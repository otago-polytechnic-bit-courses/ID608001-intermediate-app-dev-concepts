# Module 05 - React Native, Expo and Navigation

## 1. What is React Native, and what is Expo

This module builds the mobile front end for the same fitness app whose backend you built in Modules 02 and 03. It's your first time touching either React Native or Expo, so before any routing or navigation, it's worth being clear on what each one actually is and why they're used together.

**React Native** lets you build mobile apps in JavaScript or TypeScript using a component model: small, self-contained pieces of UI, each responsible for one part of the screen, that you compose together into a full app. If that sounds like the same idea behind SvelteKit's components from Intro App Dev, it is, just with a different syntax and a different underlying library. The mental model is React's: a **component** is a function that returns a description of what should appear on screen, called **JSX**, and that description re-renders automatically whenever the data behind it changes.

The critical difference from anything web-based is that there's no browser and no HTML. React Native doesn't render `<div>` or `<button>` tags; it translates your components into the platform's actual native UI, a real iOS `UIView` or a real Android view, not a web page pretending to be an app. To do that translation, it gives you its own set of built-in components that stand in for the HTML tags you might otherwise reach for:

| If you were on the web, you'd use... | In React Native, use instead                           |
| ------------------------------------ | ------------------------------------------------------ |
| `<div>`                              | `<View>`                                               |
| `<p>`, `<span>`                      | `<Text>`                                               |
| `<img>`                              | `<Image>`                                              |
| `<button>`                           | `<Pressable>`                                          |
| `<input>`                            | `<TextInput>`                                          |
| `<ul>` / scrolling list              | `<FlatList>` or `<ScrollView>`                         |
| a `.css` file, or `class="..."`      | `StyleSheet.create({...})`, applied via a `style` prop |

Every piece of text on screen, without exception, has to be wrapped in a `<Text>` component; unlike the web, React Native won't let a bare string sit inside a `<View>` on its own.

**Expo** is a toolchain built on top of React Native that handles the parts of native app development you don't want to deal with yet: build configuration, native modules, and getting something running on an actual phone without installing the full iOS or Android developer toolchains. For this course, Expo is what makes it possible to write code on your laptop and see it running on your own phone within seconds.

| Key terms    |                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------- |
| React Native | A framework for building mobile apps in JavaScript or TypeScript, using React's component model |
| Expo         | A toolchain around React Native that handles most native build configuration for you            |
| Component    | A function that returns a description of UI; the basic building block of a React Native app     |
| JSX          | Markup-like syntax written directly inside JavaScript or TypeScript, describing what to render  |

---

## 2. Installing and creating your first project

You'll need Node.js installed, and either the **Expo Go** app on a physical phone (available from the App Store or Play Store), or Xcode's iOS simulator / Android Studio's emulator on your laptop.

```bash
npx create-expo-app fittrack-app --template blank-typescript
cd fittrack-app
npx expo start
```

`create-expo-app` scaffolds a working project for you, the same way `django-admin startproject` did back in Module 02. The **blank TypeScript** template specifically is deliberately minimal: TypeScript is configured, but nothing else is set up for you yet, no routing, no navigation, no example screens. That's the point for this module: you'll add Expo Router yourself in Section 4, so you actually see what it's doing, rather than inheriting a folder structure that's already there.

Running `npx expo start` prints a QR code in your terminal. Scanning it with the Expo Go app on your phone, or pressing `i`/`a` in the terminal for an iOS or Android simulator, loads your app. Any file you save is reflected on the phone or simulator within a second or two; this is called **fast refresh**, and you'll rely on it constantly.

### 2.1 The project structure

Open the folder `create-expo-app` generated:

```
fittrack-app/
├── App.tsx        ← the entire app, right now
├── package.json
├── tsconfig.json
└── app.json
```

Everything currently renders from the single `App.tsx` at the root, the same way a single `index.html` might be the whole of a very first web page. There's no `app/` directory yet, and no routing; that only exists once you deliberately add Expo Router.

