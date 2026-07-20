# Module 02 - Django and MVT Pattern

## 1. Why Django

Express gives you almost nothing by default. Every project decides its own folder structure, its own way of talking to a database, its own admin tooling, if it has any at all. That flexibility is genuinely useful once you know what you're doing, but it also means every Express project looks a little different, and a newcomer has to learn that project's particular choices before they can be productive. Django makes most of those choices for you, up front. An admin panel, a database layer, a way of defining URLs, a testing framework: all included, all built to work together. The trade-off is less flexibility. The payoff is that any Django project is recognisable to any other Django developer within minutes.

|                     | Express                         | Django                                       |
| ------------------- | ------------------------------- | -------------------------------------------- |
| Included by default | Almost nothing                  | Admin panel, ORM, auth, forms, testing tools |
| Database layer      | You choose and wire up your own | Built in, via the ORM                        |
| Project structure   | Up to you                       | Enforced by convention                       |
| Philosophy          | Minimal, flexible               | Batteries included, opinionated              |

---

## 2. Installing Django and starting a project

Inside your activated virtual environment from module 01, run the following.

```bash
pip install django
django-admin startproject fittrack_backend
cd fittrack_backend
python manage.py runserver
```

Visit `http://127.0.0.1:8000` and you should see Django's welcome page. `manage.py` is your command-line tool for this project from now on. Almost everything you do this module runs through it.

### 2.1 Project vs app

Django separates a **project**, the whole backend, configuration and all, from an **app**, one self-contained feature area inside it. A single project usually contains several apps. This course's project will eventually have a `studios` app, and later, an app for authentication.

```bash
python manage.py startapp studios
```

This creates a `studios/` folder with a predictable set of files already in it: `models.py`, `views.py`, `admin.py`, and a few others you'll fill in over the next few modules. Add the app to your project by opening `fittrack_backend/settings.py` and adding `"studios"` to the `INSTALLED_APPS` list.

If this course's backend eventually needs both a `studios` app and a separate `accounts` app for authentication, why not just put everything in one app? _Answer: separation of concerns. Each app should have one clear area of responsibility. A single giant app becomes exactly the kind of tangled, hard-to-navigate codebase this course is trying to teach you to avoid._

| Key terms        |                                                         |
| ---------------- | ------------------------------------------------------- |
| Project          | The whole Django backend, including configuration       |
| App              | A self-contained feature area inside a project          |
| `manage.py`      | The command-line tool for running project-wide commands |
| `INSTALLED_APPS` | The settings list of every app Django should load       |

---

## 3. MVT

Django organises every app around a pattern called **MVT**: Model, View, Template. If you've heard of MVC before, which stands for Model-View-Controller, MVT is Django's variation on the same idea, with the names shuffled slightly.

| MVC term   | Django's MVT term | Responsibility                                             |
| ---------- | ----------------- | ---------------------------------------------------------- |
| Model      | Model             | Defines the data and talks to the database                 |
| Controller | View              | Receives a request, decides what to do, returns a response |
| View       | Template          | Renders what the user actually sees                        |

This is genuinely confusing the first time you meet it, because Django's "View" does the job that MVC calls the "Controller," and what MVC calls the "View," meaning the presentation layer, is Django's "Template." Once you've said it out loud once, it tends to stick: **a Django View is a controller**. Since this course is building an API, not rendering HTML pages, you'll barely touch templates at all. What you'll spend most of your time on is models this module, and views in module 04, once you're returning JSON instead of HTML.

The specific names matter less than the underlying idea: keep "what the data looks like," "what happens when a request comes in," and "what gets shown" as three separate, clearly bordered responsibilities. That's the same Single Responsibility thinking from an earlier course's class design, just applied at the scale of a whole application instead of a single class.

---

## 4. Models

A Django **model** is a Python class that defines both the shape of your data and how it's stored, in one place. Django translates the class into database tables automatically.

Create the following in `studios/models.py`.

