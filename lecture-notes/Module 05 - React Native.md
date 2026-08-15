# Module 05: React Native

## 1. What a React Native component actually is

React Native looks like React, because it is React, but it isn't rendering to a browser, so the building blocks are different. There's no `<div>`, no `<span>`, no CSS file.

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FitTrack</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  heading: { fontSize: 24, fontWeight: "700" },
});
```

`View` is the closest thing React Native has to a `<div>`, a generic container with no visual meaning of its own. `Text` is where actual words go, and this matters more than it sounds like it should: unlike HTML, where a string of text can sit directly inside almost any element, React Native requires every piece of visible text to be wrapped in a `Text` component. `StyleSheet.create` replaces CSS, using plain JavaScript objects with camelCase property names instead of a separate stylesheet language.

Why does React Native insist that all text sit inside a `Text` component, when HTML happily lets text sit directly inside a `<div>`? _Answer: on native iOS and Android, rendering text and rendering a generic layout container are handled by genuinely different underlying native views. HTML hides that distinction from you; React Native keeps it visible, so `Text` exists as its own component rather than being folded invisibly into `View`._

| Key terms           |                                                                       |
| ------------------- | --------------------------------------------------------------------- |
| `View`              | A generic layout container, React Native's equivalent of a `<div>`    |
| `Text`              | The only component allowed to directly contain visible text           |
| `StyleSheet.create` | Defines styles as a JavaScript object, instead of a separate CSS file |

---

## 2. Layout with Flexbox

Every `View` in React Native lays out its children using Flexbox, and it's on by default, there's no separate `display: flex` to turn on the way there is on the web. One default is also flipped from what you might expect: `flexDirection` defaults to `column`, not `row`.

```jsx
<View style={styles.card}>
  <View style={styles.thumbnail} />
  <View style={styles.details}>
    <Text style={styles.name}>CityFit</Text>
    <Text style={styles.meta}>Dunedin Central, Dunedin</Text>
  </View>
</View>
```

```jsx
const styles = StyleSheet.create({
  card: { flexDirection: "row", padding: 16, alignItems: "center" },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  details: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#6b7280" },
});
```

`card` explicitly sets `flexDirection: "row"` to lay its two children out side by side, a thumbnail box and a details column, since the default would have stacked them vertically instead. `alignItems: "center"` vertically centres that row. Nothing here is specific to FitTrack, this exact row-of-thumbnail-plus-stacked-text shape is one of the most common layouts in mobile UI generally.

---

## 3. Props: making a component reusable

A component that only ever renders one hardcoded studio isn't very useful. **Props** are how a component receives different data each time it's used, the same way a function receives different arguments each time it's called.

```jsx
import { View, Text, Pressable, StyleSheet } from "react-native";

interface StudioRowProps {
  name: string;
  suburb: string;
  city: string;
  isFavourite: boolean;
  onToggleFavourite: () => void;
};

export function StudioRow({
  name,
  suburb,
  city,
  isFavourite,
  onToggleFavourite,
}: StudioRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.thumbnail} />

      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          {suburb}, {city}
        </Text>
      </View>

      <Pressable onPress={onToggleFavourite}>
        <Text>{isFavourite ? "♥" : "♡"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", padding: 16, alignItems: "center" },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  details: { marginLeft: 12, flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#6b7280" },
});
```

`StudioRow` doesn't know or store anything about favourites itself, it just displays whatever `isFavourite` it's handed, and calls whatever function it's handed as `onToggleFavourite` when the heart is pressed. That decision, of where the favourite actually lives, belongs to whatever screen uses `StudioRow`, not to `StudioRow` itself. Keeping a component this uninformed about anything outside its own props is what makes it genuinely reusable later.

| Key terms   |                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------- |
| Props       | Data passed into a component from whatever renders it, read-only from inside that component |
| `Pressable` | React Native's tappable wrapper component, the rough equivalent of a clickable `<button>`   |

---

## 4. State with `useState`

Props flow in from outside. **State** is data a component manages itself, that can change over time in response to something the user does.

```jsx
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <View>
      <Text>{count}</Text>
      <Pressable onPress={() => setCount(count + 1)}>
        <Text>Add one</Text>
      </Pressable>
    </View>
  );
}
```

Every call to `setCount` tells React the value has changed, and React re-renders the component with the new value. This is the exact same mechanism you'll rely on for a studio's favourite status, a search box's current text, or anything else that needs to change while someone's actually using the app.

Before adding a new `useState`, write down, in one sentence, exactly what event changes it and what the new value should be. "Pressing the heart flips `isFavourite` for that one studio" is a complete design. If you can't state it that plainly, the state itself is probably trying to represent two different things at once, and is worth splitting into two separate `useState` calls instead.

---

## 5. Rendering a list of data

A real screen shows more than one studio. `FlatList` renders an array efficiently, only building the rows that are actually visible on screen at any given moment, rather than all of them at once.

```jsx
import { FlatList } from "react-native";

