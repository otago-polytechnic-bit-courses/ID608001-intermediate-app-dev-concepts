# Module 10: SOLID and Code Smells

**Note:** The following notes were co-written with AI help structure topics and explain complex terms clearly.

## 1. Where this fits

Module 01 listed SOLID as five principles about structuring classes and dependencies well, and promised you'd meet each one properly, with real code. This is that module.

The timing is deliberate. SOLID taught before you've written anything substantial is five slogans to memorise. Taught now, with a Django API and a React Native client behind you, every principle can point at code you actually wrote and explain what's uncomfortable about it.

That's also the honest framing for the whole module. These principles aren't laws, and the goal isn't a codebase that scores full marks against a checklist. The goal is recognising the specific kind of pain each one is describing, so that when you feel that pain in your Project you know which shape to reach for.

---

## 2. Single Responsibility

**A class should have one reason to change.**

The phrasing matters. It isn't "a class should do one thing," which is vague enough to justify anything. It's about _reasons to change_: if two different stakeholders, or two unrelated future requirements, would both send you to the same file, that file is doing two jobs.

Here's a view doing three:

```python
class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()
    serializer_class = StudioSerializer

    def create(self, request):
        # Validating
        if len(request.data.get("name", "")) < 3:
            return Response(
                {"detail": "Name too short"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Saving
        studio = Studio.objects.create(
            owner=request.user,
            name=request.data["name"],
            suburb=request.data["suburb"],
            city=request.data["city"],
        )

        # Sending a notification
        send_mail(
            "New studio registered",
            f"{studio.name} was added in {studio.city}.",
            "noreply@fittrack.test",
            ["admin@fittrack.test"],
        )

        return Response(StudioSerializer(studio).data, status=status.HTTP_201_CREATED)
```

Three reasons to change, in one method. A new validation rule changes it. A new field changes it. A change to who gets emailed changes it.

Django already gives you the right homes for two of those. Validation belongs on the serializer; the email is a side effect that module 14 will show belongs somewhere else entirely.

```python
class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ["id", "name", "suburb", "city", "created_at"]

    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters.")
        return value


class StudioViewSet(viewsets.ModelViewSet):
    queryset = Studio.objects.all()
    serializer_class = StudioSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

The view is back to the five lines it was in module 03, and each rule now lives where someone would go looking for it.

This applies just as directly on the client. A screen component that fetches, transforms, holds state, and renders has the same problem, which is why modules 06 and 07 kept `studiosApi.ts` separate from the screens that use it.

---

## 3. Open/Closed

**Open for extension, closed for modification.** You should be able to add new behaviour without editing existing, working, tested code.

Consider a function that formats a studio's status:

```python
def describe_status(studio):
    if studio.status == "open":
        return "Currently accepting members"
    elif studio.status == "paused":
        return "Temporarily closed"
    elif studio.status == "closed":
        return "No longer operating"
```

Every new status means editing this function. That's a small thing here, but the shape scales badly: a long `if`/`elif` chain over a type is one of the most reliable signals that Open/Closed is being violated, and the same chain usually appears in three other places too.

Module 07's permission classes are the counter-example worth studying, because you've already used them. Adding `IsOwnerOrReadOnly` required writing a new class and adding it to a list. Nothing inside DRF was edited. That's Open/Closed achieved through the Strategy pattern, and it's why the two ideas so often show up together.

Closed for modification doesn't mean code is frozen. Fixing a bug is modification, and you should. It means adding a _new case_ shouldn't require reopening code that already handles the old ones correctly.

A colleague argues that the `if`/`elif` version above is fine, because adding a status is a two-line change and any alternative would be more code overall. Are they wrong? _Answer: not necessarily, and this is worth taking seriously. For one chain, in one place, they're right, and module 01's YAGNI supports them. Open/Closed earns its keep when the same chain appears in several places, because then adding a status means finding all of them and the compiler won't tell you if you miss one. The principle is describing a cost that scales, not a rule that applies at every size._

---

## 4. Liskov Substitution

**Anywhere a base class is used, a subclass must work without the calling code noticing.**

This is the least intuitive of the five, and the easiest to demonstrate with a violation:

```python
class StudioClass(models.Model):
    def cancel(self):
        self.is_cancelled = True
        self.save()


