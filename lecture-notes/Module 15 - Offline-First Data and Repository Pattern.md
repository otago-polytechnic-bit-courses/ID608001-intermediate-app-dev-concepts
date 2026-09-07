# Module 15: Offline-First Data and Repository Pattern

**Note:** The following notes were co-written with AI help structure topics and explain complex terms clearly.

## 1. The assumption every app makes and shouldn't

Every screen you've built since module 06 assumes a working network. `getStudios()` fetches, the spinner spins, the list appears. Module 06's Task 5 added an error state, which was an improvement, but the improvement was only ever "tell the user it failed."

Mobile is different from the web in a way that matters here. A phone loses signal in a lift, on a bus, in a gym basement. It goes into a tunnel mid-request. Those aren't failures in any interesting sense; they're the normal operating conditions of a device that moves around.

**Offline-first** treats the local device as the primary source of data, with the network as something that updates it. The app reads from local storage and renders immediately, then refreshes from the server when it can. The user's experience of losing signal changes from "the app is broken" to "the app is showing me what it knew a minute ago."

Module 09 listed assumptions as one of the things worth writing down precisely because they're invisible. "Users will be online when they use the app" is the assumption this module exists to question.

| Approach      | Reads from    | With no network                   |
| ------------- | ------------- | --------------------------------- |
| Network-first | The API       | An error screen, or nothing       |
| Offline-first | Local storage | The last known data, still usable |

---

## 2. Local storage on the device

Expo offers a real SQL database on the device.

```bash
npx expo install expo-sqlite
```

Create `db/database.ts`.

```tsx
import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync("fittrack.db");

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS studios (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      suburb TEXT NOT NULL,
      city TEXT NOT NULL,
      synced_at TEXT NOT NULL
    );
  `);

  return database;
}
```

Two things worth noticing. The `database` variable caches the connection, so repeated calls reuse one connection rather than opening a new one each time. And `CREATE TABLE IF NOT EXISTS` means this is safe to call on every launch, which matters because there's no `manage.py migrate` here; the app has to set up its own schema.

That's the same problem Django solved with migrations back in module 02, arriving from the other side, and it has the same eventual answer: once your schema changes after users already have data, you'll need versioned migration steps rather than a single `CREATE TABLE`.

---

## 3. The Repository pattern

Module 03 named the **Repository pattern** while looking at Django's ORM, and promised you'd meet it again on the client doing precisely the same job for a local SQLite cache. Here it is.

A Repository sits between your application code and however data is actually stored, so nothing above it needs to know whether data came from the network, from SQLite, or from memory. It exposes intentions, `getAll`, `save`, `clear`, rather than mechanisms, `SELECT`, `INSERT`, `fetch`.

Create `repositories/studioRepository.ts`.

```tsx
import { getDatabase } from "../db/database";
import { Studio } from "../studiosApi";

interface StudioRow {
  id: number;
  name: string;
  suburb: string;
  city: string;
  synced_at: string;
}

export const studioRepository = {
  async getAll(): Promise<Studio[]> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<StudioRow>(
      "SELECT * FROM studios ORDER BY name",
    );

    return rows.map(({ id, name, suburb, city }) => ({
      id,
      name,
      suburb,
      city,
    }));
  },

  async getById(id: number): Promise<Studio | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<StudioRow>(
      "SELECT * FROM studios WHERE id = ?",
      [id],
    );

    if (!row) {
      return null;
    }

    return { id: row.id, name: row.name, suburb: row.suburb, city: row.city };
  },

  async saveAll(studios: Studio[]): Promise<void> {
    const database = await getDatabase();
    const syncedAt = new Date().toISOString();

    await database.withTransactionAsync(async () => {
      for (const studio of studios) {
        await database.runAsync(
          `INSERT OR REPLACE INTO studios (id, name, suburb, city, synced_at)
           VALUES (?, ?, ?, ?, ?)`,
          [studio.id, studio.name, studio.suburb, studio.city, syncedAt],
        );
      }
    });
  },

  async lastSyncedAt(): Promise<string | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<{ synced_at: string }>(
      "SELECT synced_at FROM studios ORDER BY synced_at DESC LIMIT 1",
    );

    return row?.synced_at ?? null;
  },
};
```

Several deliberate decisions in there.

The `?` placeholders are **parameterised queries**, and they aren't optional. Building SQL by string concatenation is how SQL injection happens, and it's just as possible on a phone as on a server. This is the same reason you never wrote raw SQL against Django's ORM in module 03: the safe path should be the easy one.

`withTransactionAsync` wraps the whole batch so it either all succeeds or all fails. Without it, an app killed halfway through a sync leaves a partially updated cache, which is a genuinely nasty class of bug.

The mapping in `getAll` turns snake_case database columns into the camelCase `Studio` shape the rest of the app uses, and drops `synced_at`, which is the repository's bookkeeping and none of the UI's business. That's the Adapter idea from module 03 nested inside the Repository, which is common: repositories very often adapt as well as store.

The interface is the point. Nothing outside this file knows SQLite is involved. Swapping it for a different storage engine, or a plain in-memory object for testing, means changing this one file, which is Dependency Inversion from module 13 with a name attached.

| Key terms           |                                                                     |
| ------------------- | ------------------------------------------------------------------- |
| Repository pattern  | A consistent interface for reading and writing data, hiding storage |
| `expo-sqlite`       | A real SQL database running on the device                           |
| Parameterised query | SQL with `?` placeholders, so values can never be read as SQL       |
| Transaction         | A group of operations that all succeed or all fail together         |

### Task 1

Build `database.ts` and `studioRepository.ts` as shown, adapted to your own app's main model rather than studios. Confirm it works by saving a hardcoded array and reading it back, before any network code is involved.

---

## 4. Cache-then-network

With a repository in place, a screen can serve local data immediately and refresh in the background.

Create `hooks/useStudios.ts`.

```tsx
import { useState, useEffect, useCallback } from "react";
import { getStudios, Studio } from "../studiosApi";
import { studioRepository } from "../repositories/studioRepository";

