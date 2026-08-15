# Module 09: Backlog Selection and Requirement Analysis

## 1. Why this module has almost no code in it

Every module so far has handed you a problem someone else had already decided was worth solving. This one doesn't, and that's the point. The Project asks you to build a full-stack app **of your own choosing**, and it assesses how you work as a developer at least as much as what you produce. The path it asks you to walk is:

**concept → backlog → requirements → design → planning → implementation → testing → release → reflection**

Implementation is one step in the middle of that list. This module covers everything before it.

That ordering isn't bureaucracy. The cheapest moment to discover that a feature doesn't make sense is while it's still a sentence in a document. The most expensive moment is after you've built it, wired it into two screens, and written tests for it. Every hour spent on Phase 1 is buying down the cost of a change later.

Everything in this module maps directly onto a deliverable in the Project's Phase 1, so treat the tasks as genuine first drafts of your submission rather than practice for it.

| Phase 1 deliverable                 | Covered in       |
| ----------------------------------- | ---------------- |
| App concept                         | Section 2        |
| Backlog of 10 requirements          | Sections 3 and 4 |
| Prioritisation approach             | Section 5        |
| Risks, assumptions and dependencies | Section 6        |
| Acceptance criteria                 | Section 7        |
| Non-functional requirements         | Section 8        |
| System design for two features      | Section 9        |
| API design                          | Section 10       |
| Wireframes                          | Section 11       |
| Design reflection                   | Section 12       |
| Sprint planning                     | Section 13       |

Your lecturer must approve your concept and design before you begin Sprint 1, so the sooner this work is real, the sooner you can start building.

---

## 2. The app concept

Your concept is 100–150 words covering what problem the app solves, who the intended users are, and what its core functionality is. It must be original, scoped to your own idea rather than a clone of something well known, and realistic for one semester.

That last constraint is the one students most often get wrong, and it's worth being blunt about. A simple, well-executed concept is preferred over an overly ambitious one. A markbook full of half-finished features scores worse than a smaller app where every requirement actually works, has tests, and survived user acceptance testing. YAGNI, from module 01, applies to scoping a project just as much as it applies to a function signature.

Two questions are worth answering honestly before committing to an idea:

**Can you describe the app's core loop in one sentence?** "A user logs a run, sees their week's total, and gets a nudge if they're behind" is a core loop. "A social fitness platform with messaging, leaderboards, workout plans, and nutrition tracking" is four apps stapled together.

**Does it need meaningful work on both sides?** The Project assesses implementation across the React Native client _and_ the Django API. An idea that's really just a local checklist with no server-side logic gives you nothing interesting to design, secure, or test on the backend.

FitTrack, the studios-and-classes app running through modules 02 to 07, is deliberately not your project. Use it as a size reference: a handful of related models, a clear owner-based permission rule, one or two screens that do something more interesting than list-and-detail.

### Task 1

Write your app concept in 100–150 words, covering the problem, the users, and the core functionality. Then write two additional sentences, not for submission, answering: what is the single feature this app cannot exist without, and what is one feature you're tempted to include that you're going to deliberately leave out? Bring both to your lecturer when you seek concept approval.

---

## 3. What a requirement actually is

A **requirement** describes something the app must let someone do, or some quality it must have. It's written from the outside, in terms of a user and an outcome, not from the inside in terms of models and endpoints.

The most common failure looks like this:

> Create a `Workout` model with a `duration` field and a `POST /api/workouts/` endpoint.

That isn't a requirement. It's an implementation plan wearing a requirement's clothes. It has already decided the answer before anyone asked what problem is being solved, and it gives you no way to tell whether it's more or less important than anything else in your backlog.

A **user story** keeps you honest by forcing the outcome into the sentence:

> As a runner, I want to log a completed run, so that I can see how much I've trained this week.

The "so that" clause is doing the real work. If you can't finish it without restating the first half, the requirement probably has no value behind it and belongs out of the backlog rather than in it.

| Key terms   |                                                                                |
| ----------- | ------------------------------------------------------------------------------ |
| Requirement | Something the app must let someone do, or a quality it must have               |
| User story  | A requirement written as "As a _role_, I want _capability_, so that _benefit_" |
| Backlog     | The ordered list of everything you might build, most valuable first            |

Which of these two is the better requirement, and why? "As a user, I want the app to be fast," or "As a user, I want my studio list to appear within two seconds on a normal connection, so I don't assume the app has frozen." _Answer: the second. Both describe the same desire, but only one of them can be tested. "Fast" cannot be verified, argued about, or signed off; "within two seconds" can be, by anyone, with a stopwatch._

