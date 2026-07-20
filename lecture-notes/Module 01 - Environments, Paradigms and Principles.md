# Module 01 - Environments, Paradigms and Principles

## 1. Course overview

**ID607001: Introductory Application Development Concepts** gave you a backend in Express and a frontend in SvelteKit, both in JavaScript. This course keeps the frontend in JavaScript, but moves it to React Native, for building mobile apps instead of web pages. The backend changes language entirely: you'll build it in Python, using Django.

Learning a second backend language, on purpose, in the middle of your programming education, is one of the most useful things this course does for you. The first language you learn is always tangled up with the concepts you're learning at the same time, questions like what's a variable or what's a function. The second language arrives once those concepts already exist in your head, and what you notice this time is which parts of programming are universal, and which parts are just how one particular language happens to do things.

---

## 2. Design patterns and principles

Before either language, it's worth being clear about two words this course uses constantly.

A **design pattern** is a named, reusable solution to a problem that comes up over and over in software, regardless of language. If you've ever solved a problem, then solved what felt like the same problem again in a different project, and thought "there should be a name for this," there usually is. Patterns give you that name, and a name is useful because it lets you talk about a solution without re-explaining it every time.

A **principle** is a rule of thumb for writing code that stays easy to work with as it grows. Principles are broader than patterns. A pattern is a specific shape; a principle is a value that many different shapes can serve.

Four principles worth knowing the names of now, even before you've seen them in code:

| Principle                                 | Short version                                                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| DRY, short for Don't Repeat Yourself      | The same piece of knowledge shouldn't be written out twice in your codebase                                    |
| KISS, short for Keep It Simple            | The simplest design that solves the problem is usually the right one                                           |
| YAGNI, short for You Aren't Gonna Need It | Don't build flexibility for a future requirement you don't actually have yet                                   |
| SOLID                                     | Five principles about structuring classes and dependencies well; you'll meet each one properly, with real code |

A junior developer copies a validation function into three different files because it was faster than figuring out how to share it. Which principle does this break? _Answer: DRY._

None of these are laws. They're defaults you can explain a departure from. "I duplicated this because sharing it would have meant a much messier dependency between two unrelated parts of the app" is a fine reason to break DRY. "I didn't think about it" isn't.

This course names a pattern or principle in almost every module, in whichever language that module is using. By term 2 of this semester, you'll have seen several of them twice, once in Python, once in JavaScript, which is the whole point: the pattern is the same idea; the syntax around it is just local dialect.

---

## 3. Paradigms

A **programming paradigm** is a style of thinking about how to structure a solution. Most languages let you mix these, but it's worth seeing each one in isolation first, since Django and React Native lean on different ones at different moments.

### 3.1 Procedural

A straight list of steps, executed in order. This is probably how your very first programs looked.

```python
def calculate_total(price, quantity):
    subtotal = price * quantity
    tax = subtotal * 0.15
    return subtotal + tax

total = calculate_total(19.99, 3)
print(total)
```

### 3.2 Object-oriented

Data and the behaviour that acts on it are bundled together into objects. You've done a full semester of this already, in an earlier course, using C#. Python supports it too, with a noticeably lighter syntax.

```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, price, quantity):
        self.items.append((price, quantity))

    def total(self):
        return sum(price * quantity for price, quantity in self.items)

cart = ShoppingCart()
cart.add_item(19.99, 3)
print(cart.total())
```

### 3.3 Functional

Programs built from small, pure functions that take input and return output, without changing anything outside themselves. JavaScript leans on this more than Python does, and you've already been using it without necessarily naming it, every time you've written `.map()`, `.filter()`, or `.reduce()`.

```javascript
const prices = [19.99, 25.5, 8.0];
const withTax = prices.map((price) => price * 1.15);
const total = withTax.reduce((sum, price) => sum + price, 0);
```

Django is heavily object-oriented: models, views, and serializers are almost all classes. React Native, and the state management you'll be introduced to, leans functional: components are functions, and a lot of state logic is built from small, composable functions rather than objects with methods. Neither approach is more correct. Recognising which one a piece of code is using helps you predict how it's going to be structured before you've read all of it.

