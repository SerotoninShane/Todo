# Todo List App

This JavaScript application provides an interactive todo list interface with features for managing tasks, categorizing them by lists, and viewing their details. The application includes functionalities for adding, deleting, and sorting tasks, as well as managing and filtering by lists.

## Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Classes and Functions](#classes-and-functions)
  - [createDiv Function](#creatediv-function)
  - [TaskViewManager Class](#taskviewmanager-class)
  - [ListManager Class](#listmanager-class)
  - [TodoManager Class](#todomanager-class)
  - [UI Class](#ui-class)
- [Todo List Functionalities](#todo-list-functionalities)
- [Event Handling](#event-handling)
- [User Interface (UI) Interaction](#user-interface-ui-interaction)
- [How to Use](#how-to-use)
- [Example Usage](#example-usage)

## Overview

This JavaScript-based todo list app allows users to manage tasks, categorize them into lists, and view their details. Users can add new lists, delete existing ones, and filter tasks based on the selected list. The app also provides functionality to sort tasks by due date and update counters for upcoming and today's tasks.

## File Structure

The code contains the following main components:

- **`createDiv` Function**: A utility function to dynamically create HTML `div` elements with specified classes and content.
- **`TaskViewManager` Class**: Manages task view functionalities, including selecting tasks, updating task details, and handling the UI for task interactions.
- **`ListManager` Class**: Handles list management functionalities, such as creating new lists, deleting lists, and updating list-related UI elements.
- **`TodoManager` Class**: Manages todo-related functionalities, including adding new todos, deleting todos, sorting todos, and updating counters.
- **`UI` Class**: Controls user interface interactions and updates the todo list view based on user actions.
- **Initialization and Event Listeners**: Sets up the UI display and initializes event listeners for user interactions.

## Classes and Functions

### `createDiv` Function

```javascript
function createDiv(classes, content) {
    const div = document.createElement('div');
    div.classList.add(...classes);
    div.textContent = content;
    return div;
}
```

**Purpose**: A helper function to create a div element with specified CSS classes and content.

**Parameters**:

- `classes`: An array of class names to be applied to the div.
- `content`: The text content to be added inside the div.

### `TaskViewManager` Class

Handles functionalities related to displaying and interacting with individual tasks:

**Static Properties**:
- `selectedTask`: Stores the currently selected task.
- `taskDetails`: Stores details of the selected task.

**Methods**:
- `selectTask(element)`: Handles logic when a task is selected.
- `updateTaskView()`: Updates the task view based on the selected task.
- `toggleTaskDetails()`: Toggles the visibility of task details.

### `ListManager` Class

Manages the creation, deletion, and updating of task lists:

**Static Properties**:
- `lists`: Stores the current lists.
- `activeList`: Stores the currently selected list.

**Methods**:
- `createList(name)`: Creates a new list with the given name.
- `deleteList(name)`: Deletes the specified list.
- `updateListCounters()`: Updates the counter next to each list.

### `TodoManager` Class

Handles todo-related functionalities:

**Static Properties**:
- `todos`: Stores the list of todos.
- `counters`: Stores counters for 'Upcoming' and 'Today' todos.

**Methods**:
- `addTodo(task)`: Adds a new todo item.
- `deleteTodo(id)`: Deletes a todo item by its ID.
- `sortTodos(byDate)`: Sorts todos based on due date.
- `updateCounters()`: Updates the counters for 'Upcoming' and 'Today' todos.

### `UI` Class

Controls the user interface and updates the view:

**Static Properties**:
- References to UI elements such as `.left`, `.right`, and `.task-view`.

**Methods**:
- `initialize()`: Initializes UI elements and event listeners.
- `updateUI()`: Updates the user interface based on user interactions.
- `renderLists()`: Renders the list of available lists.

## Todo List Functionalities

### Task Management

- **Add Task**: Users can add new tasks to the list, specifying details and due dates.
- **Delete Task**: Tasks can be deleted from the list.
- **Sort Tasks**: Tasks can be sorted by their due dates.

### List Management

- **Create List**: Users can create new lists for categorizing tasks.
- **Delete List**: Users can delete existing lists.
- **Filter Tasks**: Tasks can be filtered based on the selected list.

### Counters and Sorting

- **Upcoming and Today's Counters**: The app displays counters for 'Upcoming' and 'Today' tasks.
- **Sorting**: Tasks can be sorted based on due dates.

## Event Handling

Events are handled through various methods in the `TaskViewManager`, `ListManager`, and `TodoManager` classes. Event listeners are attached to UI elements to manage user interactions, such as adding, deleting, and sorting tasks.

## User Interface (UI) Interaction

The user interface is dynamic and updates based on user interactions:

- **Task View**: The `TaskViewManager` class updates the task view when tasks are selected.
- **List Management**: The `ListManager` class handles creating, deleting, and updating lists.
- **Todo Management**: The `TodoManager` class manages todos and updates counters.

## How to Use

1. **Initialize the App**: The app initializes with the current state of tasks and lists.
2. **Manage Tasks**: Use the provided methods to add, delete, or sort tasks.
3. **Manage Lists**: Create and delete lists as needed. Filter tasks based on the selected list.
4. **View Details**: Click on tasks to view their details and toggle visibility.

## Example Usage

To see this code in action, ensure your HTML has a structure compatible with the class queries and contains the necessary elements (e.g., `.left`, `.right`, `.task-view`, etc.).

Upon setting up the HTML and JavaScript, the todo list app will allow users to interact with tasks and lists, providing a comprehensive task management interface.