```python
from django.db import models


class Studio(models.Model):
    name = models.CharField(max_length=200)
    suburb = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

A few things worth noticing. Every model inherits from `models.Model`. Each field is declared with a type that maps directly onto a database column type: `CharField` for short text, which requires a `max_length`, `DateTimeField` for timestamps, and several others you'll meet as you need them. `__str__` is Python's equivalent of overriding `ToString()` from an earlier course: it controls how an instance of this model prints, and it's what you'll see representing each row in the Django admin.

### 4.1 Relationships

Add a `StudioClass` model that belongs to a `Studio`, using a `ForeignKey`, Django's way of expressing exactly the "has a" relationship you built with composition in an earlier course.

```python
class StudioClass(models.Model):
    studio = models.ForeignKey(
        Studio,
        on_delete=models.CASCADE,
        related_name="classes",
    )
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} ({self.studio.name})"
```

`on_delete=models.CASCADE` means: if a `Studio` is deleted, delete all of its `StudioClass` rows too, rather than leaving them pointing at nothing. `related_name="classes"` is what lets you write `some_studio.classes.all()` later, to get every class belonging to that studio.

Before writing a model, sketch it the same way you sketched a class in an earlier course: a box with the model's name, its fields underneath, and an arrow to any related model it belongs to or contains. Deciding the fields and relationships on paper is much cheaper than migrating your way out of a mistake later.

| Key terms                    |                                                                            |
| ---------------------------- | -------------------------------------------------------------------------- |
| Model                        | A Python class defining both a data shape and how it's stored              |
| `CharField`, `DateTimeField` | Field types mapping directly onto database column types                    |
| `ForeignKey`                 | Defines a "has a" relationship between two models                          |
| `on_delete`                  | Decides what happens to related rows when the referenced row is deleted    |
| `related_name`               | The name used to access related rows from the other side of a relationship |

### Task 1

Create the `Studio` and `StudioClass` models above in your `studios` app. Add a third field to `StudioClass` of your choosing, such as a duration field or a description field, whatever seems useful, and add a `__str__` method to both models.

---

## 5. Migrations

Defining a model doesn't touch the database on its own. **Migrations** are Django's way of turning a model definition into actual database changes, tracked over time, the same way Git tracks changes to your code.

```bash
python manage.py makemigrations
python manage.py migrate
```

`makemigrations` looks at your models and generates a migration file describing what changed. `migrate` applies that file to the actual database. Run both, in that order, every time you add or change a model.

Because migrations are files, they're committed to Git along with everything else. That means anyone who clones your repository, including you on a different machine, can run `python manage.py migrate` and end up with a database that matches your models exactly, without ever writing a line of SQL by hand. This is the same DRY thinking from module 01: the shape of your data is written down once, in your models, and every migration is just a recorded, reversible step toward that shape.

By default, Django uses **SQLite**, a single-file database needing no separate server, which is exactly why it's a sensible default for learning and for smaller projects. You'll swap this out for a production-grade database later in your studies. The model and migration code you write doesn't change either way.

| Key terms        |                                                                               |
| ---------------- | ----------------------------------------------------------------------------- |
| Migration        | A file describing a change to the database schema, generated from your models |
| `makemigrations` | Generates migration files from changes to your models                         |
| `migrate`        | Applies migration files to the actual database                                |

### Task 2

Run `makemigrations` and `migrate` for the models from Task 1. Open the generated migration file in `studios/migrations/` and read it. In a short comment at the top of that file, explain in your own words what it's actually doing.

---

## 6. Django admin

One of Django's most immediately useful included tools is a fully working admin panel, generated automatically from your models.

Add this to `studios/admin.py`.

```python
from django.contrib import admin
from .models import Studio, StudioClass

admin.site.register(Studio)
admin.site.register(StudioClass)
```

Create a superuser account to log in with.

```bash
python manage.py createsuperuser
```

Run the server and visit `http://127.0.0.1:8000/admin`. You now have a working interface to create, edit, and delete studios and classes, without writing a single line of view or template code.

This is DRY in its most visible form. You defined the shape of your data exactly once, in `models.py`, and Django derived an entire working admin interface from that single definition. Nothing about the fields, their types, or their relationships was repeated anywhere.

### Task 3

Register both models in the admin, create a superuser, and use the admin panel to add at least three studios and two classes per studio. Take a screenshot of the admin list view for both models and add it to your repository's README.

| Key terms    |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| Django admin | An automatically generated interface for managing your models' data |
| Superuser    | An admin account with full access to the Django admin               |

---

## 7. Customising the admin

The default admin registration works, but it's worth seeing where "batteries included" needs a small amount of your own configuration, because this is where a lot of real Django code lives.

Replace the simple registration in `studios/admin.py` with the following.

```python
from django.contrib import admin
from .models import Studio, StudioClass


class StudioClassInline(admin.TabularInline):
    model = StudioClass
    extra = 1


@admin.register(Studio)
class StudioAdmin(admin.ModelAdmin):
    list_display = ("name", "suburb", "city")
    search_fields = ("name", "suburb")
    inlines = [StudioClassInline]


@admin.register(StudioClass)
class StudioClassAdmin(admin.ModelAdmin):
    list_display = ("name", "studio")
    list_filter = ("studio",)
```

`StudioClassInline` lets you add classes directly from the Studio admin page, rather than switching between two separate screens. `list_display` controls which columns show in the list view. None of this required touching a template, a route, or a single line of HTML.

### Task 4

Apply the `ModelAdmin` customisations above to your own models. Add at least one additional field to `list_display` beyond what's shown here, and add `search_fields` to `StudioClass` as well.
