# Module 07: Authentication, Permissions and Strategy Pattern

## 1. Authentication vs authorisation

Two words that get used interchangeably in conversation mean genuinely different things in code, and keeping them separate makes the rest of this module much easier to follow.

**Authentication** answers "who is making this request?" **Authorisation** answers "is that person allowed to do this?" A logged-in user is authenticated. Whether that authenticated user can delete a studio they don't own is a separate question entirely, answered by a separate part of your code.

Django and DRF keep these separate too, deliberately. Authentication classes work out who the requester is and attach them to `request.user`. Permission classes then look at `request.user` and decide whether to allow the action. Two different responsibilities, two different places in your code, which is the same separation-of-concerns thinking from module 02's MVT.

| Term           | Question it answers           | Where it lives in DRF    |
| -------------- | ----------------------------- | ------------------------ |
| Authentication | Who is making this request?   | `authentication_classes` |
| Authorisation  | Is this requester allowed to? | `permission_classes`     |

---

## 2. Sessions vs tokens

The API you've built so far is completely open. Anyone who can reach `http://127.0.0.1:8000/api/studios/` can create, edit, and delete whatever they like. That was fine while you were learning the shape of an API. It isn't fine for anything real.

Django's own admin panel, from module 02, uses **session authentication**: you log in, Django stores a session on the server, and hands your browser a cookie that identifies it. Every subsequent request sends that cookie back automatically.

That works well for a browser. It works badly for a mobile app. React Native has no cookie jar that behaves the way a browser's does, no shared origin, and no automatic cookie handling you'd want to rely on. What a mobile client wants instead is a **token**: a string the server hands out at login, which the client stores itself and attaches to every request by hand.

|                   | Session authentication              | Token authentication                     |
| ----------------- | ----------------------------------- | ---------------------------------------- |
| Server stores     | A session record per logged-in user | Nothing, for JWTs                        |
| Client stores     | A cookie, handled by the browser    | A token string, handled by your own code |
| Sent with request | Automatically, as a cookie          | Manually, in an `Authorization` header   |
| Suits             | Server-rendered web pages           | Mobile apps and separate frontends       |

This course uses **JWT**, short for JSON Web Token. A JWT is a string with three dot-separated parts: a header, a payload of claims such as the user's ID and an expiry time, and a signature. The signature is what matters. It's generated using a secret only your server knows, so the server can verify a token it receives is one it genuinely issued, without having stored anything about it.

A JWT's payload is encoded, not encrypted. Anyone holding the token can decode and read it. What does that tell you about what should never be put in a JWT payload? _Answer: anything secret. A password, an API key, or anything else you wouldn't want the token's holder to read. The signature stops a token being forged or altered; it does nothing at all to hide what's inside it._

---

## 3. Setting up JWT authentication

Install the standard JWT package for DRF, inside your activated virtual environment.

```bash
pip install djangorestframework-simplejwt
```

Add the following to `fittrack_backend/settings.py`.

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}
```

Then add the login and refresh endpoints to `fittrack_backend/urls.py`.

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("studios.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
```

Test it with the superuser account you created in module 02.

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_superuser", "password": "your_password"}'
```

You should get back two tokens.

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The **access token** is short-lived, five minutes by default, and is what you attach to every API request. The **refresh token** lives much longer, and its only job is exchanging itself for a fresh access token when the old one expires. This split exists so that a leaked access token stops being useful almost immediately, while the user still isn't forced to log in again every five minutes.

Use the access token by sending it in an `Authorization` header.

```bash
curl http://127.0.0.1:8000/api/studios/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

| Key terms                       |                                                                           |
| ------------------------------- | ------------------------------------------------------------------------- |
| JWT, short for JSON Web Token   | A signed, self-contained token carrying claims about who the requester is |
| Access token                    | Short-lived token attached to every API request                           |
| Refresh token                   | Long-lived token whose only job is obtaining a new access token           |
| `Authorization: Bearer <token>` | The header format used to send a token with a request                     |

### Task 1

