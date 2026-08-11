# Module 06: Navigation and API Integration

## 1. A second screen, with Expo Router

Create a new blank TypeScript project:

```
npx create-expo-app --template
cd fittrack-app-06
npx expo start
```

Keep this deliberately small: one list screen, and one detail screen, connected by a single dynamic route. Nothing else yet, no tabs, no modals.

Create `app/index.tsx`.

```tsx
import { Link } from "expo-router";
import { View, Text, FlatList } from "react-native";

const studios = [
  { id: "1", name: "CityFit" },
  { id: "2", name: "Harbourside Yoga" },
];

export default function StudiosScreen() {
  return (
    <FlatList
      data={studios}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href={`/studios/${item.id}`}>
          <Text>{item.name}</Text>
        </Link>
      )}
    />
  );
}
```

Create `app/studios/[id].tsx`.

```tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Studio ID: {id}</Text>
    </View>
  );
}
```

That's the whole navigation setup. Tapping a name on the list screen pushes the detail screen, with the tapped studio's `id` available through `useLocalSearchParams`. The `<{ id: string }>` part tells TypeScript what shape to expect the route's params to have, the same idea as `StudioRowProps` in Section 1, just applied to a hook instead of a component.

| Key terms              |                                                                               |
| ---------------------- | ----------------------------------------------------------------------------- |
| Dynamic route          | A route segment, written as `[id].tsx`, that captures a variable from the URL |
| `useLocalSearchParams` | Reads the current route's dynamic segment                                     |

---

## 2. Fetching real data

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

Convert `StudioRow` from module 04 into TypeScript, with a proper `StudioRowProps` interface, as shown in Section 1.

## Task 2

Set up the two-screen navigation from Section 2. Confirm tapping a studio on the list pushes the detail screen, showing the correct `id`.

## Task 3

Create `studiosApi.ts` as shown in Section 3, and connect your list screen to it, so it displays real studios from your running Django server instead of hardcoded data.

## Task 4

Connect the detail screen to `getStudio(id)` as well, so it shows a real studio's full details, fetched by the `id` from the route.

## Task 5

Both screens currently ignore the possibility of the fetch failing, for example if your Django server isn't running. Add a simple error state to at least one screen, using a second piece of state such as `error: string | null`, and show a plain error message instead of an empty screen when the request fails. Test it by actually stopping your Django server and confirming the message appears.

## Task 6

In the separate blank project from Section 5, implement a working [React Navigation](https://reactnavigation.org/) stack with at least two screens of your own, not just the Home and Details example shown above. One screen should navigate to the other while passing at least one param, and the receiving screen should read and display that param.
