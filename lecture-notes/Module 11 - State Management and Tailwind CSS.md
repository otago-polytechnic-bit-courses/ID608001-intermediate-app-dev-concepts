# Module 11: State Management and Tailwind CSS

## 1. The problem with `useState` alone

Module 05 introduced `useState`, and it's still the right tool for most things. A search box's current text, whether a form is expanded, which tab is selected: all of these belong to exactly one component and nothing else needs to see them.

The trouble starts when two components in different parts of your app need the same piece of state. Module 07 made this concrete: whether a user is logged in affects the login screen, the studio list, the detail screen, and anything that shows an edit button. That's not one component's state any more.

The standard first move is **lifting state up**: move it to the closest common ancestor and pass it down as props. That works, and for a shallow tree it's the right answer. In a deeper tree it turns into **prop drilling**, where a value is threaded through four components that don't use it, purely so the fifth one can.

```tsx
<App user={user}>
  <Layout user={user}>
    <Screen user={user}>
      <Header user={user}>
        <Avatar user={user} />
```

`Layout`, `Screen`, and `Header` have no interest in `user` whatsoever. They're couriers. Every one of them now needs `user` in its props interface, and every one has to be edited if the shape of `user` ever changes.

That's a maintainability problem, not a correctness problem, which is why it's easy to ignore until the app is large enough that ignoring it hurts.

What principle from module 01 is prop drilling most obviously in tension with? _Answer: it's a separation of concerns problem. Three components have been given a responsibility, carrying `user`, that has nothing to do with what any of them are actually for. It's arguably a DRY issue too, since the same prop declaration is repeated at every level._

| Key terms     |                                                                                 |
| ------------- | ------------------------------------------------------------------------------- |
| Local state   | State owned by one component, via `useState`                                    |
| Lifting state | Moving state to the closest common ancestor of the components that need it      |
| Prop drilling | Passing a prop through components that don't use it, just to reach a deeper one |
| Global state  | State available anywhere in the app, without being passed as props              |

---

## 2. Context

React's **Context API** lets a value be provided at one point in the tree and read anywhere beneath it, skipping every component in between.

Create `contexts/AuthContext.tsx`, building on module 07's auth functions.

```tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getToken,
  saveToken,
  clearToken,
  login as loginRequest,
} from "../auth";

interface AuthContextValue {
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken().then((stored) => {
      setToken(stored);
      setIsLoading(false);
    });
  }, []);

  async function login(username: string, password: string): Promise<void> {
    await loginRequest(username, password);
    setToken(await getToken());
  }

  async function logout(): Promise<void> {
    await clearToken();
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
```

Wrap your app in the provider, in `app/_layout.tsx`.

```tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
```

And read it from any screen, at any depth.

```tsx
import { useAuth } from "../contexts/AuthContext";

export default function StudiosScreen() {
  const { token, logout } = useAuth();
  // ...
}
```

Two details are doing more than they look like they are.

The custom `useAuth` hook exists so that no component ever calls `useContext(AuthContext)` directly. That's not just tidiness: the `undefined` check turns "somebody rendered this outside the provider" from a confusing null-reference crash three lines later into an error message that names the actual mistake. It's the defensive programming habit from earlier courses, applied to a hook.

Typing the context as `AuthContextValue | undefined` is what forces that check to exist. If the default value had been `{} as AuthContextValue`, TypeScript would have been satisfied and the bug would have been silent, which is module 04's point about `as` being an unchecked promise.

Context solves prop drilling, but it isn't free. Every component consuming a context re-renders whenever that context's value changes, regardless of whether it uses the part that changed. For something that changes rarely, like auth, that's fine. For something that changes on every keystroke, it isn't.

---

## 3. Zustand

For state that changes often, or where you want components subscribing to only the slice they actually use, a dedicated state library is a better fit. **Zustand** is small, unopinionated, and needs no provider at all.

```bash
npx expo install zustand
```

Create `stores/favouritesStore.ts`.