interface UseStudiosResult {
  studios: Studio[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useStudios(): UseStudiosResult {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const fresh = await getStudios();
      await studioRepository.saveAll(fresh);
      setStudios(fresh);
    } catch {
      setError("Showing saved data. Couldn't reach the server.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const cached = await studioRepository.getAll();
      setStudios(cached);
      setIsLoading(false);
      await refresh();
    }

    load();
  }, [refresh]);

  return { studios, isLoading, isRefreshing, error, refresh };
}
```

The order in `load` is the whole strategy. Read the cache, show it, stop the initial loading state, _then_ go to the network. A returning user sees data almost instantly, and the refresh happens behind data they're already reading.

The error message is worth reading carefully too. It says the app is showing saved data, rather than announcing a failure. That's an honest description of the state the user is actually in, and it's a much better experience than an empty screen, because the app is still useful.

Two loading states now exist, and they mean different things. `isLoading` is "I have nothing to show yet," which is only true on a genuine first launch. `isRefreshing` is "I'm updating what you're already looking at," which belongs in a pull-to-refresh spinner, not a full-screen one.

Using it:

```tsx
import {
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useStudios } from "../hooks/useStudios";
import { StudioRow } from "../components/StudioRow";

export default function StudiosScreen() {
  const { studios, isLoading, isRefreshing, error, refresh } = useStudios();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {error && (
        <Text className="p-3 bg-amber-100 text-amber-900">{error}</Text>
      )}

      <FlatList
        data={studios}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <StudioRow studio={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <Text className="p-6 text-center text-gray-500">No studios yet.</Text>
        }
      />
    </>
  );
}
```

The screen is now handling all four states module 09 asked your wireframes to cover: loading, error, empty, and success. `ListEmptyComponent` is the empty state, and it's the one most often missed, since it's the very first thing a new user sees.

### Task 2

Build `useStudios` and connect it to your list screen. Then test it properly, which means testing it offline: load the app once with your Django server running, stop the server, and reload. The list should still appear, with the message explaining it's saved data.

---

## 5. Knowing whether you're online

Catching a failed fetch tells you the network failed. It doesn't tell you the difference between "no signal" and "your server is down," and the user experience for those two should differ.

```bash
npx expo install @react-native-community/netinfo
```

```tsx
import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable));
    });

    return unsubscribe;
  }, []);

  return isOnline;
}
```

Returning `unsubscribe` from `useEffect` is a **cleanup function**, and it's essential rather than tidy. Without it, every mount adds another listener that's never removed, and the app slowly accumulates them. This is the client-side equivalent of leaving a database connection open.

`isConnected` and `isInternetReachable` are genuinely different. A phone on hotel wifi with a login page it hasn't completed is connected and not reachable, which is exactly the case that produces confusing bug reports.

Given that this hook exists, should `useStudios` in section 4 check `isOnline` before attempting its refresh, and skip the request if the answer is no? _Answer: it can, but it shouldn't rely on it. Connectivity can drop between the check and the request, and being reported as online is not a promise that your particular server is reachable - it might be down, or your LAN address might have changed. The `try`/`catch` is what actually handles failure; the online check is an optimisation that avoids a pointless request, not a replacement for handling the error._

---

## 6. Queuing writes

Reading offline is the easy half. Writing offline is where the real design decisions are, and it's worth being honest that this is where most offline-first implementations get complicated.

The basic approach is a queue: when a write fails because there's no network, store the intent locally and replay it when connectivity returns.

```tsx
CREATE TABLE IF NOT EXISTS pending_writes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