class OnlineStudioClass(StudioClass):
    def cancel(self):
        raise NotImplementedError("Online classes cannot be cancelled")
```

Any code holding a `StudioClass` may reasonably call `cancel()`. Hand it an `OnlineStudioClass` and it crashes. The subclass has narrowed what the parent promised, so it isn't substitutable, and every caller now needs to know which subclass it actually has, which defeats the entire point of the inheritance.

The usual fix is that the inheritance itself was wrong: cancellable-ness wasn't a property of all classes, so it shouldn't have been on the base. Pull it into something only cancellable classes have.

The practical warning sign is a subclass overriding a method to raise an exception, or to do nothing at all. Both are ways of saying "I can't actually honour this promise," which means the promise was in the wrong place.

---

## 5. Interface Segregation

**No client should be forced to depend on methods it doesn't use.**

Python has no `interface` keyword, but TypeScript does, so this one is easiest to see on the client.

```tsx
interface StudioRowProps {
  id: number;
  name: string;
  suburb: string;
  city: string;
  createdAt: string;
  ownerId: number;
  ownerEmail: string;
  classCount: number;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}
```

A row that only displays a name and a location now demands twelve props. Every place that renders it must supply all twelve, including four callbacks it may have no use for, and a test for it needs twelve values before it can render anything at all.

Split by what's actually needed:

```tsx
interface StudioSummary {
  id: number;
  name: string;
  suburb: string;
  city: string;
}

interface StudioRowProps {
  studio: StudioSummary;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}
```

Module 03 was already applying this on the API side without naming it. `StudioSerializer` and `StudioDetailSerializer` exist as two shapes precisely because a list response doesn't need every studio's full nested class list, and forcing one serializer to serve both would be the same over-broad interface in JSON form.

---

## 6. Dependency Inversion

**Depend on abstractions, not on concrete implementations.**

```tsx
export default function StudiosScreen() {
  const [studios, setStudios] = useState<Studio[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/studios/")
      .then((response) => response.json())
      .then(setStudios);
  }, []);
  // ...
}
```

The screen depends on a specific URL, on `fetch`, and on the response arriving as JSON in a particular shape. Change the host, and every screen doing this needs editing. Test it, and you're testing the network.

`studiosApi.ts` from module 06, and `apiFetch` from module 07, are the inversion. The screen now depends on `getStudios(): Promise<Studio[]>`, an abstraction describing _what_ it needs rather than _how_ it arrives. Swapping `fetch` for something else, adding a token header, or mocking the whole thing in a test, as module 10 did, all become possible without a single screen changing.

That's the concrete payoff, and it's worth stating plainly: module 10's mocked tests only worked because module 07 had already inverted this dependency. Screens calling `fetch` directly would have been untestable without mocking global `fetch` itself.

| Principle             | One-line version                                     | Warning sign                                  |
| --------------------- | ---------------------------------------------------- | --------------------------------------------- |
| Single Responsibility | One reason to change                                 | "and" in a class's description                |
| Open/Closed           | Extend without editing                               | A long `if`/`elif` over a type                |
| Liskov Substitution   | Subclasses must honour the base class's promises     | An override that raises or does nothing       |
| Interface Segregation | Don't force clients to depend on what they don't use | Props or serializer fields nobody reads       |
| Dependency Inversion  | Depend on abstractions                               | A URL or a library name inside a UI component |

### Task 1

Find one genuine violation of each of Single Responsibility, Interface Segregation, and Dependency Inversion in code you've written for this course. Fix all three. For each, write two or three sentences in your README naming the principle, what was wrong, and what specifically became easier after the change.

If you can't find a real violation of one of them, say so honestly and explain what in your code already prevents it, rather than inventing one to fix.

---

## 7. Code smells

A **code smell** is a surface symptom suggesting a deeper design problem. Smells aren't bugs. Code that smells usually works, which is exactly why it survives long enough to become a problem.

| Smell               | What it looks like                                        | Usually means                         |
| ------------------- | --------------------------------------------------------- | ------------------------------------- |
| Long method         | A function needing scrolling to read                      | Several responsibilities in one place |
| Large class         | A file everything ends up in                              | Single Responsibility violated        |
| Duplicated code     | The same logic in three files                             | DRY violated; a missing abstraction   |
| Magic numbers       | A bare `20` or `"active"` with no name                    | Knowledge that should be named        |
| Primitive obsession | Passing five separate strings that always travel together | A missing type or interface           |
| Feature envy        | A method mostly using another object's data               | The method is on the wrong class      |
| Shotgun surgery     | One small change requiring edits in eight files           | A concept spread too thin             |
| Dead code           | Commented-out blocks, unused functions                    | Git already remembers; delete it      |

### 7.1 Magic numbers

```python
if studio_class.capacity > 20:
    raise ValidationError("Capacity too high")