```tsx
import { create } from "zustand";

interface FavouritesState {
  favouriteIds: number[];
  toggleFavourite: (id: number) => void;
  isFavourite: (id: number) => boolean;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>((set, get) => ({
  favouriteIds: [],

  toggleFavourite: (id) =>
    set((state) => ({
      favouriteIds: state.favouriteIds.includes(id)
        ? state.favouriteIds.filter((favouriteId) => favouriteId !== id)
        : [...state.favouriteIds, id],
    })),

  isFavourite: (id) => get().favouriteIds.includes(id),

  clear: () => set({ favouriteIds: [] }),
}));
```

Use it directly, with no provider and no props.

```tsx
import { useFavouritesStore } from "../stores/favouritesStore";

export function StudioRow({ id, name, suburb, city }: StudioRowProps) {
  const isFavourite = useFavouritesStore((state) => state.isFavourite(id));
  const toggleFavourite = useFavouritesStore((state) => state.toggleFavourite);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Pressable onPress={() => toggleFavourite(id)}>
        <Text>{isFavourite ? "♥" : "♡"}</Text>
      </Pressable>
    </View>
  );
}
```

The function passed to `useFavouritesStore` is a **selector**, and it's the reason to reach for Zustand over Context for this kind of state. Each `StudioRow` subscribes only to its own favourite status. Favouriting studio 3 re-renders the row for studio 3, and no others. A Context holding the same array would re-render every consuming row every time any favourite changed.

Notice the update never mutates the existing array. `filter` and the spread both produce a new array, and React relies on that: it decides whether to re-render by comparing references, so `state.favouriteIds.push(id)` would change the contents while leaving the reference identical, and nothing on screen would move. This is the functional paradigm from module 01 being load-bearing rather than stylistic.

|            | `useState`     | Context                         | Zustand                          |
| ---------- | -------------- | ------------------------------- | -------------------------------- |
| Scope      | One component  | Everything under the provider   | The whole app                    |
| Setup      | None           | A provider component            | One store file                   |
| Re-renders | The component  | Every consumer, on any change   | Only components using that slice |
| Best for   | Local UI state | Rarely-changing app-wide values | Frequently-changing shared state |

There's a real risk of over-engineering here, and YAGNI from module 01 applies directly. Reaching for a global store for state that only one screen uses makes that state harder to reason about, not easier, because now anything in the app could theoretically change it. Start local. Move outward only when a second component genuinely needs the same value.

| Key terms   |                                                                              |
| ----------- | ---------------------------------------------------------------------------- |
| Context     | React's built-in mechanism for providing a value to a whole subtree          |
| Provider    | The component that supplies a context value to everything beneath it         |
| Custom hook | A function starting with `use` that wraps hook logic for reuse               |
| Store       | A single object holding state and the functions that change it               |
| Selector    | A function picking one slice of a store, so only that slice triggers renders |

### Task 1

Build the `AuthContext` from section 2 and wire it into your app's root layout. Replace any direct calls to module 07's `getToken` in your screens with `useAuth`, and add a logout button that clears the token and returns the user to the login screen.

### Task 2

Build the favourites store from section 3 and connect it to your `StudioRow`. Confirm with a `console.log` inside `StudioRow` that favouriting one studio doesn't re-render the others.

### Task 3

Your favourites currently vanish when the app closes, because the store lives in memory.

Zustand ships with a `persist` middleware, which wasn't demonstrated above. Using Zustand's own documentation, work out how to persist the favourites store to device storage so it survives a restart, and which storage backend to give it, since Zustand's default assumes a browser's `localStorage`, which React Native doesn't have.

In your README, explain why `expo-secure-store`, which you used for the token in module 07, would be a poor choice here, and what you used instead.

---

## 4. Styling with Tailwind

Every style so far has gone through `StyleSheet.create`, which works, but it produces a familiar shape: a component at the top, then forty lines of style object at the bottom, with your eye bouncing between the two to work out what `card` actually looks like.

**Tailwind CSS** takes the opposite approach: small, single-purpose utility classes composed directly on the element. **NativeWind** is what makes Tailwind work in React Native, compiling those class names into the native styles React Native actually understands.

