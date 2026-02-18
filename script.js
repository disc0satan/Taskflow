const taskInput = document.getElementById('task-input');
const categorySelect = document.getElementById('category-select');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const dateDisplay = document.getElementById('date-display');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `<div class="empty-state">✨ You're all caught up!</div>`;
    } else {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="task-info" onclick="toggleTask(${index})">
                    <span class="category-badge badge-${task.category}">${task.category}</span>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="delete-btn" onclick="animateDelete(${index})">Remove</button>
            `;
            taskList.appendChild(li);
        });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    
    if (text) {
        tasks.push({ text, category, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function animateDelete(index) {
    const items = document.querySelectorAll('li');
    const target = items[index];
    
    // Trigger CSS slide-out
    target.classList.add('slide-out');
    
    // Wait for animation to finish before removing from array
    setTimeout(() => {
        tasks.splice(index, 1);
        renderTasks();
    }, 300);
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

// Date Setup
const options = { weekday: 'long', month: 'short', day: 'numeric' };
dateDisplay.innerText = new Date().toLocaleDateString('en-US', options);

renderTasks();
