// Static class for managing header functionality
class StaticElementManager {
  static header;
  static hoverArea;

  static init() {
    StaticElementManager.header = document.querySelector('header');
    StaticElementManager.hoverArea = document.createElement('div');
    StaticElementManager.hoverArea.id = 'hover-area';
    document.body.appendChild(StaticElementManager.hoverArea);
    
    StaticElementManager.setupHoverArea();
    StaticElementManager.hideHeader();
    StaticElementManager.displayDate();
  } 

  static setupHoverArea() {
    let timeout;

    const hideHeader = () => {
      timeout = setTimeout(() => {
        StaticElementManager.header.classList.add('hidden');
      }, 3000); // Adjust delay as needed
    };

    const showHeader = () => {
      clearTimeout(timeout);
      StaticElementManager.header.classList.remove('hidden');
    };

    StaticElementManager.hoverArea.addEventListener('mouseenter', showHeader);
    StaticElementManager.hoverArea.addEventListener('mouseleave', hideHeader);
  }

  static hideHeader() {
    StaticElementManager.header.classList.add('hidden');
  }

  static showHeader() {
    StaticElementManager.header.classList.remove('hidden');
  }

  static displayDate() {
    const dateElement = document.getElementById('today-date');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerText = today.toLocaleDateString('en-US', options);
  }
}

// Static class for managing Todos
class TodoManager {
  static todos = [];

  static init() {
    const addTaskButton = document.getElementById('add-task');
    addTaskButton.addEventListener('click', () => TodoManager.addTodo());
    TodoManager.loadTodos(); // Load todos from local storage on page load
  }

  static loadTodos() {
    console.log('TodoManager: loadTodos')
    TodoManager.todos = JSON.parse(localStorage.getItem('todos')) || [];
    TodoRenderer.init(); // Initialize TodoRenderer before rendering todos

    // TodoRenderer.renderTodos(); // Update rendering after loading todos
    TagAndSortManager.showInProgressTodos(); // Page load pre sorted render

    TagAndSortManager.updateCounters(); // Update counters after loading todos
  }

  static saveTodos() {
    console.log('TodoManager: saveTodos')
    localStorage.setItem('todos', JSON.stringify(TodoManager.todos));
    TagAndSortManager.updateCounters(); // Update counters after saving todos
  }

  static addTodo() {
    console.log('TodoManager: addTodo')
    const newTaskInput = document.getElementById('new-task');
    const newTask = newTaskInput.value.trim();

    if (newTask) {
      TodoManager.todos.push({
        task: newTask,
        completed: false,
      });

      TodoManager.saveTodos();
      TodoRenderer.renderTodos(); // Update rendering after adding todo
      newTaskInput.value = ''; // Clear input field
    }
  }
}

// Static class for rendering todos
class TodoRenderer {
  static todoList;

  static init() {
    TodoRenderer.todoList = document.getElementById('todo-list');
  }

