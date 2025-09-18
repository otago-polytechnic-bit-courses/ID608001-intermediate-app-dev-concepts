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

# Object instantiation
institution = Institution("Otago Polytechnic", "Otago", "New Zealand")
print(institution) # Otago Polytechnic is located in Otago, New Zealand
print(institution.name) # Otago Polytechnic
print(institution.region) # Otago
print(institution.country) # New Zealand
```

> **Note:** The naming convention you should follow is **PascalCase** for classes.

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

## Programming Principles

**Programming principles** are guidelines that help you write clean, maintainable and efficient code. In this section, you will learn about three important programming principles: **DRY (Don't Repeat Yourself)**, **KISS (Keep It Simple, Stupid)**, and **YAGNI (You Aren't Gonna Need It)**.

---

### DRY (Don't Repeat Yourself)

The **DRY** principle states that you should avoid duplicating code. Instead, you should create reusable functions or classes that can be called whenever needed. This helps to reduce errors and makes it easier to maintain your code.

Here are some examples of the **DRY** principle in **Python**:

```python
# Not DRY
def calculateAreaOfCircle(radius):
    return 3.14159 * radius * radius

def calculateAreaOfSquare(side):
    return side * side

def calculateAreaOfRectangle(length, width):
    return length * width

# DRY
def calculateAreaOfCircle(radius):
    return 3.14159 * radius * radius

def calculateAreaOfSquare(side):
    return calculateAreaOfRectangle(side, side)

def calculateAreaOfRectangle(length, width):
    return length * width
```

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
# Not YAGNI
class Circle:
    def __init__(self, radius):
        self.radius = radius
        self.color = "red" # Not needed yet
        self.borderWidth = 1 # Not needed yet

    def calculateArea(self):
        return 3.14159 * self.radius * self.radius

# YAGNI
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def calculateArea(self):
        return 3.14159 * self.radius * self.radius
```

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

In the `task-01.py` file, write a function called `calculateGrade(marks)` that takes a list and returns:

- The average mark
- The letter grade (A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: 0-59)
- Whether the learner has passed (> 60)

Here is an example of usage:

```python
marks = [85, 92, 78, 90, 88]
average, letterGrade, passed = calculateGrade(marks)
print(f"Average: {average}, Grade: {letterGrade}, Passed: {passed}") # Average: 86.6, Grade: B, Passed: True
```

---

### Task 2

In the `task-02.py` file, write a function called `analyseText(text)` that takes a string that:

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

In the `task-03.py` file, write two classes called `Institution` and `InstitutionManager`:

```python
class Institution:
    def __init__(self, name, region, country, studentCount):
        # Initialise attributes
        pass

    def addStudents(self, count):
        # Add students to the institution
        pass

    def __str__(self):
        # Return formatted string representation
        pass

class InstitutionManager:
    def __init__(self):
        # Initialise with empty list of institutions
        pass

    def addInstitution(self, institution):
        # Add institution to the list
        pass

    def findByCountry(self, country):
        # Return list of institutions in given country
        pass

    def getTotalStudents(self):
        # Return total students across all institutions
        pass
```

---

### Task 4

In the `task-04.py` file, write functions that perform the following:

```python
import re

def validateEmail(email):
    """Validate email format using regex"""
    pass

def extractPhoneNumbers(text):
    """Extract all phone numbers from text (various formats)"""
    pass

def formatName(name):
    """Convert name to proper case (first letter of each word capitalized)"""
    pass

def generateSlug(title):
    """Convert title to URL-friendly slug (lowercase, spaces to hyphens, remove special chars)"""
    pass

def countWordFrequency(text):
    """Return dictionary with word frequency count (case-insensitive)"""
    pass
```

---

### Task 6

In the `task-06.py` file, write a function called `processData(data)` that takes a list of dictionaries and performs the following:

- Filters out any entries that do not have a "name" key
- Sorts the remaining entries by the "age" key (ascending)
- Returns the processed list

Here is an example of usage:

```python
data = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
    {"age": 40}
]
result = processData(data)
print(result) # [{"name": "Bob", "age": 25}, {"name": "Alice", "age": 30}]
```

---

### Task 7

In the `task-07.py` file, write a function called `processStudentData(students)` that takes a list of tuples containing student information in the format `(name, age, grade, subjects)` where `subjects` is a list of subject names. The function should return a dictionary containing:

Here is an example of usage:

```python
def processStudentData(students):
    """
    Input: List of tuples in format (name, age, grade, subjects)
    where subjects is a list of subject names
    
    Return a dictionary containing:
    - 'uniqueSubjects': Set of all unique subjects
    - 'averageAge': Average age of students
    - 'topStudents': List of students with grade >= 85
    - 'subjectCount': Dictionary mapping each subject to count of students taking it
    """
    pass

# Example input:
students = [
    ("Alice", 20, 88, ["Math", "Physics", "Chemistry"]),
    ("Bob", 19, 92, ["Math", "Biology"]),
    ("Carol", 21, 76, ["Physics", "Chemistry", "Biology"])
]
```

---

### Task 8

In the `task-08.py` file, write functions that perform the following:

```python
def processStudentFile(filePath):
    """
    Read a file containing student records (one per line):
    Format: "Name,Age,Grade1,Grade2,Grade3"
    
    Return:
    - Dictionary with student names as keys and average grades as values
    - Handle file not found errors gracefully
    - Skip any malformed lines
    """
    pass

def saveTopStudents(studentAverages, outputPath, threshold=85):
    """
    Save students with averages >= threshold to a new file
    Format: "Name: Average"
    """
    pass
```

---

### Task 9

In the `task-09.py` file, write two classes called `Book` and `Library`:

```python
class Book:
    def __init__(self, isbn, title, author, year):
        pass

class Library:
    def __init__(self):
        pass
    
    def addBook(self, book):
        pass
    
    def searchByTitle(self, title):
        pass
    
    def searchByAuthor(self, author):
        pass
    
    def saveToFile(self, filename):
        """Save library data to file"""
        pass
    
    def loadFromFile(self, filename):
        """Load library data from file"""
        pass
    
    def getBooksByYear(self, year):
        pass
    
    def removeBook(self, isbn):
        pass
```

---

### Task 10

In the `task-10.py` file, write classes to simulate the game of **Blackjack**:

---

## Next Class

Link to the next class: [Week 02](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s2-26/lecture-notes/week-week-02-lambda-fp-adts-design-patterns.md)
