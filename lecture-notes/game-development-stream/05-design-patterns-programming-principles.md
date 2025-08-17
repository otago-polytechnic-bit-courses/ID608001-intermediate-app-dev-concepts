# Week 05 - Godot Design Patterns and Principles

## Previous Class

Link to the previous class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/game-development-stream/04-godot-signals-events.md)

---

## Overview

In this class, we will explore design patterns and programming principles that are essential for building scalable and maintainable games in Godot.

---

## Single Responsibility Principle

The **Single Responsibility Principle (SRP)** states that a script should have only one reason to change. In other words, a class or script should only have one job or responsibility.

Here is an example of a script that violates this principle:

```gdscript
# Bad
extends CharacterBody2D

@export var speed = 300
var health = 100
var score = 0
var inventory = []

func _ready():
	load_player_data()
	setup_ui()
	setup_audio()

func _process(delta):
	handle_movement()
	handle_combat()
	update_ui()

func handle_movement():
	pass

func handle_combat():
	pass

func update_ui():
	pass
```

How to implement the **Single Responsibility Principle** in **Godot**?

1. Instead of having one script that handles multiple aspects of a game object, i.e., movement, health, UI, etc., create separate scripts for each concern. 

2. Instead of having one script directly manipulate another script's properties, use signals to emit events that other scripts can listen for. 

3. Each script should have a clear and specific purpose. If a script starts to handle multiple concerns, consider refactoring it into smaller, more focused scripts.

---

## Don't Repeat Yourself (DRY)

The **Don't Repeat Yourself (DRY) principle** states that you should avoid duplicating code. Instead, you should abstract and reuse code wherever possible.

Here is an example of code that violates the **DRY principle**:

```gdscript
# Goblin.gd
extends CharacterBody2D
class_name Goblin

@export var speed = 150
var health = 50

func _ready():
	pass

func take_damage(amount):
	pass

func move_towards_player():
	pass

# Orc.gd
extends CharacterBody2D
class_name Orc

@export var speed = 100
var health = 100

func _ready():
	health = 100

func take_damage(amount):
	pass

func move_towards_player():
	pass
```

Here is an example of code that follows the **DRY principle**:

```gdscript
# Enemy.gd
extends CharacterBody2D
class_name Enemy

@export var speed = 100
@export var max_health = 50
var health

func _ready():
	health = max_health

func take_damage(amount):
	pass

func move_towards_player():
	pass

# Goblin.gd 
extends Enemy
class_name Goblin

func _ready():
	speed = 150
	max_health = 50
	super._ready()

# Orc.gd   
extends Enemy
class_name Orc

func _ready():
	speed = 100
	max_health = 100
	super._ready()
```

---

## Separation of Concerns

**Separation of Concerns (SoC)** is a **design principle** that encourages the separation of a game's concerns into distinct sections, each addressing a specific aspect of the game. 

Here is an example:

```gdscript
# PlayerInput.gd
extends Node
class_name PlayerInput

signal move_input(direction)
signal attack_input
signal jump_input

func _input(event):
	pass

func _process(delta):
	pass

# PlayerMovement.gd
extends CharacterBody2D

@export var speed = 300
var input_handler: PlayerInput

func _ready():
	pass

func _on_move_input(direction):
	pass

func _on_attack_input():
	pass

func _on_jump_input():
	pass

# PlayerHealth.gd
extends Node

@export var max_health = 100
var current_health

signal died
signal health_changed(health)

func _ready():
	pass

func take_damage(amount):
	pass

func heal(amount):
    pass
```

---

## Godot Design Patterns

1. **Godot's** scene system uses the **scene composition pattern** to compose complex objects from simpler, reusable components. Each component handles a specific functionality.

```gdscript
# Player (CharacterBody2D)
# ├── PlayerMovement (Node)  
# ├── PlayerHealth (Node)
# ├── PlayerInput (Node)
# └── Sprite2D

# PlayerMovement.gd
extends Node

@onready var player = get_parent()
@export var speed = 300

func move(direction):
	pass

# PlayerHealth.gd  
extends Node

@export var max_health = 100
var current_health

func _ready():
	pass

func take_damage(amount):
	pass
```

