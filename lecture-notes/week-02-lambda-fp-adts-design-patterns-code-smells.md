# Week 02

## Previous Class

Link to the previous class: [Week 01]()

---

## Before We Start

Open your **id608001-s2-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-02-lambda-fp-adts-design-patterns-code-smells** from the previous branch.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Lambda 

---

## Functional Programming (FP)

The **functional programming** paradigm treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. It emphasises the use of functions as first-class citizens, meaning that functions can be passed as arguments, returned from other functions, and assigned to variables.

---

### First-Class Functions

In **Python**, functions are first-class citizens. This means that you can treat functions like any other object. You can assign them to variables, pass them as arguments to other functions, and return them from other functions.

Here are examples of first-class functions in **Python**:

```python
# Assigning a function to a variable
def greet(name):
    return f"Hello, {name}!"

greeting = greet
print(greeting("Alice")) # Hello, Alice!

# Passing a function as an argument
def callFunction(func, arg):
    return func(arg)

print(callFunction(greet, "Bob")) # Hello, Bob!

# Returning a function from another function
def outerFunction():
    def innerFunction(name):
        return f"Hello, {name}!"
    return innerFunction

greet = outerFunction()
print(greet("Charlie")) # Hello, Charlie!
```

---

### Higher-Order Functions

A **higher-order function** is a function that either takes one or more functions as arguments or returns a function as its result. Higher-order functions are a key feature of functional programming and allow for greater abstraction and code reuse.

Here are some examples of higher-order functions in **Python**:

```python
# Higher-order function that takes a function as an argument
def applyFunction(func, value):
    return func(value)

print(applyFunction(greet, "David")) # Hello, David!

# Higher-order function that returns a function
def makeMultiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

double = makeMultiplier(2)
print(double(5)) # 10

triple = makeMultiplier(3)
print(triple(5)) # 15
```

---

### Pure Functions

A **pure function** is a function that, given the same input, will always return the same output and does not have any side effects (i.e., it does not modify any external state or variables). Pure functions are easier to reason about, test, and debug.

Here are some examples of pure functions in **Python**:

```python
# Pure function
def add(a, b):
    return a + b
print(add(2, 3)) # 5
print(add(2, 3)) # 5 input)

# Impure function
counter = 0
def increment():
    global counter
    counter += 1
    return counter
print(increment()) # 1
print(increment()) # 2 
```

### Recursion

**Recursion** is a programming technique where a function calls itself in order to solve a problem. Recursive functions typically have a base case that stops the recursion and a recursive case that breaks the problem down into smaller subproblems.

Here are some examples of recursion in **Python**:

```python
# Recursive function to calculate the factorial of a number
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1) 
print(factorial(5)) # 120

# Recursive function to calculate the nth Fibonacci number
def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)
print(fibonacci(6)) # 8
```

---

## Abstract Data Types (ADTs)

---

### Stack

---

### Queue


> **Note:**

---

### Tree

---

### Graph

---

## Design Patterns

---

## Next Class