  static renderTodos(todos = TodoManager.todos) {
    console.log('TodoRenderer: renderTodos')
    if (!TodoRenderer.todoList) return;

    TodoRenderer.todoList.innerHTML = '';
  
    // Ensure todos is always an array
    if (!Array.isArray(todos)) {
      todos = [todos];
    }
  
  
  todos.forEach((todo, index) => {
    // Create the list item element for the todo
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    todoItem.dataset.index = index;
    Object.assign(todoItem.style, {
      display: 'flex',
      flexDirection: 'column',
    });

    // Create the container for the todo content
    const todoContent = document.createElement('div');
    todoContent.classList.add('todo-content');
    Object.assign(todoContent.style, {
      display: 'flex',
      alignItems: 'center',
    });

    // Create the color indicator element
    const colorIndicator = document.createElement('span');
    colorIndicator.classList.add('color-indicator');
    colorIndicator.style.backgroundColor = todo.color || '#ffffff';  // Set initial value if color exists

    // Create the label element for the task text
    const label = document.createElement('label');
    label.innerText = todo.task;
    if (todo.completed) label.classList.add('completed');

  
    // Create the arrow element
    const arrow = document.createElement('span');
    arrow.classList.add('arrow');
    arrow.innerHTML = '&#9654;'; // Unicode for right arrow
  
    // Create a date element to display the due date
    const dateElement = document.createElement('span');
    dateElement.classList.add('todo-date');

    // Check if the todo item has a due date
    if (todo.dueDate) {
      // Create a Date object and add one day to get the proper day showing
      const date = new Date(todo.dueDate);
      date.setDate(date.getDate() + 1);

      // Format the date as "Month Day, Year" (e.g., "January 1, 2024")
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      dateElement.innerText = date.toLocaleDateString('en-US', options);
    } else {
      // If no due date, set the inner text to an empty string
      dateElement.innerText = '';
    }

      // Create the list element to display the list name
      const listElement = document.createElement('span');
      listElement.classList.add('todo-list');
      listElement.innerText = todo.list ? `${dateElement.innerText == '' ? '': ' | '}${todo.list}` : '';
  
      // Append elements to the todoContent div
      todoContent.appendChild(colorIndicator);
      todoContent.appendChild(label);
      todoContent.appendChild(arrow);
  
      // Append the todoContent and dateElement to the todoItem
      todoItem.appendChild(todoContent);
      dateElement.appendChild(listElement);
      todoItem.appendChild(dateElement);
  
      todoItem.addEventListener('click', () => {
        TaskViewManager.showTodoInfo(todo);
      });
  
      // Append the todoItem to the todoList (assuming TodoRenderer.todoList exists)
      if (!TodoRenderer.todoList) return;
      TodoRenderer.todoList.appendChild(todoItem);
    });
  }

  // Filters todos by the specified list and renders them
  static renderTodosByList(list) {
    console.log('TodoRenderer: renderTodosByList')
    const filteredTodos = TodoManager.todos.filter(todo => todo.list === list);
    TodoRenderer.renderTodos(filteredTodos);
  }

  // Saves the current list of todos to local storage
  static saveTodos() {
    console.log('TodoRenderer: saveTodos')
    localStorage.setItem('todos', JSON.stringify(TodoManager.todos));
  }
}

// Static class for managing task view section functionality
class TaskViewManager {
  static taskView;
  static closeButton;
  static todoInfoContainer; // Container to hold todo information
  static listSelect; // Select element for lists

  static init() {
    TaskViewManager.taskView = document.querySelector('.right');
    TaskViewManager.closeButton = document.querySelector('.close-button');
    TaskViewManager.todoInfoContainer = document.querySelector('.task-list');
    TaskViewManager.listSelect = document.createElement('select');
    TaskViewManager.setupListSelect();
    TaskViewManager.setupCloseButton();
    TaskViewManager.updateListSelect(); // Initialize list options
  }
  static setupCloseButton() {
    if (TaskViewManager.closeButton) {
      TaskViewManager.closeButton.addEventListener('click', () => {
        TaskViewManager.closeTaskView();
      });
    }
  }

  static openTaskView() {
    if (TaskViewManager.taskView) {
      TaskViewManager.taskView.style.display = 'block';
    }
  }

  static closeTaskView() {
    if (TaskViewManager.taskView) {
      TaskViewManager.taskView.style.display = 'none';
    }
  }

  static showTodoInfo(todo) {
    // Clear previous content
    if (TaskViewManager.todoInfoContainer) {
      TaskViewManager.todoInfoContainer.innerHTML = '';

      // Create elements for the task view
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('task');

      const closeButton = document.createElement('button');
      closeButton.classList.add('close-button');
      closeButton.textContent = 'x';
      closeButton.addEventListener('click', TaskViewManager.closeTaskView);

      const taskContent = document.createElement('div');
      taskContent.classList.add('task-content');

      const taskTitle = document.createElement('h4');
      taskTitle.textContent = 'Task:';

      const nameInput = document.createElement('input');
      nameInput.setAttribute('type', 'text');
      nameInput.setAttribute('placeholder', 'NAME OF TASK');
      nameInput.classList.add('name-input');
      nameInput.value = todo.task;

      // Color selector using input type="color"
      const colorInput = document.createElement('input');
      colorInput.setAttribute('type', 'color');
      colorInput.classList.add('color-input');
      colorInput.value = todo.color || '#ffffff'; // Set initial value if color exists

      let originalColor = todo.color; // Use let for reassignment

      const descriptionInput = document.createElement('textarea');
      descriptionInput.setAttribute('placeholder', 'Description');
      descriptionInput.classList.add('description-input');
      descriptionInput.value = todo.description || '';

      const itemsList = document.createElement('ul');
      if (Array.isArray(todo.items)) {
        todo.items.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item;
          itemsList.appendChild(listItem);
        });
      }