interface Studio {
  id: string;
  name: string;
  suburb: string;
  city: string;
};

const studios: Studio[] = [
  { id: "1", name: "CityFit", suburb: "Dunedin Central", city: "Dunedin" },
  { id: "2", name: "Harbourside Yoga", suburb: "St Kilda", city: "Dunedin" },
  {
    id: "3",
    name: "Northside Strength",
    suburb: "North Dunedin",
    city: "Dunedin",
  },
];

<FlatList
  data={studios}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <StudioRow name={item.name} suburb={item.suburb} city={item.city} />
  )}
/>;
```

`keyExtractor` tells React which value uniquely identifies each row, the same purpose a primary key serves on the backend. Without it, React has no reliable way to tell which row is which when the underlying array changes, and can end up updating the wrong row on screen.

For a short, fixed list of exactly three items that never grows, would `studios.map(...)` work just as well as `FlatList`? _Answer: yes, functionally, for a list that small. `FlatList`'s real advantage is virtualisation, only rendering what's currently visible, which only starts to matter once a list is long enough, or grows dynamically enough, that rendering every row up front would actually cost something._

| Key terms      |                                                                              |
| -------------- | ---------------------------------------------------------------------------- |
| `FlatList`     | Efficiently renders a scrollable list, only rendering currently visible rows |
| `keyExtractor` | Tells React how to uniquely identify each row in a list                      |

---

## 6. Controlled text input

A search box needs to keep whatever's currently typed in sync with a piece of state, so the rest of the screen can react to it as it changes.

```jsx
import { useState } from "react";
import { TextInput, FlatList } from "react-native";

interface Studio {
  id: string;
  name: string;
  suburb: string;
  city: string;
};

export default function StudiosScreen() {
  const [query, setQuery] = useState<string>("");

  const filtered: Studio[] = studios.filter((studio) =>
    studio.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <TextInput
        placeholder="Search studios"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudioRow name={item.name} suburb={item.suburb} city={item.city} />
        )}
      />
    </>
  );
}
```

`value={query}` and `onChangeText={setQuery}` together make this a **controlled input**: the text box never manages its own content, it always displays exactly whatever `query` currently is, and every keystroke updates that state, which then flows back down as the new `value`. This is the same one-directional flow of data as everything else in this module, just applied to typing instead of pressing a button.

---

## Task 1

Build `StudioRow` as shown in Section 3, but design your own card layout using Flexbox rather than copying the one shown, styling it as a card of your own with at least a name, a suburb, and a city.

## Task 2

Create an array of at least five studio objects and render them with `FlatList`, using `StudioRow`. This can all live in one file for now, there's no navigation to wire up yet.

## Task 3

Add a `favourites` array to your screen's own `useState`, and wire up `StudioRow`'s `isFavourite` and `onToggleFavourite` props to it, so tapping the heart on any studio updates that studio, and only that studio.

## Task 4

Add the search box from Section 6 above your list, and extend the filter so it matches against both a studio's name and its suburb, not just its name.

## Task 5

Add a small inline form below the list, with two `TextInput` fields for a studio's name and suburb, and a button that adds a new studio to your array when pressed. Since there's no modal or navigation available yet, work out how to show and hide this form using a boolean piece of state and conditional rendering, without being shown exactly how, since neither was explicitly demonstrated in this module.

