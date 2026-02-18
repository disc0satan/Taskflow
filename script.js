// 1. DATA INITIALIZATION
// We pull from LocalStorage or start fresh
let tasks = JSON.parse(localStorage.getItem('neonTasks')) || [];
let customCategories = JSON.parse(localStorage.getItem('neonCats')) || [];

// 2. DOM ELEMENTS
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const allDoneMsg = document.getElementById('allDoneMsg');
const filterSelect = document.getElementById('filterSelect');

// 3. INITIALIZE APP
function init() {
    loadCategoryDropdowns(); // Fill the dropdowns with custom tags
    renderTasks();           // Show the tasks
}

// 4. ADD CUSTOM CATEGORY LOGIC
function addCustomCategory() {
    const nameInput = document.getElementById('newCatName');
    const colorInput = document.getElementById('newCatColor');
    const name = nameInput.value.toLowerCase().trim();
    const color = colorInput.value;

    if (!name) return alert("Enter a category name!");
    
    // Check if category already exists
    const exists = customCategories.find(c => c.name === name);
    if (exists) return alert("Category already exists!");

    // Save to our custom category list
    customCategories.push({ name, color });
    localStorage.setItem('neonCats', JSON.stringify(customCategories));
    
    // Refresh UI
    loadCategoryDropdowns();
    nameInput.value = "";
    console.log("Category Added:", name);
}

// 5. UPDATE DROPDOWNS
function loadCategoryDropdowns() {
    const defaults = `
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="social">Social</option>
        <option value="school">School</option>
    `;
    
    let customHtml = "";
    customCategories.forEach(cat => {
        customHtml += `<option value="${cat.name}">${cat.name.toUpperCase()}</option>`;
    });

    // Update both the "Add Task" dropdown and the "Filter" dropdown
    categoryInput.innerHTML = defaults + customHtml;
    filterSelect.innerHTML = `<option value="all">ALL_SYSTEMS</option>` + defaults + customHtml;
}

// 6. ADD TASK LOGIC
addBtn.onclick = () => {
    if (taskInput.value.trim() === "") return;

    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        category: categoryInput.value,
        date: dateInput.value || "No Deadline",
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = "";
};

// 7. RENDER & FILTER LOGIC
function renderTasks() {
    taskList.innerHTML = "";
    const filterValue = filterSelect.value;
    
    // Logic: If filter is "all", show everything. Otherwise, match category.
    const filteredTasks = tasks.filter(t => {
        if (filterValue === "all") return true;
        return t.category === filterValue;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        
        // Find if this is a custom category to get its color
        const customCat = customCategories.find(c => c.name === task.category);
        
        li.className = `task-item ${task.category} ${task.completed ? 'completed' : ''}`;
        
        // Apply dynamic neon color if it's a custom category
        if (customCat && !task.completed) {
            li.style.borderColor = customCat.color;
            li.style.boxShadow = `0 0 10px ${customCat.color}`;
            li.style.color = customCat.color;
        }

        li.innerHTML = `
            <div>
                <strong>${task.text}</strong> <br>
                <small>${task.date} [${task.category.toUpperCase()}]</small>
            </div>
            <div class="actions">
                <button onclick="toggleDone(${task.id})">DONE</button>
                <button onclick="deleteTask(${task.id})">DEL</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    checkAllDone();
}

// 8. UTILS
function toggleDone(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('neonTasks', JSON.stringify(tasks));
    renderTasks();
}

function clearAll() {
    if(confirm("WIPE SYSTEM MEMORY?")) {
        tasks = [];
        saveAndRender();
    }
}

function checkAllDone() {
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
        allDoneMsg.classList.remove('hidden');
    } else {
        allDoneMsg.classList.add('hidden');
    }
}
function removeCategory() {
    const catToRemove = document.getElementById('categoryInput').value;
    
    // Don't allow removing default system categories
    const defaults = ['work', 'personal', 'social', 'school'];
    if (defaults.includes(catToRemove)) {
        alert("SYSTEM PROTECTED: Cannot delete default categories.");
        return;
    }

    if (confirm(`Delete category [${catToRemove.toUpperCase()}]?`)) {
        // Remove from list
        customCategories = customCategories.filter(c => c.name !== catToRemove);
        // Save back to memory
        localStorage.setItem('neonCats', JSON.stringify(customCategories));
        // Refresh UI
        loadCategoryDropdowns();
        renderTasks(); 
    }
}

// START THE SYSTEM
init();