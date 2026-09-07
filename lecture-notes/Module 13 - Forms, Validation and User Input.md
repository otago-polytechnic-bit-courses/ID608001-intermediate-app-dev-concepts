# Module 13: Forms, Validation and User Input

**Note:** The following notes were co-written with AI help structure topics and explain complex terms clearly.

## 1. Why forms deserve a module

Count the screens in your Project's backlog. A large share of them are forms: creating something, editing something, filtering something, logging in. Forms are where users spend most of their attention and where almost all of their frustration comes from.

They also involve more moving parts than any other kind of screen. A form has to hold the current value of every field, decide when each one is invalid and say so usefully, disable itself while submitting, display errors the server sent back rather than ones it worked out itself, and survive a keyboard covering half the screen.

Module 05's `TextInput` and module 07's login screen each handled a slice of that. This module handles the whole thing.

---

## 2. Holding the values

Module 05 introduced the controlled input: `value` comes from state, `onChangeText` writes back to it. That scales badly past two fields.

```tsx
const [name, setName] = useState("");
const [suburb, setSuburb] = useState("");
const [city, setCity] = useState("");
const [capacity, setCapacity] = useState("");
```

Four fields, four pieces of state, and every operation on the form as a whole - resetting it, checking whether anything changed, submitting it - has to name all four. Add a fifth field and you edit five places.

One object is usually better:

```tsx
interface StudioFormValues {
  name: string;
  suburb: string;
  city: string;
  capacity: string;
}

const EMPTY_FORM: StudioFormValues = {
  name: "",
  suburb: "",
  city: "",
  capacity: "",
};

export default function StudioForm() {
  const [values, setValues] = useState<StudioFormValues>(EMPTY_FORM);

  function updateField<K extends keyof StudioFormValues>(
    field: K,
    value: StudioFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <View>
      <TextInput
        value={values.name}
        onChangeText={(text) => updateField("name", text)}
        placeholder="Studio name"
      />
      <TextInput
        value={values.suburb}
        onChangeText={(text) => updateField("suburb", text)}
        placeholder="Suburb"
      />
    </View>
  );
}
```

`updateField` is generic over `keyof StudioFormValues`, which means `updateField("subrub", text)` is a compile error rather than a field that silently never updates. That's module 04's typing argument applied to the most typo-prone code in any app.

Note `capacity` is typed as `string`, not `number`, even though the API wants a number. A `TextInput` deals in text, and a half-typed `"1"` on the way to `"15"` is a valid intermediate state that a `number` can't hold - as is `""`, which `Number("")` turns into `0` rather than nothing. Keep form state as strings and convert once, at submission.

Why does `setValues` take a function here rather than `setValues({ ...values, [field]: value })`? _Answer: because `values` inside the callback might be stale. React batches updates, so two fields updated in quick succession can both read the same old object and the second overwrite the first. The function form receives whatever the current state actually is at the moment React applies it. For forms this is rarely visible; for anything updating faster than typing, it's a real bug._

---

## 3. Validation, and when to run it

Two rules, both about not being annoying.

**Don't show an error for a field the user hasn't finished with.** Validating as they type means "Enter a valid email" appears the instant they type the first letter, and stays there while they're still typing it. Validate a field when they leave it, and validate everything on submit.

**Never let a submission through unvalidated because you validated on blur.** A user can type into the last field and hit submit without ever blurring it.

That means tracking which fields have been touched:

```tsx
type FormErrors = Partial<Record<keyof StudioFormValues, string>>;

function validate(values: StudioFormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (values.suburb.trim() === "") {
    errors.suburb = "Suburb is required.";
  }

  const capacity = Number(values.capacity);

  if (!Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = "Capacity must be a whole number of at least 1.";
  }

  return errors;
}
```

```tsx
const [touched, setTouched] = useState<Set<keyof StudioFormValues>>(new Set());
const [submitted, setSubmitted] = useState(false);

const errors = validate(values);

function shouldShow(field: keyof StudioFormValues): boolean {
  return (submitted || touched.has(field)) && Boolean(errors[field]);
}
```

Validation runs on every render, which sounds wasteful and isn't - it's a handful of string checks, and deriving errors from values rather than storing them in their own state removes an entire category of bug where the two disagree.

`Partial<Record<K, string>>` is a precise type for this: a partial map from field names to messages, so `errors.subrub` won't compile and a missing key is meaningfully different from an empty message.

Keep the messages specific. "Invalid input" tells the user nothing; "Capacity must be a whole number of at least 1" tells them exactly what to change. This is the same standard module 09 set for acceptance criteria, applied to what the user reads.

---

## 4. Submitting

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
const [formError, setFormError] = useState<string | null>(null);

