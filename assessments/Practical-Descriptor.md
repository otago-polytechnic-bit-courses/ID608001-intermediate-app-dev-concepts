# ID608001: Intermediate Application Development Concepts

# Practical

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------: | --------------- | --------: |
| 6     |      15 | Individual      |       20% |

**This assessment is open for five days. No extensions will be granted.**

---

# Practical Overview

You will be given a small, working full-stack application: a Django REST API and a React Native client. It runs. It does what it claims to do. It is also badly built.

Your task is to **refactor it** so that it applies the design patterns and programming principles taught in Modules 01 to 08, and to justify every change you make.

You are not adding features or redesigning the interface. Almost all of the marks are for improving the structure of code that already works, and for explaining why your version is better.

Unlike the Project, which focuses on the complete professional development process, the Practical focuses on **applying patterns and principles within a controlled technical task**.

You will be assessed on your ability to:

- identify violations of programming principles in existing code;
- apply named design patterns where they solve a genuine problem;
- refactor without changing observable behaviour;
- follow software development best practices; and
- justify your technical decisions against the alternatives you rejected.

---

# Learning Outcomes

At the successful completion of this course, you will be able to:

1. **Apply design patterns and programming principles using software development best practices.**
2. Design and implement full-stack applications using industry-relevant programming languages.

## Learning Outcome Mapping

| Requirement                           | LO1 |
| ------------------------------------- | :-: |
| Diagnosis of structural problems      |  ✓  |
| Application of design patterns        |  ✓  |
| Application of programming principles |  ✓  |
| Behaviour-preserving refactoring      |  ✓  |
| Software development best practices   |  ✓  |
| Justification of technical decisions  |  ✓  |

---

# Assessments

| Assessment | Weighting | Due Date                | Learning Outcomes |
| ---------- | --------: | ----------------------- | ----------------- |
| Practical  |       20% | 18 September at 4:59 PM | LO1               |
| Project    |       80% | 13 November at 4:59 PM  | LO1, LO2          |

---

# Submission

**Repository:** Provided at the beginning of the course.

**Branch:** `practical`

**Opens:** 14 September at 9:00 AM

**Practical Due:** 18 September at 4:59 PM

## Extensions

**No extensions will be granted for this assessment.** The window is five days, and it is the same five days for everyone.

If circumstances outside your control affect your ability to submit, contact your lecturer as early as possible and follow the standard impaired performance process. Do not wait until the deadline has passed.

Work pushed to the `practical` branch after the deadline will not be marked.

## Scoping your work

Five days is not long, and the brief asks for more than most students will complete to a high standard. That is deliberate.

**Do less, well.** The marks reward depth of reasoning, not quantity of changes. Three problems diagnosed properly, refactored carefully, and justified against real alternatives will outscore eight problems changed in a hurry with a thin reflection.

Budget time for Part 5 before you start. It carries 15 marks, it has to be recorded, and it is the part most often left unfinished.

## Checklist

You are responsible for ensuring that:

- your latest work has been committed and pushed;
- the application can be built and run locally (both the API and the client);
- the supplied test suite passes;
- `diagnosis.md` is complete; and
- `presentation.md` contains a working link to your recording.

**Partial marks are available for partially completed work.** A well-executed refactor of three problems, properly justified, will score better than eight problems changed without explanation.

---

# The Starter Application

**ToolShed** is a community tool library: a set of neighbourhood sheds, each holding tools that members can borrow.

Users can view the sheds, view one shed and the tools it holds, create, edit and delete a shed, and log in.

Run it and use it **before you change anything**. You can't refactor safely without knowing what the current behaviour is.

A test suite is supplied. **Do not modify it.** It describes the behaviour your refactor must preserve.

```bash
python manage.py test
```

If a supplied test fails at any point, your refactor has changed behaviour. Find out why before continuing.

---

# 1. Diagnosis

**15 marks**

Before changing anything, produce `diagnosis.md` identifying **at least eight** distinct structural problems.

For each, record:

- the location, as a file and approximate line;
- the problem, in one or two sentences;
- the principle or pattern it violates or is missing; and
- a severity of high, medium or low, with a one-line reason.

Severity means impact on maintainability, not how annoying the fix is.

At least six of your eight must be problems you go on to fix. You may list problems you decide not to fix, provided you say so.

Describing symptoms rather than causes will score in the lower band. "The view is messy" is a symptom; "the view validates, saves and formats the response, so three unrelated requirements would each send you to the same method" is a diagnosis.

---

# 2. Design Patterns

**30 marks**

Apply **at least two** of the following, each solving a problem you identified in Part 1.

| Pattern    | Where the starter code needs it                                        |
| ---------- | ---------------------------------------------------------------------- |
| Adapter    | The API builds its JSON by hand; the client trusts whatever arrives    |
| Repository | Data access is scattered across views rather than behind one interface |
| Strategy   | Access rules are hardcoded as conditional branches inside views        |