Install and wire up SimpleJWT as shown, and obtain a token pair for your superuser with `curl`. Then paste your access token into [jwt.io](https://jwt.io) and read its decoded payload. Record in `API_TESTING.md` which claims it contains, what each one appears to mean, and what happens to the response when you deliberately change one character of the token before sending it.

---

## 4. An accounts app, and registration

Obtaining a token requires an account to already exist, which so far means an account you made by hand with `createsuperuser`. A real app needs users to be able to register themselves.

Module 02 made the case for separating apps by responsibility, so authentication gets its own.

```bash
python manage.py startapp accounts
```

Add `"accounts"` to `INSTALLED_APPS`, then create `accounts/serializers.py`.

```python
from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
```

Two details here are doing real work. `write_only=True` means the password can be sent _in_, but is never included in any JSON sent _out_, so a registration response can't accidentally echo it back. `create_user`, rather than `User.objects.create`, is what hashes the password before storing it. Using the wrong one of those two stores the password in plain text, which is exactly the kind of quiet, invisible mistake that never announces itself in testing.

Create `accounts/views.py`.

```python
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
```

Create `accounts/urls.py`.

```python
from django.urls import path
from .views import RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
]
```

And include it in `fittrack_backend/urls.py`, alongside the paths already there.

```python
path("api/auth/", include("accounts.urls")),
```

`AllowAny` on the registration view is deliberate and worth pausing on: it's the one endpoint that must work for someone who has no account yet, so requiring authentication on it would make registration impossible.

| Key terms       |                                                                   |
| --------------- | ----------------------------------------------------------------- |
| `write_only`    | A serializer field accepted as input but never included in output |
| `create_user`   | Django's user-creation method, which hashes the password          |
| `CreateAPIView` | A DRF generic view providing only a create endpoint               |

---

## 5. Permissions as a Strategy

Here's where a named pattern shows up, and it's one worth recognising because DRF's whole permission system is built on it.

The **Strategy pattern** is a family of interchangeable algorithms, each wrapped in its own object, all sharing an identical interface, so the calling code can swap one for another without changing anything about itself. DRF's permission classes are exactly this. Every permission class implements the same method, `has_permission`, returning `True` or `False`. The view doesn't know or care which one it's been handed. It just calls the method.

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Studio
from .serializers import StudioSerializer, StudioDetailSerializer


class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return StudioDetailSerializer
        return StudioSerializer
```

Swapping `IsAuthenticatedOrReadOnly` for `IsAuthenticated` changes the entire access policy of that endpoint, and not a single other line of the ViewSet needs to change. That interchangeability, achieved without touching the code that uses it, is the pattern's whole point.

| Built-in permission class   | What it allows                                      |
| --------------------------- | --------------------------------------------------- |
| `AllowAny`                  | Everyone, authenticated or not                      |
| `IsAuthenticated`           | Only requests carrying a valid token                |
| `IsAuthenticatedOrReadOnly` | Anyone may read; only authenticated users may write |
| `IsAdminUser`               | Only users with `is_staff` set                      |

### 5.1 Writing your own strategy

The built-in classes only know about the requester. They know nothing about the object being requested, which means none of them can express "only the person who created this studio may edit it." That needs a custom permission, using DRF's second hook, `has_object_permission`.

Create `studios/permissions.py`.

```python
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
```

`SAFE_METHODS` is DRF's name for `GET`, `HEAD`, and `OPTIONS`: the methods that only read and never change anything. So this reads as "reading is always fine; changing is only fine if you own it."

For this to work, a `Studio` needs to know who owns it. Add the field in `studios/models.py`.

```python
from django.contrib.auth.models import User
from django.db import models


class Studio(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="studios",
    )
    name = models.CharField(max_length=200)
    suburb = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

This is the same `ForeignKey` shape from module 02, just pointing at Django's `User` model instead of one of yours. Run `makemigrations` and `migrate` afterwards. Django will ask what to do about existing rows that have no owner, since the new field can't be null; the simplest answer while learning is to provide your superuser's ID as a one-off default.

Then apply the permission, and set the owner automatically on create.

```python
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly


class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

`perform_create` is DRF's hook for adding data the client didn't send. Setting the owner here, rather than trusting an `owner` field in the request body, is essential: if the client sent its own owner ID, anyone could create a studio owned by somebody else simply by editing the JSON.

Permission classes in a list are combined with AND, so every one of them must pass. Given that, what would `[IsAuthenticated, IsOwnerOrReadOnly]` do differently from the pair used above? _Answer: it would block anonymous users from reading at all, since `IsAuthenticated` fails before ownership is ever considered. `IsAuthenticatedOrReadOnly` deliberately lets anyone browse the studio list while still requiring a login to change anything._

| Key terms               |                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------- |
| Strategy pattern        | Interchangeable algorithms behind one shared interface, swappable without changes |
| `has_permission`        | Decides access to the endpoint as a whole                                         |
| `has_object_permission` | Decides access to one specific object                                             |
| `SAFE_METHODS`          | The HTTP methods that only read: `GET`, `HEAD`, `OPTIONS`                         |
| `perform_create`        | A ViewSet hook for setting fields the client shouldn't be trusted to send         |

Before writing a custom permission, write the rule out as one plain English sentence first, in the form "a _who_ may _do what_ to _which objects_." If that sentence needs an "and also" in the middle, you probably have two permissions rather than one, and splitting them keeps each one independently swappable, which is the whole reason for the pattern.

### Task 2

Add the `owner` field, the `IsOwnerOrReadOnly` permission, and `perform_create` as shown. Then prove it works, rather than assuming it does. Register a second user through your new registration endpoint, obtain a token for them, and use it to attempt to edit a studio owned by your first user. Record the request, the status code, and the response body in `API_TESTING.md`.

### Task 3

Write a second custom permission class of your own that isn't a variation on ownership, and apply it to `StudioClassViewSet`. It should express a rule your app genuinely needs, for example only allowing classes to be added to a studio that the requester owns, or blocking deletion of a class that already has bookings once you have them.

Use DRF's permissions documentation to find whichever hook fits your rule best, since your rule may need to inspect the request body rather than an existing object, which neither example above did. In your README, name the rule in one sentence, explain which hook you used and why the other one couldn't express it, and describe what you had to test to be confident it actually holds.

---

## 6. Using the token from React Native

The client side now needs three things: a way to log in, somewhere safe to keep the token, and a way to attach it to every request without repeating that code in every function.

### 6.1 Storing the token

Tokens are credentials, so they don't belong in ordinary storage. `expo-secure-store` writes to the iOS keychain and Android keystore instead.

```bash
npx expo install expo-secure-store
```

Create `auth.ts`.

```tsx
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "fittrack.access";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
}

