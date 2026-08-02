# Module 07: Backend: Authentication, Permissions and Strategy Pattern


## 1. Authentication as a Strategy

DRF doesn't force you to pick a single authentication method for your whole project. You can configure several at once, and DRF tries each one, in order, until one of them succeeds or all of them fail.

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
}
```

This is the **Strategy pattern**. `SessionAuthentication` and `TokenAuthentication` both implement the exact same interface, an `authenticate` method that either returns a user or doesn't, but they check credentials in completely different ways: one reads a cookie tied to a browser session, the other reads a token sent explicitly in a request header. DRF's view code never needs to know or care which specific strategy actually succeeded. This is a different pattern from the Adapter you met in module 03, but the same underlying habit: define one consistent interface, then let interchangeable implementations sit behind it.

Why would a mobile app, like the one you're building from module 04 onward, prefer token authentication over session authentication? _Answer: session authentication relies on a cookie that a browser stores and sends back automatically. A mobile app has no shared cookie jar with your Django server the way a browser does, so there's nothing for a session to attach itself to. A token, sent explicitly in an `Authorization` header on every request, doesn't depend on cookies at all, which is why it's the strategy you'll actually use from React Native in module 07._

| Key terms               |                                                               |
| ----------------------- | ------------------------------------------------------------- |
| Authentication          | Establishing who is making a request                          |
| Permission              | Deciding what an already-identified user is allowed to do     |
| `SessionAuthentication` | Authenticates using Django's cookie-based browser session     |
| `TokenAuthentication`   | Authenticates using a token sent in an `Authorization` header |

---

## 2. Setting up token authentication

Add `"rest_framework.authtoken"` to `INSTALLED_APPS` in `settings.py`, then run migrations, since tokens are stored in the database like anything else.

```bash
python manage.py migrate
```

Wire up an endpoint that exchanges a username and password for a token.

```python
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path

urlpatterns = [
    path("api/token/", obtain_auth_token),
]
```

A request to that endpoint with a valid username and password returns a token. Every subsequent request then includes that token in its headers.

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "alex", "password": "correct-horse-battery-staple"}'
```

```bash
curl http://127.0.0.1:8000/api/studios/ \
  -H "Authorization: Token the-token-you-got-back"
```

---

## 3. OAuth and social login: a third strategy

Sometimes you don't want FitTrack managing passwords at all. **OAuth** lets a user prove who they are through a trusted third party, such as Google, without ever handing FitTrack their password. For a mobile app specifically, the usual shape is: the React Native app itself handles the actual sign-in with Google, using a library such as `expo-auth-session`, and receives a short-lived ID token directly from Google. That ID token is then sent to your Django backend, which verifies it directly against Google's servers, confirms the user's identity, and issues its own token, the same kind you built in Section 2, for the user to attach to every subsequent request.

Notice this is still the Strategy pattern from Section 1. Google sign-in is simply a fourth interchangeable way of answering "who is this," it just delegates the actual credential-checking to Google instead of checking a password or a token against your own database.

Verifying the token Google issued looks like this, using the `google-auth` package.

```python
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


def verify_google_token(token):
    return id_token.verify_oauth2_token(token, google_requests.Request())
```

A view that takes that verified identity, finds or creates a matching Django user, and returns your own token looks like this.

```python
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view

User = get_user_model()


@api_view(["POST"])
def google_login(request):
    payload = verify_google_token(request.data["id_token"])
    user, _ = User.objects.get_or_create(
        username=payload["email"],
        defaults={"email": payload["email"]},
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})
```

Notice this view doesn't touch permissions at all. Whatever gets checked in Section 4 applies exactly the same, regardless of how a user proved their identity in the first place. A studio owned by someone who signed in with Google is protected by precisely the same ownership check as one owned by someone who logged in with a username and password. That's the actual value of keeping authentication and permissions as separate concerns: one answers who you are, the other only cares what you're allowed to do once that's settled, and it doesn't need to know which strategy answered the first question.

**Quick check.** Why does `google_login` above call `get_or_create` rather than assuming a matching user already exists? _Answer: the first time someone signs in with Google, Django has never seen them before, there's no existing row in the user table for them. Unlike token or session authentication, which both assume an account already exists before a request arrives, OAuth often needs to create that account on the fly, the moment a new identity shows up._

