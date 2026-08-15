# ID608001: Intermediate Application Development Concepts

# Project

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------: | --------------- | --------: |
| 6     |      15 | Individual      |       80% |

---

# Project Overview

In this project, you will design and build a full-stack app **of your own choosing**, working as a professional developer within an agile development environment.

You will define your own product backlog to identify and prioritise requirements, design solutions before implementation, plan and deliver work through multiple sprints, conduct user acceptance testing as part of your development process, and produce versioned releases of your app.

Unlike the Practical, which focuses on applying patterns and principles within a controlled technical task, this Project focuses on the **complete professional development process**.

You will demonstrate how you move from:

**concept → backlog → requirements → design → planning → implementation → testing → release → reflection**

The emphasis is therefore on **how you work as a developer**, as well as what you produce.

You will be assessed on your ability to:

- define and prioritise your own backlog requirements;
- design solutions before implementation;
- plan and manage development work;
- implement features across the React Native client and Django API;
- apply appropriate design patterns and programming principles;
- conduct user acceptance testing and evaluate your implementation;
- work iteratively through multiple sprints;
- maintain professional version control;
- deliver working software; and
- critically reflect on your development process.

---

# Learning Outcomes

At the successful completion of this course, you will be able to:

1. **Apply design patterns and programming principles using software development best practices.**
2. **Design and implement full-stack applications using industry-relevant programming languages.**

## Learning Outcome Mapping

| Requirement                              | LO1 | LO2 |
| ---------------------------------------- | :-: | :-: |
| App concept and backlog definition       |     |  ✓  |
| System design for two selected features  |     |  ✓  |
| API endpoint planning                    |     |  ✓  |
| Wireframes                               |     |  ✓  |
| Design reflection                        |     |  ✓  |
| Sprint planning                          |     |  ✓  |
| Django API implementation                |     |  ✓  |
| React Native client implementation       |     |  ✓  |
| Application of programming principles    |  ✓  |     |
| Application of design patterns           |  ✓  |     |
| User acceptance testing                  |     |  ✓  |
| User acceptance testing reflection       |  ✓  |  ✓  |
| Versioned sprint releases                |     |  ✓  |
| Design pattern and principles reflection |  ✓  |     |
| Final reflection                         |  ✓  |  ✓  |
| Final presentation and demonstration     |  ✓  |  ✓  |

---

# Assessments

| Assessment | Weighting | Due Date                | Learning Outcomes |
| ---------- | --------: | ----------------------- | ----------------- |
| Practical  |       20% | 18 September at 4:59 PM | LO1               |
| Project    |       80% | 13 November at 4:59 PM  | LO1, LO2          |

The Practical provides an early, focused demonstration of LO1.

The Project builds on this by assessing the broader ability to apply software development practices within a substantial full-stack development process.

---

# Submission

**Repository:** Provided at the beginning of the course. You will submit your work by pushing to this repository.

**Branch:** `project`

Your `project` branch must contain your latest completed release.

**Project Due:** 13 November at 11:59 PM

The version available on the `project` branch at the submission deadline will be used for marking.

You are responsible for ensuring that:

- your latest work has been committed and pushed;
- the application can be built and run locally (both the API and the client);
- your documentation is complete; and
- all required evidence has been submitted.

**Partial marks are available for partially completed work.**

You are not required to deploy the API or publish the app to any store or distribution platform. Your work is assessed by building and running it locally from your repository.

---

# Phase 1: Design

> Complete this phase before beginning Sprint 1. Your lecturer must approve your app concept and design before development begins.

The purpose of this phase is to demonstrate that you can define and analyse development requirements for your own app concept, and make informed technical decisions **before writing the implementation**.

---

# 1. App Concept

Before selecting requirements, briefly describe your app idea (**100–150 words**), covering:

- what problem it solves, or what need it addresses;
- who the intended users are; and
- what its core functionality is.

Your app should be original, scoped to your own idea (not a clone of an existing well-known app), and realistic for a student project completed over one semester. A simple, well-executed concept is preferred over an overly ambitious one.

Your lecturer must approve your concept before you continue to backlog selection.

---

# 2. Backlog Selection and Requirement Analysis

Define your own product backlog of **10 requirements** for your app concept.

These requirements should represent meaningful development work across both the React Native client and Django API, and should be scoped so that a working full-stack feature set is achievable across your sprints.

For each requirement, write **150–250 words** addressing:

### Priority and selection

- Why have you selected this requirement?
- What value does it provide?
- Why is it a higher or lower priority than other requirements in your backlog?
- Which prioritisation approach did you use?

Examples include:

- MoSCoW;
- Kano;
- Weighted Shortest Job First; or
- another appropriate technique.

### Risks, assumptions and dependencies

Identify at least one relevant:

- risk;
- assumption;
- technical dependency; or
- project dependency.

Explain how it may affect implementation.

### Acceptance criteria

Define clear, measurable and testable acceptance criteria.

Explain how you would verify that each criterion has been met.

