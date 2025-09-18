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
python -m venv venv
```

This will create a new directory called `venv` in root directory of your repository, which contains the **virtual environment**.

---

### Activating the Virtual Environment

To activate the **virtual environment** on **Windows**, run the following command:

```bash
venv\Scripts\activate
```

To activate the **virtual environment** on **macOS** or **Linux**, run the following command:

```bash
source venv/bin/activate
```

Once the **virtual environment** is activated, you should see the name of the **virtual environment** in your terminal prompt.

---

## Python

> You should already be familiar with these concepts from previous courses such as **ID510001: Programming 1**, **ID511001: Programming 2**, **ID607001: Introductory Application Development Concepts**, etc. However, we will review these concepts to ensure everyone is comfortable with **Python's** specific syntax and semantics before proceeding to advanced topics.

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
isOperatorExample = (stringExample == "Hello, World!")
isNotOperatorExample = (stringExample != "Hello")

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

# Match-case statement
day = "Monday"
match day:
    case "Monday":
        print("Today is Monday")
    case "Tuesday":
        print("Today is Tuesday")
    case _: # Default case
        print("Today is not Monday or Tuesday")
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

### Classes and Objects

Here are some examples of classes and objects in **Python**:

```python
# Class definition
class Institution:
    def __init__(self, name, region, country):
        self.name = name
        self.region = region
        self.country = country

    def __str__(self):
        return f"{self.name} is located in {self.region}, {self.country}"

# Object creation
institution = Institution("Otago Polytechnic", "Otago", "New Zealand")

# Calling the __str__ method
print(institution) # Otago Polytechnic is located in Otago, New Zealand

# Setting attributes
institution.name = "Southern Institute of Technology"
institution.region = "Southland"

# Getting attributes
print(institution.name) # Southern Institute of Technology
print(institution.region) # Southland
print(institution.country) # New Zealand
```

> **Note:** The naming convention you should follow is **PascalCase** for classes.

---

### Inheritance

Here are some examples of inheritance in **Python**:

```python
# Base class
class Person:
    def __init__(self, firstName, lastName, age):
        self.firstName = firstName
        self.lastName = lastName
        self.age = age

    def __str__(self):
        return f"{self.firstName} {self.lastName} is {self.age} years old"

# Derived class
class Student(Person):
    def __init__(self, firstName, lastName, age, id):
        super().__init__(firstName, lastName, age)
        self.id = id

    def __str__(self):
        return f"{self.firstName} {self.lastName} is {self.age} years old and is a student with ID {self.id}"

# Object creation 
person = Person("John", "Doe", 25)
student = Student("Jane", "Doe", 20, "S12345")

# Calling the __str__ method
print(person) # John Doe is 25 years old
print(student) # Jane Doe is 20 years old and is a student with ID S12345
```

---

### Polymorphism

Here are some examples of polymorphism in **Python**:

```python
# Base class
class Animal:
    def speak(self):
        pass

# Derived class
class Dog(Animal):
    def speak(self):
        return "Woof!"

# Derived class
class Cat(Animal):
    def speak(self):
        return "Meow!"

# Function that takes an Animal object and calls its speak method
def animalSound(animal):
    print(animal.speak())

# Creating objects of the derived classes
dog = Dog()
cat = Cat()

# Calling the animalSound function with different objects
animalSound(dog) # Woof!
animalSound(cat) # Meow!
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
myDict = {"name": "Otago Polytechnic", "region": "Otago", "country": "New Zealand"}
print(myDict["name"]) # Otago Polytechnic
myDict["city"] = "Dunedin"
print(myDict) # {'name': 'Otago Polytechnic', 'region': 'Otago', 'country': 'New Zealand', 'city': 'Dunedin'}
del myDict["region"]
print(myDict) # {'name': 'Otago Polytechnic', 'country': 'New Zealand', 'city': 'Dunedin'}
print(len(myDict)) # 3
myDict.clear()
print(myDict) # {}
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
FILE_PATH = "example.txt"

# Writing to a file
with open(FILE_PATH, "w") as file:
    file.write("Hello, World!")

# Appending to a file
with open(FILE_PATH, "a") as file:
    file.write("\nHow are you?")

# Reading from a file
with open(FILE_PATH, "r") as file:
    content = file.read()
    print(content) # Hello, World!
                   # How are you?
```

The `with` keyword is used to ensure that the file, i.e., `example.txt`, is properly closed after its suite finishes, even if an exception is raised.

---

### Regular Expressions

**Regular expressions** are sequences of characters that form a search pattern. They are used for pattern matching within strings.

Here are some examples of regular expressions in **Python**:

```python
import re

# Match a pattern
pattern = r"\d+" # Matches one or more digits
text = "There are 123 apples and 456 oranges"
matches = re.findall(pattern, text)
print(matches) # ['123', '456']

# Search for a pattern
match = re.search(pattern, text)
if match:
    print(match.group()) # 123

# Replace a pattern
newText = re.sub(pattern, "NUM", text)
print(newText) # There are NUM apples and NUM oranges
```

---

### Modules and Packages

In **Python**, a **module** is a file containing **Python** code that can define functions, classes, and variables. A **package** is a way of organizing related modules into a directory hierarchy.

Here are some examples of modules and packages in **Python**:

```python
# Importing a module
import math
print(math.sqrt(16)) # 4.0
print(math.pi) # 3.141592653589793