      const dueDateContainer = document.createElement('div');
      dueDateContainer.classList.add('due-date-container');

      const dueDateInput = document.createElement('input');
      dueDateInput.type = 'date';
      dueDateInput.classList.add('due-date-input');
      dueDateInput.value = todo.dueDate || ''; // Set initial value if dueDate exists

      let originalDueDate = todo.dueDate; // Use let for reassignment

      dueDateContainer.appendChild(dueDateInput);

      const listContainer = document.createElement('div');
      listContainer.classList.add('list-container');

      const listLabel = document.createElement('label');
      listLabel.textContent = 'List:';

      const listSelect = document.createElement('select');
      listSelect.classList.add('listSelect');

      listSelect.appendChild(document.createElement('option'));

      ListManager.lists.forEach(list => {
        const option = document.createElement('option');
        option.value = list;
        option.textContent = list;
        if (todo.list === list) {
          option.selected = true;
        }
        listSelect.appendChild(option);
      });

      listContainer.appendChild(listLabel);
      listContainer.appendChild(listSelect);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button', 'TaskViewButton');
      deleteButton.textContent = 'Delete Task';
      deleteButton.addEventListener('click', () => {
        // Implement deletion logic
        const index = TodoManager.todos.findIndex(t => t.task === todo.task);
        if (index !== -1) {
          TodoManager.todos.splice(index, 1);
          TodoManager.saveTodos();
          TodoRenderer.renderTodos();
          TaskViewManager.closeTaskView();
        }
      });

      const saveButton = document.createElement('button');
      saveButton.classList.add('save-button', 'TaskViewButton');
      saveButton.textContent = 'Save Changes';
      saveButton.addEventListener('click', () => {
        // Update todo with new values from inputs
        todo.task = nameInput.value;
        todo.description = descriptionInput.value;
        todo.dueDate = dueDateInput.value; // Update dueDate

        // Only update color if it has changed
        if (colorInput.value !== originalColor) {
          todo.color = colorInput.value;
          originalColor = colorInput.value; // Update original color
        }

        if (dueDateInput.value !== originalDueDate) {
          todo.dueDate = dueDateInput.value;
          originalDueDate = dueDateInput.value; // Update original dueDate
        }

        // Update todo items, assuming they're stored in an array and parsed correctly
        const updatedItems = [];
        itemsList.childNodes.forEach(node => {
          if (node.textContent.trim() !== '') {
            updatedItems.push(node.textContent.trim());
          }
        });
        todo.items = updatedItems;
        // Update list
        todo.list = listSelect.value;

        TodoManager.saveTodos();
        TodoRenderer.renderTodos();
        TaskViewManager.showTodoInfo(todo);
      });

      const completedButton = document.createElement('button');
      completedButton.classList.add('completed-button', 'TaskViewButton');
      completedButton.textContent = todo.completed == true ? 'Unmark As Completed' : 'Mark As Completed';
      completedButton.addEventListener('click', () => {
        todo.completed = !todo.completed;
        TodoManager.saveTodos();
        TodoRenderer.renderTodos();
        TaskViewManager.showTodoInfo(todo);
      });

      

      // Append elements to taskContent
      const taskTop = document.createElement('div')
      taskTop.style.display = 'flex'
      taskTop.appendChild(colorInput);
      taskTop.appendChild(taskTitle);
      taskContent.appendChild(taskTop);
      taskContent.appendChild(nameInput);
      taskContent.appendChild(descriptionInput);
      taskContent.appendChild(itemsList);
      taskContent.appendChild(dueDateContainer);
      taskContent.appendChild(listContainer);

