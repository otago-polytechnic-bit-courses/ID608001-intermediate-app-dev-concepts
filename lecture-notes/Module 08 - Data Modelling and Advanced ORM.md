# Module 08: Data Modelling and Advanced ORM

## 1. One `ForeignKey` only gets you so far

Every model in this course so far has used exactly one relationship: a `StudioClass` belongs to a `Studio`, and a `Studio` belongs to a `User`. That's the "has a" relationship from module 02, and it covers a genuine share of real data modelling.

It stops covering it the moment you ask a question your current schema can't answer. Which classes has a member booked? A booking isn't owned by a member _or_ by a class; it connects them. There's no sensible place to put a `ForeignKey` because the relationship goes both ways.

The timing of this module is deliberate. You're about to define your own app's backlog in module 09 and design your own schema for the Project, and a schema is the single most expensive thing to get wrong. Code can be refactored in an afternoon. A data model that can't represent something your app needs means migrations, backfills, and rewriting every serializer and screen that touched it.

---

## 2. The three relationship types

| Type              | Reads as                           | Example                           |
| ----------------- | ---------------------------------- | --------------------------------- |
| `ForeignKey`      | Many _X_ belong to one _Y_         | Many classes belong to one studio |
| `OneToOneField`   | One _X_ belongs to exactly one _Y_ | One profile belongs to one user   |
| `ManyToManyField` | Many _X_ relate to many _Y_        | Many members book many classes    |

### 2.1 `OneToOneField`

Module 07 raised this while warning about custom user models: rather than replacing Django's `User`, attach extra fields alongside it.

```python
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    display_name = models.CharField(max_length=100)
    joined_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.display_name
```

A `OneToOneField` is a `ForeignKey` with a uniqueness constraint on it, which is exactly how Django implements it. The practical difference is on the reverse side: `user.profile` gives you the object directly, where a `ForeignKey`'s reverse accessor would give you a manager you'd have to call `.first()` on.

### 2.2 `ManyToManyField`

```python
class StudioClass(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name="classes")
    name = models.CharField(max_length=200)
    members = models.ManyToManyField(User, related_name="classes_booked", blank=True)
```

Django creates a hidden join table behind this, holding pairs of IDs. You never write it, and you query through the field as though the relationship were a list.

```python
studio_class.members.add(user)
studio_class.members.remove(user)
studio_class.members.all()

user.classes_booked.all()
```

Notice there's no `on_delete` on a `ManyToManyField`. There's nothing for it to describe: neither side owns the other, and removing one row from the join table doesn't imply deleting anything else.

`blank=True` matters here in a way it doesn't elsewhere. A many-to-many is never required at creation time, because the object has to exist before it can be related to anything - you can't add members to a class that hasn't been saved yet.

---

## 3. Through models

A plain `ManyToManyField` records only that two things are related. Very often the relationship itself carries information: _when_ the booking was made, whether it was cancelled, whether the member turned up.

There's nowhere to put that. It isn't a property of the user, and it isn't a property of the class. It's a property of the connection between them, and the shape that holds it is a **through model**.

```python
class Booking(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "confirmed", "Confirmed"
        WAITLISTED = "waitlisted", "Waitlisted"
        CANCELLED = "cancelled", "Cancelled"

    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    studio_class = models.ForeignKey(
        StudioClass, on_delete=models.CASCADE, related_name="bookings"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.CONFIRMED
    )
    booked_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.member.username} - {self.studio_class.name}"


class StudioClass(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name="classes")
    name = models.CharField(max_length=200)
    capacity = models.PositiveIntegerField()
    members = models.ManyToManyField(User, through=Booking, related_name="classes_booked")
```

A through model is just an ordinary model with two `ForeignKey`s, which is worth internalising: the many-to-many is two one-to-manys pointing at a table in the middle. Naming that table, and giving it fields, is what turns a bare association into something your app can reason about.

