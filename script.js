const add_section = document.querySelector('.add_section');
let sections = JSON.parse(localStorage.getItem('sections')) || [];

reload(sections);

function reload(arr) {
    const sectionsContainer = document.querySelector('.sections');
    sectionsContainer.innerHTML = '';

    arr.forEach((elem) => {
        sectionsContainer.innerHTML += `
            <div class="section" id="${elem.id}">
                <div class="name">
                    <h3>${elem.name}</h3>
                    <div class="count">${elem.todos.length}</div>
                </div>
                <div class="todos">
                    ${reloadTodo(elem.todos)}
                </div>
                <button class="add_todo">Add todo</button>
                <button class="delete_section">Delete section</button>
            </div>
        `;
    });

    addEventListeners();
}

function addEventListeners() {
    add_section.onclick = handleAddSection;

    document.querySelectorAll('.add_todo').forEach((button) => {
        button.onclick = handleAddTodo;
    });

    document.querySelector('.sections').addEventListener('change', handleCheckboxChange);
    document.querySelector('.sections').addEventListener('click', handleDeleteTodo);
    document.querySelector('.sections').addEventListener('click', handleDeleteSection);
}

function handleAddSection() {
    const name = prompt('Name of the section: ');

    if (name) {
        sections.push({
            id: Math.random(),
            name: name,
            todos: []
        });

        updateLocalStorage();
        reload(sections);
    }
}

function handleAddTodo(event) {
    if (event.target.classList.contains('add_todo')) {
        const section_id = +event.target.parentNode.id;
        const section = sections.find((elem) => elem.id === section_id);
        const todo_name = prompt('Name of the todo: ');

        if (todo_name) {
            section.todos.push({
                id: Math.random(),
                isDone: false,
                time: new Date(),
                name: todo_name
            });

            updateLocalStorage();
            reload(sections);
        }
    }
}

function handleCheckboxChange(event) {
    if (event.target.type === 'checkbox') {
        const todo_id = +event.target.closest('.todo').id;
        const section_id = +event.target.closest('.section').id;
        const section = sections.find((elem) => elem.id === section_id);
        const todo = section.todos.find((elem) => elem.id === todo_id);

        todo.isDone = event.target.checked;

        updateLocalStorage();
    }
}

function handleDeleteTodo(event) {
    if (event.target.closest('.delete')) {
        const todo_id = +event.target.closest('.todo').id;
        const section_id = +event.target.closest('.section').id;
        const section = sections.find((elem) => elem.id === section_id);

        section.todos = section.todos.filter((elem) => elem.id !== todo_id);

        updateLocalStorage();
        reload(sections);
    }
}

function handleDeleteSection(event) {
    if (event.target.classList.contains('delete_section')) {
        const section_id = +event.target.parentNode.id;
        sections = sections.filter((section) => section.id !== section_id);

        updateLocalStorage();
        reload(sections);
    }
}

function reloadTodo(arr) {
    return arr.map((elem) => `
        <div class="todo" id="${elem.id}">
            <div class="left__side">
                <input type="checkbox" ${elem.isDone ? 'checked' : ''}>
                <div class="title">
                    <h4>${elem.name}</h4>
                    <span class="date">${new Date(elem.time).toLocaleString()}</span>
                </div>
            </div>
            <div>
                <svg class="delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </div>
        </div>
    `).join('');
}

function updateLocalStorage() {
    localStorage.setItem('sections', JSON.stringify(sections));
}

addEventListeners();
