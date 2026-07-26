# Module 03: Django REST Framework, Serializers and Adapter Pattern

## 1. Why an API layer

**Why this matters.** The Django admin is genuinely useful, but it's a tool for people, rendered as HTML, requiring a login, a browser, and a human clicking around. The mobile app you'll build next module is none of those things. It will need data as plain JSON, delivered over HTTP, so it can decide for itself how to display it. **Django REST Framework**, usually shortened to DRF, is the standard, official-adjacent way to add that JSON layer on top of the models you already built.

```bash
pip install djangorestframework
```

Add `"rest_framework"` and `"studios"` to the `INSTALLED_APPS` list in `settings.py`, alongside the apps already listed there from module 02.

---

## 2. Serializers as Adapters

A model instance is a Python object, living in memory, full of Python-specific behaviour. JSON is plain text, made of only strings, numbers, booleans, arrays, and nested objects. Something has to translate between the two, in both directions: turning a Python object into JSON to send out, and turning incoming JSON back into something you can validate and save. That translator is a **serializer**.

Create the following in `studios/serializers.py`.

```python
from rest_framework import serializers
from .models import Studio, StudioClass


class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at"]


class StudioClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioClass
        fields = ["id", "studio", "name"]
```

This is the **Adapter pattern**, and it's worth recognising it by name, because you'll meet it again from the other direction in module 07, when React Native's API client adapts incoming JSON back into the shapes your components expect. An Adapter's whole job is translating one interface into another without either side needing to know the translation is happening. `StudioSerializer` doesn't change what a `Studio` model is; it just knows how to present one as JSON, and how to turn JSON back into one.

You'll also sometimes hear a serializer described as a **DTO**, a Data Transfer Object: a shape whose only job is carrying data between two layers, with no behaviour of its own. `ModelSerializer` in particular is Django's DRY move here too: rather than writing out every field's JSON representation by hand, it reads your model's fields and infers a sensible default, the same way the admin panel did in module 02.

### 2.1 Nested serializers

Since a `StudioClass` belongs to a `Studio`, it's often useful to include a studio's classes directly in its own JSON, rather than making the client fetch them separately.

```python
class StudioDetailSerializer(serializers.ModelSerializer):
    classes = StudioClassSerializer(many=True, read_only=True)

    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at", "classes"]
```

This works because of the `related_name="classes"` you set on the `ForeignKey` back in module 02. Django uses that name to find every `StudioClass` pointing at this `Studio`, and the nested serializer turns each one into JSON in turn.

If you removed `related_name="classes"` from the `StudioClass` model back in module 02, what would you need to change here for this to keep working? _Answer: the `classes` field name above would need to change to match whatever Django's default reverse-relation name became instead, usually `studioclass_set`. This is exactly why choosing a clear `related_name` up front, back when you designed the model, saves you from a confusing rename later._

| Key terms                           |                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Serializer                          | Translates between a model instance and its JSON representation           |
| `ModelSerializer`                   | A serializer that infers its fields from a model automatically            |
| DTO, short for Data Transfer Object | A shape whose only job is carrying data between layers                    |
| Nested serializer                   | Includes a related model's data inline, rather than as a separate request |

Before writing a serializer, sketch the JSON shape you actually want a client to receive, as a small example object, the same way you'd sketch a class diagram before writing a class. Deciding what belongs in the response, and what a client would have to fetch separately, is a design decision, not a detail to figure out as you type.

### Task 1

Create `StudioSerializer`, `StudioClassSerializer`, and a `StudioDetailSerializer` with nested classes, as shown above. Confirm in the Django shell that `StudioDetailSerializer(some_studio).data` produces the nested JSON shape you expect. Run `python manage.py shell` to open it.

---

## 3. Views and DRY

A DRF **view** is Django's MVT "controller," from module 02, now returning JSON instead of a template. DRF offers several levels of how much it does for you, and the pattern worth noticing is how much repetition disappears as you move up each level.

### 3.1 The explicit version

Create the following in `studios/views.py`.

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Studio
from .serializers import StudioSerializer


@api_view(["GET"])
def studio_list(request):
    studios = Studio.objects.all()
    serializer = StudioSerializer(studios, many=True)
    return Response(serializer.data)
```

This works, but every model you add would need its own hand-written list view, detail view, create view, update view, and delete view, almost all of them shaped identically. That's exactly the kind of repetition DRY warns against.

### 3.2 ViewSets: the DRY version

Replace the contents of `studios/views.py` with the following.

```python
from rest_framework import viewsets
from .models import Studio, StudioClass
from .serializers import StudioSerializer, StudioDetailSerializer, StudioClassSerializer


class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return StudioDetailSerializer
        return StudioSerializer


class StudioClassViewSet(viewsets.ModelViewSet):
    queryset = StudioClass.objects.all()
    serializer_class = StudioClassSerializer