```

What is 20? A gym's fire limit? An arbitrary guess? Nobody reading this in three months can tell, and if the same 20 appears in the serializer and in a React Native validation check, changing it means finding all three.

```python
MAX_CLASS_CAPACITY = 20

if studio_class.capacity > MAX_CLASS_CAPACITY:
    raise ValidationError(
        f"Capacity cannot exceed {MAX_CLASS_CAPACITY}."
    )
```

The name is the documentation. This is DRY in its truest form, which is about knowledge rather than characters: the rule is written down once, and every use refers to that one place.

### 7.2 Primitive obsession

```tsx
function formatStudioLabel(name: string, suburb: string, city: string): string {
  return `${name} - ${suburb}, ${city}`;
}
```

Three strings that always travel together, in an order nothing enforces. Swap `suburb` and `city` at a call site and TypeScript is perfectly happy, because both are `string`. The bug surfaces on screen, not at compile time.

```tsx
function formatStudioLabel(studio: StudioSummary): string {
  return `${studio.name} - ${studio.suburb}, ${studio.city}`;
}
```

Now the compiler catches it, and the function signature says what it's actually about.

### 7.3 Long method

The most common smell in student projects, and the easiest to fix. A 60-line `handleSubmit` that validates, transforms, calls the API, handles errors, updates state, and navigates is six things. Extracting each into a named function makes the top-level function read as a summary of what happens, which is usually the version you wanted to write in the first place.

A useful test: if you'd need to write a comment saying `# now validate the input`, that's the extraction telling you its own name. `validate_input()` says the same thing and can be tested on its own.

---

## 8. Refactoring safely

**Refactoring** means changing a program's internal structure without changing what it does. The second half of that sentence is the hard part, and it's why this module comes after module 10 rather than before it.

Refactoring without tests isn't refactoring, it's rewriting and hoping. The tests are what let you make a change confidently, because "did I break anything?" becomes a command rather than a feeling.

The loop:

1. Confirm the tests pass **before** you touch anything.
2. Make one small change.
3. Run the tests.
4. Commit.
5. Repeat.

Committing at step 4, every time, is what makes the process safe: any change that goes wrong is one `git reset` away from a known-good state, rather than tangled up with four other changes you'd rather keep.

Resist changing behaviour while refactoring. If you spot a bug mid-refactor, note it, finish the refactor, commit, then fix the bug separately. A commit that both restructures and changes behaviour is one nobody, including you, can review or revert cleanly.

---

## 9. Linting and formatting

Some smells can be caught automatically, and a machine is more consistent about it than you will be at 2am.

For Python, **Ruff** does both linting and formatting.

```bash
pip install ruff
ruff check .
ruff format .
```

For TypeScript, **ESLint** and **Prettier**.

```bash
npx expo lint
npm install -D prettier
npx prettier --write .
```

