# Module 06: Navigation and API Integration

## 1. Setting up a new project

Create a new project, and install Expo Router explicitly rather than assuming a template already includes it correctly configured.

```bash
npx create-expo-app fittrack-app-06 --template blank-typescript
cd fittrack-app-06
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

At this point your project only has `App.tsx` at the root, along with the usual config files. That's expected: the `blank-typescript` template gives you a single-file app, not a project with Expo Router already wired up.

Expo Router expects to be the app's entry point, taking over from `App.tsx` entirely. Set that in `package.json`.

```json
{
  "main": "expo-router/entry"
}
```

Once that's set, `App.tsx` is no longer used for anything, Expo Router won't look at it. Delete it, so there isn't a dead file sitting in your project pretending to matter.

Expo Router doesn't read `App.tsx`, it reads a folder called `app/`, which the `blank-typescript` template doesn't create for you. Create it yourself, at the project root, alongside `package.json`.

```bash
mkdir app
```

Every screen from here on is a file inside that `app/` folder. If you only ever see `App.tsx` in your file explorer and nothing changes when you edit it, this is almost always why: either `app/` doesn't exist yet, or `main` in `package.json` still points at the old entry point instead of `expo-router/entry`.

Confirm the project runs before going further.

```bash
npx expo start -c
```

At this stage, with no files inside `app/` yet, Expo Router will show its own "missing default export" or "no routes found" screen. That's expected too, and it means the entry point swap worked. Section 2 adds the first real route.

---

## 2. A second screen, with Expo Router

Keep this deliberately small: one list screen, and one detail screen, connected by a single dynamic route. Nothing else yet, no tabs, no modals.

Create `app/index.tsx`.

```tsx
import { Link } from "expo-router";
import { View, Text, FlatList, StyleSheet } from "react-native";

const studios = [
  { id: "1", name: "CityFit" },
  { id: "2", name: "Harbourside Yoga" },
];

export default function StudiosScreen() {
  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={studios}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href={`/studios/${item.id}`} style={styles.row}>
          <Text style={styles.rowText}>{item.name}</Text>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d1d5db",
  },
  rowText: { fontSize: 16, fontWeight: "500" },
});
```

Create `app/studios/[id].tsx`.

```tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Studio ID</Text>
      <Text style={styles.value}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  label: { fontSize: 13, color: "#6b7280", textTransform: "uppercase" },
  value: { fontSize: 22, fontWeight: "700", marginTop: 4 },
});
```

That's the whole navigation setup. Tapping a name on the list screen pushes the detail screen, with the tapped studio's `id` available through `useLocalSearchParams`. The `<{ id: string }>` part tells TypeScript what shape to expect the route's params to have, the same idea as `StudioRowProps` in Section 3, just applied to a hook instead of a component.

| Key terms              |                                                                               |
| ---------------------- | ----------------------------------------------------------------------------- |
| Dynamic route          | A route segment, written as `[id].tsx`, that captures a variable from the URL |
| `useLocalSearchParams` | Reads the current route's dynamic segment                                     |

---

## 3. A typed presenter component

Bring `StudioRow` over from module 04 and give it a proper interface, so a mistyped or missing prop is caught before the app ever runs, rather than silently rendering `undefined` the way it could in plain JavaScript.

```tsx
interface StudioRowProps {
  name: string;
  suburb: string;
  city: string;
}

export function StudioRow({ name, suburb, city }: StudioRowProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.meta}>
        {suburb}, {city}
      </Text>
    </View>
  );
}
```

| Key terms   |                                                                        |
| ----------- | ---------------------------------------------------------------------- |
| `interface` | Describes the shape of an object: its fields, and the type of each one |

---

## 4. Fetching real data

The list above is still hardcoded. Replace it with a real request to the API you built in module 03.

Create `studiosApi.ts`, describing the shape of the data and how to fetch it.

```tsx
export interface Studio {
  id: number;
  name: string;
  suburb: string;
  city: string;
}

export async function getStudios(): Promise<Studio[]> {
  const response = await fetch("http://127.0.0.1:8000/api/studios/");
  return response.json();
}

export async function getStudio(id: string): Promise<Studio> {
  const response = await fetch(`http://127.0.0.1:8000/api/studios/${id}/`);
  return response.json();
}
```

This is the same Adapter idea named back in module 03, now showing up from the other side. `getStudios` doesn't just fetch data, it also tells the rest of the app exactly what shape to expect back, `Promise<Studio[]>`, so every screen that calls it gets the same guarantee, checked by TypeScript, instead of trusting raw, untyped JSON.

Use it in the list screen with `useState` and `useEffect`.

```tsx
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { FlatList, Text, ActivityIndicator } from "react-native";
import { getStudios, Studio } from "./studiosApi";

export default function StudiosScreen() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudios().then((data) => {
      setStudios(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={studios}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Link href={`/studios/${item.id}`}>
          <Text>{item.name}</Text>
        </Link>
      )}
    />
  );
}
```

`useState<Studio[]>([])` is the array of studios, starting empty. `useEffect(..., [])` runs once, when the screen first appears, kicking off the fetch. Do the same thing on the detail screen, using `getStudio(id)` instead, so the detail screen shows real data too, not just the raw `id`.

Before writing a fetch call, decide what the screen should show in each of its three possible states: while waiting, once data arrives, and if the request fails. `ActivityIndicator` above only handles the first. A screen that never plans for the third state just freezes, or shows stale data, the moment a real network fails.

| Key terms           |                                                                               |
| ------------------- | ----------------------------------------------------------------------------- |
| `useEffect`         | Runs code in response to a component appearing, or a value changing           |
| `Promise<Studio[]>` | A type describing a value that will eventually resolve to an array of studios |

---

## Task 1

Convert `StudioRow` from module 04 into TypeScript, with a proper `StudioRowProps` interface, as shown in Section 3.

## Task 2

Set up the two-screen navigation from Section 2. Confirm tapping a studio on the list pushes the detail screen, showing the correct `id`.

## Task 3

Create `studiosApi.ts` as shown in Section 4, and connect your list screen to it, so it displays real studios from your running Django server instead of hardcoded data.

## Task 4

Connect the detail screen to `getStudio(id)` as well, so it shows a real studio's full details, fetched by the `id` from the route.

## Task 5

Both screens currently ignore the possibility of the fetch failing, for example if your Django server isn't running. Add a simple error state to at least one screen, using a second piece of state such as `error: string | null`, and show a plain error message instead of an empty screen when the request fails. Test it by actually stopping your Django server and confirming the message appears.

## Task 6

Everything so far in this module has used Expo Router, which infers routes automatically from your file structure. Under the hood, Expo Router is actually built on top of a separate library called [React Navigation](https://reactnavigation.org/), which requires you to declare every screen explicitly, in code, rather than by file name.

Expo Router and a manually configured React Navigation setup don't mix cleanly in the same project, since Expo Router already sets up its own navigator underneath your `app/` folder. Create a second, separate blank TypeScript project just for this task.

Without any walkthrough or example to copy from, use React Navigation's own documentation to install it, wire up a working stack navigator with at least two screens of your own, and get one screen navigating to the other while passing at least one param, which the receiving screen reads and displays. Then add a third screen, and work out how it fits into the same stack.

In your README, write two or three sentences on what React Navigation makes you configure explicitly that Expo Router had been doing for you automatically all along.
