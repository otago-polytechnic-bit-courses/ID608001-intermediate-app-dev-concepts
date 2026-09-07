# Module 14: Signals, Middleware and Background Jobs

**Note:** The following notes were co-written with AI help structure topics and explain complex terms clearly.

## 1. Three ways of doing work elsewhere

Module 13 left a problem unfinished. A view that saved a studio and then sent an email had three reasons to change, and two of them clearly didn't belong there. Validation moved to the serializer. The email had nowhere obvious to go.

This module is about that "nowhere obvious." Four mechanisms, each solving a different version of the same question: how do you run code that needs to happen, without wiring it into the request-handling code that shouldn't have to know about it?

| Mechanism         | Runs when                           | Answers                                  |
| ----------------- | ----------------------------------- | ---------------------------------------- |
| Signal            | A specific model event occurs       | "Whenever X happens, also do Y"          |
| Middleware        | On every request and response       | "Do this for everything passing through" |
| Background job    | Later, outside the request entirely | "Do this, but don't make the user wait"  |
| Exception handler | Whenever a request fails            | "Report every failure the same way"      |

---

## 2. Signals, and the Observer pattern

A **signal** lets one part of your app announce that something happened, and lets other parts react, without either side holding a reference to the other. Django sends signals for model events automatically.

This is the **Observer pattern**: a subject broadcasts an event, and any number of observers subscribe to it. The subject doesn't know who's listening, how many there are, or what they'll do. Adding a new observer requires no change to the subject at all, which is Open/Closed from module 13 achieved through a different shape than the Strategy pattern used for permissions.

Create `studios/signals.py`.

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Studio, StudioClass


@receiver(post_save, sender=Studio)
def create_default_class(sender, instance, created, **kwargs):
    if not created:
        return

    StudioClass.objects.create(
        studio=instance,
        name="Intro Session",
    )
```

`@receiver` is a decorator, one of the Python features offered in module 01's Task 2, and here it's registering this function as a listener for `post_save` on `Studio`.

The `created` flag matters. `post_save` fires on both creation and update, so without that guard every edit to a studio would add another "Intro Session," forever. This is the single most common signal bug.

Signals need connecting when the app loads. In `studios/apps.py`:

```python
from django.apps import AppConfig


class StudiosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "studios"

    def ready(self):
        from . import signals
```

The import sits inside `ready()` rather than at the top of the file on purpose: at import time Django's app registry isn't populated yet, and importing models too early raises an error.

Common built-in signals:

| Signal        | Fires                                    |
| ------------- | ---------------------------------------- |
| `pre_save`    | Before a model instance is saved         |
| `post_save`   | After a model instance is saved          |
| `pre_delete`  | Before a model instance is deleted       |
| `post_delete` | After a model instance is deleted        |
| `m2m_changed` | When a many-to-many relationship changes |

### 2.1 When not to use a signal

Signals have a genuine cost, and it's worth being honest about it, because they're easy to over-use once they click.

Signals hide control flow. Somebody reading `StudioViewSet` sees a studio being saved. Nothing in that file mentions that a `StudioClass` is also being created. They'd have to already know that `signals.py` exists and to go looking for it. Six months later, that somebody is you, wondering where these mystery classes are coming from.

A useful rule: use a signal when the reaction is genuinely a _side concern_ that the acting code shouldn't need to know about, especially across app boundaries. Don't use one when the reaction is part of the operation's core meaning.

By that rule, is `create_default_class` above a good use of a signal? _Answer: arguably not. Creating a studio's first class sounds like part of what "create a studio" means, so hiding it in a separate file makes the operation harder to understand, not easier. Doing it explicitly in `perform_create` would be more honest. It's used here because it's the clearest small demonstration of the mechanism, not because it's the best design._

A better fit is cross-app work: an `accounts` app creating a profile whenever a `User` is created, where the code creating users, including Django's own admin, shouldn't have to know that your profile model exists.

| Key terms        |                                                                      |
| ---------------- | -------------------------------------------------------------------- |
| Signal           | A broadcast that something happened, which any code may subscribe to |
| Observer pattern | A subject notifying subscribers without knowing who they are         |
| `@receiver`      | The decorator registering a function as a signal listener            |
| `post_save`      | Fires after a model instance is saved, for both creates and updates  |
| `ready()`        | The `AppConfig` hook where signal modules should be imported         |

### Task 1

Create an `accounts` signal that automatically creates a `Profile` model instance whenever a `User` is created. You'll need to design the `Profile` model yourself, with at least two fields that make sense for your app.

Then write a test, using module 10's `APITestCase`, that registers a user through your API and asserts a profile was created. Confirm the test fails if you comment out the `ready()` import, which will tell you whether your signal is genuinely connected or whether something else was creating the profile.

---

## 3. Middleware

**Middleware** is code that sits in the pipeline between a request arriving and a response leaving. Every request passes through every middleware on the way in; every response passes back through them on the way out.

You've been using middleware since module 02 without looking at it. Open `settings.py` and read the `MIDDLEWARE` list: session handling, authentication, and CSRF protection are all middleware, applied to every request without any view mentioning them.

```
Request  →  M1  →  M2  →  M3  →  View
Response ←  M1  ←  M2  ←  M3  ←
```

Order matters, because it's a nested pipeline rather than a flat list. Authentication middleware must run before anything that wants `request.user`, which is why moving entries around in that list can break things in ways that look unrelated.

This shape is the **Chain of Responsibility** pattern: each handler gets a chance to act, and to decide whether to pass the request along or stop it there.

Create `fittrack_backend/middleware.py`.

```python
import time
import logging