Each must be recognisable as that pattern to someone who knows it, rather than merely labelled as it, and must leave observable behaviour unchanged.

Applying all three is **not** worth more than applying two well. A third bolted on where it isn't needed will lose marks under KISS and YAGNI, and recognising that a pattern was unnecessary is a defensible answer in Part 5.

---

# 3. Programming Principles and Best Practices

**30 marks**

## Principles

Apply **at least three** of: DRY, KISS, YAGNI, separation of concerns, and defensive programming.

Each must point at a specific change in your code. "I applied DRY throughout" earns nothing; "the same fetch-and-parse logic appeared in four screens, so I extracted it into one client module that every screen now calls" earns the mark.

DRY is about knowledge, not characters. Two functions that look similar but change for different reasons are not a violation, and merging them is a mistake.

## Best practices

Assessed across the whole submission:

| Area            | Expectation                                                         |
| --------------- | ------------------------------------------------------------------- |
| Security        | No secret or credential committed; secrets in environment variables |
| Version control | A `.gitignore` covering environments, databases and dependencies    |
| Naming          | Clear, descriptive, consistent within each language's conventions   |
| Error handling  | Failures handled and surfaced, not swallowed                        |
| Typing          | The client is typed; `any` only where genuinely unavoidable         |
| Style           | Consistent formatting, produced by a tool rather than by hand       |
| Commits         | Small and descriptive, made throughout rather than in one sitting   |

The starter code violates several of these on purpose. **At least two are not listed anywhere in this document**, and finding them is part of the assessment.

---

# 4. Extension

**10 marks**

Add one small capability:

> A tool can be marked as either available or under repair. Tools under repair are visible only to the user who owns the shed holding them. Everyone continues to see available tools exactly as before.

This is a test of the structure you produced in Parts 2 and 3, not a feature task. If your refactor went well, this should mean adding code rather than editing existing working code. If it means changing something in six places, that is a genuine finding, and saying so in Part 5 will score better than pretending otherwise.

The supplied tests must still pass.

---

# 5. Justification

**15 marks**

Rather than a written reflection, you will **record a presentation** of **seven to ten minutes** justifying your decisions.

This mirrors Phase 4 of the Project, where you present your work to a technical audience. Treat this as your rehearsal for it, at a fifth of the weighting.

## Format

- A screencast with your voice over your screen, showing **your actual code**.
- Seven to ten minutes. Content beyond ten minutes is not marked.
- Slides are optional and should be minimal. This is a code walkthrough, not a talk about code.
- Your face need not appear. Your voice must.

Add the link to `presentation.md` in your repository, along with the tool you used to record. If your recording is hosted somewhere requiring access, confirm the link works from an account that is not yours.

## Content

Address all four of the following. Move between files as you speak; do not read from a script.

### 1. Each pattern you applied

Show it on screen. Say what problem it solves in this codebase, one alternative you considered and rejected, and why, and what the change actually made easier.

"I could have not used a pattern" is not an alternative.

### 2. Each principle you applied

The same, showing a specific before-and-after from your own code. Having the previous version open in a diff is the clearest way to do this.

### 3. A principle you deliberately did not follow

Show one place where you could have applied a principle and chose not to. Explain what applying it would have cost in that specific case, and why leaving it was the better call.

Module 01 made the point that these are defaults you can explain a departure from. A well-argued departure scores as well as a well-argued application.

### 4. What Part 4 revealed

Show the diff for your extension. Say how many files it touched, whether that matched your expectations, and what you would change about your refactor if it did not.

## What is being assessed

The reasoning, not the polish. A confident, clear explanation of three decisions will outscore a rushed tour of eight.

Marks are lost for describing what the code does rather than why you chose it, since your marker can already read the code. Time spent introducing yourself, explaining what the app is, or apologising for the recording quality is time not spent earning marks.

---

# Use of AI Tools

**You are strongly encouraged not to use AI tools for this assessment.**

This is not a rule about honesty. It is advice about what will actually get you the marks.

An AI tool will restructure this codebase for you, quickly, and the result may look reasonable. What it can't do is the part being assessed. Parts 1 and 5 are worth **30 of the 100 marks** and both ask for something only you can supply: which problems _you_ judged most severe and why, which alternative _you_ weighed and rejected, and which principle _you_ deliberately chose not to apply.

Part 5 makes this concrete. You will be talking, unscripted, over code on screen, explaining why you chose one abstraction over another. Explaining code you did not write is difficult, and it is obvious to a marker when it is happening. Where your presentation and your code disagree, the presentation is treated as the more reliable evidence of your understanding.

This assessment is also your best chance to find out whether you can do this unaided, while it is worth 20% rather than 80%. If you can't yet, that is genuinely useful to discover now.

If you do use AI tools, you **must** declare which tools and for what, in a short section at the end of `presentation.md`. Declaring it costs you no marks. Not declaring it is an academic integrity matter.

You may be asked to explain any part of your submission in person, in addition to your recording.
