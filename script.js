let formE1 = document.querySelector(`#task-form`);
let tasksToDoE1 = document.querySelector(`#tasks-to-do`);

let createTaskHandler = function(event) {

    event.preventDefault();

    let listItemE1 = document.createElement(`li`);
    listItemE1.className = `task-item`;
    listItemE1.textContent = `This is a new task`;
    tasksToDoE1.appendChild(listItemE1);
};
formE1.addEventListener(`submit`,createTaskHandler); 