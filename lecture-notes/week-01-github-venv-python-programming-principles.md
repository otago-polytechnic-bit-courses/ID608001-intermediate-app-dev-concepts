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

> You should already be familiar with these concepts from previous courses such as **ID510001: Programming 1**, **ID511001: Programming 2**, **ID607001: Introductory Application Development Concepts\***, etc. However, we will review these concepts to ensure everyone is comfortable with **Python's** specific syntax and semantics before proceeding to advanced topics.

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

Here are some examples of control structures in **Python**:

```python
# If-elif-else statement
integerExample = 10

if integerExample > 5:
    print("integerExample is greater than 5")
elif integerExample == 5:
    print("integerExample is equal to 5")
else:
    print("integerExample is less than 5")

# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1
```

---

### Functions

Here are some examples of functions in **Python**:

```python
# Function definition
def add(a, b):
    return a + b

# Function call
result = add(5, 10)
print(result) # 15
```

---

### Data Structures - Lists, Tuples, Sets and Dictionaries

In **ID511001: Programming 2**, you learned about **lists** and **dictionaries**. In this section, we will review these concepts and introduce **tuples** and **sets**. **Tuples** are similar to **lists**, but they are immutable. They are defined using parentheses `()` instead of square brackets `[]`. **Sets** are unordered collections of unique elements. They are defined using curly braces `{}` or the `set()` function.

Here are some examples of data structures in **Python**:

```python
# List
myList = [1, 2, 3, 4, 5]
myList.append(6)
print(myList) # [1, 2, 3, 4, 5, 6]
print(myList[0]) # 1
print(myList[1:4]) # [2, 3, 4]
myList.remove(3)
print(myList) # [1, 2, 4, 5, 6]
myList.pop()
print(myList) # [1, 2, 4, 5]
print(len(myList)) # 4
myList.sort()
print(myList) # [1, 2, 4, 5]
myList.reverse()
print(myList) # [5, 4, 2, 1]
myList.clear()
print(myList) # []

# Tuple
myTuple = (1, 2, 3, 4, 5)
print(myTuple[0]) # 1
print(myTuple[1:4]) # (2, 3, 4)
print(len(myTuple)) # 5

# Set
mySet = {1, 2, 3, 4, 5}
mySet.add(6)
print(mySet) # {1, 2, 3, 4, 5, 6}
mySet.remove(3)
print(mySet) # {1, 2, 4, 5, 6}
print(len(mySet)) # 5

# Dictionary
myDict = {"name": "John", "age": 30, "city": "New York"}
print(myDict["name"]) # John
myDict["age"] = 31
print(myDict) # {"name": "John", "age": 31, "city": "New York"}
myDict["country"] = "USA"
print(myDict) # {"name": "John", "age": 31, "city": "New York", "country": "USA"}
del myDict["city"]
print(myDict) # {"name": "John", "age": 31, "country": "USA"}
print(len(myDict)) # 3
```

---

### Comprehensions

**Comprehensions** provide a concise way to create lists, sets, or dictionaries in **Python**. They consist of brackets containing an expression followed by a `for` clause, and can also include optional `if` clauses to filter items.

Here are some examples of comprehensions in **Python**:

```python
# List comprehension
squaredList = [x**2 for x in range(10)]
print(squaredList) # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# List comprehension with condition
evenSquaredList = [x**2 for x in range(10) if x % 2 == 0]
print(evenSquaredList) # [0, 4, 16, 36, 64]

# Set comprehension
squaredSet = {x**2 for x in range(10)}
print(squaredSet) # {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}

# Dictionary comprehension
squaredDict = {x: x**2 for x in range(10)}
print(squaredDict) # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36, 7: 49, 8: 64, 9: 81}
```

---

### File I/O

Here are some examples of file I/O in **Python**:

```python
# Writing to a file
with open("example.txt", "w") as file:
    file.write("Hello, World!")

# Appending to a file
with open("example.txt", "a") as file:
    file.write("\nHow are you?")

# Reading from a file
with open("example.txt", "r") as file:
    content = file.read()
    print(content) # Hello, World!
                   # How are you?
```

The `with` keyword is used to ensure that the file is properly closed after its suite finishes, even if an exception is raised.

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