export async function login(username: string, password: string): Promise<void> {
  const response = await fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data: { access: string; refresh: string } = await response.json();
  await saveToken(data.access);
}
```

Notice `login` checks `response.ok` before touching the body. `fetch` does not throw on a 401; it resolves normally with a failed status, and module 06's fetch code would have happily tried to read a studio list out of an error response. Checking the status explicitly is the network-boundary version of the same defensive habit from module 03.

### 6.2 Attaching the token to every request

The obvious approach is adding a header to each function in `studiosApi.ts` by hand. That's the exact repetition DRY warns against, and it's also fragile: the one function somebody forgets is the one that breaks in production.

Write a single wrapper instead, and route every request through it.

```tsx
import { getToken } from "./auth";

const BASE_URL = "http://127.0.0.1:8000/api";

async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${path}`, { ...options, headers });
}

export interface Studio {
  id: number;
  name: string;
  suburb: string;
  city: string;
}

export async function getStudios(): Promise<Studio[]> {
  const response = await apiFetch("/studios/");

  if (!response.ok) {
    throw new Error("Could not load studios");
  }

  return response.json();
}

export async function createStudio(
  studio: Omit<Studio, "id">,
): Promise<Studio> {
  const response = await apiFetch("/studios/", {
    method: "POST",
    body: JSON.stringify(studio),
  });

  if (!response.ok) {
    throw new Error("Could not create studio");
  }

  return response.json();
}
```

Every call now goes through one place that knows about tokens, base URLs, and JSON headers. `Omit<Studio, "id">` is a TypeScript utility type saying "a `Studio`, but without its `id`," which is exactly right for a create request, since the server assigns the ID.

This is the Adapter idea from module 03 again, thickened slightly. `studiosApi.ts` is still translating between the API's world and your app's world; it has just taken on the authentication detail as well, so no screen ever has to know a token exists.

| Key terms           |                                                                   |
| ------------------- | ----------------------------------------------------------------- |
| `expo-secure-store` | Stores small secrets in the device keychain or keystore           |
| `response.ok`       | `true` for a 2xx status; `fetch` does not throw on 4xx or 5xx     |
| `Omit<T, K>`        | A TypeScript utility type producing `T` with property `K` removed |

### Task 4

Build a login screen at `app/login.tsx` with two `TextInput` fields and a button, wired to the `login` function above. Handle all three states from module 06: waiting, success, and a wrong password. Confirm a failed login shows a message rather than silently doing nothing.

> **Hint:** `secureTextEntry` on a `TextInput` masks the password as it's typed.

### Task 5

Convert `studiosApi.ts` to route every request through `apiFetch`, and add `updateStudio` and `deleteStudio` functions using it. Confirm with your running Django server that an unauthenticated delete is rejected, and the same delete succeeds once you've logged in as that studio's owner.

### Task 6

Access tokens expire after five minutes, and nothing you've built so far notices. Once the token expires, every request starts failing with a 401 and your app has no idea why.

Nothing in this module showed you how to handle this. Using the SimpleJWT documentation and React Native's own docs, work out and implement a strategy for it. There is more than one defensible answer: you could store the refresh token too and exchange it inside `apiFetch` when a 401 comes back, retrying the original request; you could check the token's expiry before sending anything; or you could simply clear the token and send the user back to the login screen.

Implement one of them. Then, in your README, explain which you chose, what the user actually experiences when their token expires under your approach, and what the main drawback of your choice is compared with one of the alternatives you rejected. There's no single correct option here, but there is a difference between choosing one and defaulting into one.
