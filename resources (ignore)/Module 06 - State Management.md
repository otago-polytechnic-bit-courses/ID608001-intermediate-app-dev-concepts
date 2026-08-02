# Module 06: Frontend: State Management

## 1. Why state management needs a plan

`useState` is perfectly fine for state that only one component cares about: whether a modal is open, what's currently typed into a text input, and so on. The trouble starts when two components that aren't directly nested both need the same piece of state. Passing it down through every component in between, just so a distant child can use it, is usually called prop drilling, and it gets worse as an app grows, not better.

The React Native app and the Django backend are both, in the end, managing state: Django's is the studios and classes stored in the database, and React's is whatever the current screen needs to remember and react to. The tools differ completely, but the underlying question is identical: where does a single piece of truth live, and how does everything that depends on it find out when it changes.

---

## 2. Lifting state up

The simplest fix for two sibling components needing the same value is to move that value up to their shared parent, and pass it back down as props. This is usually called lifting state up.

```tsx
import { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";

const allStudios = [
  { id: "1", name: "CityFit", suburb: "Dunedin Central" },
  { id: "2", name: "Harbourside Yoga", suburb: "St Kilda" },
  { id: "3", name: "Northside Strength", suburb: "North Dunedin" },
];

export default function StudiosScreen() {
  const [query, setQuery] = useState("");

  const filtered = allStudios.filter((studio) =>
    studio.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <TextInput
        placeholder="Search studios"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
```

The search box and the list both live inside the same screen, so `query` living in that screen's own `useState` is enough. Neither component needs to know the other exists, they both just read and write the same state, one level up.

| Key terms        |                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Prop drilling    | Passing a value through several components that don't use it, just so a deeper child can |
| Lifting state up | Moving state to the closest shared parent of the components that need it                 |

---

## 3. Context: state that crosses screens

Lifting state up stops working once the components that need a value aren't on the same screen at all. A list of favourite studios needs to be readable from the Studios tab, where a user favourites something, and from the Profile tab, where they might review their favourites. These two screens don't share any visible parent closer than the root layout itself.

**Context** is React's way of making a value available to any component in the tree, without passing it down manually through every layer in between.

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface FavouritesContextValue {
  favouriteIds: string[];
  toggleFavourite: (id: string) => void;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(
  undefined,
);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  const toggleFavourite = (id: string) => {
    setFavouriteIds((current) =>
      current.includes(id)
        ? current.filter((existingId) => existingId !== id)
        : [...current, id],
    );
  };

  return (
    <FavouritesContext.Provider value={{ favouriteIds, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used inside a FavouritesProvider");
  }
  return context;
}
```

Wrap the app in the provider inside `app/_layout.tsx`, around the `Stack`, so every screen underneath it can reach into the same favourites list.

This is the **Observer pattern**. Any component that calls `useFavourites()` is subscribing to `FavouritesContext`'s value, and React re-renders every subscriber automatically whenever that value changes, without the component that changed it needing to know who else is listening, or how many. Hold onto this idea, because module 08 introduces Django signals, which solve the exact same problem, one function reacting automatically when something elsewhere changes, on the backend side, in a completely different language.

If `StudioRow` read `favouriteIds` directly from `useContext(FavouritesContext)` instead of through the `useFavourites` hook, would it still work? _Answer: yes, functionally, but the custom hook exists to hide that detail and to throw a clear error if it's used outside a provider by mistake. Wrapping a raw `useContext` call in a purpose-built hook is the same DRY instinct from module 01, applied to a piece of frontend plumbing instead of a backend utility._

| Key terms   |                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Context     | A way of making a value available to any component in the tree, without passing it through props |
| Provider    | The component that supplies a Context's current value to everything nested inside it             |
| Custom hook | A function, usually named `useSomething`, that wraps and hides a lower-level React API           |

---

## 4. Design first

Before adding a new piece of shared state anywhere in this app, ask one question first: which specific screens actually need to read or change this value? If the answer is one screen, it belongs in that screen's own `useState`. If the answer is two screens with a shared parent nearby, lift it to that parent. Only reach for Context once the answer is "screens that don't share a nearby parent at all." Reaching for Context by default, for everything, recreates the same tangled, everything-knows-about-everything problem prop drilling was supposed to avoid, just with different syntax.

---

## Task 1

Add the search filter shown in Section 2 to your real Studios tab, filtering the hardcoded studio data you already have from earlier modules by name as the user types.

## Task 2

Build `FavouritesContext`, its `FavouritesProvider`, and the `useFavourites` hook as shown in Section 3. Wrap your root layout in the provider.

## Task 3

Add a favourite toggle to `StudioRow`, such as a heart icon that fills in when a studio is favourited. Use `useFavourites` inside `StudioRow` to read and update the shared list. Confirm that favouriting a studio on the Studios tab is reflected correctly if you display the same studio, or a favourites count, anywhere else in the app, such as the Profile tab.

## Task 4

This favourites list currently lives only in memory, and disappears the moment the app restarts. Without being shown how, look into what `AsyncStorage` from `@react-native-async-storage/async-storage` does, and use it to persist `favouriteIds` so it survives an app restart. Write two or three sentences in your README explaining what you had to change in `FavouritesProvider` to load the saved value on startup and save it again on every change.