---

## 4. Building the backlog

The Project asks for **10 requirements**, representing meaningful development work across both the client and the API, scoped so a working full-stack feature set is achievable across your sprints.

Ten is a deliberate number. It's enough that you have to make real prioritisation decisions, and few enough that each one can be analysed properly in 150–250 words.

A practical way to generate them is to write far more than ten first, without judging any of them, then cut. Cutting from twenty-five down to ten forces you to articulate why each survivor earned its place, which is exactly what the written analysis asks for anyway.

Watch the granularity. These three are all describing the same feature at wildly different sizes:

| Too small                       | About right                      | Too large                          |
| ------------------------------- | -------------------------------- | ---------------------------------- |
| "Add a save button to the form" | "A user can log a completed run" | "A user can manage their training" |

A requirement that's too small isn't worth 200 words of analysis. One that's too large hides so many decisions that you can't write testable acceptance criteria for it, which is the signal to split it.

A rough test: if a requirement can't plausibly be finished inside one sprint, it's an epic and needs splitting. If three of them would be finished in an afternoon, they're probably one requirement pretending to be three.

### Task 2

Brainstorm at least twenty candidate requirements for your concept, as user stories, without filtering as you go. Then cut to ten. Keep the discarded list; the ones you rejected are useful evidence when you have to justify why the survivors were higher priority.

---

## 5. Prioritisation

Once you have ten, they need an order. The Project asks you to name which prioritisation approach you used, and to explain for each requirement why it sits higher or lower than the others. Three common techniques, any of which is defensible if applied consistently:

### 5.1 MoSCoW

Sorts requirements into four buckets: **Must** have, **Should** have, **Could** have, **Won't** have this time.

Its strength is that it's quick and easy to explain. Its weakness is that everything drifts into "Must" unless you're disciplined. A useful rule: if your Musts are more than about 60% of the backlog, you haven't prioritised, you've relabelled.

### 5.2 Kano

Sorts by how each feature affects user satisfaction, rather than by how much you want it.

| Kano category | What it means                                                     |
| ------------- | ----------------------------------------------------------------- |
| Basic         | Absent, users are angry; present, nobody notices. Login, usually  |
| Performance   | More of it is linearly better. Speed, accuracy, number of filters |
| Excitement    | Absent, nobody minds; present, users are delighted                |
| Indifferent   | Users don't care either way, however much you enjoyed building it |

Kano's real value is catching the feature you're personally excited about that no user would notice was missing.

### 5.3 Weighted Shortest Job First

Divides the value of a requirement by its estimated size, then orders by the result, so that cheap high-value work rises to the top.

```
WSJF = (business value + time criticality + risk reduction) / job size
```

Its strength is that it accounts for cost, which neither MoSCoW nor Kano does. Its weakness is that the inputs are estimates you invented, so it can lend false precision to a guess. Being honest about that in your write-up is better than pretending the number is objective.

Whichever you choose, apply it to all ten. Mixing techniques halfway down the list means you can no longer justify any of the relative orderings, which is precisely what you're being assessed on.

Two requirements score identically under your chosen technique. What should break the tie? _Answer: dependency order. If requirement A can't be built until B exists, B is higher regardless of what the scoring says. Prioritisation techniques rank value; they don't know about your technical sequencing._

### Task 3

Choose one prioritisation technique and apply it to all ten of your requirements. Produce an ordered list, and write two or three sentences explaining why you chose that technique over the other two for this particular app.

---

## 6. Risks, assumptions and dependencies

For each requirement, the Project asks you to identify at least one relevant risk, assumption, technical dependency, or project dependency, and explain how it may affect implementation.

| Term                 | What it is                                                   | Example                                                         |
| -------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Risk                 | Something that might go wrong, with a consequence if it does | The device's location permission may be denied, leaving no data |
| Assumption           | Something you're treating as true without having verified it | Users will be online when they log an activity                  |
| Technical dependency | Another piece of technology this needs in order to work      | Needs `expo-notifications`, which behaves differently on iOS    |
| Project dependency   | Another requirement that must be finished first              | Cannot start "view my history" before "log an activity" exists  |

The most useful ones to write down are the assumptions, because they're the ones you don't notice you're making. "Users will be online" is an assumption that quietly decides whether you need module 15's offline handling at all. Writing it down turns an invisible decision into a visible one you can revisit when it turns out to be wrong.

Vague entries earn nothing. "Risk: it might not work" says nothing about what might fail or what you'd do about it. Compare with: "Risk: image uploads on a slow connection may time out, leaving the user unsure whether their post saved; mitigation is an explicit uploading state and a retry."