### Non-functional requirements and constraints

Identify relevant considerations such as:

- performance;
- usability;
- security;
- maintainability;
- reliability;
- compatibility; or
- other constraints relevant to your app.

Your 10 requirements should provide enough work for meaningful sprint planning without creating an unrealistic workload.

---

# 3. System Design

From your 10 selected requirements, choose **two features** involving meaningful UI and/or system-level complexity.

For each feature, create an appropriate system design diagram.

This could be:

- a component diagram;
- architecture diagram;
- sequence diagram; or
- another appropriate representation.

Your design should demonstrate:

- how responsibility is divided between the React Native client and Django API;
- the key data exchanged between client and server;
- the major components involved;
- relationships between components; and
- external dependencies (e.g. third-party APIs or libraries), if any.

Accompany each diagram with a **100–150 word explanation** that:

- justifies your design;
- explains your technical decisions; and
- identifies an alternative approach that you considered and rejected.

---

# 4. API Design

Document the Django API endpoints required by your two selected features.

| HTTP Method | URL | Description | Authentication | Roles | Body Parameters |
| ----------- | --- | ----------- | -------------- | ----- | --------------- |

Consider:

- authentication;
- authorisation;
- validation;
- invalid requests;
- error responses;
- status codes; and
- returned data.

Your API design should fit sensibly into your overall app architecture.

---

# 5. Wireframes

Create wireframes for your two selected features.

Your wireframes should show:

- navigation;
- important information;
- interactive elements;
- default states;
- loading states;
- error/empty states; and
- success states.

The purpose is to communicate the intended user experience before implementation.

---

# 6. Design Reflection

Before beginning implementation, write a short reflection addressing:

1. What are your two selected features?
2. Why did you select these over the other eight requirements?
3. How do they fit into your overall app architecture?
4. What do you expect to be the most challenging part of implementing them?

This reflection is assessed on the quality of your reasoning rather than whether your predictions turn out to be correct.

---

# Phase 2: Build

Implement your selected requirements across the Django API and React Native client.

Use your design documents as the starting point for implementation.

Your designs are not fixed contracts. If implementation reveals that a design needs to change, update the relevant documentation and explain **why the change occurred**.

---

# Project Management

Use a Kanban board throughout the project.

You may use:

- GitHub Projects;
- Trello; or
- another appropriate project management tool.

Organise your work into a minimum of **three development sprints**, plus your UAT sprint.

For each sprint, document:

- the sprint goal;
- requirements included;
- estimates;
- sequencing; and
- a **100–150 word rationale** explaining why the work was grouped and ordered that way.

Your board should demonstrate genuine use throughout the project.

---

# Django API Implementation

Implement the API functionality required by your selected requirements.

You must:

- implement the required endpoints;
- validate create and update operations;
- return consistent JSON error responses;
- write automated tests that demonstrate the functionality you add or modify behaves as intended (e.g. successful requests, validation, and error responses); and
- implement appropriate relationships or queries involving multiple models where relevant.

The API should integrate cleanly with the rest of your app rather than being developed as an isolated system.

---

# React Native Client Implementation

Implement your selected requirements within the React Native client.

You must:

- implement all 10 selected requirements;
- follow your system designs and wireframes for your two selected features;
- document and justify significant deviations;
- handle loading, error, empty and success states appropriately; and
- provide clear feedback to the user.

---

# Design Patterns and Programming Principles

The Practical provides a focused demonstration of your ability to apply patterns and principles.

The Project now assesses those skills in a **larger and more complex development context**.

Across the Project, you must demonstrate the appropriate use of:

## Design patterns

At least **two named design patterns**.

These should be used where they solve genuine problems within your implementation.

## Programming principles

At least **two programming principles or software development best practices**.

Examples include:

- SOLID;
- DRY;
- separation of concerns;
- defensive programming;
- dependency management; or
- another appropriate principle.

Your final reflection must evaluate how effectively you applied these patterns and principles across the larger project.

---

# User Acceptance Testing Sprint

One of your sprints will be designated as your **User Acceptance Testing (UAT) sprint**.

In this sprint, in addition to that sprint's planned development work, you will validate your two Phase 1 features with real users.

You must:

1. Design a UAT test plan for your two selected features, including test scenarios/tasks derived directly from your Phase 1 acceptance criteria.
2. Recruit at least **three participants** who have not been involved in development (e.g. classmates, friends, or family) to complete the test scenarios.
3. Observe and record how participants complete each task, noting any issues, confusion, or failures.
4. Collect structured feedback from each participant (e.g. a short questionnaire or rating scale) covering usability, clarity and satisfaction.
5. Analyse the results and identify issues that require changes to your implementation.
6. Make the identified changes and re-verify the affected acceptance criteria.
7. Document your test plan, raw results and the resulting changes.
8. Include this evidence in the sprint release.

You remain responsible for prioritising which feedback to act on and justifying any feedback you choose not to act on.

## UAT Criteria