      // Append taskContent and buttons to taskDiv
      taskDiv.appendChild(closeButton);
      taskDiv.appendChild(taskContent);

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');
      buttonContainer.appendChild(deleteButton);
      buttonContainer.appendChild(saveButton);
      taskDiv.appendChild(buttonContainer);
      taskDiv.appendChild(completedButton);
      

      // Append taskDiv to todoInfoContainer
      TaskViewManager.todoInfoContainer.appendChild(taskDiv);

      // Show the task view section
      document.querySelector('.right').style.display == 'block' ? TaskViewManager.closeTaskView() : TaskViewManager.openTaskView()
    }
  }

  static updateListSelect() {
    if(document.querySelector('.listSelect')) {
    document.querySelector('.listSelect').innerHTML = ''
    document.querySelector('.listSelect').appendChild(document.createElement('option'));
    ListManager.lists.forEach(list => {
      const option = document.createElement('option');
      option.value = list;
      option.textContent = list;
      document.querySelector('.listSelect').appendChild(option);
    });
  }
  }

  static setupListSelect() {
    TaskViewManager.updateListSelect();
      TaskViewManager.listSelect.addEventListener('change', () => {
        const selectedList = TaskViewManager.listSelect.value;
        TaskViewManager.renderTasks(selectedList);
      });
    }
}

// Static class for managing tags, sorting, and counters
class TagAndSortManager {
  static init() {
    const upcomingBadge = document.querySelector('.badge.upcoming').parentElement;
    const totalBadge = document.querySelector('.badge.total').parentElement;
    const overdueBadge = document.querySelector('.badge.overdue').parentElement;
    const completedBadge = document.querySelector('.badge.completed').parentElement;

    upcomingBadge.addEventListener('click', () => {
      TagAndSortManager.setActiveFilter(upcomingBadge);
      TagAndSortManager.showTodayTodos();
    });

    totalBadge.addEventListener('click', () => {
      TagAndSortManager.setActiveFilter(totalBadge);
      TagAndSortManager.showInProgressTodos();
    });

    overdueBadge.addEventListener('click', () => {
      TagAndSortManager.setActiveFilter(overdueBadge);
      TagAndSortManager.showOverdueTodos();
    });

    completedBadge.addEventListener('click', () => {
      TagAndSortManager.setActiveFilter(completedBadge);
      TagAndSortManager.showCompletedTodos();
    });

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      TagAndSortManager.searchTodos(e.target.value);
    });

    TagAndSortManager.setActiveFilter(totalBadge);
  }

  static setActiveFilter(element) {
    console.log('[X] TagAndSortManager: setActiveFilter')
    // Remove active class from all filters
    document.querySelectorAll('.tasks div').forEach(div => {
      div.classList.remove('active');
    });
    element.classList.add('active');
  }

  static showInProgressTodos() {
    console.log('TagAndSortManager: showInProgressTodos')
    const filteredTodos = TodoManager.todos.filter(todo => !todo.completed);
    TodoRenderer.renderTodos(filteredTodos);
  }

  static showTodayTodos() {
    console.log('TagAndSortManager: showTodayTodos')
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];

    const filteredTodos = TodoManager.todos.filter(todo => {
      return todo.dueDate && todo.dueDate >= todayDate && !todo.completed;
    });

    filteredTodos.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });

    TodoRenderer.renderTodos(filteredTodos);
  }

  static showOverdueTodos() {
    console.log('TagAndSortManager: showOverdueTodos')
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];

    const overdueTodos = TodoManager.todos.filter(todo => {
      return todo.dueDate && todo.dueDate < todayDate && !todo.completed;
    });

    TodoRenderer.renderTodos(overdueTodos);
  }

  static showCompletedTodos() {
    console.log('TagAndSortManager: showCompletedTodos')
    const completedTodos = TodoManager.todos.filter(todo => todo.completed);
    TodoRenderer.renderTodos(completedTodos);
  }

  static searchTodos(pattern) {
    console.log('TagAndSortManager: searchTodos')
    const regex = new RegExp(pattern, 'i');
    const filteredTodos = TodoManager.todos.filter(todo => regex.test(todo.text));
    TodoRenderer.renderTodos(filteredTodos);
  }

  static updateCounters(total, upcoming, overdue, completed) {
    console.log('TagAndSortManager: updateCounters')
    document.querySelector('.badge.total').textContent = TodoManager.todos.filter(todo => !todo.completed).length;
    document.querySelector('.badge.upcoming').textContent = upcoming !== undefined ? upcoming : TagAndSortManager.getUpcomingCount();
    document.querySelector('.badge.overdue').textContent = overdue !== undefined ? overdue : TagAndSortManager.getOverdueCount();
    document.querySelector('.badge.completed').textContent = completed !== undefined ? completed : TagAndSortManager.getCompletedCount();
  }

  static getUpcomingCount() {
    console.log('[X] TagAndSortManager: getUpcomingCount')
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    return TodoManager.todos.filter(todo => todo.dueDate && todo.dueDate >= todayDate && !todo.completed).length;
  }

  static getOverdueCount() {
    console.log('[X] TagAndSortManager: getOverdueCount')
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    return TodoManager.todos.filter(todo => todo.dueDate && todo.dueDate < todayDate && !todo.completed).length;
  }

  static getCompletedCount() {
    console.log('[X] TagAndSortManager: getCompletedCount')
    return TodoManager.todos.filter(todo => todo.completed).length;
  }
}


