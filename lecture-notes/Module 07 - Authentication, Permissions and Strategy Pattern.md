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

### 4.1 A warning about the `User` model

Everything above uses Django's built-in `User`, which is the right choice for learning and perfectly adequate for many projects. There is one thing worth knowing before you go further, because it's much cheaper to act on now than later.

Django lets you substitute your own user model, via `AUTH_USER_MODEL` in `settings.py`, but only really expects you to do it **before your first migration**. Swapping it afterwards, once you have tables and foreign keys pointing at `auth_user`, is genuinely painful, and the usual advice is to delete your migrations and database and start again.

So decide now, not in sprint three. If your Project's concept needs anything on a user that Django's `User` doesn't have — a display name, a phone number, a role, a date of birth — you have two options:

| Option                                                  | When it fits                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| A separate `Profile` model with a `OneToOneField`       | Extra fields only; you're happy with username/email login                 |
| A custom user model, set up before your first migration | You want to change how login itself works, e.g. email instead of username |

The `Profile` approach is the lower-risk option, works fine alongside everything in this module, and is what module 12 builds on when it creates a profile automatically. Choose deliberately rather than by default.

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

`BASE_URL` is hardcoded to `127.0.0.1` here, which will work in a simulator on the same machine as your Django server and fail on a physical phone. Section 8 explains why and fixes it; leave it as it is for now.

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

---

## 7. Secrets and environment variables

Open `fittrack_backend/settings.py` and look at the top of the file.

```python
SECRET_KEY = "django-insecure-8f3k2j!x9v..."

DEBUG = True

ALLOWED_HOSTS = []
```

That `SECRET_KEY` is what signs the JWTs you just built. Anyone holding it can forge a valid token for any user in your system, which makes every permission class in section 5 decorative. It is currently sitting in a file you commit to GitHub.

The Project's code quality expectations require secrets stored in environment variables, and this is the reason. A **secret** is anything that would let someone impersonate your app or reach something on your behalf: signing keys, database passwords, API keys for third-party services, the broker URL module 12 will add.

The rule of thumb is simple. If a value differs between your machine and anyone else's, or between development and production, it's configuration and belongs in an environment variable. If it would be damaging in a stranger's hands, it's a secret and it _must_ be.

### 7.1 Moving them out

```bash
pip install django-environ
```

Create a `.env` file next to `manage.py`.

```
DJANGO_SECRET_KEY=replace-this-with-a-long-random-string
DJANGO_DEBUG=True
```

Read it in `settings.py`.

```python
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env("DJANGO_DEBUG")
```

`environ.Env(DEBUG=(bool, False))` sets both a type and a default. The type matters more than it looks: environment variables are always strings, and the string `"False"` is truthy in Python, so reading `DEBUG` without a type conversion gives you a production server running in debug mode. That's not a hypothetical; it's one of the most common Django deployment mistakes there is.

`SECRET_KEY` deliberately has no default. If the variable is missing, the app refuses to start with a clear error, which is far better than silently falling back to a placeholder that then signs real tokens.

Now the critical step. Add `.env` to `.gitignore`.

```
.env
*.sqlite3
__pycache__/
venv/
```

And commit a `.env.example` alongside it, with the keys but not the values.

```
DJANGO_SECRET_KEY=
DJANGO_DEBUG=True
```

That file is what tells the next person — a marker, a teammate, or you on a different machine — what they need to supply. An app that can't be run because nobody knows which variables it wants is a documentation failure, and the Project asks for environment variables to be listed in `api-documentation.md` for exactly this reason.

A secret that has been committed, even once, and even if you delete it in the next commit, is in your repository's history permanently. What does that mean you have to do if it happens? _Answer: rotate it. Generate a new `SECRET_KEY` and treat the old one as compromised. Removing it from the current files doesn't remove it from the history, and rewriting history on a repository you've already pushed is far more trouble than generating a new key._

### 7.2 The client side

Expo has its own convention. Variables prefixed with `EXPO_PUBLIC_` are readable in your app code via `process.env`.

Create `.env` in your Expo project.