```tsx
export const pendingWriteRepository = {
  async enqueue(method: string, path: string, body: unknown): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `INSERT INTO pending_writes (method, path, body, created_at)
       VALUES (?, ?, ?, ?)`,
      [method, path, JSON.stringify(body), new Date().toISOString()],
    );
  },

  async flush(): Promise<void> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<{
      id: number;
      method: string;
      path: string;
      body: string;
    }>("SELECT * FROM pending_writes ORDER BY created_at");

    for (const row of rows) {
      const response = await apiFetch(row.path, {
        method: row.method,
        body: row.body,
      });

      if (response.ok) {
        await database.runAsync("DELETE FROM pending_writes WHERE id = ?", [
          row.id,
        ]);
      }
    }
  },
};
```

Flushing in `created_at` order matters: if someone created a studio and then edited it while offline, replaying the edit first would fail against a studio that doesn't exist yet.

And this is where the genuinely hard problem appears. Two people edit the same studio offline. Both come back online. Whose version wins?

| Strategy         | How it resolves                        | Cost                                  |
| ---------------- | -------------------------------------- | ------------------------------------- |
| Last write wins  | Most recent timestamp overwrites       | Silently discards someone's work      |
| First write wins | Later conflicting writes are rejected  | The second user loses work, but knows |
| Merge            | Combine changes field by field         | Complex, and not always meaningful    |
| Ask the user     | Show both versions, let a human decide | Best outcome, most UI work            |

There is no correct answer, only a decision appropriate to your app. Last-write-wins is fine for a personal note nobody else touches. It's clearly wrong for a shared booking count.

For a Project of this size, an entirely reasonable decision is: queue offline writes for data owned by a single user, and require connectivity for anything shared. Scoping the problem deliberately is a better answer than a half-built conflict resolution system, and YAGNI from module 01 supports it. What matters is that you decided, and can say why.

| Key terms           |                                                                        |
| ------------------- | ---------------------------------------------------------------------- |
| Cache-then-network  | Render cached data immediately, then refresh from the server           |
| Cleanup function    | The function returned from `useEffect`, undoing what the effect set up |
| Write queue         | Locally stored write intentions, replayed when connectivity returns    |
| Conflict resolution | Deciding which version wins when the same record changed in two places |

### Task 3

Add the `useIsOnline` hook and use it to show a persistent banner when the device is offline. Confirm it appears and disappears by toggling airplane mode on a real device or simulator.

### Task 4

Implement the write queue for one create operation in your app. Test it end to end: go offline, create something, confirm it's queued, come back online, confirm it reaches your Django API and appears in the admin panel.

### Task 5

Your queued write currently doesn't appear in the UI until it syncs, which means the user taps "save" and watches nothing happen.

Nothing above showed you how to handle this. The usual approach is an **optimistic update**: write to the local repository immediately, show it in the UI right away, and mark it as pending until the server confirms. Work out how to implement that for your queued create, including what the user sees for a row that exists locally but hasn't synced, and what happens to that row if the server ultimately rejects it.

In your README, describe your design and answer one question honestly: what does your app currently do if a queued write fails permanently, for example because the server rejects it as invalid? If the answer is "it retries forever," say so, and say what you'd change.

### Task 6

Write tests for `studioRepository` using module 10's Jest setup.

This will immediately surface a problem: your tests would need a real SQLite database. Work out how to avoid that, using the fact that nothing outside `studioRepository.ts` knows SQLite is involved. In your README, explain how the Repository pattern made this testable, and name the SOLID principle from module 13 that your solution relies on.

---

## 7. How much data are you actually moving

Section 4 caches everything `getStudios()` returns. That works because `getStudios()` returns everything, and `ModelViewSet` from module 03 has been quietly handing over every row in the table on every request since then.

With twelve studios, nobody notices. With three thousand, every launch downloads three thousand records, parses them, writes three thousand rows to SQLite, and renders a `FlatList` from all of them. The app gets measurably slower every sprint, and the cause is invisible because nothing broke.

This is the performance non-functional requirement from module 09 arriving as a real constraint rather than a paragraph.

### 7.1 Pagination

**Pagination** returns a fixed-size page of results plus a pointer to the next one.