---

## 7. Acceptance criteria

Acceptance criteria are how you and a marker both know when a requirement is finished. The Project's wording is exact: **clear, measurable and testable**, with an explanation of how you would verify each one has been met.

They also do double duty. Your user acceptance testing sprint requires test scenarios derived directly from these criteria, so criteria written vaguely now become an unusable UAT test plan later.

**Given/When/Then** is a reliable format:

> **Given** I am logged in and viewing the studio list,
> **When** I tap the heart icon on a studio,
> **Then** that studio appears in my favourites list and the icon stays filled after I close and reopen the app.

Note what makes this testable. Someone who didn't write it can follow it exactly, and there is no argument about whether it passed.

Include the unhappy paths. Module 03 asked you to write down what a failing request should look like before testing it, and module 06 asked you to plan for a screen's error state. Acceptance criteria are where that habit becomes a written commitment:

> **Given** I have no network connection,
> **When** I tap the heart icon,
> **Then** I see a message explaining the change couldn't be saved, and the icon returns to its previous state.

A requirement whose criteria only describe things going well is a requirement that will pass its own tests and then fall over in front of a UAT participant.

| Key terms           |                                                                            |
| ------------------- | -------------------------------------------------------------------------- |
| Acceptance criteria | Measurable, testable conditions that define when a requirement is complete |
| Given/When/Then     | A format expressing a criterion as context, action, and observable outcome |
| Happy path          | The scenario where everything works as intended                            |
| Unhappy path        | The scenarios involving failure, invalid input, or missing data            |

---

## 8. Non-functional requirements

A functional requirement says what the app does. A **non-functional requirement** says how well it must do it, and these are the ones most likely to be skipped and most likely to matter.

| Consideration   | A question worth answering for your app                                      |
| --------------- | ---------------------------------------------------------------------------- |
| Performance     | How long may this screen take to load before a user assumes it's broken?     |
| Usability       | How many taps should this take? Is it usable one-handed?                     |
| Security        | Who may see this data? Where is the token stored? What's in an env variable? |
| Maintainability | Could you add a second, similar feature without copying this code?           |
| Reliability     | What happens when the request fails halfway through?                         |
| Compatibility   | Does this behave the same on iOS and Android, and on a small screen?         |

Several of these connect directly to work you've already done. Storing a JWT in `expo-secure-store` in module 07 was a security non-functional requirement being met. The Project's own code quality expectations name secrets in environment variables explicitly, so that's a constraint you already know applies to every requirement that touches the API.

You don't need all six for every requirement. You need the ones that genuinely constrain that requirement, stated specifically enough to be checked.

### Task 4

Write the full analysis for **three** of your ten requirements, at 150–250 words each, covering priority and selection, risks/assumptions/dependencies, acceptance criteria, and non-functional requirements. Choose your highest-priority requirement, your lowest, and one from the middle.

Doing three now, rather than all ten, is deliberate: bring these to your lecturer, get feedback on the depth expected, and apply it to the remaining seven rather than writing all ten at the wrong depth and rewriting them.

---

## 9. System design

From your ten requirements, the Project asks you to choose **two features** with meaningful UI or system-level complexity, and produce a system design diagram for each, with a 100–150 word explanation justifying the design, explaining your technical decisions, and naming an alternative you considered and rejected.

Pick features with something to design. A feature that lists rows from one endpoint has a diagram nobody learns anything from. A feature that touches authentication, a device API, two models, and a loading state has real decisions in it.

Your diagram must show how responsibility is divided between the React Native client and the Django API, the key data exchanged, the major components, the relationships between them, and any external dependencies.

A sequence diagram usually suits a feature that's really a flow through time, such as logging in or uploading a photo. A component or architecture diagram suits a feature that's really about structure, such as how a screen, a cache, and an API client relate. Either is acceptable; choosing deliberately and saying why is what's assessed.

The rejected alternative is not a formality. "I put filtering in the API rather than the client, because filtering client-side would require downloading every record on every load" is a real technical decision with a real trade-off, and it's exactly the reasoning the reflection later asks you to evaluate.

Before drawing anything, write down the single sentence describing what crosses the client/server boundary for this feature, and in which direction. Modules 03 and 06 built that boundary from both sides; a diagram that's vague about it usually means the design is vague about it too.

---

## 10. API design

Document the endpoints your two features need, before building them.