It's worth being clear about the division of labour. A **formatter** handles what code looks like: indentation, quote style, line length. None of it affects behaviour, and none of it is worth a team discussion, which is precisely why automating it away is valuable. A **linter** finds likely mistakes: unused variables, unreachable code, missing dependencies in a `useEffect`.

The Project's code quality expectations include consistent formatting and linting, so running these once at the end is worth far less than having them running throughout. Module 10's Task 6 built a workflow that runs your tests on every push; the same workflow can run `ruff check` and `expo lint`.

| Key terms   |                                                                     |
| ----------- | ------------------------------------------------------------------- |
| Code smell  | A surface symptom suggesting a deeper design problem                |
| Refactoring | Changing internal structure without changing behaviour              |
| Linter      | A tool finding likely mistakes and questionable patterns            |
| Formatter   | A tool enforcing consistent appearance, with no effect on behaviour |

### Task 2

Run Ruff across your Django project and ESLint across your Expo project. Read every warning rather than auto-fixing them all immediately. Pick three that reveal something you didn't already know, fix them by hand, and record what each one was actually warning you about.

### Task 3

Find the longest method in your codebase, in either language. Before changing it, make sure it's covered by at least one test, writing one if it isn't. Then refactor it into smaller named functions, committing after each step, running the tests each time.

Record the before and after line counts, and the sequence of commits you made. The commit history is the evidence that you refactored in safe steps rather than rewriting it in one go and checking at the end.

### Task 4

Pick two more smells from the table in section 7, ones not demonstrated in sections 7.1 to 7.3, and find real examples of both in your own code. Fix them.

Then go further than anything shown here. Every fix in this module has been an improvement, but refactoring genuinely has costs, and pretending otherwise is how codebases end up with fifteen tiny files nobody can navigate. Choose one place in your code where you can identify a smell and have decided **not** to fix it. In your README, name the smell, explain what fixing it would cost in this specific case, and justify why leaving it is the better call here. Module 01 made the point that a principle is a default you can explain a departure from; this task is asking you to explain one.

---

## 10. Professional version control

Section 8 made the case for committing after every small refactoring step, which is a version control practice justified by a code quality argument. That's the right way round, and it's worth extending, because the Project assesses your Git history directly.

The expectations are explicit: regular, descriptive conventional commits linked to relevant issues, and semantic versioned releases with notes at the end of each sprint. The descriptor also puts it more bluntly - a single commit on the due date communicates something very specific to a marker. Your history is evidence of your process, and it's the one piece of evidence you cannot reconstruct at the end.

### 10.1 Conventional commits

**Conventional Commits** is a convention giving every message a type, an optional scope, and a description.

```
feat(studios): add favourite toggle to studio row
fix(auth): stop token refresh loop on expired refresh token
refactor(views): extract validation from StudioViewSet into serializer
test(studios): cover ownership permission for non-owners
docs(api): document error response shape
chore(deps): upgrade expo-sqlite
```

Common types:

| Type       | Use for                                                   |
| ---------- | --------------------------------------------------------- |
| `feat`     | A new capability a user could notice                      |
| `fix`      | A bug fix                                                 |
| `refactor` | Restructuring with no behaviour change - section 8's work |
| `test`     | Adding or changing tests                                  |
| `docs`     | Documentation only                                        |
| `chore`    | Dependencies, config, tooling                             |

The value isn't the tidiness. It's that `refactor` and `feat` being different types forces you to notice when a commit is doing both, which is exactly the mixed commit section 8 warned against. If you can't pick one type, the commit is two commits.

Write the description as the completion of "this commit will…". Present tense, imperative, no full stop. `add favourite toggle`, not `added favourite toggle` or `adding some stuff to the studio row`.

Three commits named `update`, `fix stuff`, and `changes` are useless six weeks later - but the real cost is immediate. Module 10's debugging section suggested narrowing a bug by halving; `git bisect` does that automatically across your history, and it's worth exactly as much as your messages are.

### 10.2 Linking to issues

Cards on your module 09 Kanban board should be GitHub issues, and commits should reference them.

```
feat(studios): add favourite toggle to studio row

Closes #14
```