`TextChoices` is Django's enum, and it's a direct answer to the magic-strings smell: `Booking.Status.CONFIRMED` is checked by your editor, where `"confirmed"` typed in five places is one typo away from a silent bug. The admin renders it as a dropdown for free.

With a `through` model, you can no longer use `.add()`, because Django doesn't know what to put in `status` or `attended`. You create the through object directly instead.

```python
Booking.objects.create(member=user, studio_class=studio_class)
```

The decision rule is short. Does the relationship itself have attributes, now or plausibly soon? If yes, use a through model from the start. Retrofitting one onto an existing plain `ManyToManyField` means a migration that has to preserve every existing pair, which is far more work than choosing correctly up front.

| Key terms         |                                                                         |
| ----------------- | ----------------------------------------------------------------------- |
| `ManyToManyField` | A relationship where many rows on each side relate to many on the other |
| Join table        | The hidden table holding ID pairs behind a many-to-many                 |
| Through model     | An explicit join model carrying its own fields about the relationship   |
| `TextChoices`     | Django's enum for a fixed set of string values                          |

Before writing any of this, sketch the models as boxes with lines between them, and write the relationship on each line as a sentence in both directions - "a studio has many classes; a class belongs to one studio." If a sentence in one direction needs a "sometimes" or an "and also," the model is more complicated than one line, and that's usually a through model announcing itself.

### Task 1

Model one many-to-many relationship your own Project genuinely needs, using a through model with at least two fields of its own beyond the two foreign keys.

Write the two directional sentences for the relationship in a comment above the model first. Then run `makemigrations` and read the generated migration, noting how many tables Django created and which one holds the relationship.

---

## 4. Constraints at the database level

Module 02's Task 1 asked you to express a capacity rule in the field definition rather than checking it elsewhere. Field-level options like `PositiveIntegerField` handle simple cases. Rules involving more than one field, or uniqueness across a combination, need a **constraint**.

```python
class Booking(models.Model):
    # ... fields as above ...

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["member", "studio_class"],
                name="unique_booking_per_member_per_class",
            ),
            models.CheckConstraint(
                condition=models.Q(attended=False) | models.Q(status="confirmed"),
                name="only_confirmed_bookings_can_be_attended",
            ),
        ]
```

The `UniqueConstraint` stops the same member booking the same class twice. Without it, a double-tapped button creates two bookings, your capacity count is wrong, and nothing anywhere complains.

`CheckConstraint` expresses a rule about a row's own fields: here, a booking can't be marked attended unless it's confirmed. `Q` objects are how you build those conditions, combined with `|` for or and `&` for and.

It's worth being clear about why this belongs in the database rather than in a serializer, since you could enforce both in `validate()`. A serializer only protects the path through your API. The Django admin, a management command, a data migration, and the shell all bypass it entirely - and so does a race between two simultaneous requests, where both pass validation before either has saved. A database constraint is the only rule that holds regardless of what wrote the row.

Serializer validation is still worth having on top, because it produces a friendly field-level error message instead of an `IntegrityError`. The two aren't alternatives: validation is for the user, constraints are for the data.

Your app has a rule that a class can't be booked beyond its capacity. Can a `CheckConstraint` express that? _Answer: no. A check constraint sees only the row being written, and capacity depends on counting other rows in the bookings table. This needs either a transaction that locks and counts before inserting, or an application-level check that accepts a small race risk. Knowing which rules a constraint can and can't express is the useful part - assuming it covers everything is how you end up with over-booked classes._

---

## 5. Asking better questions of the ORM

Module 03 introduced `.all()`, `.filter()`, and `.get()`. Those cover retrieval. What they don't do is calculation, and doing calculation in Python instead of in the database is one of the most common performance mistakes in Django code.

```python
# Works, and gets slower with every studio in your database
studios = Studio.objects.all()
for studio in studios:
    print(studio.name, studio.classes.count())
```

That runs one query for the studios, then one more per studio. It's the N+1 shape, and it appears here because the counting happens in Python.

### 5.1 Annotation

