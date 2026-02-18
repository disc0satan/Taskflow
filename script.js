// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['General', 'Work', 'Personal'];
let currentFilter = 'all';

// Selectors
const taskList = document.getElementById('task-list');
const categorySelect = document.getElementById('category-select');
const categoryFilters = document.getElementById('category-filters');
const clearAllBtn = document.getElementById('clear-all-btn');

function init() {
    renderCategories();
    renderTasks();
    updateDate();
}

function updateDate() {
    const now = new Date();
    document.getElementById('day-name').innerText = now.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('full-date').innerText = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderCategories() {
    // Update Dropdown
    categorySelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Update Sidebar Filters
    categoryFilters.innerHTML = `<li class="filter-item ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">All Tasks</li>`;
    categories.forEach(cat => {
        categoryFilters.innerHTML += `<li class="filter-item ${currentFilter === cat ? 'active' : ''}" data-filter="${cat}">${cat}</li>`;
    });

    // Add Filter Listeners
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', () => {
            currentFilter = item.getAttribute('data-filter');
            renderTasks();
        });
    });
}

function renderTasks() {
    // 1. Filter
    let filteredTasks = currentFilter === 'all' ? tasks : tasks.filter(t => t.category === currentFilter);

    // 2. Sort by Date (ascending)
    filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Render
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<div class="empty-state">✨ You're all caught up!</div>`;
    } else {
        taskList.innerHTML = filteredTasks.map((task, index) => `
            <li class="${task.completed ? 'completed' : ''}">
                <div class="task-main">
                    <span class="task-cat-label">${task.category}</span>
                    <strong onclick="toggleTask(${index})">${task.text}</strong>
                    <span class="task-date-label">${task.date || 'No Date'}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
            </li>
        `).join('');
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('categories', JSON.stringify(categories));
    renderCategories(); // Keep active state in sync
}

function addTask() {
    const text = document.getElementById('task-input').value;
    const date = document.getElementById('date-input').value;
    const category = categorySelect.value;
    const newCat = document.getElementById('new-category-input').value.trim();

    // Handle Custom Category
    let finalCategory = category;
    if (newCat) {
        if (!categories.includes(newCat)) {
            categories.push(newCat);
        }
        finalCategory = newCat;
    }

    if (text && date) {
        tasks.push({ text, date, category: finalCategory, completed: false });
        document.getElementById('task-input').value = '';
        document.getElementById('new-category-input').value = '';
        renderTasks();
    } else {
        alert("Please add a task and a date!");
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

clearAllBtn.addEventListener('click', () => {
    if(confirm("Clear all tasks?")) {
        tasks = [];
        renderTasks();
    }
});

document.getElementById('add-btn').addEventListener('click', addTask);

init();