`Closes #14` in a commit or pull request body moves that issue to closed automatically when it lands on your default branch, which keeps the board honest without you maintaining it by hand. The board demonstrating genuine use throughout is assessed; a board updated in one sitting looks exactly like what it is.

### 10.3 Branching

For an individual project, a straightforward model is enough:

- `main` - always in a working state, and what you tag releases from.
- `project` - the branch the Project is marked from, per the descriptor.
- One short-lived branch per issue, named for it: `feat/14-favourite-toggle`.

Merge back with a pull request, even working alone. It gives you a place to read your own diff before it lands, and it's where module 10's CI workflow reports whether the tests passed. Reviewing your own PR catches a surprising amount - a stray `console.log`, a committed `.env`, a file you didn't mean to touch.

Keep branches short-lived. A branch open for three weeks accumulates conflicts and stops being a unit of work.

### 10.4 Releases

At the end of each sprint, including the UAT sprint, tag a release and write notes.

**Semantic versioning** is `MAJOR.MINOR.PATCH`:

| Part  | Increment when                                           |
| ----- | -------------------------------------------------------- |
| MAJOR | You make a breaking change to something others depend on |
| MINOR | You add functionality without breaking what exists       |
| PATCH | You fix a bug without changing anything else             |

For a project of this shape, sprint releases are usually `v0.1.0`, `v0.2.0`, `v0.3.0`, with a `v0.2.1` if you have to fix something after tagging. The leading `0` says the project isn't stable yet, which is honest.

```bash
git tag -a v0.2.0 -m "Sprint 2: favourites and offline studio list"
git push origin v0.2.0
```

`-a` creates an annotated tag, which records who tagged it and when. A bare `git tag v0.2.0` creates a lightweight pointer with none of that, and the difference matters when a tag is your evidence that a release existed at a particular point in time.

Release notes need to cover what was delivered, known issues, how to run the release locally - both API and client - and any relevant technical information.

```markdown
## v0.2.0 - Sprint 2

### Delivered

- Users can favourite a studio; favourites persist across restarts (#14, #15)
- Studio list reads from a local cache when offline (#18)

### Known issues

- Favourites are device-local and don't sync between devices (#22)
- Pull-to-refresh spinner occasionally persists after a failed refresh (#23)

### Running this release

API: see `api-documentation.md`. Requires `DJANGO_SECRET_KEY` in `.env`.
Client: `npm install`, set `EXPO_PUBLIC_API_URL` to your machine's LAN address, `npx expo start`.

### Technical notes

- Adds `expo-sqlite`; schema created on first launch, no migration needed.
```

The known issues section is the one students omit, and it's the one that reads best. Listing what doesn't work yet, with issue numbers, demonstrates that you know your own project's state. Silence about it reads either as not knowing or as hoping nobody checks.

Each release must be runnable locally from the tagged commit. That's worth testing rather than assuming: check the tag out into a fresh directory and follow your own instructions.

| Key terms            |                                                                      |
| -------------------- | -------------------------------------------------------------------- |
| Conventional Commits | A commit message convention of type, optional scope, and description |
| Semantic versioning  | `MAJOR.MINOR.PATCH`, where each part signals a kind of change        |
| Annotated tag        | A tag recording author, date and message, unlike a lightweight tag   |
| Release notes        | What shipped, what's known broken, and how to run it                 |

### Task 5

Adopt conventional commits for the rest of the course, starting with Task 3's refactoring commits. Then look back at your last twenty commit messages and pick the three least useful. Rewrite each as it should have been written, and record in your README what information the original was missing.

### Task 6

Tag your current work as `v0.1.0` with an annotated tag, and write full release notes including a known issues section with at least two real entries.

Then verify it properly, which nothing above walked you through. Clone your own repository into a completely fresh directory, check out the tag, and follow your own release notes exactly - no filling in gaps from memory, no reusing your existing `.env` or virtual environment. Record every step where your instructions turned out to be incomplete, and fix them.

Whatever you find here, a marker would have found too.
