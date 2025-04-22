/* ========== DOM ELEMENTS ========== */
const button = document.querySelector(".add"); // Add Task button
const taskNameInput = document.getElementById("taskName"); // Task name input
const taskDeadlineInput = document.getElementById("taskDeadline"); // Deadline input
const taskPrioritySelect = document.getElementById("taskPriority"); // Priority dropdown

/* ========== UTILITY FUNCTIONS ========== */
/**
 * Generates a unique ID for each task
 * @returns {string} Unique ID combining timestamp and random string
 */
const uniqueId = () => {
    return Date.now() + "-" + Math.random().toString(36).slice(2,6);
};

/**
 * Shows a temporary notification popup
 * @param {string} message - The message to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation handling
    setTimeout(() => {
        notification.remove();
    },2000)
}

/* ========== TASK MANAGEMENT ========== */
let tasks = []; // Main tasks array

/**
 * Saves tasks to localStorage
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Loads tasks from localStorage
 */
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks = savedTasks;
        renderTasks();
    }
}

/**
 * Renders tasks to the UI
 * @param {Array} tasksToShow - Tasks to display (defaults to all tasks)
 */
const renderTasks = (tasksToShow = tasks) => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasksToShow.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = `task-item ${task.priority}`;
        taskElement.innerHTML = `
            <h3>Name: ${task.name}</h3>
            <p>Deadline: ${new Date(task.deadline).toDateString()}</p>
            <span class="priority">${task.priority}</span>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskList.appendChild(taskElement);
    });
}

/* ========== EVENT HANDLERS ========== */
/**
 * Handles task addition
 */
const addTask = () => {
    // Get and validate inputs
    const taskName = taskNameInput.value.trim();
    const taskDeadline = taskDeadlineInput.value;
    const taskPriority = taskPrioritySelect.value;

    if (!taskName) return alert("Task name cannot be empty");
    if (!taskDeadline) return alert("Please select a deadline");

    // Create and add new task
    const newTask = {
        id: uniqueId(),
        name: taskName,
        deadline: taskDeadline,
        priority: taskPriority
    };

    tasks.push(newTask);
    showNotification(`Added: ${taskName} (ID: ${newTask.id})`);
    
    // Reset and update
    taskNameInput.value = "";
    taskDeadlineInput.value = "";
    renderTasks();
    saveTasks();
};

/**
 * Handles task deletion via event delegation
 */
document.getElementById("taskList").addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = e.target.getAttribute('data-id');
        const deletedTask = tasks.find(task => task.id === taskId);
        tasks = tasks.filter(task => task.id !== taskId);
        
        showNotification(`Deleted: ${deletedTask.name} (ID: ${taskId})`);
        renderTasks();
        saveTasks();
    }
});

/**
 * Handles filtering and sorting
 */
document.querySelector('.filters').addEventListener('click', (e) => {
    if (!e.target.matches('button')) return;
    
    const buttonText = e.target.textContent.trim();
    
    if (buttonText === 'All Tasks') {
        renderTasks();
    }
    else if (buttonText === 'High Priority') {
        renderTasks(tasks.filter(task => task.priority === 'High'));
    }
    else if (buttonText === 'Medium Priority') {
        renderTasks(tasks.filter(task => task.priority === 'Medium'));
    }
    else if (buttonText === 'Low Priority') {
        renderTasks(tasks.filter(task => task.priority === 'Low'));
    }
    else if (buttonText === 'Sort by Deadline') {
        renderTasks([...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
    }
});

/* ========== INITIALIZATION ========== */
button.addEventListener("click", addTask);
loadTasks(); // Load saved tasks on startup