| HTTP Method | URL                  | Description      | Authentication | Roles      | Body Parameters          |
| ----------- | -------------------- | ---------------- | -------------- | ---------- | ------------------------ |
| `GET`       | `/api/studios/`      | List all studios | No             | Any        | —                        |
| `POST`      | `/api/studios/`      | Create a studio  | Yes            | Any user   | `name`, `suburb`, `city` |
| `PUT`       | `/api/studios/{id}/` | Update a studio  | Yes            | Owner only | `name`, `suburb`, `city` |
| `DELETE`    | `/api/studios/{id}/` | Delete a studio  | Yes            | Owner only | —                        |

The Project asks you to consider authentication, authorisation, validation, invalid requests, error responses, status codes, and returned data. Module 07's split between the two auth words is why the table above has separate columns for them: "Yes, authentication required" and "owner only" are different constraints, and a table collapsing them into one column hides the interesting one.

Decide your error shape once, here, rather than discovering three inconsistent shapes during implementation. The Project requires consistent JSON error responses, and consistency is far easier to design than to retrofit.

```json
{
  "detail": "You do not have permission to perform this action."
}
```

Status codes worth being deliberate about:

| Code | Meaning                                              |
| ---- | ---------------------------------------------------- |
| 200  | Success                                              |
| 201  | Created successfully                                 |
| 400  | The request was malformed or failed validation       |
| 401  | No valid credentials were supplied                   |
| 403  | Credentials were valid, but not permitted to do this |
| 404  | No such resource                                     |

The 401/403 distinction is module 07's authentication/authorisation split showing up in the protocol itself: 401 means "I don't know who you are," 403 means "I know exactly who you are, and no."

---

## 11. Wireframes

Wireframes for your two features must show navigation, important information, interactive elements, and four states: default, loading, error or empty, and success.

Those four states are the same three-state planning habit from module 06, with the empty case added. Sketching them costs minutes; discovering during UAT that a first-time user sees a blank screen with no explanation costs a change late in the project.

The empty state is the one most often forgotten. A brand-new user has no data at all, and every list in your app is empty on their very first launch. That screen is the first impression your app makes.

Wireframes are low fidelity on purpose. Boxes and labels communicate structure. Choosing fonts and colours at this stage is a way of feeling productive while avoiding the harder question of what actually goes on the screen.

---

## 12. Design reflection

Before implementation, write a short reflection covering your two selected features, why you selected them over the other eight, how they fit into your overall architecture, and what you expect to be the most challenging part of implementing them.

This is assessed on the quality of your reasoning, not whether your predictions turn out to be correct. That's worth reading twice, because it means a confidently wrong prediction, honestly reasoned, scores well, and it becomes genuinely useful material for the final reflection later when you compare what you expected against what happened.

### Task 5

Complete the remaining seven requirement analyses, then produce the full Phase 1 package for your two selected features: system design diagrams with explanations, an API design table, wireframes covering all four states, and your design reflection. Submit it for lecturer approval before starting Sprint 1.

---

## 13. Sprint planning

The Project requires a minimum of three development sprints plus a UAT sprint, tracked on a Kanban board, with a documented goal, included requirements, estimates, sequencing, and a 100–150 word rationale for each.

A sprint goal is one sentence describing what will be demonstrably true at the end that isn't true now. "Work on the API" is not a goal. "A logged-in user can create, edit, and delete their own activities from the app" is, because you can tell at the end whether it happened.

The rationale is where the marks are. Anyone can put five items in a sprint; explaining why _those_ five, in _that_ order, is the part that shows you understood your own dependencies:

> Sprint 1 delivers registration, login and token storage first, because six of the remaining eight requirements are owner-scoped and cannot be meaningfully tested until a request can identify its user. Activity logging follows in the same sprint because it's the app's core loop and everything in Sprint 2 reads the data it produces.

One scheduling decision worth making now: your UAT sprint validates your two Phase 1 features with real participants, and at least two identified issues must result in tracked, implemented changes that are then re-verified. Scheduling UAT as your final sprint leaves no room to make those changes. Put it second-to-last.

Your board should demonstrate genuine use throughout. Moving every card from "To Do" to "Done" the night before submission communicates something very specific to a marker, in exactly the way a single commit on the due date does.

### Task 6

Plan your sprints. Set up your Kanban board, create a card for each of your ten requirements, and write the goal, contents, estimates, sequencing, and rationale for Sprint 1 in full, plus a provisional outline of the remaining sprints.

Then do something none of the above told you how to do: work out and document a definition of done for your project, meaning the checklist a card must satisfy before you're allowed to move it to Done. Nothing in this module specified what belongs on that list. Use the Project's own code quality, testing, and documentation expectations as your source, decide what your own standard is, and record it in your README so it can be applied consistently from Sprint 1 rather than invented retrospectively in Sprint 3.
