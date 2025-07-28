# Week 03

## Previous Class

Link to the previous class: [Week 02]()

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-03-formative-assessment** from **week-02-formative-assessment**.

---

## Open and Import Godot Project

Open **Godot** and import the project you created in the previous class. 

---

## Input Map

In the **Project** menu, select **Project Settings**. In the `Input Map` section, add the following actions:

- `left`
- `right`
- `jump`
- `shoot`

For each action, you can assign a key or button by clicking the **Add Key** button.

## Player

Open the `Player` scene you created in the previous class. 

Create a new script for the `Player` scene. In this script, you will handle player movement and actions.

In the script, add the following code to handle player movement:

```gdscript
extends CharacterBody2D

var direction_x := 0.0

@export var speed = 150

func _process(delta):
	get_input()
	apply_gravity()
	
	velocity.x = direction_x * speed
	move_and_slide()
		
func get_input():
	direction_x = Input.get_axis("left", "right")

	if Input.is_action_just_pressed("jump"):
		velocity.y = -200

func apply_gravity():
	velocity.y += 20
```

What is happening here:

- `move_and_slide()`: This function is used to move the player character while handling collisions automatically.

- `get_input()`: Checks for player input. It sets the `direction_x` variable based on the left and right input actions. If the jump action is pressed, it applies an upward velocity.
  
- `apply_gravity()`: Applies gravity to the player by increasing the vertical velocity. This simulates the effect of gravity pulling the player down.

Run the `Level1` scene to see the player in action. You should be able to move left and right and jump. However, the player will fall through the ground because we have not set up collision detection yet.

---

## Tilemap Collision



---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One


---


## Next Class

Link to the next class: [Week 03]()