```bash
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
npx tailwindcss init
```

Configure `tailwind.config.js`.

```js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Create `global.css`.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import it once in `app/_layout.tsx`, and add the NativeWind preset to `babel.config.js`.

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

Restart with a cleared cache, since Babel config changes aren't picked up otherwise.

```bash
npx expo start -c
```

Now `StudioRow` from module 05, rewritten:

```tsx
import { View, Text, Pressable } from "react-native";

export function StudioRow({
  name,
  suburb,
  city,
  isFavourite,
  onToggleFavourite,
}: StudioRowProps) {
  return (
    <View className="flex-row items-center p-4 border-b border-gray-200">
      <View className="w-12 h-12 rounded-lg bg-gray-200" />

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold">{name}</Text>
        <Text className="text-sm text-gray-500">
          {suburb}, {city}
        </Text>
      </View>

      <Pressable onPress={onToggleFavourite} className="p-2">
        <Text className="text-xl">{isFavourite ? "♥" : "♡"}</Text>
      </Pressable>
    </View>
  );
}
```

The entire `StyleSheet.create` block is gone. Every style sits next to the element it applies to, so reading the component tells you what it looks like without scrolling.

Compare the two directly:

|                   | `StyleSheet`                          | NativeWind                             |
| ----------------- | ------------------------------------- | -------------------------------------- |
| Where styles live | A separate object below the component | Inline, on the element                 |
| Values            | Whatever number you type              | A constrained scale, e.g. `p-2`, `p-4` |
| Consistency       | Up to your discipline                 | Enforced by the scale                  |
| Readability       | Component stays clean                 | Elements get long `className` strings  |
| Reuse             | Named style objects                   | Extracted components, or `@apply`      |

The constrained scale is Tailwind's most underrated feature. `p-4` is 16 pixels, `p-5` is 20, and there is no `p-4.5`. That sounds restrictive until you've inherited a codebase with padding values of 12, 13, 15, and 16 scattered through it, none of which were chosen deliberately.

The honest downside is verbosity. A complex element accumulates a long class string, and `className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm"` is harder to skim than `style={styles.card}`. The usual answer is the same as it would be for any repetition: when the same long string appears three times, that's a component wanting to be extracted, which is DRY pointing at a design improvement rather than just a formatting one.

Neither approach is more correct. Pick one and use it consistently across your project, because a codebase where half the components use each is worse than either choice made wholeheartedly.

| Key terms            |                                                                     |
| -------------------- | ------------------------------------------------------------------- |
| Tailwind CSS         | A styling approach built from small, single-purpose utility classes |
| NativeWind           | Compiles Tailwind class names into React Native styles              |
| `className`          | The prop NativeWind adds to React Native components                 |
| Utility class        | A class doing exactly one thing, such as `p-4` or `text-gray-500`   |
| `tailwind.config.js` | Where the design scale, colours, and content paths are configured   |

### Task 4

Install and configure NativeWind, then convert `StudioRow` and one full screen from `StyleSheet` to `className`. Confirm both render identically to before.

### Task 5

Your app needs a colour that isn't in Tailwind's default palette, and a piece of spacing the default scale doesn't offer.

Using the Tailwind configuration documentation, extend `theme.extend` in `tailwind.config.js` with a named brand colour of your own and one custom spacing value, then use both in a component. In your README, explain why extending the theme is preferable to writing an arbitrary inline value each time you need that colour, and connect your answer to a principle from module 01.

### Task 6

Convert the rest of your app to NativeWind, and while doing it, find at least one place where the same long `className` string is repeated. Extract it into a reusable component rather than leaving the duplication.

Then answer this in your README, in two or three sentences: you've now seen the same value, a card's appearance, expressed as a named `StyleSheet` object and as a repeated utility string. Which of the two made the duplication more obvious to you, and what does that suggest about the trade-off between the two approaches on a project the size of your Project?

---

## 5. Accessibility

