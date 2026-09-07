# Module 16: Notifications, Device APIs and Testing

**Note:** The following notes were co-written with AI help structure topics and explain complex terms clearly.

## 1. What a phone can do that a browser can't

Everything built so far could, with some translation, have been a web app. This module covers the parts that couldn't: the camera, the device's location, and the ability to reach a user when your app isn't running.

These capabilities come with a constraint that shapes all the code in this module. None of them are simply available. Every one is gated behind a **permission** the user grants or denies at runtime, and can revoke later from system settings. Your app has to handle all three answers - granted, denied, and denied permanently - and it has to keep working when the answer is no.

Module 09 asked you to identify risks for each requirement. "The user may deny this permission" is the risk attached to every feature in this module, and it isn't hypothetical.

---

## 2. Local notifications

```bash
npx expo install expo-notifications
```

Create `notifications.ts`.

```tsx
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();

  if (existing === "granted") {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleClassReminder(
  className: string,
  startsAt: Date,
): Promise<string | null> {
  const granted = await requestPermission();

  if (!granted) {
    return null;
  }

  const triggerAt = new Date(startsAt.getTime() - 60 * 60 * 1000);

  if (triggerAt <= new Date()) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Class starting soon",
      body: `${className} starts in an hour.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerAt,
    },
  });
}