**Annotation** attaches a computed value to each row, calculated by the database.

```python
from django.db.models import Count, Avg, Q

studios = Studio.objects.annotate(class_count=Count("classes"))

for studio in studios:
    print(studio.name, studio.class_count)
```

One query. `class_count` doesn't exist on the model; it's attached to each instance by the query that produced it, and you can filter and order by it exactly as though it were a real field.

```python
Studio.objects.annotate(class_count=Count("classes")).filter(class_count__gte=3)

StudioClass.objects.annotate(
    confirmed=Count("bookings", filter=Q(bookings__status="confirmed"))
).order_by("-confirmed")
```

That second one - a `Count` with a `filter` argument - is the tool for "how many of the related rows match a condition," which is otherwise the query people most often give up on and do in Python.

### 5.2 Aggregation

**Aggregation** collapses a whole queryset to a single summary value.

```python
from django.db.models import Avg, Max

StudioClass.objects.aggregate(
    average_capacity=Avg("capacity"),
    largest=Max("capacity"),
)
# {'average_capacity': 18.4, 'largest': 40}
```

The distinction is worth holding onto: `annotate` gives you one value **per row**, `aggregate` gives you one value **for the whole set**.

### 5.3 `F` expressions

An `F` object refers to a field's value inside the database, rather than pulling it into Python first.

```python
from django.db.models import F

StudioClass.objects.filter(id=class_id).update(booked_count=F("booked_count") + 1)
```

Compare with reading the value, adding one, and saving. Between the read and the write, another request can do the same thing, and one of the two increments vanishes. `F` sends the arithmetic to the database as a single atomic operation, so it can't interleave. Any counter incremented by concurrent requests should use `F`.

### 5.4 Following relationships efficiently

```python
StudioClass.objects.select_related("studio")
Studio.objects.prefetch_related("classes")
```

`select_related` follows a forward `ForeignKey` or `OneToOneField` using a SQL join, in one query. `prefetch_related` handles reverse relationships and many-to-manys with one additional query, matching the results up in Python.

The rule of thumb: forward and single, use `select_related`; backward or many, use `prefetch_related`. Module 15 comes back to this with the timing middleware to actually measure the difference.

| Key terms          |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| `annotate`         | Attaches a computed value to each row in a queryset                     |
| `aggregate`        | Collapses a queryset to a single summary value                          |
| `F` expression     | Refers to a field's value in the database, avoiding a read-modify-write |
| `Q` object         | A composable query condition, combinable with `&` and `\|`              |
| `select_related`   | Follows a forward relationship with a join, in one query                |
| `prefetch_related` | Fetches reverse or many-to-many relations in one additional query       |

### Task 2

Add at least one `UniqueConstraint` and one `CheckConstraint` to your models, expressing rules your Project genuinely needs. Prove each one works by trying to violate it from the Django shell and recording the exception you get.

Then add serializer validation for the same rules, and compare the two failures: the raw `IntegrityError` from the shell, and the response your API returns. Note in your README which one a user should ever see, and why you kept both.

### Task 3

Write three queries against your own models using annotation or aggregation, answering questions your app would actually ask - "which of my classes are nearly full", "how many bookings did each member make this month".

For one of them, write the naive Python-loop version too. Count the queries each version runs using `django.db.connection.queries` in the shell, and record both numbers.

---

## 6. Serializing relationships

A richer schema immediately raises a question module 03 could avoid with one flat model: when a client asks for a class, what should its bookings look like?

DRF gives you several answers, and choosing badly is the most common cause of an API that's either useless or unbearably slow.

```python
class BookingSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.username", read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "member", "member_name", "status", "booked_at", "attended"]
        read_only_fields = ["booked_at"]


class StudioClassSerializer(serializers.ModelSerializer):
    booking_count = serializers.IntegerField(read_only=True)
    spaces_left = serializers.SerializerMethodField()

    class Meta:
        model = StudioClass
        fields = ["id", "studio", "name", "capacity", "booking_count", "spaces_left"]

    def get_spaces_left(self, obj):
        return obj.capacity - getattr(obj, "booking_count", obj.bookings.count())
```