Styling decides how something looks. **Accessibility** decides whether it works for someone who can't see it, can't tap precisely, or has their phone's text size turned all the way up.

This belongs in a styling module because most accessibility problems are created by styling decisions, and because the cheapest moment to fix them is while you're making those decisions rather than after a UAT participant struggles in front of you.

### 5.1 Labels

A screen reader reads what's on screen aloud. It has nothing useful to say about the heart icon from module 05:

```tsx
<Pressable onPress={onToggleFavourite}>
  <Text>{isFavourite ? "♥" : "♡"}</Text>
</Pressable>
```

It announces "black heart suit," or nothing at all, and the user has no idea what pressing it would do.

```tsx
<Pressable
  onPress={onToggleFavourite}
  accessibilityRole="button"
  accessibilityLabel={
    isFavourite ? `Remove ${name} from favourites` : `Add ${name} to favourites`
  }
  accessibilityState={{ selected: isFavourite }}
>
  <Text>{isFavourite ? "♥" : "♡"}</Text>
</Pressable>
```

Three props, and the control now announces what it is, what it does, and what state it's in. The label includes the studio name because a screen reader user moving down a list of twenty identical "Add to favourites" buttons has no way of knowing which row they're on.

Anything that conveys meaning through an icon alone needs this. Anything that conveys meaning through colour alone — a red border for an invalid field, a green tick for success — needs a text equivalent too, since roughly one in twelve men has some form of colour vision deficiency.

### 5.2 Touch targets

Tailwind makes it easy to write a beautifully compact icon button that nobody with large hands can hit. Both platforms recommend a minimum of around 44 points square.

```tsx
<Pressable className="p-1">   {/* roughly 24pt total — too small */}
<Pressable className="p-3">   {/* roughly 44pt total — fine */}
```

`hitSlop` extends the tappable area beyond the visible one, which keeps a design tight without making it unusable.

```tsx
<Pressable hitSlop={12} onPress={onToggleFavourite}>
```

### 5.3 Text that scales

Users can set a system-wide text size, and some set it very large. Fixed heights are what break under it: a row with `h-12` and text scaled to 200% clips the text rather than growing.

Preferring padding over fixed heights, and letting content determine size, handles most of it. Where a layout genuinely can't accommodate it, `allowFontScaling={false}` exists — and should be a last resort on something decorative, never on the text carrying the meaning.

### 5.4 Checking it

Turn the screen reader on and use your own app for two minutes with the screen off. VoiceOver on iOS is in Settings under Accessibility; TalkBack is the Android equivalent.

It's an awkward, humbling two minutes, and it finds more real problems than any checklist. Module 09's usability non-functional requirements are where these findings belong, and module 10's UAT is where they'll surface anyway if you haven't looked — with the difference that a participant who can't complete a task is a logged issue in your assessed sprint, while a problem you found yourself in week 10 is just a fix.

| Key terms            |                                                                   |
| -------------------- | ----------------------------------------------------------------- |
| `accessibilityLabel` | What a screen reader announces for an element                     |
| `accessibilityRole`  | What kind of control it is, e.g. `button`, `header`, `link`       |
| `accessibilityState` | Current state, e.g. `selected`, `disabled`, `checked`             |
| Touch target         | The tappable area of a control, ideally at least 44 points square |
| `hitSlop`            | Extends the tappable area beyond the visible bounds               |

### Task 7

Add accessibility labels, roles and states to every interactive element in one full screen of your app. Include the dynamic part: a favourite toggle's label must change with its state, not describe only one of them.

Then turn on VoiceOver or TalkBack, put the screen face down, and complete one task in your app using only audio. Record in your README what you couldn't do, and what you changed as a result.

### Task 8

Nothing above covered what a screen reader does with the loading, error and empty states from module 06.

Work out, using React Native's accessibility documentation, how to announce a state change that happens without the user doing anything — a list finishing loading, or an error appearing. A sighted user sees the spinner replaced by content; a screen reader user gets silence unless you say something.

Implement it for one screen, and explain in your README which property you used and why simply putting the message in a `Text` component wasn't enough on its own.