# Importing specific functions from a module
from math import sqrt, pi
print(sqrt(25)) # 5.0
print(pi) # 3.141592653589793

# Importing a package
import os
print(os.getcwd()) # Current working directory
print(os.listdir()) # List of files and directories in the current directory
```

---

### User Input

Here is an example of user input in **Python**:

```python
firstName = input("Enter your first name: ")
lastName = input("Enter your last name: ")
age = int(input("Enter your age: ")) # Convert input to integer
print(f"Hello, {firstName} {lastName}! You are {age} years old.") # Hello, John Doe! You are 25 years old.
```

## Programming Principles

**Programming principles** are guidelines that help you write clean, maintainable and efficient code. In this section, you will learn about three important programming principles: **DRY (Don't Repeat Yourself)**, **KISS (Keep It Simple, Stupid)**, and **YAGNI (You Aren't Gonna Need It)**.

---

### DRY (Don't Repeat Yourself)

The **DRY** principle states that you should avoid duplicating code. Instead, you should create reusable functions or classes that can be called whenever needed. This helps to reduce errors and makes it easier to maintain your code.

Here are some examples of the **DRY** principle in **Python**:

```python
# This example does not adhere to the DRY principle
def calculateAreaOfCircle(radius):
    return 3.14159 * radius * radius

def calculateAreaOfSquare(side):
    return side * side

def calculateAreaOfRectangle(length, width):
    return length * width
```

How do you make the above example adhere to the **DRY** principle?

<details>
<summary>Click here to see an example</summary>

```python
# This example adheres to the DRY principle
def calculateAreaOfCircle(radius):
    return 3.14159 * radius * radius

def calculateAreaOfSquare(side):
    return calculateAreaOfRectangle(side, side)

def calculateAreaOfRectangle(length, width):
    return length * width
```

</details>
<br />

With the **DRY** principle, the `calculateAreaOfSquare` function reuses the `calculateAreaOfRectangle` function instead of duplicating the code.

---

### KISS (Keep It Simple, Stupid)

The **KISS** principle states that you should keep your code simple and easy to understand. Avoid unnecessary complexity and use clear and concise names for variables, functions and classes.

Here are some examples of the **KISS** principle in **Python**:

```python
# This example does not adhere to the KISS principle
def calculateAreaOfCircle(radius):
    if radius < 0:
        return 0
    else:
        area = 3.14159 * radius * radius
        return area
```

How do you make the above example adhere to the **KISS** principle?

<details>
<summary>Click here to see an example</summary>

```python
# This example adheres to the KISS principle
def calculateAreaOfCircle(radius):
    if radius < 0:
        return 0
    return 3.14159 * radius * radius
```

</details>
<br />

With the **KISS** principle, the `calculateAreaOfCircle` function is simplified by removing the unnecessary `else` statement.

---

### YAGNI (You Aren't Gonna Need It)

The **YAGNI** principle states that you should not add functionality until it is necessary. This helps to keep your codebase clean and reduces the risk of introducing bugs.

Here are some examples of the **YAGNI** principle in **Python**:

```python
# This example does not adhere to the YAGNI principle
class Circle:
    def __init__(self, radius):
        self.radius = radius
        self.color = "red" # Not needed yet
        self.borderWidth = 1 # Not needed yet

    def calculateArea(self):
        return 3.14159 * self.radius * self.radius
```

How do you make the above example adhere to the **YAGNI** principle?

<details>
<summary>Click here to see an example</summary>

```python
# This example adheres to the YAGNI principle
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def calculateArea(self):
        return 3.14159 * self.radius * self.radius
```

</details>
<br />

With the **YAGNI** principle, the `Circle` class only includes the `radius` attribute and the `calculateArea` method, which are necessary for its functionality.

---

## Exercises

Copy the directory `week-01-github-venv-python-programming-principles` into your **id608001-s2-26** repository. Open your **id608001-s1-26** repository in **Visual Studio Code**. Open the terminal and run the commands:

- `cd week-01-github-venv-python-programming-principles`
- `python3 task-01.py`

You should see the following output.

```bash
$ python3 task-01.py
Hello, World!
```

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task 1

In the `task-01.py` file, write a function called `calculateGrade(marks)` that takes a list of marks (integers) and returns:

- The average mark
- The letter grade (A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: 0-59)
- Whether the learner has passed (> 60)

Here is an example of usage:

```python
marks = [85, 92, 78, 90, 88]
average, letterGrade, passed = calculateGrade(marks)
print(f"Average: {average}, Grade: {letterGrade}, Passed: {passed}") # Average: 86.6, Grade: B, Passed: True
```

Make sure you consider edge cases such as an empty list of marks or invalid marks (e.g., negative numbers or numbers greater than 100).

---

### Task 2

In the `task-02.py` file, write a function called `analyseText(text)` that takes a string and returns:

- Counts the number of words
- Finds all email addresses using a **regular expression**
- Replaces all numbers with "NUM"
- Returns a **dictionary** with the results

Here is an example of usage:

```python
text = "Contact john@email.com or call 123-456-7890. We have 50 items available."
result = analyseText(text)
print(result) # {"wordCount": 10, "emails": ["john@email.com"], "textWithNumbers": "Contact john@email.com or call NUM-NUM-NUM. We have NUM items available."}
```

---

### Task 3

---

### Task 4

---

### Task 5

---

## Next Class

Link to the next class: [Week 02](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s2-26/lecture-notes/week-week-02-lambda-fp-adts-design-patterns.md)