### Task 1

Create the project above, get it running on either a physical device or a simulator, and confirm fast refresh works: open `App.tsx`, change its text, save, and watch it update without a manual reload.

---

## 3. Your first component

Every screen starts from the same basic shape: a `View` for layout, `Text` for anything readable, and a `StyleSheet` object for styling.

```tsx
// App.tsx
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitTrack</Text>
      <Text style={styles.subtitle}>Find a studio near you</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
});
```

A few things worth noticing here, since they'll be everywhere from now on. `flex: 1` tells a `View` to grow and fill the space available to it; React Native uses **flexbox** for all layout, with no other layout system available, so it's worth getting comfortable with `flex`, `alignItems`, and `justifyContent` early. `StyleSheet.create` takes a plain JavaScript object and returns something React Native can apply efficiently; despite the name, there's no actual stylesheet file involved, and no class names, just an object passed to a component's `style` prop.

Like any React component, a React Native component can accept **props**, values passed in from whoever renders it, and can hold its own **state**, values that change over time and trigger a re-render when they do:

```tsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <Text style={styles.greeting}>Welcome, {name}</Text>;
}

export default function App() {
  const [isAcceptingMembers, setIsAcceptingMembers] = useState(true);

  return (
    <View style={styles.container}>
      <Greeting name="Alex" />
      <Pressable onPress={() => setIsAcceptingMembers((prev) => !prev)}>
        <Text>
          {isAcceptingMembers
            ? "Accepting new members"
            : "Not accepting new members"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
  },
});
```

`Greeting` is a component receiving a `name` prop, typed with the `GreetingProps` interface from Module 04. `useState` is a **hook**, a function that lets a component remember a value across re-renders; calling `setIsAcceptingMembers` updates that value and causes the component to render again with the new one. You'll use both of these constantly for the rest of this module.

| Key terms           |                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------- |
| `View`, `Text`      | React Native's core layout and text components                                      |
| `StyleSheet.create` | Defines styles as a JavaScript object, applied via a component's `style` prop       |
| flexbox             | React Native's layout system; `flex`, `alignItems`, `justifyContent` control it     |
| Props               | Values passed into a component from whoever renders it                              |
| State, `useState`   | A value a component remembers across renders, and can update to trigger a re-render |

### Task 2

Build a static `App.tsx` screen for FitTrack with an app name, a short tagline, and at least one piece of layout using `flex`, `alignItems`, and `justifyContent`. Then add a `Pressable` that toggles a piece of `useState` text between two values, the same way the example above does, using something relevant to the fitness app rather than copying the example directly.

---

## 4. Expo Router

**Expo Router** is the file-system-based routing framework for React Native and Expo, built on top of React Navigation. It uses the same mental model as SvelteKit's own file-based routing, which you already know from Intro App Dev: the file structure inside an `app/` directory defines the routes, rather than a routing table you write by hand. The blank template you started from doesn't include it, so you're about to set it up from nothing, which is the clearest way to see what it actually does.

The current version is **Expo Router v4**, which ships with Expo SDK 52.