async function handleSubmit() {
  setSubmitted(true);

  if (Object.keys(errors).length > 0) {
    return;
  }

  setIsSubmitting(true);
  setFormError(null);
  setFieldErrors({});

  try {
    await createStudio({
      name: values.name.trim(),
      suburb: values.suburb.trim(),
      city: values.city.trim(),
      capacity: Number(values.capacity),
    });

    setValues(EMPTY_FORM);
    setTouched(new Set());
    setSubmitted(false);
    router.back();
  } catch (error) {
    setFormError("Could not save. Check your connection and try again.");
  } finally {
    setIsSubmitting(false);
  }
}
```

```tsx
<Pressable
  onPress={handleSubmit}
  disabled={isSubmitting}
  className={
    isSubmitting ? "bg-gray-300 p-4 rounded-lg" : "bg-blue-600 p-4 rounded-lg"
  }
>
  <Text className="text-center text-white font-semibold">
    {isSubmitting ? "Saving…" : "Save studio"}
  </Text>
</Pressable>
```

The `disabled={isSubmitting}` is not cosmetic. Without it, an impatient user on a slow connection taps twice and creates two studios - which is precisely the duplicate that module 08's `UniqueConstraint` exists to catch, and it's much better to prevent it here than to explain a database error there.

`finally` guarantees the button re-enables. Putting `setIsSubmitting(false)` only in the `try` leaves the form permanently frozen after any failure, which is a bug that only appears when something else has already gone wrong.

Note that the form resets **after** the request succeeds, not before. Clearing the fields optimistically means a failed request has thrown away everything the user typed.

---

## 5. Errors the server sent

Client validation catches what the client can know. Some rules only the server can check: whether a name is already taken, whether the user still has permission, whether the class filled up between loading the screen and submitting.

Module 03's DRF returns validation failures keyed by field name:

```json
{ "name": ["Studio with this name already exists."] }
```

Which maps directly onto the `FormErrors` shape you already have:

```tsx
catch (error) {
  if (error instanceof ApiRequestError && error.fields) {
    const serverErrors: FormErrors = {};

    for (const [field, messages] of Object.entries(error.fields)) {
      if (field in values) {
        serverErrors[field as keyof StudioFormValues] = messages[0];
      }
    }

    setFieldErrors(serverErrors);

    if (Object.keys(serverErrors).length === 0) {
      setFormError(error.message);
    }

    return;
  }

  setFormError("Could not save. Check your connection and try again.");
}
```

`ApiRequestError` is the class module 14 builds alongside its consistent error envelope. Until then, read the raw response body - the shape is the same; the envelope just makes it dependable.

Two details carry real weight. The `field in values` check exists because DRF can return errors for keys your form has no input for - `non_field_errors`, or a field the serializer requires that your form doesn't show. Assigning those to `fieldErrors` attaches a message to an input that doesn't exist, so the user sees nothing at all and concludes the button is broken. The fallback to `formError` is what catches them.

And errors for the _whole form_ need somewhere to appear, near the submit button where the user is looking. A permission failure or a network error belongs there, not attached to a field that isn't the problem.

Display then combines both sources:

```tsx
function errorFor(field: keyof StudioFormValues): string | undefined {
  if (fieldErrors[field]) return fieldErrors[field];
  if (shouldShow(field)) return errors[field];
  return undefined;
}
```

| Key terms         |                                                         |
| ----------------- | ------------------------------------------------------- |
| Controlled input  | An input whose displayed value always comes from state  |
| Touched           | Whether the user has interacted with and left a field   |
| Client validation | Rules the app can check without asking the server       |
| Server validation | Rules only the API can check, returned keyed by field   |
| Form-level error  | An error about the submission as a whole, not one field |

### Task 1

Build a form for one create operation in your own Project, with at least four fields. Hold the values in a single typed object with a generic `updateField`, and validate on blur and on submit.

Include the submitting state and the disabled button. Test the double-tap by adding an artificial delay to your API call and tapping the button twice - confirm only one record is created.

### Task 2

Wire server-side field errors into the same display. Trigger a real one by adding a `UniqueConstraint` or a serializer rule that your form can't check locally, and confirm the message appears against the correct input.

Then trigger an error your form has no field for, such as a permission failure, and confirm it appears as a form-level message rather than vanishing.

---

## 6. Making it usable on a phone

A form that's logically correct can still be miserable to use, and this is the part that surfaces in user acceptance testing.

### 6.1 Keyboard types and hints

```tsx
<TextInput
  value={values.email}
  onChangeText={(text) => updateField("email", text)}
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
  textContentType="emailAddress"
  returnKeyType="next"
/>

<TextInput
  value={values.capacity}
  onChangeText={(text) => updateField("capacity", text)}
  keyboardType="number-pad"
  returnKeyType="done"
/>
```

`autoCapitalize="none"` on an email field is the single highest-value line in this module. The default capitalises the first letter, so a user typing their email gets `Alex@…`, the login fails, and neither of you knows why. The same applies to usernames and any other case-sensitive value.

`textContentType` lets the OS offer autofill from the password manager, which is the difference between a login taking two seconds and twenty.

### 6.2 Moving between fields

```tsx
const suburbRef = useRef<TextInput>(null);