```python
REST_FRAMEWORK = {
    # ... the existing entries ...
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

The response shape changes, which will break your client immediately:

```json
{
  "count": 3241,
  "next": "http://127.0.0.1:8000/api/studios/?page=2",
  "previous": null,
  "results": [ ... 20 studios ... ]
}
```

That's the `Paginated<T>` generic from module 04's Task 5, showing up as a real API response rather than a typing exercise.

```tsx
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getStudios(page = 1): Promise<Paginated<Studio>> {
  const response = await apiFetch(`/studios/?page=${page}`);

  if (!response.ok) {
    throw new Error("Could not load studios");
  }

  return response.json();
}
```

`next` being `null` is how you know you've reached the end, which is more reliable than comparing counts yourself. `FlatList` has `onEndReached` for loading the following page as the user scrolls, giving you infinite scrolling without any of it being your own bookkeeping.

Be aware of how far this change reaches before you make it. `getStudios()` has returned a bare `Studio[]` since module 06, and three things now depend on that: the screen rendering it, `useStudios` in section 4, and the call to `studioRepository.saveAll(fresh)`, which will happily try to iterate an object that no longer is an array. TypeScript will catch all three the moment you change the return type, which is module 04's whole argument arriving as a practical benefit rather than a claim - in plain JavaScript, the first two would have failed silently at runtime and the third would have written nothing to the cache without complaining.

Pagination and offline caching interact in a way worth thinking about rather than discovering. If your app caches page 1 and the user has scrolled to page 5, what should be in the cache next launch? Caching every page they've ever seen means the local database grows without limit. Caching only page 1 means their scroll position is meaningless offline. Neither is wrong; the point is that offline-first forces you to decide how much history is worth keeping, and "all of it" is a decision too.

### 7.2 Filtering and ordering

Module 03's Task 4 had you override `get_queryset` to filter by city. That works, and it stops scaling the moment you want three filters and an ordering, at which point `get_queryset` becomes the long method from module 13.

```bash
pip install django-filter
```

```python
INSTALLED_APPS = [
    # ... the existing entries ...
    "django_filters",
]

REST_FRAMEWORK = {
    # ... the existing entries ...
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}
```

Note the underscore. The package installs as `django-filter` and imports as `django_filters`, singular versus plural, which is a small inconsistency that has cost many people twenty minutes.

```python
class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ["city", "suburb"]
    search_fields = ["name", "suburb"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]
```

That gives you `?city=Dunedin`, `?search=yoga`, and `?ordering=-created_at`, with no `get_queryset` override at all. It's the same DRY move as `ModelViewSet` and `DefaultRouter` in module 03: declare what's allowed, let the framework generate the rest.

The `ordering = ["name"]` default matters more than it looks. Without an explicit ordering, the database is free to return rows in whatever order it likes, and that order can differ between requests - so page 2 might repeat a row from page 1 or skip one entirely. Unordered pagination is a genuine bug that only appears with enough data, which is the worst kind.

Filtering server-side also does something caching can't: it moves the work to where the data already is. Fetching three thousand studios to display twenty in Dunedin wastes the user's bandwidth, battery, and time, and no amount of clever client code recovers that.

### 7.3 The query that quietly costs the most

Module 03's `StudioDetailSerializer` nests each studio's classes. On a paginated list, that means Django runs one query for the studios, then one more per studio to fetch its classes - 21 queries for a 20-item page. This is the **N+1 problem** module 08 introduced, and pagination is where it stops being theoretical: the cost is now paid on every page, by every user, on every launch.

```python
class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all().prefetch_related("classes")
```

`prefetch_related` fetches all the related classes in one additional query and matches them up in Python: two queries instead of 21. Use `select_related` instead for forward `ForeignKey` relationships, where a SQL join can do it in a single query.

The timing middleware you built in module 14 is what makes this visible. A list endpoint that takes 40ms with 12 studios and 900ms with 300 is telling you something specific, and it's usually this.

| Key terms          |                                                                      |
| ------------------ | -------------------------------------------------------------------- |
| Pagination         | Returning a fixed-size page of results plus a pointer to the next    |
| `PAGE_SIZE`        | How many records one page contains                                   |
| Filter backend     | A pluggable component turning query parameters into queryset filters |
| N+1 problem        | One query per row of a result set, instead of one for all of them    |
| `prefetch_related` | Fetches related objects in one extra query rather than one per row   |

### Task 7

Add pagination to your API, update your client's types and fetch functions to the paginated shape, and add `onEndReached` so scrolling loads the next page.

Then decide, and write down in your README, what your offline cache should hold once pages exist: only the first page, every page seen this session, or every page ever seen. Justify the choice against your own app, and say what the user loses under your decision.

### Task 8

Add filtering, search and ordering to one of your ViewSets using the declarative approach above, and confirm each works with `curl`.

Then measure the N+1 problem rather than taking my word for it. Nothing above showed you how. Install Django Debug Toolbar, or use `django.db.connection.queries` in the shell, and record the actual query count for your list endpoint before and after adding `prefetch_related`.

In your README, record both numbers, and answer this: at what point does this stop being worth optimising? Module 01's YAGNI applies to performance work as much as to features, and "I measured it and it was fine" is a better answer than either premature optimisation or ignoring it.