```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

```tsx
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
```

The word `PUBLIC` is doing real work there, and it's worth being blunt about it. Those values are **compiled into your app bundle**. Anyone who downloads your app can extract them. They are for configuration that varies by environment, like the API URL, not for secrets.

This is a genuine difference between the two sides of your project, and it catches people out: a Django `SECRET_KEY` in an environment variable is safe because it never leaves your server, whereas an API key put into `EXPO_PUBLIC_` anything is simply published. If a third-party service needs a secret key, the request has to be made from your Django API, not from the phone.

| Key terms            |                                                                            |
| -------------------- | -------------------------------------------------------------------------- |
| Environment variable | A value supplied by the environment rather than written into source code   |
| `.env`               | A local file holding those values, never committed                         |
| `.env.example`       | A committed template listing the required keys, with no values             |
| `EXPO_PUBLIC_`       | Expo's prefix for variables bundled into the app, and therefore not secret |

### Task 7

Move `SECRET_KEY` and `DEBUG` out of `settings.py` and into a `.env` file, add `.env` to `.gitignore`, and commit a `.env.example`. Confirm the server still starts, then rename `.env` temporarily and confirm it fails with a useful error rather than starting with a broken configuration.

Then check your own history: run `git log -p -- fittrack_backend/settings.py` and see whether your original `SECRET_KEY` is in there. Record in your README what you found and what you did about it.

---

## 8. Talking to your API from a real device

Everything so far has used `http://127.0.0.1:8000`. That address means "this machine, talking to itself," and it works fine when your React Native app runs in a simulator on the same computer as your Django server.

Put the app on a physical phone and every request fails immediately. The phone resolves `127.0.0.1` to _itself_, looks for a Django server running on the phone, and finds nothing. The error message says the network request failed, which is technically true and completely unhelpful.

Two things need fixing: the address the app uses, and the fact that Django and the browser security model will both reject the request even once it arrives.

### 8.1 Use your machine's LAN address

Find your computer's address on the local network.

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I

# Windows
ipconfig
```

You'll get something like `192.168.1.42`. Update your Expo `.env`, which is exactly the kind of value that differs per machine and is therefore why section 7 existed:

```
EXPO_PUBLIC_API_URL=http://192.168.1.42:8000/api
```

Then run Django so it listens on every interface rather than only on loopback.

```bash
python manage.py runserver 0.0.0.0:8000
```

And tell Django that address is allowed, in `settings.py`.

```python
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])
```

```
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.42
```

Both devices have to be on the same wifi network. Institutional and guest networks frequently block devices from talking to each other, which is a real constraint worth discovering during a lab rather than during your final demonstration.

### 8.2 CORS

Even with the right address, requests from Expo's web target — and from some development builds — get rejected before your view ever runs, with an error mentioning `Access-Control-Allow-Origin`.

**CORS**, short for Cross-Origin Resource Sharing, is a browser security mechanism. By default a page loaded from one origin isn't allowed to make requests to a different one, so the browser sends a preflight `OPTIONS` request asking the server whether it consents. Django, having never been told about your app, doesn't answer, and the browser blocks the real request.

```bash
pip install django-cors-headers
```

In `settings.py`, add the app, and the middleware **near the top** of `MIDDLEWARE`.

```python
INSTALLED_APPS = [
    # ...
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ... the rest ...
]

CORS_ALLOWED_ORIGINS = env.list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    default=["http://localhost:8081"],
)
```

Position matters, and module 12 explains why in full: middleware is an ordered pipeline, and the CORS headers have to be attached before anything else has a chance to return a response.

You will find suggestions online to set `CORS_ALLOW_ALL_ORIGINS = True`. It makes the error disappear, which is why it's popular. It also tells every website on the internet that it may make authenticated requests to your API, which given the tokens you built in section 3 is a meaningful thing to switch off. List the origins you actually need.

CORS is enforced by the _browser_, not by the server. `curl` ignores it entirely, which is why your `curl` tests in section 3 worked perfectly while the app failed. What does that tell you about what CORS is actually protecting? _Answer: it protects a user's browser from a malicious page making requests on their behalf, using credentials the browser would attach automatically. It isn't protecting your server from attackers — anyone can send whatever request they like with `curl`. Authentication and permissions do that job; CORS does a different one._

| Key terms         |                                                                         |
| ----------------- | ----------------------------------------------------------------------- |
| `127.0.0.1`       | Loopback: the machine making the request, whichever machine that is     |
| LAN address       | Your machine's address on the local network, reachable by other devices |
| `ALLOWED_HOSTS`   | The hostnames Django will accept requests for                           |
| CORS              | A browser mechanism controlling which origins may call your API         |
| Preflight request | The `OPTIONS` request a browser sends before a cross-origin call        |

### Task 8

Get your app talking to your Django API from a device that isn't your development machine — a physical phone on the same wifi, or a simulator configured to use your LAN address. Confirm login and the studio list both work.

Move the API URL into `EXPO_PUBLIC_API_URL` so it isn't hardcoded, and add `django-cors-headers` with an explicit origin list.

Then document it, because this is the single most likely reason a marker cannot run your project. In `app-documentation.md`, write the setup steps someone on a different machine would need: how to find their own LAN address, what to set it to, and how to run the Django server so it's reachable. Test your instructions by following them exactly, as though you'd never seen the project before.