<TextInput
  returnKeyType="next"
  onSubmitEditing={() => suburbRef.current?.focus()}
/>
<TextInput ref={suburbRef} />
```

Tapping through four fields by hand is four opportunities to tap the wrong thing. A next button that moves focus costs three lines per field.

### 6.3 The keyboard covering the input

The most common form complaint in mobile UAT: the user taps the last field and the keyboard hides it.

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  className="flex-1"
>
  <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 p-4">
    {/* fields */}
  </ScrollView>
</KeyboardAvoidingView>
```

`keyboardShouldPersistTaps="handled"` fixes a subtler one: without it, the first tap on your submit button only dismisses the keyboard, so the user has to tap twice and reasonably concludes the button ignored them.

### 6.4 Accessible forms

Module 11's accessibility section applies with particular force here, because an error shown only in red text next to an input is invisible to a screen reader and to anyone who can't distinguish the colour.

```tsx
<TextInput
  accessibilityLabel="Studio name"
  accessibilityHint="Required. At least three characters."
  accessibilityInvalid={Boolean(errorFor("name"))}
/>;
{
  errorFor("name") && (
    <Text
      accessibilityLiveRegion="polite"
      className="text-red-600 text-sm mt-1"
    >
      {errorFor("name")}
    </Text>
  );
}
```

A `placeholder` is not a label. It disappears the moment the user types, so anyone who loses their place has no way to recover what the field was for, and screen readers treat it inconsistently. Where the design allows, use a visible label above the input as well.

| Key terms                   |                                                                   |
| --------------------------- | ----------------------------------------------------------------- |
| `autoCapitalize="none"`     | Stops the OS capitalising case-sensitive input                    |
| `textContentType`           | Lets the OS offer autofill for known field kinds                  |
| `KeyboardAvoidingView`      | Shifts content so the keyboard doesn't cover the focused input    |
| `keyboardShouldPersistTaps` | Lets a tap reach a button instead of only dismissing the keyboard |

### Task 3

Take the form from Task 1 and make it usable: correct keyboard types, `autoCapitalize` set deliberately on every field, focus moving between inputs, and the keyboard not covering anything.

Test it on a real device, in portrait, one-handed. Record anything you had to change that you wouldn't have noticed in a simulator with a hardware keyboard.

### Task 4

Add accessibility labels, hints and error announcements to every field. Then complete the form with VoiceOver or TalkBack on and the screen face down, exactly as module 11 asked.

Record in your README which errors you couldn't discover by audio alone, and what you changed.

---

## 7. When to reach for a library

Everything above is about eighty lines of your own code. Form libraries exist because that eighty lines gets rewritten in every form, and by the fourth one it's genuinely repetitive.

```bash
npx expo install react-hook-form
```

```tsx
import { useForm, Controller } from "react-hook-form";

const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<StudioFormValues>({ defaultValues: EMPTY_FORM });

<Controller
  control={control}
  name="name"
  rules={{ minLength: { value: 3, message: "At least 3 characters." } }}
  render={({ field: { onChange, onBlur, value } }) => (
    <TextInput value={value} onChangeText={onChange} onBlur={onBlur} />
  )}
/>;
```

|               | Your own state                        | A form library                    |
| ------------- | ------------------------------------- | --------------------------------- |
| Setup         | None                                  | A dependency and an API to learn  |
| First form    | Faster                                | Slower                            |
| Fifth form    | Slower, and inconsistent between them | Faster, and consistent            |
| Control       | Total                                 | Whatever the library exposes      |
| Server errors | You wire it up                        | Usually supported, via `setError` |

Either choice is defensible, and the argument is module 01's, not a matter of taste. YAGNI says don't add a dependency for a single login form. DRY says the fifth hand-rolled form with slightly different validation timing from the other four is a real maintenance cost.

What isn't defensible is drifting: two forms using a library and three not, because whoever wrote each one decided in the moment. Pick one approach for your Project and apply it consistently - the same conclusion module 11 reached about `StyleSheet` versus NativeWind, for the same reason.

Writing it yourself once, as tasks 1 to 4 asked, is worth doing regardless. A library that hides validation timing from you is much harder to debug if you've never implemented the timing yourself.

### Task 5

Look at how many forms your Project's backlog implies, then make the call: hand-rolled or a library. Write two or three sentences in your README justifying it against your actual form count, and name the principle behind your reasoning.

### Task 6

Whichever you chose, you now have a repeated shape across your forms - probably an input, its label, and its error message together.

Extract it into a reusable component. Nothing above showed you how, and there's a real design decision in it: your component needs to accept a value, a change handler, a blur handler, an error, and every `TextInput` prop a caller might want to pass through, without you enumerating all of them.

Work out how to do that pass-through in TypeScript, using React Native's own type definitions. Then rebuild your Task 1 form with it and record how many lines the form itself lost.

In your README, name the code smell from module 13 that the original repetition was an example of, and say honestly whether your component is now doing one job or has quietly acquired two.