logger = logging.getLogger(__name__)


class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        started = time.monotonic()

        response = self.get_response(request)

        duration_ms = (time.monotonic() - started) * 1000
        logger.info(
            "%s %s -> %s in %.1fms",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )
        response["X-Response-Time-Ms"] = f"{duration_ms:.1f}"

        return response
```

Register it at the end of `MIDDLEWARE` in `settings.py`.

```python
MIDDLEWARE = [
    # ... the existing entries ...
    "fittrack_backend.middleware.RequestTimingMiddleware",
]
```

The structure is the whole lesson. `__init__` runs once, at startup. `__call__` runs per request. Everything before `self.get_response(request)` happens on the way in; everything after happens on the way out, with the response in hand. `self.get_response` is the rest of the chain, which is why calling it is what lets the request continue.

Not calling it stops the request dead, which is exactly how a middleware that blocks something works:

```python
class BlockUserAgentMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if "badbot" in request.headers.get("User-Agent", "").lower():
            return HttpResponse("Forbidden", status=403)

        return self.get_response(request)
```

Module 09 asked you to identify performance as a non-functional requirement, and timing middleware is one way to actually measure whether you're meeting it, rather than guessing.

Use middleware for genuinely cross-cutting concerns: logging, timing, security headers, request IDs. Don't use it for logic that only applies to some endpoints. That's what permissions and view logic are for, and burying an endpoint-specific rule in middleware makes it invisible from the endpoint it governs.

| Key terms               |                                                                    |
| ----------------------- | ------------------------------------------------------------------ |
| Middleware              | Code running on every request and response, in a defined order     |
| Chain of Responsibility | Handlers in sequence, each able to act or pass along               |
| `get_response`          | The rest of the chain; calling it lets the request continue        |
| Cross-cutting concern   | Something applying across the whole app rather than to one feature |

### Task 2

Build `RequestTimingMiddleware` as shown, and confirm the `X-Response-Time-Ms` header appears using `curl -i`.

Then write a second middleware of your own that does something your app genuinely benefits from. Options worth considering: attaching a unique request ID to every request and response so a log line can be traced back to one specific call; or rejecting requests with a body larger than some limit.

In your README, explain why your chosen concern belongs in middleware rather than in a view or permission class, using the "cross-cutting" test above.

---

## 4. Background jobs

Some work is too slow to do while a user waits. Sending an email, resizing an uploaded image, generating a report: each might take several seconds, and every one of those seconds is a user staring at a spinner.

A **background job** hands the work to a separate process and returns immediately.

The shape has three parts. A **broker** holds a queue of jobs; Redis is the usual choice. A **worker** is a separate process that pulls jobs off the queue and runs them. **Celery** is the library that connects your Django code to both.

```bash
pip install celery redis
```

You'll need Redis running locally. On macOS, `brew install redis` then `redis-server`. On Windows, running it through Docker or WSL is the least painful route.

Create `fittrack_backend/celery.py`.

```python
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fittrack_backend.settings")

app = Celery("fittrack_backend")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

Add to `fittrack_backend/__init__.py`.

```python
from .celery import app as celery_app

__all__ = ("celery_app",)
```

And to `settings.py`.

```python
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
```

Reading those from environment variables rather than hardcoding them is one of the Project's stated code quality expectations, and a broker URL will contain a password the moment it isn't running on your own machine.

Create `studios/tasks.py`.