| Approach                   | Sends                          | Use when                                  |
| -------------------------- | ------------------------------ | ----------------------------------------- |
| `PrimaryKeyRelatedField`   | Just IDs                       | The client already has the related data   |
| Nested serializer          | The full related objects       | The client always needs them together     |
| `source="member.username"` | One field from a relation      | You need a label, not the whole object    |
| `SerializerMethodField`    | Anything you can compute       | The value isn't a field at all            |
| A separate endpoint        | Nothing; the client asks again | The related set is large or rarely needed |

Two things are worth flagging. `booking_count` is declared as a plain `IntegerField` because it's expected to arrive from the `annotate` in the ViewSet's queryset, not from the model - which is how you connect section 5 to your API without the serializer running its own query per row.

And `SerializerMethodField` is where N+1 problems hide most effectively. The `getattr` fallback above will silently run one query per class if the annotation isn't there. That's a deliberate illustration: it works, it's easy to write, and it's slow in exactly the way you can't see from reading the serializer.

Nesting is the other trap. A class serializer that nests every booking, requested as a list of fifty classes, sends every booking in the studio to a phone that wanted to display fifty names. Module 15's pagination helps; deciding what belongs in the response helps more.

### Task 4

Serialize your through model from Task 1, exposing at least one field via `source` from a related object and one computed value via `SerializerMethodField`.

Then annotate the ViewSet's queryset so the computed value doesn't need a per-row query, and confirm with `django.db.connection.queries` that your list endpoint's query count no longer grows with the number of rows returned.

---

## 7. Changing a schema that already has data

Module 02's migrations worked because your tables were empty or nearly so. Adding a non-nullable field to a table with three thousand rows is a different problem: Django has to put _something_ in that column for every existing row.

A **data migration** is a migration that moves or transforms data rather than changing structure.

```bash
python manage.py makemigrations --empty studios --name backfill_booking_status
```

```python
from django.db import migrations


def set_default_status(apps, schema_editor):
    Booking = apps.get_model("studios", "Booking")
    Booking.objects.filter(status="").update(status="confirmed")


def reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("studios", "0004_booking")]

    operations = [
        migrations.RunPython(set_default_status, reverse),
    ]
```

`apps.get_model` rather than importing `Booking` directly is not a stylistic choice. It gives you the model **as it existed at this point in the migration history**, so the migration keeps working when you add fields later. An imported model is the current one, and a migration written against it breaks the moment the model moves on - usually for whoever clones your repository next, not for you.

The safe sequence for a change like adding a required field to a populated table is three migrations: add it as nullable, backfill it with a data migration, then make it non-nullable. Doing it in one step forces you to invent a default for rows that had no meaningful value, and that invented default is now real data nobody will ever question.

| Key terms        |                                                                   |
| ---------------- | ----------------------------------------------------------------- |
| Data migration   | A migration that transforms existing rows rather than schema      |
| `RunPython`      | The migration operation that runs a Python function               |
| `apps.get_model` | Gets a model as it existed at that point in the migration history |

### Task 5

Add a new required field to a model that already has rows in it, using the three-step nullable-backfill-required sequence. Confirm your existing rows have sensible values afterwards.

### Task 6

Your schema is about to be designed properly in module 09, and this task is the rehearsal.

Draw the full data model for your own Project: every model, every field with its type, every relationship with its direction and its `related_name`. Include at least one relationship that isn't a plain `ForeignKey`.

Then do the part nothing above walked you through. Take three questions your app will need to answer - real ones, from your backlog - and for each, write the ORM query that answers it against your drawn schema. Not pseudocode: the actual queryset.

If a question can't be answered, or needs more than one query and a loop in Python to assemble, that's your schema telling you something before you've written a line of it. Record what you changed as a result, because a design you revised on paper is the cheapest revision you will make all semester.