Your UAT will be assessed against the following:

| Criterion                 | What this looks like                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Participant selection** | At least 3 participants who were not involved in development and reasonably represent your intended users                       |
| **Test design**           | Test scenarios map directly to the acceptance criteria defined in Phase 1, not just general "click around" exploration          |
| **Session evidence**      | At least one moderated/observed session, with notes on what participants did, said, or struggled with                           |
| **Structured feedback**   | Feedback is captured consistently across participants (e.g. the same questionnaire or rating scale), not just informal comments |
| **Issue tracking**        | Issues found are logged individually, with a note on severity/priority                                                          |
| **Action taken**          | At least two identified issues result in a tracked, implemented change to the app                                               |
| **Re-verification**       | Changed features are re-checked against their original acceptance criteria after the fix                                        |
| **Documentation**         | Your test plan, raw results, and a short written summary of findings are all included in your evidence                          |

---

# Releases

At the end of **each sprint**, including the UAT sprint:

1. Create a semantic versioned release/tag, such as `v0.1.0`.
2. Produce release notes describing:
   - what was delivered;
   - known issues;
   - how to run the release locally (both API and client); and
   - relevant technical information.

You are **not required to deploy the API or publish your app** to an app store, TestFlight, EAS, or any other distribution platform. Each release should be runnable locally from the tagged commit.

The release history should demonstrate genuine incremental development throughout the project.

---

# Code Quality and Version Control

The Project assesses professional development practices over an extended period.

Your implementation should demonstrate:

| Area                | Expectation                                                         |
| ------------------- | ------------------------------------------------------------------- |
| **Structure**       | Clear separation of concerns and logical organisation               |
| **Style**           | Consistent formatting and linting                                   |
| **Naming**          | Clear, descriptive names                                            |
| **Error handling**  | Errors handled consistently and visibly                             |
| **Security**        | Secrets stored in environment variables                             |
| **Version control** | Regular, descriptive conventional commits linked to relevant issues |

Your Git history is evidence of your development process. A regular history should demonstrate how the project evolved over multiple sprints - a single commit on the due date communicates something very specific to a marker.

---

# Documentation

Maintain the following documentation throughout the project.

## `api-documentation.md`

Include:

- project description;
- setup instructions;
- environment variables;
- development instructions; and
- testing instructions.

## `app-documentation.md`

Include:

- project description (your app concept);
- setup instructions;
- React Native development/build instructions; and
- a note of each versioned release/tag with at least one per sprint, and instructions for running that release locally.

Documentation should be maintained throughout development rather than written entirely at the end.

---

# Phase 3: Reflect

After completing development, create `reflection.md`.

Your reflections should be based on **specific evidence from your project**.

Generic statements such as "I learned a lot" will not demonstrate sufficient reflection.

---

# Design and Implementation Reflection

**Approximately 400 words**

Address:

### 1. What changed?

Identify a specific change to your:

- system design;
- API design; or
- wireframes.

Explain why the change occurred.

### 2. What was harder than expected?

Describe one specific technical problem.

Explain:

- what happened;
- what you tried;
- what worked;
- what did not work; and
- what you learned.

### 3. Patterns and principles

For each of your design patterns:

- identify where it is used;
- explain why you selected it;
- compare it with an alternative;
- discuss the trade-offs; and
- evaluate its effectiveness.

Do the same for your programming principles.

Use specific examples from your code.

### 4. What are you most confident about?

Identify the part of the project that best demonstrates your understanding and explain why.

---

# User Acceptance Testing Reflection

**Approximately 400 words**

Address:

1. How did you design your test scenarios, and how well did they map to your acceptance criteria?
2. What did your participants struggle with or misunderstand, and why do you think that happened?
3. Which pieces of feedback did you act on, and which did you decide not to act on? Explain your reasoning.
4. How did the changes you made improve the feature(s)?
5. What would you do differently if you ran another round of UAT?

---

# Final Reflection

**Approximately 300 words**

Address:

1. What was the biggest difference between your original designs and the final implementation?
2. What did implementing the React Native client reveal about your API design?
3. What is the single most significant improvement you would make to your development process?

Your reflection should use concrete examples from your project.

---

# Phase 4: Present

Complete an individual presentation of **10–15 minutes**, either live or recorded.

The presentation should demonstrate your ability to communicate your work as a professional developer would to a technical lead, development team or client.

Do not simply read your written reflections.

Your presentation must include:

### Project overview

Briefly explain:

- your app concept;
- your backlog and prioritisation; and
- your sprint plan.

**Approximately 1–2 minutes.**

### Feature demonstration

Demonstrate your two Phase 1 features by running your latest local release.

### Code walkthrough

Demonstrate one design pattern in your actual implementation.

Explain:

- where it is used;
- why it was selected; and
- what problem it solves.

### User acceptance testing

Provide a concise and honest account of your UAT process and what it revealed.

### Final takeaway

Explain the single most important thing you learned about professional software development through this project.