```python
from celery import shared_task
from django.core.mail import send_mail


@shared_task
def notify_admin_of_new_studio(studio_id, studio_name, city):
    send_mail(
        "New studio registered",
        f"{studio_name} was added in {city}.",
        "noreply@fittrack.test",
        ["admin@fittrack.test"],
    )
```

Call it from the view that was overloaded back in module 13.

```python
def perform_create(self, serializer):
    studio = serializer.save(owner=self.request.user)
    notify_admin_of_new_studio.delay(studio.id, studio.name, studio.city)
```

Run a worker in a second terminal, with your virtual environment activated.

```bash
celery -A fittrack_backend worker --loglevel=info
```

`.delay()` is the whole difference. It doesn't run the function; it puts a message on the queue and returns immediately. The user gets their 201 response in milliseconds, and the email happens whenever a worker picks it up.

Notice what's passed to the task: an ID and two plain strings, not the `Studio` object itself. Arguments have to be serialised to travel through Redis, and a whole model instance is both awkward to serialise and potentially stale by the time the worker runs. Passing the ID and re-fetching inside the task if you need the full object is the standard approach.

Signals and background jobs combine well, and this is where module 13's email problem finally lands properly:

```python
@receiver(post_save, sender=Studio)
def announce_new_studio(sender, instance, created, **kwargs):
    if not created:
        return

    notify_admin_of_new_studio.delay(instance.id, instance.name, instance.city)
```

The view knows nothing about emails. The signal knows nothing about SMTP. The task knows nothing about HTTP requests. Three responsibilities, three places, which is section 2 of module 13 applied end to end.

The trade-off is real, though, and worth naming: you now have three processes to run instead of one, a broker to keep alive, and failures that happen somewhere your user will never see. A job that fails silently is worse than a slow response, so anything important needs its failures logged and, ideally, retried.

Your app needs to email a receipt after a booking. Should that be a background job? _Answer: almost certainly yes, because SMTP is slow and unreliable, and the booking succeeding shouldn't depend on the email succeeding. But the user does need to know the booking worked, so the response has to confirm the booking itself rather than the email, and the email failing later needs to be logged somewhere you'll actually look._

| Key terms      |                                                                          |
| -------------- | ------------------------------------------------------------------------ |
| Background job | Work handed to a separate process, so the request can return immediately |
| Broker         | The queue holding pending jobs, commonly Redis                           |
| Worker         | A separate process that pulls jobs off the queue and runs them           |
| `@shared_task` | Marks a function as runnable by a Celery worker                          |
| `.delay()`     | Queues a task rather than running it, returning immediately              |

### Task 3

Set up Celery and Redis, write the `notify_admin_of_new_studio` task, and trigger it by creating a studio through your API. Confirm in the worker's terminal output that the task ran, and confirm the API response came back before it did.

> **Hint:** setting `EMAIL_BACKEND` to `"django.core.mail.backends.console.EmailBackend"` in `settings.py` prints emails to the terminal instead of needing a real mail server.

### Task 4

Write a second task that does something genuinely slow and useful for your own app. Then handle its failure case, which nothing above covered.

Using Celery's documentation, work out how to make a task retry automatically when it fails, with a limit on the number of attempts. Test it by deliberately making the task raise an exception, and confirm from the worker output that it retried the number of times you configured and then gave up.

In your README, explain what should happen from the _user's_ point of view when a task exhausts its retries, and whether your current design achieves that. If it doesn't, say what you'd need to add.

---

## 5. Consistent error responses

Here's a fourth cross-cutting concern, and one the Project requires directly: consistent JSON error responses.

Try breaking your API in three different ways and reading what comes back.

```bash
# A validation failure
curl -X POST http://127.0.0.1:8000/api/studios/ -H "Content-Type: application/json" -d '{}'
{"name": ["This field is required."], "suburb": ["This field is required."]}

# A permission failure
{"detail": "You do not have permission to perform this action."}

# A missing resource
{"detail": "Not found."}
```

Three shapes. One is an object keyed by field name, holding arrays. Two are objects with a `detail` string. None of them says which kind of failure it was, other than through the status code.

That inconsistency lands on the client. Module 07's `apiFetch` throws a generic `Error` on any non-`ok` response precisely because there's nothing dependable to read, so a screen can't distinguish "your session expired, log in again" from "the suburb field is too long" without inspecting the status code and then guessing at the body's shape.

DRF lets you replace its error formatting in one place. Create `fittrack_backend/exceptions.py`.