| Key terms      |                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| Design pattern | A named, reusable solution to a recurring software problem                                                 |
| Principle      | A rule of thumb for keeping code maintainable as it grows                                                  |
| Paradigm       | A style of thinking about how to structure a solution: procedural, object-oriented, functional, and others |

---

## 4. Python for people who already know C# and JavaScript

You're not starting from zero. You already understand variables, functions, conditionals, loops, and objects, from C# and JavaScript. What follows is a translation guide, not a first introduction.

| Concept                 | C#                                                                                                            | JavaScript                                              | Python                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Variable                | `int age = 25;`                                                                                               | `let age = 25;`                                         | `age = 25`                                                                                                       |
| Constant                | `const string name = "Maya";`                                                                                 | `const name = "Maya";`                                  | `name = "Maya"`. Python has no true constant, though `ALL_CAPS` is the convention for treating a variable as one |
| String interpolation    | `$"Hello, {name}"`                                                                                            | `` `Hello, ${name}` ``                                  | `f"Hello, {name}"`                                                                                               |
| Function                | `int Add(int a, int b) { return a + b; }`                                                                     | `function add(a, b) { return a + b; }`                  | `def add(a, b):` then an indented `return a + b`                                                                 |
| Lambda / Arrow function | `(a, b) => a + b`                                                                                             | `(a, b) => a + b`                                       | `lambda a, b: a + b`. This style is rare in Python and used sparingly                                            |
| Array / list            | `List<int> nums = new List<int>() { 1, 2, 3 };`                                                               | `const nums = [1, 2, 3];`                               | `nums = [1, 2, 3]`                                                                                               |
| Object / dict           | `Dictionary<string, object> person = new Dictionary<string, object>() { { "name", "Liam" }, { "age", 20 } };` | `const person = { name: "Liam", age: 20 };`             | `person = {"name": "Liam", "age": 20}`                                                                           |
| Class                   | `class Dog { public Dog(string name) { Name = name; } public string Name { get; set; } }`                     | `class Dog { constructor(name) { this.name = name; } }` | `class Dog:` with `def __init__(self, name): self.name = name`                                                   |
| `this`                  | `this.Name`                                                                                                   | `this.name`                                             | `self.name`, and `self` is always an explicit parameter, never implicit                                          |
| Equality                | `==` (value equality for primitives)                                                                          | `===`                                                   | `==`. Python doesn't have a separate strict-equality operator                                                    |
| Block delimiters        | Curly braces `{ }`                                                                                            | Curly braces `{ }`                                      | Indentation. There are no braces at all                                                                          |
| Package manager         | NuGet                                                                                                         | npm                                                     | pip                                                                                                              |

Two things trip people up immediately. First, indentation isn't a style choice in Python, it's the syntax. A wrongly indented line is a genuine error, not a warning. Second, `self` in Python does the same job as `this` in C# and JavaScript, but it's never implicit: every instance method takes `self` as its first written parameter, on purpose.

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return "Woof woof!"

my_dog = Dog("Max", 3)
print(my_dog.bark())
```

In this class, `self.name` is the field being set, while `name` is simply the parameter passed in.

If that constructor pattern looks familiar, it should: it's the same private-field-and-constructor shape you already know from an earlier course, just without an access modifier keyword. Python doesn't enforce `private` the way C# does. Instead, a leading underscore, as in `self._name`, is a convention meaning treat this as internal, trusted rather than enforced.

In Python, what happens if you mix tabs and spaces for indentation in the same block? _Answer: it's an error. Python needs consistent indentation to know where a block starts and ends. Most editors, including VS Code with the Python extension, fix this automatically._

| Key terms    |                                                                            |
| ------------ | -------------------------------------------------------------------------- |
| `self`       | Python's equivalent of `this`, always an explicit first parameter          |
| `f"{value}"` | Python's string interpolation, equivalent to a JavaScript template literal |
| Indentation  | In Python, indentation defines code blocks; there are no braces            |

Before Task 1, write your plan as a short list of steps, the same habit from your first programming course. The point isn't the syntax yet, it's making sure the logic is right before you're fighting indentation errors at the same time.

### Task 1

Write a Python function `studio_summary(name, class_count)` that returns a string like `"CityFit has 6 classes"`. Call it with at least two different studios and print the results. Then write the same function in JavaScript, as `studioSummary(name, classCount)`, and run it with Node. Compare the two side by side in a written note: what's identical, and what's just different syntax for the same idea?

Nobody teaches you every Python feature you'll ever need in a lecture. Most of what you'll actually use, you'll pick up by reading a snippet, guessing at what it does, and confirming that guess against the documentation. This course wants you practising that skill deliberately, starting now, rather than only ever meeting new syntax when a lecturer hands it to you.

### Task 2

Below is a list of Python concepts that don't map cleanly onto anything you've used in JavaScript. Pick **one** from the list, not more.

**List comprehensions**

```python
squares = [n ** 2 for n in range(10)]
```

**Dictionary comprehensions**

```python
squares = {n: n ** 2 for n in range(5)}
```

**Decorators**

```python
def shout(func):
    def wrapper():
        return func().upper()
    return wrapper