```

A single `ModelViewSet` gives you list, retrieve, create, update, and delete, all from about five lines of code. `get_serializer_class` is a small customisation: use the fuller `StudioDetailSerializer`, which nests each studio's classes, when a client asks for one specific studio, but the lighter `StudioSerializer` for a list of many, since nesting every studio's full class list into a list response would be wasteful.

| Key terms              |                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| View                   | Receives a request and returns a response; Django's MVT "controller"                          |
| `ModelViewSet`         | Generates list, retrieve, create, update, and delete endpoints from a queryset and serializer |
| `get_serializer_class` | Lets a ViewSet choose a different serializer depending on the action                          |

---

## 4. URLs and routers

A **router** wires a ViewSet up to a set of URLs automatically, the same DRY move applied one layer further out.

Create the following in `studios/urls.py`.

```python
from rest_framework.routers import DefaultRouter
from .views import StudioViewSet, StudioClassViewSet

router = DefaultRouter()
router.register("studios", StudioViewSet)
router.register("classes", StudioClassViewSet)

urlpatterns = router.urls
```

Add the following in `fittrack_backend/urls.py`.

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("studios.urls")),
]
```

This single router registration generates `GET /api/studios/`, `GET /api/studios/1/`, `POST /api/studios/`, `PUT /api/studios/1/`, and `DELETE /api/studios/1/`, all pointed at the correct `ModelViewSet` methods, without you writing a single URL pattern by hand.

| Key terms       |                                                       |
| --------------- | ----------------------------------------------------- |
| Router          | Generates a full set of URL patterns from a ViewSet   |
| `DefaultRouter` | A router that also provides a browsable API root view |

### Task 2

Create `StudioViewSet` and `StudioClassViewSet` as shown, and wire them up with a router. Run the server and visit `http://127.0.0.1:8000/api/` in a browser. DRF's browsable API should show you a working, clickable interface to your new endpoints, no separate tool required.

---

## 5. Testing the API

Beyond the browsable API, `curl` is a quick way to confirm your endpoints from the command line, and it's the same shape of request the mobile app you build next module will eventually make.

```bash
curl http://127.0.0.1:8000/api/studios/

curl -X POST http://127.0.0.1:8000/api/studios/ \
  -H "Content-Type: application/json" \
  -d '{"name": "CityFit", "suburb": "Dunedin Central", "city": "Dunedin"}'
```

Before the next task, write down, for each endpoint, what a successful request looks like and what a failing one looks like, such as a missing required field or a nonexistent ID. Deciding what "wrong" should look like, before you test it, is the same defensive habit from earlier courses, just aimed at an API instead of a desktop app.

### Task 3

Using either `curl` or DRF's browsable API, test list, retrieve, create, update, and delete for both `Studio` and `StudioClass`. Also test a request that should fail, like creating a studio with a missing `name`. Record each request and its response in a short `API_TESTING.md` file in your repository.

---

## 6. ORM as a Repository

You've been calling `Studio.objects.all()` and similar throughout this module without necessarily naming what it is. Django's **ORM**, short for Object-Relational Mapper, is what turns those calls into actual SQL behind the scenes, and the specific shape it gives you, a single, consistent object you ask for data through, rather than writing SQL queries scattered across your codebase, is a well-known pattern in its own right: the **Repository pattern**.

All of the following hide their SQL behind a consistent, queryable interface.

```python
Studio.objects.all()
Studio.objects.filter(city="Dunedin")
Studio.objects.get(id=1)
Studio.objects.filter(suburb="Dunedin Central").order_by("name")
```

A Repository's job is to sit between your application code and however the data is actually stored, so the rest of your code never needs to know or care whether it's talking to SQLite, PostgreSQL, or something else entirely. You'll meet this exact pattern again in module 09, on the React Native side, when a hand-written `studioRepository` object does precisely the same job for a local SQLite cache on the phone. Different language, different database, identical idea: hide the storage details behind one consistent interface.

| Key terms                               |                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| ORM, short for Object-Relational Mapper | Translates Python method calls into SQL, and rows back into Python objects                |
| Repository pattern                      | A consistent interface for reading and writing data, hiding the storage details behind it |
| `QuerySet`                              | The lazily-evaluated result of an ORM query, like `Studio.objects.filter(...)`            |

### Task 4

Add a custom method to your `StudioViewSet` that returns only studios in a given city, via a query parameter like `/api/studios/?city=Dunedin`. You can do this either with an `@action`-decorated method, or with a filtered `get_queryset` override. Test it with `curl` and record the result in `API_TESTING.md`.

> **Hint:** overriding `get_queryset(self)` and checking `self.request.query_params.get("city")` is the more idiomatic approach here than a separate `@action`.
