# Module 14: Notifications, Device APIs and Testing

## 1. What a phone can do that a browser can't

Everything built so far could, with some translation, have been a web app. This module covers the parts that couldn't: the camera, the device's location, and the ability to reach a user when your app isn't running.

These capabilities come with a constraint that shapes all the code in this module. None of them are simply available. Every one is gated behind a **permission** the user grants or denies at runtime, and can revoke later from system settings. Your app has to handle all three answers — granted, denied, and denied permanently — and it has to keep working when the answer is no.

Module 08 asked you to identify risks for each requirement. "The user may deny this permission" is the risk attached to every feature in this module, and it isn't hypothetical.

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

The `triggerAt <= new Date()` guard handles the case of a class starting in twenty minutes, where a reminder an hour before is already in the past. Scheduling a notification in the past is one of those things that fails in different ways on different platforms, which is exactly the kind of case module 08's "compatibility" non-functional requirement is about.

Returning the notification's ID is what makes `cancelReminder` possible. If the user un-books the class, you need that ID to cancel it, so storing it alongside the booking is part of the design rather than an afterthought.

### 2.1 Push notifications, briefly

Local notifications are scheduled by your app on the device. **Push notifications** are sent from your server to a device that isn't running your app at all, which requires the device to register for a push token, your server to store it, and a push service to deliver the message.

The Project doesn't require you to deploy your API or publish your app, so a full push setup is out of scope. It's worth understanding the shape, though, because it's a natural fit for module 12's background jobs: a Celery task that sends a push is one of the more common things a worker actually does.

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

That's fine once. Repeated across four screens, it's the duplication module 11 warned about, and every screen now knows about permission statuses, accuracy enums, and the shape of a position object.

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

Compare that with a function returning `Coordinates | null`. Null tells you something went wrong, but not what, so the UI can't distinguish "you denied us" — which needs a message about Settings — from "GPS failed" — which needs a retry button. Making the failure modes explicit in the type is what lets the UI respond usefully to each.

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

`quality: 0.7` is a real decision, not a default worth skipping past. A modern phone camera produces images of several megabytes, and uploading those over mobile data is slow, expensive for the user, and a common cause of timeouts — precisely the performance non-functional requirement module 08 asked you to identify.

Notice that `location.ts` and `pickImage` are the same idea as `studiosApi.ts` from module 06 and `studioRepository.ts` from module 13: a module owning one messy external dependency, exposing a clean interface, so nothing above it deals with the mess. Facade, Adapter, and Repository are three names for three variations on that single move.

| Key terms             |                                                               |
| --------------------- | ------------------------------------------------------------- |
| Facade pattern        | A simple interface in front of a complicated subsystem        |
| Discriminated union   | A union where a shared field identifies which case a value is |
| Foreground permission | Access granted only while the app is open and visible         |

### Task 2

Build a facade for one device capability your own app genuinely needs, following the shape above. It must return a discriminated union covering every outcome, and no screen may import the underlying Expo module directly.

Then use it in a screen that handles every case in the union with a distinct, useful response. Test all of them, including denial, which means actually revoking the permission in system settings rather than assuming that path works.

---

## 4. Testing code that touches a device

Module 09's tests ran in Node, with no device anywhere. Jest cannot open a camera, and there's no GPS in a test runner.

The answer is the same as module 09's network mocking, and it works for the same reason: because your facade is the only thing importing the Expo module, one mock covers everything.

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

The second test is the valuable one, and it's worth being explicit about why. Testing the denied path by hand means revoking a permission in system settings, relaunching, checking, and granting it again — perhaps ninety seconds of fiddling, every time. It runs here in milliseconds, on every push, forever. The paths that are most tedious to test manually are the ones automated tests pay for themselves on fastest, and they're the same paths most likely to be quietly broken.

Note also that these tests never assert anything about permissions or Expo. They assert what the user sees for each outcome, which means refactoring the facade's internals breaks nothing, exactly as module 09 argued for querying by visible text.

### 4.1 What still needs a real device

Mocks verify your app's _response_ to an outcome. They can't verify that the outcome is real. Nothing above proves `getCurrentLocation` actually returns a location on an Android phone.

Some things only a device can tell you:

| Only testable on a device              | Why                                                  |
| -------------------------------------- | ---------------------------------------------------- |
| A notification actually arriving       | Delivery is the OS's job, not your app's             |
| The permission dialog's real wording   | Written by the platform, from your app config        |
| Behaviour when the app is backgrounded | The simulator's lifecycle differs from a real device |
| Performance with a real camera image   | A mocked URI has no file size                        |

The split is worth being deliberate about, because it's exactly the split the Project's UAT sprint depends on: automated tests confirm your app responds correctly to each outcome, and a human with a real phone confirms the outcomes happen at all.

### Task 3

Write mocked tests for your facade from Task 2, covering every case in its union. Confirm each test fails if you remove the corresponding branch from your screen — a test that passes against broken code is worse than no test, because it's actively misleading.

### Task 4

Nothing in this module showed you how to test the facade itself, as opposed to screens that use it.

Work out how, using Jest's module mocking documentation, and write tests that mock `expo-location` directly to confirm your facade returns `denied` when permission is refused and `unavailable` when the underlying call throws.

Then answer this in your README: you now have tests at two levels — screens with the facade mocked, and the facade with Expo mocked. What class of bug would still slip through both, and which kind of testing would catch it?

---

## 5. Where the course has got to

Fourteen modules, two languages, one full-stack app. It's worth naming what's actually been assembled, because the individual pieces are easier to see than the shape they make.

| Pattern                 | First met | Met again                    |
| ----------------------- | --------- | ---------------------------- |
| Adapter                 | 03        | 06, in `studiosApi.ts`       |
| Repository              | 03        | 13, in `studioRepository.ts` |
| Strategy                | 07        | 11, as Open/Closed           |
| Observer                | 12        | —                            |
| Chain of Responsibility | 12        | —                            |
| Facade                  | 14        | —                            |

Module 01 promised that by term 2 you'd have seen several patterns twice, once in Python and once in JavaScript, and that this repetition was the point: the pattern is the idea, and the syntax around it is local dialect. The Repository row is the clearest evidence — Django's ORM and a hand-written SQLite wrapper on a phone are about as different as two implementations get, and they're the same idea.

The Project asks for at least two named design patterns and two programming principles, used where they solve genuine problems, with a reflection evaluating how effectively you applied them. The table above is your shortlist, and "genuine problems" is the operative phrase: a pattern bolted on to satisfy a rubric reads exactly like what it is.

### Task 5

Audit your Project against everything this course has covered. For each item, record where it appears in your code, or note honestly that it doesn't yet.

- Two named design patterns, solving real problems
- Two programming principles, with specific examples
- Automated API tests covering success, validation, and error responses
- Component tests, including at least one failure path
- Consistent JSON error responses
- All four UI states on every screen: loading, error, empty, success
- Secrets in environment variables, not in source
- Linting and formatting configured and passing
- `api-documentation.md` and `app-documentation.md` up to date
- A versioned release per sprint, with release notes

Anything you can't point at a file for is work remaining, not work done. Finding that out now, with sprints left, is the entire purpose of doing this audit before your final sprint rather than during your final reflection.
