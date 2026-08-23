# fittrack-app (Module 08)

Expo Router app extending the Module 07 frontend with Module 08's through
model: browsing a studio's classes, booking one (creating a `Booking`
directly, per section 3 - not `.add()`-ing to a many-to-many), and seeing
the `UniqueConstraint` from section 4 reject a duplicate booking with a
friendly message instead of a raw error.

Pinned to **Expo SDK 54** (`expo ~54.0.37`) to match the current Expo Go
app - see the Module 07 app's README for why, and for the recovery steps
if you regenerate this from scratch and land on a newer SDK by default.
Same reason `expo-status-bar` isn't in `app.json`'s `plugins` list here
either.

## Running it

```bash
cd "../backend"
python3 -m venv venv && source venv/bin/activate   # first time only
pip install -r requirements.txt                     # first time only
python manage.py migrate                            # first time only
python manage.py createsuperuser                    # first time only
python manage.py runserver 8001

cd ../fittrack-app
npm install
npx expo start
```

Run this backend on a different port from the Module 07 one (`8001` here)
if you want both projects' servers up at the same time - they otherwise
both default to `8000`. `.env` already points this app at
`http://127.0.0.1:8001/api` to match.

## What's here

Same base as the Module 07 app (`app/login.tsx`, protected `app/index.tsx`
studios list, `lib/auth.ts`, `lib/config.ts`), extended with:

- `app/studios/[id].tsx` - each class shows `spaces_left` / `capacity`, and
  a "Book" button that calls `createBooking`. A full class disables the
  button. Booking a class you're already booked into surfaces the API's
  own `non_field_errors` message from the `UniqueConstraint`, rather than
  a generic failure.
- `app/bookings.tsx` - "My bookings", listing everything the through model
  (`Booking`) has recorded for the logged-in user.
- `lib/api.ts` - `getStudio`, `createBooking`, `getBookings`, typed against
  the actual `BookingSerializer` / `StudioClassSerializer` shapes.

## A backend gap this surfaced

`StudioClassViewSet`'s queryset wasn't annotated with `booking_count`
(section 5/Task 4's own exercise) - fixed in `../backend/studios/views.py`
so `/api/classes/` actually returns it. But the nested `classes` array
returned by `/api/studios/:id/` goes through `StudioDetailSerializer`,
which serializes off `studio.classes.all()` directly rather than the
annotated ViewSet queryset, so `booking_count` is silently absent there
too (DRF drops a read-only field it can't find a value for, rather than
erroring). Since that's the endpoint this app's detail screen actually
uses, `StudioClass.booking_count` is typed as optional in `lib/api.ts`,
and the UI shows `capacity - spaces_left` instead, since `spaces_left`
comes from a `SerializerMethodField` with a fallback query and is present
either way.

## What was actually verified

No iOS/Android simulator was available in the environment this was built
in, so verification was:

1. `npx tsc --noEmit` - clean.
2. `npx expo export --platform ios` - bundles cleanly.
3. The full request sequence each screen makes - login, `GET /studios/`,
   `GET /studios/:id/`, `POST /bookings/` (twice, to see the duplicate get
   rejected), `GET /bookings/` - was replayed with plain `fetch` against
   the real running Django server, and every response was checked against
   the TypeScript interfaces in `lib/api.ts` field-for-field, including
   confirming `spaces_left` actually decrements after a booking.

What that doesn't cover: rendering on a real device or simulator. Before
treating this as done, run it in Expo Go or a simulator and confirm the
booking flow, the disabled "Full" state, and the duplicate-booking message
all behave as expected on screen.