| Key terms       |                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------- |
| OAuth           | Authentication delegated to a trusted third-party identity provider                      |
| ID token        | A short-lived, signed token from a provider such as Google, confirming a user's identity |
| `get_or_create` | A Django ORM shortcut that finds a matching row, or creates one if none exists           |

---

## 4. Attribute-based permissions

DRF's built-in permission classes, such as `IsAuthenticated` and `IsAdminUser`, answer a coarse question: is this user logged in, or are they an admin. That's role-based thinking, and it isn't enough for FitTrack. A studio shouldn't be editable by just any logged-in user, only by the specific user who owns that specific studio. That isn't a role the user has in general, it's an attribute of one particular object, checked against one particular request. This is attribute-based access control, and DRF handles it through object-level permission checks rather than the simpler request-level ones.

First, `Studio` needs an owner. Add a field to the model you built in module 02.

```python
from django.conf import settings

class Studio(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="studios",
    )
```

Generate and run the migration for this change, the same as any other model update from module 02.

Then write a permission class that checks the object itself, not just whether the user is logged in.

```python
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
```

`has_object_permission` receives the actual `Studio` instance being acted on, which is exactly what a role-based check like `IsAuthenticated` can't see. `SAFE_METHODS` covers `GET`, `HEAD`, and `OPTIONS`, so anyone can still read a studio's data. Only the owner can change or delete it.

Apply it to the ViewSet from module 03.

```python
class StudioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Studio.objects.all()
```

Before writing a permission class, write down, in plain English, exactly who should be allowed to do what to which objects. "Anyone can view a studio; only its owner can edit or delete it" is a full permission policy in one sentence, and it should be possible to read your `has_object_permission` code back and recognise that same sentence in it. If you can't, the code is more complicated than the policy actually requires.

| Key terms               |                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------- |
| Role-based access       | Permission decisions based on who a user generally is, such as staff or not staff |
| Attribute-based access  | Permission decisions based on a specific attribute of the object being acted on   |
| `has_object_permission` | A permission check that receives the specific object instance being accessed      |
| `SAFE_METHODS`          | The read-only HTTP methods: `GET`, `HEAD`, and `OPTIONS`                          |

---

## Task 1

Set up token authentication as shown in Section 2. Create at least two users, obtain a token for each, and confirm with `curl` that a request without a token, and a request with an obviously invalid token, are both rejected, while a request with a valid token succeeds.

## Task 2

Add the `owner` field to `Studio`, migrate it, and assign an owner to each of your existing studios through the Django admin or the shell.

## Task 3

Write `IsOwnerOrReadOnly` and apply it to `StudioViewSet`. Using the two users and tokens from Task 1, confirm with `curl` that user A can edit a studio they own, user A cannot edit a studio owned by user B, and both users can still read any studio regardless of who owns it.

## Task 4

DRF also supports JSON Web Tokens, JWTs, as a third authentication strategy, usually added through the separate `djangorestframework-simplejwt` package rather than anything built into DRF itself. Without being walked through it, install that package, read enough of its own documentation to wire it up alongside, or instead of, `TokenAuthentication`, and get a working login that returns a JWT rather than a plain token.

Write a short comparison in your README of session authentication, plain token authentication, and JWT authentication. Cover at least one genuine trade-off between them, such as what it takes to revoke access early, and be specific rather than repeating whatever a tutorial told you: check the claim you're about to write down against what actually happened when you tested it.

## Task 5

FitTrack currently only supports signing in with a username and password. Without being walked through every step, add Google sign-in as an additional authentication option. On the frontend, use `expo-auth-session`, or another library of your choosing, to obtain a Google ID token from an actual Google account. On the backend, verify that token as shown in Section 3, and issue a token the app can use for every subsequent request, the same as Task 1. Test the complete flow end to end.

Write two or three sentences in your README about one thing that surprised you about wiring up a real OAuth flow, compared with how it's usually described secondhand in tutorials or blog posts. This is the same habit from module 03's task on secondhand claims, applied to a new piece of technology.