Reference: [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

File-based routing is **convention over configuration**, the exact same philosophy behind Django's `startapp` command and its predictable file layout, from Module 02. In both cases, the framework looks at where a file lives and infers what it should do, so you spend your time writing the actual screen, not wiring up a routing table by hand.

### 4.1 Why Expo Router?

| Feature           | Expo Router              | React Navigation (bare) |
| ----------------- | ------------------------ | ----------------------- |
| Route definition  | File system              | Code                    |
| Deep linking      | Automatic                | Manual configuration    |
| URL support (web) | Built-in                 | Requires extra setup    |
| Typed routes      | Built-in (`typedRoutes`) | Manual                  |
| Layouts           | File-based               | Defined in code         |

### 4.2 Installing it

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Set the entry point in `package.json`, replacing whatever `main` currently points at:

```json
{
  "main": "expo-router/entry"
}
```

This one line is what hands control of the app over to Expo Router. From this point on, Expo Router looks for an `app/` directory and builds your screens from whatever it finds there; `App.tsx` at the root is no longer read at all.

Enable typed routes in `app.json`:

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

Typed routes are exactly the piece from Module 04 that stops a mistyped route name compiling in the first place; the rest of this module assumes it's turned on.

### 4.3 Migrating your screen into `app/`

Create the directory and move your screen into it:

```bash
mkdir app
```

```tsx
// app/index.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [isAcceptingMembers, setIsAcceptingMembers] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitTrack</Text>
      <Pressable onPress={() => setIsAcceptingMembers((prev) => !prev)}>
        <Text>
          {isAcceptingMembers
            ? "Accepting new members"
            : "Not accepting new members"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
});
```

Also add a minimal root layout, which every Expo Router project needs:

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

You can delete `App.tsx` at this point; it's no longer part of the app.

### Task 3

Install Expo Router as in Section 4.2, then carry the screen you built in Task 2 over into `app/index.tsx`, adding a basic `app/_layout.tsx` alongside it. Confirm the app still runs and shows your screen, then delete `App.tsx` and confirm nothing breaks, proving Expo Router really is the one in control now.

---

## 5. File system routing

Every file inside `app/` that exports a React component becomes a route.

### 5.1 Route conventions

| File                        | Route          | Notes                          |
| --------------------------- | -------------- | ------------------------------ |
| `app/index.tsx`             | `/`            | Home screen                    |
| `app/about.tsx`             | `/about`       | Static route                   |
| `app/studios/index.tsx`     | `/studios`     | Index of a group               |
| `app/studios/[id].tsx`      | `/studios/:id` | Dynamic route                  |
| `app/studios/[...slug].tsx` | `/studios/*`   | Catch-all route                |
| `app/_layout.tsx`           | (none)         | Layout for the current segment |
| `app/(tabs)/_layout.tsx`    | (none)         | Tab group layout               |
| `app/+not-found.tsx`        | 404            | Not-found screen               |

### 5.2 Root layout

`app/_layout.tsx` is the root layout and wraps every screen in the app. It is where you configure the navigation stack, theme, and global providers:

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#111827",
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
        }}
      />
    </>
  );
}
```

Before writing any route file, sketch the screen map on paper: boxes for each screen, arrows for how a user moves between them. This is the same wireframe habit from Windows Forms design in an earlier course, applied to a stack of mobile screens instead of a single window. For this app, that map is likely to include a list of studios, a studio's detail screen showing its classes, and a way to add a new studio; settle that map before touching a route file. Once the map is settled, the file structure to build it is usually obvious.

| Key terms                  |                                                                |
| -------------------------- | -------------------------------------------------------------- |
| `app/` directory           | The folder whose file structure defines your app's routes      |
| `_layout.tsx`              | Defines a shared layout (and navigator) for the current folder |
| Dynamic route (`[id].tsx`) | A route segment that captures a variable, like a studio's ID   |

---

## 6. Stack navigation

A **Stack** navigator presents screens as a stack. Navigating forward pushes a new screen on top; the back button pops it off.

### 6.1 Basic stack

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="studios/index" options={{ title: "Studios" }} />
      <Stack.Screen name="studios/[id]" options={{ title: "Studio Details" }} />
    </Stack>
  );
}
```

### 6.2 Navigating between screens

```tsx
// app/index.tsx
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* Declarative navigation */}
      <Link href="/studios">
        <Text>View Studios</Text>
      </Link>

      {/* Imperative navigation */}
      <Pressable onPress={() => router.push("/studios")}>
        <Text>View Studios</Text>
      </Pressable>

      {/* Replace instead of push, no back button */}
      <Pressable onPress={() => router.replace("/login")}>
        <Text>Go to Login</Text>
      </Pressable>

      {/* Go back */}
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
    </View>
  );
}
```