export async function cancelReminder(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
```

Several details are load-bearing.

Checking `getPermissionsAsync` before calling `requestPermissionsAsync` isn't redundant. On iOS, the system prompt appears **once**, ever. If the user denies it, requesting again does nothing at all, silently, and your app has no way to ask a second time. That's why timing matters: prompting on first launch, before the user knows what the app does, is how you get denied permanently by someone who would happily have said yes ten minutes later. Ask at the moment the permission is obviously needed.

Your app is denied notification permission, and later the user taps a button clearly labelled "Remind me an hour before". What should happen? _Answer: something, and not silence. `scheduleClassReminder` currently returns `null`, which a caller can easily ignore, leaving the user believing a reminder was set. The honest response is to explain that notifications are off and point them at system settings, since your app can no longer bring up the prompt itself. This is why the facade in section 3 returns a named `denied` case rather than a bare `null` - a return value that's easy to ignore usually gets ignored._

The `triggerAt <= new Date()` guard handles the case of a class starting in twenty minutes, where a reminder an hour before is already in the past. Scheduling a notification in the past is one of those things that fails in different ways on different platforms, which is exactly the kind of case module 09's "compatibility" non-functional requirement is about.

Returning the notification's ID is what makes `cancelReminder` possible. If the user un-books the class, you need that ID to cancel it, so storing it alongside the booking is part of the design rather than an afterthought.

### 2.1 Push notifications, briefly

Local notifications are scheduled by your app on the device. **Push notifications** are sent from your server to a device that isn't running your app at all, which requires the device to register for a push token, your server to store it, and a push service to deliver the message.

The Project doesn't require you to deploy your API or publish your app, so a full push setup is out of scope. It's worth understanding the shape, though, because it's a natural fit for module 14's background jobs: a Celery task that sends a push is one of the more common things a worker actually does.

| Key terms            |                                                                    |
| -------------------- | ------------------------------------------------------------------ |
| Local notification   | Scheduled by the app, delivered by the device itself               |
| Push notification    | Sent from a server, delivered to a device via a push service       |
| Permission status    | `granted`, `denied`, or `undetermined`                             |
| Notification channel | Android's grouping of notifications by type, with its own settings |

### Task 1

Implement `scheduleClassReminder` for something in your own app that has a future time attached. Test it on a real device or simulator with a trigger only a minute or two ahead, so you actually see it arrive. Confirm that denying the permission leaves the rest of the app working normally rather than crashing or hanging.

---

## 3. Device APIs, and a Facade

Each device capability has its own module, its own permission call, and its own quirks.

```bash
npx expo install expo-location expo-image-picker
```

Used raw, in a component, they look like this:

```tsx
const { status } = await Location.requestForegroundPermissionsAsync();

if (status !== "granted") {
  // now what?
}

const position = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
```

That's fine once. Repeated across four screens, it's the duplication module 13 warned about, and every screen now knows about permission statuses, accuracy enums, and the shape of a position object.

The **Facade pattern** puts a simple interface in front of a complicated subsystem. It doesn't add behaviour; it hides complexity behind something your app actually wants to say.

Create `device/location.ts`.

```tsx
import * as Location from "expo-location";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type LocationResult =
  | { status: "success"; coordinates: Coordinates }
  | { status: "denied" }
  | { status: "unavailable"; reason: string };

export async function getCurrentLocation(): Promise<LocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return { status: "denied" };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      status: "success",
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch (error) {
    return {
      status: "unavailable",
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

`LocationResult` is a **discriminated union**, module 04's union types doing real work. Every possible outcome is a named case, and TypeScript will force a caller to handle each one:

```tsx
const result = await getCurrentLocation();

if (result.status === "success") {
  setCoordinates(result.coordinates);
} else if (result.status === "denied") {
  setMessage("Enable location in Settings to find studios near you.");
} else {
  setMessage("Couldn't get your location. Try again.");
}
```

Compare that with a function returning `Coordinates | null`. Null tells you something went wrong, but not what, so the UI can't distinguish "you denied us" - which needs a message about Settings - from "GPS failed" - which needs a retry button. Making the failure modes explicit in the type is what lets the UI respond usefully to each.

The same facade shape works for images:

```tsx
import * as ImagePicker from "expo-image-picker";

export type ImageResult =
  | { status: "success"; uri: string }
  | { status: "cancelled" }
  | { status: "denied" };

export async function pickImage(): Promise<ImageResult> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    return { status: "denied" };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: true,
  });

  if (result.canceled) {
    return { status: "cancelled" };
  }

  return { status: "success", uri: result.assets[0].uri };
}
```

`cancelled` and `denied` are separate cases for the same reason as before: the user tapping "cancel" is not an error and should produce no message at all, while a denied permission needs explaining.

`quality: 0.7` is a real decision, not a default worth skipping past. A modern phone camera produces images of several megabytes, and uploading those over mobile data is slow, expensive for the user, and a common cause of timeouts - precisely the performance non-functional requirement module 09 asked you to identify.

Notice that `location.ts` and `pickImage` are the same idea as `studiosApi.ts` from module 06 and `studioRepository.ts` from module 15: a module owning one messy external dependency, exposing a clean interface, so nothing above it deals with the mess. Facade, Adapter, and Repository are three names for three variations on that single move.

| Key terms             |                                                               |
| --------------------- | ------------------------------------------------------------- |
| Facade pattern        | A simple interface in front of a complicated subsystem        |
| Discriminated union   | A union where a shared field identifies which case a value is |
| Foreground permission | Access granted only while the app is open and visible         |

### Task 2

Build a facade for one device capability your own app genuinely needs, following the shape above. It must return a discriminated union covering every outcome, and no screen may import the underlying Expo module directly.

Then use it in a screen that handles every case in the union with a distinct, useful response. Test all of them, including denial, which means actually revoking the permission in system settings rather than assuming that path works.

---

## 4. Getting the file to the server

`pickImage` returns a `uri`, and so far nothing happens to it. That URI is a path to a file in the device's own storage - `file:///var/mobile/...` - which means it's meaningless to anyone else. Show it in an `<Image>` and it works; send it to your API as a string and you've stored a path that will never resolve on any other device, including the same user's next phone.

Uploading a file is different from every request you've made so far, on both sides.

### 4.1 Accepting a file in Django

Add an image field to a model. Pillow handles image processing and is required for `ImageField`.

```bash
pip install Pillow
```

```python
class Studio(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="studios")
    name = models.CharField(max_length=200)
    suburb = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    photo = models.ImageField(upload_to="studios/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

`upload_to="studios/"` is a subdirectory inside your media root, not a full path. Configure that in `settings.py`.

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

And serve those files during development, in `fittrack_backend/urls.py`.

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... the existing entries ...
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

That `if settings.DEBUG` guard is not decoration. Django's static file serving is deliberately unsuitable for production - it's single-threaded and does no caching - so this exists purely so uploads work while you're developing. Add `media/` to `.gitignore` too; uploaded files are user data, not source code.

Run `makemigrations` and `migrate`, then add the field to your serializer.

```python
class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "photo", "created_at"]
```

DRF returns `photo` as a URL, and because the serializer has access to the request, it returns an absolute one - which is what the app needs, since a relative `/media/studios/x.jpg` means nothing to a phone.

### 4.2 Sending it from the app

Every request so far has sent JSON. A file can't go in JSON, so this one is **multipart form data** instead.

```tsx
export async function uploadStudioPhoto(
  studioId: number,
  uri: string,
): Promise<Studio> {
  const filename = uri.split("/").pop() ?? "photo.jpg";
  const extension = filename.split(".").pop()?.toLowerCase() ?? "jpg";

  const form = new FormData();

  form.append("photo", {
    uri,
    name: filename,
    type: `image/${extension === "jpg" ? "jpeg" : extension}`,
  } as unknown as Blob);

  const response = await apiFetch(`/studios/${studioId}/`, {
    method: "PATCH",
    body: form,
    headers: {},
  });

  if (!response.ok) {
    throw new Error("Could not upload photo");
  }

  return response.json();
}
```

Three things here will each cost you an afternoon if you don't know them in advance.

**The `Content-Type` header must be removed, not set.** Module 07's `apiFetch` sets `application/json` on everything. For multipart, the header needs a boundary string that `FormData` generates itself, so it has to be left alone. Passing `headers: {}` here isn't quite enough given how `apiFetch` merges headers - you'll need to adjust `apiFetch` so a `FormData` body skips the JSON content type entirely. That's the task below.

**React Native's `FormData` takes an object, not a `File`.** There is no `File` in React Native, so you append `{ uri, name, type }`. TypeScript doesn't like it, which is what the assertion is doing, and this is one of the few honest uses of `as` from module 04: the type is genuinely wrong and the runtime genuinely works.

**`PATCH`, not `PUT`.** `PUT` replaces the whole resource, so a multipart `PUT` with only a photo would blank out the name and suburb. `PATCH` updates only what's sent.

Uploads are also the first request in this course that is slow enough for the user to notice. Module 09 asked for loading states; a two-second spinner is fine, but a fifteen-second upload with no progress indication is where people force-quit the app. This is where the `quality: 0.7` decision from section 3 pays off, and where module 15's write queue starts to look attractive rather than theoretical.

| Key terms           |                                                                  |
| ------------------- | ---------------------------------------------------------------- |
| `ImageField`        | A Django field storing a path, with the file written to disk     |
| `MEDIA_ROOT`        | Where uploaded files are written on the server                   |
| Multipart form data | The request format used to send files, with a generated boundary |
| `FormData`          | The object used to build a multipart request body                |

### Task 3

Add an image field to one of your models and implement upload end to end: pick an image with your facade, send it, and confirm the file appears in your `media/` directory and the URL comes back in the API response.

You'll have to modify `apiFetch` so it doesn't force `Content-Type` on a `FormData` body. Do that in one place rather than writing a second fetch wrapper - a duplicate wrapper is exactly the smell module 13 described.

Then test what happens with a large file and a slow connection, which you can simulate with your simulator's network conditioner or by throttling wifi. Record what your UI does during those seconds, and whether a user would believe the app had frozen.

---

## 5. Testing code that touches a device

Module 10's tests ran in Node, with no device anywhere. Jest cannot open a camera, and there's no GPS in a test runner.

The answer is the same as module 10's network mocking, and it works for the same reason: because your facade is the only thing importing the Expo module, one mock covers everything.

```tsx
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import NearbyScreen from "../app/nearby";
import * as location from "../device/location";

jest.mock("../device/location");

describe("NearbyScreen", () => {
  it("shows studios once a location is available", async () => {
    jest.spyOn(location, "getCurrentLocation").mockResolvedValue({
      status: "success",
      coordinates: { latitude: -45.8788, longitude: 170.5028 },
    });

    render(<NearbyScreen />);

    await waitFor(() => {
      expect(screen.getByText("CityFit")).toBeTruthy();
    });
  });

  it("explains how to enable location when permission is denied", async () => {
    jest.spyOn(location, "getCurrentLocation").mockResolvedValue({
      status: "denied",
    });

    render(<NearbyScreen />);

    await waitFor(() => {
      expect(screen.getByText(/enable location/i)).toBeTruthy();
    });
  });
});
```

The second test is the valuable one, and it's worth being explicit about why. Testing the denied path by hand means revoking a permission in system settings, relaunching, checking, and granting it again - perhaps ninety seconds of fiddling, every time. It runs here in milliseconds, on every push, forever. The paths that are most tedious to test manually are the ones automated tests pay for themselves on fastest, and they're the same paths most likely to be quietly broken.

Note also that these tests never assert anything about permissions or Expo. They assert what the user sees for each outcome, which means refactoring the facade's internals breaks nothing, exactly as module 10 argued for querying by visible text.

### 5.1 What still needs a real device

Mocks verify your app's _response_ to an outcome. They can't verify that the outcome is real. Nothing above proves `getCurrentLocation` actually returns a location on an Android phone.

Some things only a device can tell you:

| Only testable on a device              | Why                                                  |
| -------------------------------------- | ---------------------------------------------------- |
| A notification actually arriving       | Delivery is the OS's job, not your app's             |
| The permission dialog's real wording   | Written by the platform, from your app config        |
| Behaviour when the app is backgrounded | The simulator's lifecycle differs from a real device |
| Performance with a real camera image   | A mocked URI has no file size                        |

The split is worth being deliberate about, because it's exactly the split the Project's UAT sprint depends on: automated tests confirm your app responds correctly to each outcome, and a human with a real phone confirms the outcomes happen at all.

### Task 4

Write mocked tests for your facade from Task 2, covering every case in its union. Confirm each test fails if you remove the corresponding branch from your screen - a test that passes against broken code is worse than no test, because it's actively misleading.

### Task 5

Nothing in this module showed you how to test the facade itself, as opposed to screens that use it.

Work out how, using Jest's module mocking documentation, and write tests that mock `expo-location` directly to confirm your facade returns `denied` when permission is refused and `unavailable` when the underlying call throws.

Then answer this in your README: you now have tests at two levels - screens with the facade mocked, and the facade with Expo mocked. What class of bug would still slip through both, and which kind of testing would catch it?

---

## 6. Where the course has got to

Fourteen modules, two languages, one full-stack app. It's worth naming what's actually been assembled, because the individual pieces are easier to see than the shape they make.

| Pattern                 | First met | Met again                    |
| ----------------------- | --------- | ---------------------------- |
| Adapter                 | 03        | 06, in `studiosApi.ts`       |
| Repository              | 03        | 15, in `studioRepository.ts` |
| Strategy                | 07        | 13, as Open/Closed           |
| Observer                | 14        | -                            |
| Chain of Responsibility | 14        | -                            |
| Facade                  | 16        | -                            |

Module 01 promised that by term 2 you'd have seen several patterns twice, once in Python and once in JavaScript, and that this repetition was the point: the pattern is the idea, and the syntax around it is local dialect. The Repository row is the clearest evidence - Django's ORM and a hand-written SQLite wrapper on a phone are about as different as two implementations get, and they're the same idea.

The Project asks for at least two named design patterns and two programming principles, used where they solve genuine problems, with a reflection evaluating how effectively you applied them. The table above is your shortlist, and "genuine problems" is the operative phrase: a pattern bolted on to satisfy a rubric reads exactly like what it is.

### Task 6

Audit your Project against everything this course has covered. For each item, record where it appears in your code, or note honestly that it doesn't yet.

- Two named design patterns, solving real problems
- Two programming principles, with specific examples
- Automated API tests covering success, validation, and error responses
- Component tests, including at least one failure path
- Consistent JSON error responses, including for unhandled exceptions
- All four UI states on every screen: loading, error, empty, success
- Interactive elements labelled for a screen reader
- Secrets in environment variables, with a committed `.env.example`
- The API reachable from a device that isn't your development machine
- Linting and formatting configured and passing
- Conventional commits, linked to issues, spread across the whole semester
- A versioned release per sprint, with release notes and known issues
- Each release verified runnable from a fresh clone of its tag
- UAT evidence: test plan, raw results, severity-ranked issues, and re-verification
- `api-documentation.md` and `app-documentation.md` up to date

Anything you can't point at a file for is work remaining, not work done. Finding that out now, with sprints left, is the entire purpose of doing this audit before your final sprint rather than during your final reflection.

---

## 7. Writing the reflections

Phase 3 of the Project is roughly 1,100 words across three reflections: design and implementation, user acceptance testing, and a final reflection. That's a meaningful share of an 80% assessment, and it's assessed on one thing above all - whether your reflections are based on specific evidence from your project. The descriptor names the failure mode directly: statements like "I learned a lot" won't demonstrate sufficient reflection.

The problem is that reflective writing is a genuinely different skill from everything else in this course, and most students have had far less practice at it than at writing code. It's worth treating as a skill rather than as paperwork.

### 7.1 What "specific evidence" means

Compare two answers to "what was harder than expected?"

> Getting authentication working was harder than I expected. I had a lot of issues with tokens and it took a while to figure out. Eventually I got it working and I learned a lot about JWTs.

> My access token expired after five minutes and every request started failing with a 401, but the app showed the generic "Could not load studios" message from `studiosApi.ts`, so I spent an hour looking for a bug in the studios endpoint. I tried extending the token lifetime in `settings.py`, which worked and was wrong - it hid the problem rather than handling it. What actually fixed it was storing the refresh token and retrying once inside `apiFetch` on a 401 (commit `f3a91c2`). What I learned was that my error handling was the real defect: a generic message for every failure meant the app couldn't tell me what had gone wrong, which is why module 14's error envelope mattered more than I thought when I built it.

The second is barely longer. The difference isn't effort, it's that it names a file, a symptom, a wrong turn, a commit, and a conclusion that goes beyond the incident. Everything in it is checkable.

A working test: could a marker who has your repository open find the thing you're describing? If not, it isn't evidence yet.

### 7.2 Where the evidence comes from

You cannot reconstruct this in November from memory. The good news is that if you've followed the modules, most of it already exists:

| Reflection asks for            | Where it already is                                             |
| ------------------------------ | --------------------------------------------------------------- |
| A change to your design        | Module 09's diagrams versus your current code                   |
| A specific technical problem   | Your issue tracker, and your commit history from module 13      |
| Patterns and principles in use | Module 16's Task 6 audit                                        |
| What UAT revealed              | Module 10's issue log, with severities and actions              |
| What you'd do differently      | Your sprint rationales, compared against what actually happened |

The single highest-value habit for this phase is a running notes file. Two or three lines whenever something surprises you, breaks, or changes - the date, what happened, what you did. Ten minutes a week over a semester produces something no amount of effort in the final week can replicate.

### 7.3 The parts students lose marks on

**Comparing with an alternative.** For each pattern and principle, the descriptor asks you to compare it with an alternative, discuss the trade-offs, and evaluate its effectiveness. Describing what a pattern does isn't any of those three. "I used the Repository pattern in `studioRepository.ts`" is a statement; "I used it rather than calling SQLite directly from `useStudios`, which would have been fewer files - the payoff was that mocking one module let me test the hook without a database, and the cost was an extra layer to navigate for a project this small" is a comparison, a trade-off, and an evaluation.

**Being honest about what didn't work.** The design reflection from module 09 was explicitly assessed on reasoning rather than whether predictions came true, and the same instinct applies here. A reflection saying "I expected the offline sync to be the hard part; it wasn't, the hard part was deciding what to do about conflicts, which I ended up scoping out entirely" is stronger than one claiming everything went to plan. Nothing goes to plan, and a marker who has read fifty of these knows it.

**Answering the question asked.** Each reflection has numbered prompts. Answer them in order, and answer all of them. The final reflection's second question - what implementing the React Native client revealed about your API design - is regularly skipped, and it's the most interesting one in the whole set.

### 7.4 The presentation

Phase 4 is 10–15 minutes, and the descriptor says plainly: do not simply read your written reflections. It's a different medium with a different job - demonstrating you can communicate your work as a professional developer would to a technical lead or a client.

Two things make the difference. First, demonstrate from your latest local release rather than a dev build you've been editing all morning, because that's what the descriptor asks for and because a demo that fails live is memorable for the wrong reasons. Second, for the code walkthrough, pick one pattern and go deep rather than touring five. You have about three minutes for it; that's enough for where it is, why you chose it, and what problem it solves, and not enough for anything else.

Rehearse it against a clock at least once. Almost everyone's first run is over time, and what gets cut under pressure is the code walkthrough - which is the part carrying the LO1 marks.

### Task 7

Start a `notes.md` in your repository today, and add to it whenever something surprises you or changes. It isn't submitted; it's the raw material for Phase 3.

Then, right now, write a first draft answer to one prompt: "what was harder than expected?" Use something that has already happened to you in this course. Include a file name, a commit hash, one thing you tried that didn't work, and one sentence about what you'd do differently.

Compare your draft against the two examples in section 7.1 and mark honestly which one it more closely resembles. If it's the first, rewrite it once. The gap between those two paragraphs is most of the difference between a passing reflection and a strong one, and it's a gap you can close by deciding to.