2. **Godot's** signal system implements the **observer pattern**, allowing objects to communicate without tight coupling.

```gdscript
# GameManager.gd
extends Node

func _ready():
	var player = $Player
	var ui = $UI
	
	player.health_changed.connect(ui._on_health_changed)

# Player.gd
extends CharacterBody2D

signal health_changed(health)

func take_damage(amount):
	pass

# UI.gd
extends Control

func _on_health_changed(health):
	pass
```

3. **State Pattern**: Used for managing different states of game objects like player states or game states.

```gdscript
# PlayerStateMachine.gd
extends Node

enum State { IDLE, RUNNING, JUMPING, ATTACKING }
var current_state = State.IDLE
@onready var player = get_parent()

func change_state(new_state):
	current_state = new_state
	
	match current_state:
		State.IDLE:
			handle_idle()
		State.RUNNING:
			handle_running()
		State.JUMPING:
			handle_jumping()
		State.ATTACKING:
			handle_attacking()

func handle_idle():
	player.velocity.x = 0

func handle_running():
	var input = Input.get_axis("ui_left", "ui_right")
	player.velocity.x = input * player.speed
```

4. **Command Pattern**: Useful for input handling and creating undoable actions.

```gdscript
# Command.gd
extends Resource
class_name Command

func execute():
	pass

func undo():
	pass

# MoveCommand.gd
extends Command
class_name MoveCommand

var actor: Node2D
var direction: Vector2
var distance: float

func _init(a: Node2D, dir: Vector2, dist: float):
	actor = a
	direction = dir
	distance = dist

func execute():
	actor.position += direction * distance

func undo():
	actor.position -= direction * distance
```

---

## Anti-Patterns

Here are some common anti-patterns to avoid in **Godot** development:

1. **Deep Node Dependencies**: Accessing nodes deep in the tree using long get_node() paths makes code fragile and hard to maintain.

```gdscript
# BAD: Deep node access
extends Node

func update_ui():
	get_node("../../UI/PlayerInfo/HealthBar").value = health
	get_node("../../UI/PlayerInfo/ScoreLabel").text = str(score)

# GOOD: Use signals or references
extends Node

signal health_changed(health)
signal score_changed(score)

func update_health(new_health):
	health = new_health
	health_changed.emit(health)
```

2. **Scene Bloat**: Putting too many nodes and scripts in a single scene makes it hard to manage and reuse.

```gdscript
# BAD: Everything in one scene
# Main (Node)
# ├── Player (CharacterBody2D) - 500 lines of code
# ├── Enemy1 (CharacterBody2D) - 300 lines of code  
# ├── Enemy2 (CharacterBody2D) - 300 lines of code
# ├── UI (Control) - 200 lines of code
# └── GameLogic (Node) - 400 lines of code

# GOOD: Separate scenes
# Main.tscn -> instances Player.tscn, Enemy.tscn, UI.tscn
# Each scene focuses on one responsibility
```

3. **Global State Overuse**: Using too many singletons/autoloads creates hidden dependencies and makes testing difficult.

```gdscript
# BAD: Everything as global state
# globals.gd (AutoLoad)
var player_health = 100
var player_score = 0
var current_level = 1
var enemy_positions = []
var ui_elements = {}

# GOOD: Use local state with communication
# Player.gd
extends CharacterBody2D

var health = 100
signal health_changed(health)

func take_damage(amount):
	health -= amount
	health_changed.emit(health)
```

4. **Tight Coupling**: Making nodes directly dependent on specific other nodes instead of using interfaces or signals.

```gdscript
# BAD: Tight coupling
extends CharacterBody2D

func _ready():
	var ui = get_node("../UI/HealthBar")  # Direct dependency
	var sound = get_node("../AudioManager")  # Direct dependency

func take_damage(amount):
	health -= amount
	get_node("../UI/HealthBar").value = health  # Tightly coupled
	get_node("../AudioManager").play("hurt")  # Tightly coupled

# GOOD: Loose coupling with signals
extends CharacterBody2D

signal health_changed(health)
signal took_damage

func take_damage(amount):
	health -= amount
	health_changed.emit(health)
	took_damage.emit()
```

---

## Next Class

Link to the next class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/game-development-stream/)