`Link` is the declarative way to navigate, similar to an `<a>` tag; `useRouter` gives you an imperative alternative, useful when navigation needs to happen inside a function, such as after a successful form submission.

### 6.3 Dynamic routes

```tsx
// app/studios/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Studio ID: {id}</Text>
    </View>
  );
}
```

Navigate to a dynamic route:

```tsx
import { useRouter } from "expo-router";

const router = useRouter();

// Type-safe navigation with typedRoutes enabled
router.push({ pathname: "/studios/[id]", params: { id: studio.id } });
```

Notice this `id` is the same field that, on the backend, is the primary key Django generated automatically for every `Studio` row back in Module 02, and the same `id` field `StudioSerializer` includes in its JSON in Module 03. The two sides of this app already agree on what identifies a studio, even though they don't talk to each other yet; that agreement is exactly what the `Studio` interface you wrote in Module 04 makes explicit on this side.

### 6.4 Passing parameters

```tsx
// Navigating with query params
router.push({
  pathname: "/studios/[id]",
  params: { id: "1", from: "home" },
});

// Receiving params
const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
```

> All params are strings, even though a `Studio`'s `id` is a number on the backend. Parse numbers explicitly, the same `TryParse`-style defensiveness from an earlier course, just under a different name: `parseInt(id, 10)`.

| Key terms              |                                                                         |
| ---------------------- | ----------------------------------------------------------------------- |
| Stack navigator        | Presents screens as a stack; forward pushes, back pops                  |
| `useRouter`            | A hook giving imperative navigation methods (`push`, `replace`, `back`) |
| `useLocalSearchParams` | Reads the current route's dynamic segment and query parameters          |

### Task 4

Build `app/studios/index.tsx` as a simple list screen: a `View` containing a handful of hardcoded studio names, each wrapped in a `Pressable`. Then create `app/studios/[id].tsx`, and wire up navigation so pressing a studio in the list pushes to its detail screen and displays that studio's `id` from the route params, with a working back button.

---

## 7. Tab navigation

A **Tab** navigator renders a persistent tab bar at the bottom of the screen. In Expo Router, tabs are defined using a route group folder prefixed with `(tabs)`.

### 7.1 Tab group structure

```
app/
├── _layout.tsx          <- Root stack (wraps tabs)
├── (tabs)/
│   ├── _layout.tsx      <- Tab navigator layout
│   ├── index.tsx        <- Home tab (/)
│   ├── studios.tsx      <- Studios tab
│   └── profile.tsx      <- Profile tab
└── studios/
    └── [id].tsx         <- Detail screen (outside tabs)
```

### 7.2 Tab layout

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          height: Platform.OS === "ios" ? 84 : 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="studios"
        options={{
          title: "Studios",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

Install the icons package:

```bash
npx expo install @expo/vector-icons
```

### 7.3 Root layout with tabs

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* The (tabs) group: headerShown false because each tab manages its own header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Detail screens live outside the tab group so they cover the tab bar */}
      <Stack.Screen name="studios/[id]" options={{ title: "Studio Details" }} />
    </Stack>
  );
}
```

| Key terms     |                                                                         |
| ------------- | ----------------------------------------------------------------------- |
| Tab navigator | A persistent tab bar, usually at the bottom of the screen               |
| `(tabs)`      | A route group folder: the parentheses mean it doesn't add a URL segment |

### Task 5

Implement the three-tab structure from Section 7 (Home, Studios, Profile). Move the screen you built in Task 4 into `app/(tabs)/studios.tsx` so the studio list appears inside the Studios tab, and confirm the detail screen still opens correctly and still sits outside the tab bar.

---

## 8. Component composition

Screens like the ones above are usually built from smaller, focused components rather than one large block of markup, exactly the same Single Responsibility instinct from your class design in an earlier course, now applied to UI. A common split is between a component that knows how to _fetch or hold data_ and a component that only knows how to _display_ whatever it's handed. This is sometimes called the container/presenter split.

```tsx
// components/StudioRow.tsx: a pure "presenter", no data fetching, just display
import { View, Text, Pressable, StyleSheet } from "react-native";