class ListManager {
  static lists = []; // Initialize an empty array to store lists

  static init() {
    ListManager.loadLists();
    ListManager.renderLists();
    ListManager.setupEventListeners();
  }

  static loadLists() {
    // Load lists from localStorage if available
    const savedLists = JSON.parse(localStorage.getItem('lists'));
    if (savedLists) {
      ListManager.lists = savedLists;
    }
  }

  static saveLists() {
    // Save lists to localStorage
    localStorage.setItem('lists', JSON.stringify(ListManager.lists));
  }

  static addList(name) {
    if (!ListManager.lists.includes(name)) {
      ListManager.lists.push(name);
      console.log(ListManager.lists)
      ListManager.saveLists();
      ListManager.renderLists();
      TaskViewManager.updateListSelect(); // Update TaskViewManager list selection
    }
  }
  
  static deleteList(name) {
    const index = ListManager.lists.indexOf(name);
    if (index !== -1) {
      ListManager.lists.splice(index, 1);
      ListManager.saveLists();
      ListManager.renderLists();
      TaskViewManager.updateListSelect(); // Update TaskViewManager list selection
    }
  }

  static renderLists() {
    const listItems = document.querySelector('.list-items');
    listItems.innerHTML = '';

      ListManager.lists.forEach(list => {
        const listContainer = document.createElement('div');
        listContainer.classList.add('list-container');

        const listName = document.createElement('span');
        listName.textContent = list;

        const listCounter = document.createElement('span');
        listCounter.textContent = TodoManager.todos.filter(todo => todo.list === list).length;
        listCounter.classList.add('badge');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
          ListManager.deleteList(list);
        });

        const listLeftFormat = document.createElement('div');
        listLeftFormat.appendChild(deleteButton);
        listLeftFormat.appendChild(listName);
        listContainer.appendChild(listLeftFormat);
        listContainer.appendChild(listCounter);
        listItems.appendChild(listContainer);

        listContainer.addEventListener('click', () => {
          // Toggle active class on the clicked list container
          listContainer.classList.toggle('active');
  
          // Render tasks for the selected list
          console.log(TodoManager.todos)
          const filteredTodos = TodoManager.todos.filter(todo => todo.list == list);
          TodoRenderer.renderTodos(filteredTodos);
        });
      });

  }

  static setupEventListeners() {
    const addListButton = document.getElementById('add-list-button');
    const newListInput = document.getElementById('new-list-input');
  
    function handleAddList() {
      const newListName = newListInput.value.trim();
      if (newListName !== '') {
        ListManager.addList(newListName);
        newListInput.value = ''; // Clear input field after adding
      }
    }
  
    addListButton.addEventListener('click', handleAddList);
    newListInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddList();
    });
  }
}

// Initialize app components
document.addEventListener('DOMContentLoaded', () => {
  StaticElementManager.init();
  TagAndSortManager.init();
  TodoManager.init();
  TaskViewManager.init();
  ListManager.init();
  TaskViewManager.setupCloseButton();
});