```python
from rest_framework.views import exception_handler as drf_exception_handler


def api_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is None:
        return None

    detail = response.data
    field_errors = None

    if isinstance(detail, dict) and "detail" in detail:
        message = str(detail["detail"])
    elif isinstance(detail, dict):
        message = "Validation failed."
        field_errors = detail
    else:
        message = "Request failed."

    response.data = {
        "error": {
            "status": response.status_code,
            "message": message,
            "fields": field_errors,
        }
    }

    return response
```

Register it in `settings.py`.

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "EXCEPTION_HANDLER": "fittrack_backend.exceptions.api_exception_handler",
}
```

Now every error has one shape.

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed.",
    "fields": {
      "name": ["This field is required."]
    }
  }
}
```

Two details are deliberate. Delegating to `drf_exception_handler` first means DRF still decides the status code and still handles every exception type it knows about; this only reformats the result, rather than reimplementing it. And returning `None` when DRF does preserves the distinction between "an expected API error" and "an unhandled crash," which should surface as a 500 and be logged rather than quietly dressed up as a tidy JSON response.

The client can now be specific:

```tsx
interface ApiError {
  status: number;
  message: string;
  fields: Record<string, string[]> | null;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly fields: Record<string, string[]> | null;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiRequestError";
    this.status = error.status;
    this.fields = error.fields;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json();
  }

  const body: { error: ApiError } = await response.json();
  throw new ApiRequestError(body.error);
}
```

Subclassing `Error` rather than throwing a plain object matters: a `catch` block can now ask `if (error instanceof ApiRequestError)` and get the status and field errors with full type safety, while anything else - a genuine network failure, a bug in your own code - still arrives as an ordinary `Error` and isn't mistaken for an API response.

A form can now highlight the offending field, and a 401 can send the user to the login screen, because the response finally carries enough information to act on. Module 12's forms consume exactly this shape, and were written against DRF's raw field-keyed errors precisely because this envelope didn't exist yet - swapping them over to `ApiRequestError` is a small change now that it does. This is module 04's argument about typing the network boundary paying off: the shape is stable enough to be worth an interface.

Why is this a better place for the reformatting than a middleware, given it applies to every request? _Answer: middleware sits outside DRF and would receive an already-rendered response, so it would have to parse the JSON back out and guess at which shape it was looking at. The exception handler runs inside DRF, with the exception object itself, which is where the information actually is. Cross-cutting doesn't automatically mean middleware; it means one place, and the right one._

| Key terms           |                                                                  |
| ------------------- | ---------------------------------------------------------------- |
| Exception handler   | DRF's hook for turning a raised exception into a response        |
| `EXCEPTION_HANDLER` | The setting pointing DRF at a custom handler                     |
| Envelope            | A consistent wrapper shape around every response of a given kind |

### Task 5

Add a custom exception handler and confirm all three failure types from the top of this section now return the same shape. Then update module 10's tests to assert against it - including one asserting that a validation failure names the field that failed, which is the part your UI depends on.

### Task 6

Your handler doesn't cover unhandled exceptions, which still return either a Django HTML debug page or an empty 500 depending on `DEBUG`. Neither is JSON, and a client parsing your envelope will crash trying to read one.

Work out how to handle this, and be careful about what you expose: a 500's real message is a stack trace, and returning it to the client leaks your file paths and code structure. Implement something that returns a generic JSON error to the client while logging the real exception server-side.

In your README, explain where you did it - the exception handler, a middleware, or somewhere else - and why that was the right layer, using the reasoning from the question above.

---

## 6. Choosing between them

All four mechanisms in this module move work out of a view. Choosing badly makes code harder to follow, not easier, so it's worth a deliberate decision rather than reaching for whichever you used last.

| Ask                                                          | If yes, use                      |
| ------------------------------------------------------------ | -------------------------------- |
| Should this happen on every request, regardless of endpoint? | Middleware                       |
| Should this happen whenever a model changes, from anywhere?  | A signal                         |
| Is this slow, and can it happen after the response?          | A background job                 |
| Is this about how a failure is reported to the client?       | The exception handler            |
| Is this part of what the operation actually means?           | None of them; put it in the view |

That last row is the one most often skipped. Every mechanism in this module makes code less obvious in exchange for keeping it separate, and that trade is only worth making when the thing being separated genuinely is a separate concern. Module 13's Single Responsibility argument cuts both ways: splitting one responsibility across three files is just as much a design problem as combining three into one.

### Task 7

Look at your own Project's backlog from module 09 and identify one requirement suited to each of the four mechanisms, plus one that superficially looks like it needs one but is better done directly in a view.

For all five, write two or three sentences justifying the choice using the table above. This is the same reasoning your Project's design pattern reflection will ask for, so writing it now while the decisions are fresh is worth more than reconstructing it in November.