interface StudioRowProps {
  id: number;
  name: string;
  suburb: string;
  city: string;
  onPress: (id: number) => void;
}

export function StudioRow({ id, name, suburb, city, onPress }: StudioRowProps) {
  return (
    <Pressable onPress={() => onPress(id)} style={styles.row}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.meta}>
        {suburb}, {city}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { padding: 16 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#6b7280", marginTop: 2 },
});
```

`StudioRow` doesn't know or care where its data came from. It could be hardcoded test data today, and real data from your Django API in Module 07, and it wouldn't need to change at all. That's the same benefit you saw from separating business logic out of an event handler in an earlier course: a component that only displays what it's given is trivially reusable, and trivially testable, because nothing about it depends on how the data arrived. Notice too that `StudioRowProps` is the same shape of interface Module 04 asked you to write for `Studio`; a props interface is just that idea applied to a component instead of a data model.

| Key terms                 |                                                                         |
| ------------------------- | ----------------------------------------------------------------------- |
| Container/presenter split | Separating "fetches or holds data" from "only displays what it's given" |

### Task 6

Pull the hardcoded rows from your Task 4 studio list out into a `components/StudioRow.tsx` presenter, typed with the `StudioRowProps` interface above. Update `app/(tabs)/studios.tsx` to render a `StudioRow` for each hardcoded studio, passing the data in as props rather than writing it inline.

---

## 9. Route groups

Route groups use parentheses in their folder name. They do not add a URL segment; they exist only to organise files or share layouts:

```
app/
├── (auth)/
│   ├── _layout.tsx    ← Auth layout (no header, different background)
│   ├── login.tsx      ← /login
│   └── register.tsx   ← /register
├── (tabs)/
│   ├── _layout.tsx
│   └── index.tsx      ← /
```

### 9.1 Auth group layout

```tsx
// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f9fafb" },
      }}
    />
  );
}
```

Real login and registration screens are Week 07's job, once there's a Django auth API to talk to. This week, the goal is only the route structure and layout.

### Task 7

Create the `(auth)` route group with `login.tsx` and `register.tsx` screens. Style the auth layout with a different background colour. Add a `Link` on the login screen to the register screen and vice versa.

---

## 10. Modal routes

Modals slide up from the bottom. Present them by setting `presentation: "modal"` on a `Stack.Screen`:

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="create-studio"
    options={{
      presentation: "modal",
      title: "New Studio",
    }}
  />
</Stack>
```

Navigate to the modal:

```tsx
router.push("/create-studio");
```

### Task 8

Create `app/create-studio.tsx` presented as a modal. Add an "Add" button (using `headerRight`) on the Studios tab that opens the modal. Include a "Cancel" button inside the modal that dismisses it with `router.back()`.

---

## 11. Typed routes

Enabling `typedRoutes` (Section 4.2) means TypeScript checks your route names and parameters against your actual `app/` folder structure, catching a typo in a route name at compile time instead of as a runtime crash on someone's phone. This is the same compile-time safety net Module 04 introduced for plain values and interfaces, just applied to navigation.

### Task 9

Enable `typedRoutes` in `app.json` if you haven't already. Update every `router.push()` call in your project to use the typed `{ pathname, params }` form. Verify that TypeScript catches an incorrect route name if you deliberately mistype one.

---

## 12. Not found screen

```tsx
// app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  link: { marginTop: 12 },
  linkText: { color: "#3b82f6", fontSize: 16 },
});
```

### Task 10

Implement `app/+not-found.tsx` with a user-friendly message and a link back to the home screen.
