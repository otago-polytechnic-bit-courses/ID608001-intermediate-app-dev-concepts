# Week 01

## GitHub

This course will use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking this link <>. You will be prompted to accept an assignment. Click on the **Accept this assignment** button. **GitHub Classroom** will create a new repository.

> **Note:** You will use this repository for non-assessed work.

---

## Virtual Environment

A **virtual environment** is an isolated **Python** environment that allows you to manage dependencies for different projects separately.

---

### Creating a Virtual Environment

There are several ways to create a virtual environment in **Python**. One common method is to use the `venv` module, which is included in the standard library.

To create a **virtual environment**, open your terminal or command prompt, navigate to the root of your repository, and then run the following command:

```bash
python3 -m venv id608001-env
```

This will create a new directory called `id608001-env` in root directory of your repository, which contains the **virtual environment**.

---

### Activating the Virtual Environment

To activate the **virtual environment** on **Windows**, run the following command:

```bash
id608001-env\Scripts\activate
```

To activate the **virtual environment** on **macOS** or **Linux**, run the following command:

```bash
source id608001-env/bin/activate
```

Once the **virtual environment** is activated, you should see the name of the **virtual environment** in your terminal prompt.

---

## Python

> You should already be familiar with these concepts from previous courses such as **ID510001: Programming 1**, **ID511001: Programming 2**, **ID607001: Introductory Application Development Concepts***, etc. However, we will review these concepts to ensure everyone is comfortable with **Python's** specific syntax and semantics before proceeding to advanced topics.

---

### Variables, Data Types and Operators

Here are some examples of variables, data types and operators in **Python**:

```python
# Variables and data types
stringExample = "Hello, World!"
integerExample = 10
floatExample = 10.5
booleanExample = True # or False
noneExample = None 

# Operators
additionExample = integerExample + 5
subtractionExample = integerExample - 5
multiplicationExample = integerExample * 2
divisionExample = integerExample / 2
modulusExample = integerExample % 3
exponentiationExample = integerExample ** 2
floorDivisionExample = integerExample // 3
concatenationExample = stringExample + " How are you?"
fStringExample = f"{stringExample} How are you?"
repetitionExample = stringExample * 3

# Comparison operators
isEqualExample = (integerExample == 10)
isNotEqualExample = (integerExample != 5)
isGreaterThanExample = (integerExample > 5)
isLessThanExample = (integerExample < 15)
isGreaterThanOrEqualExample = (integerExample >= 10)
isLessThanOrEqualExample = (integerExample <= 10)

# Logical operators
andOperatorExample = (integerExample > 5 and booleanExample)
orOperatorExample = (integerExample < 5 or booleanExample)
notOperatorExample = not booleanExample

# Identity operators
isOperatorExample = (stringExample is "Hello, World!")
isNotOperatorExample = (stringExample is not "Hello")

# Membership operators
inOperatorExample = ("World" in stringExample)
notInOperatorExample = ("Python" not in stringExample)
```

> **Note:** The naming convention you should follow is **camelCase** for variables and functions.

---

### Control Structures

---

### Functions

---

### Data Structures - Lists, Tuples, Sets and Dictionaries

---

### Comprehensions

---

### File I/O and Exception Handling

---

### Context Managers

---

### Regular Expressions

---

### Modules and Packages

---

## Programming Principles

---

### DRY (Don't Repeat Yourself)

---

### KISS (Keep It Simple, Stupid)

---

### YAGNI (You Aren't Gonna Need It)

---

## Next Class