@shout
def greet():
    return "hello"
```

**Context managers**

```python
with open("notes.txt", "w") as file:
    file.write("Hello, file!")
```

**`*args` and `**kwargs`\*\*

```python
def describe(*args, **kwargs):
    print(args)
    print(kwargs)

describe(1, 2, name="Alex")
```

**Unpacking**

```python
first, *rest = [1, 2, 3, 4]
```

**Generators**

```python
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1
```

**Lambda functions**

```python
square = lambda n: n ** 2
```

**`enumerate` and `zip`**

```python
names = ["Alex", "Sam", "Jo"]
for index, name in enumerate(names):
    print(index, name)
```

**Exception handling**

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    result = None
```

**Slicing**

```python
letters = ["a", "b", "c", "d", "e"]
middle = letters[1:4]
```

**Ternary conditional expressions**

```python
status = "adult" if age >= 18 else "minor"
```

**Sets**

```python
unique_numbers = {1, 2, 2, 3, 3, 3}
```

**`classmethod` and `staticmethod`**

```python
class Studio:
    count = 0

    @classmethod
    def register(cls):
        cls.count += 1
```

**Dunder methods**

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"
```

**The walrus operator**

```python
while (line := input("Enter something: ")) != "quit":
    print(line)
```

None of the snippets above are explained. That's deliberate. Work out what your chosen one is doing on your own, using the official Python documentation, a search engine, or an AI tool as a starting point, not as a substitute for actually understanding it.

Once you've picked one and worked out how it behaves, write two or three short examples of your own that use it in a way that isn't copied from whatever source you learned it from. Then record a short video, two to four minutes long, where you explain your chosen concept in your own words and walk through your own examples running in the terminal. Add the video, or a link to it, along with your example code, to your repository's `README.md`.

---

## 5. Setting up your Python environment

Install **Python 3.14 or later** from [python.org](https://www.python.org/downloads/) if it isn't already on your machine. Then create a **virtual environment** for this course's project, a self-contained folder holding just the Python packages this project needs, kept separate from anything else on your machine.

```bash
python -m venv venv
```

Activate it. You'll do this every time you open a terminal to work on the project.

On macOS or Linux, run the following.

```bash
source venv/bin/activate
```

On Windows, run the following instead.

```bash
venv\Scripts\activate
```

Your terminal prompt should now show `(venv)` at the start of the line. Install packages with `pip`, Python's package manager and npm's rough equivalent.

```bash
pip install django
```

Without a virtual environment, every Python project on your machine shares the same set of installed packages, and a version needed by one project can silently break another. This is the same problem `node_modules` solves for JavaScript, just handled differently: Node isolates packages per-project automatically, whereas Python needs you to create that isolation yourself, on purpose, every time.

| Key terms           |                                                              |
| ------------------- | ------------------------------------------------------------ |
| Virtual environment | An isolated set of Python packages for one project           |
| `pip`               | Python's package manager                                     |
| `venv`              | The standard library tool for creating a virtual environment |

### Task 3

In a new folder, create a `hello_fittrack.py` file that prints a short welcome message related to FitTrack, the fitness app you will be developing throughout this course, and run it with `python hello_fittrack.py` inside your activated virtual environment. Take a screenshot of it working and add it to your repository's `README.md`.
