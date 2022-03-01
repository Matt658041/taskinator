let taskIdCounter = 0;

let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let pageContentEl = document.querySelector("#page-content");

let taskFormHandler = function(event) {
  event.preventDefault();
  let taskNameInput = document.querySelector("input[name='task-name']").value;
  let taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // check if task is new or one being edited by seeing if it has a data-task-id attribute
  let isEdit = formEl.hasAttribute("data-task-id");
//has data attribute, so get the task id and call function to complete edit process
  if (isEdit) {
    let taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
   else {
    let taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };

    createTaskEl(taskDataObj);
  }
};

let createTaskEl = function(taskDataObj) {
  let listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  let taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // create task actions (buttons and select) for task
  let taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  tasksToDoEl.appendChild(listItemEl);

  // increase task counter for next unique id
  taskIdCounter++;
};

let createTaskActions = function(taskId) {
  // create container to hold elements
  let actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  let editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);
  // create delete button
  let deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);
  // create change status dropdown
  let statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);
  // create status options
  let statusChoices = ["To Do", "In Progress", "Completed"];

  for (let i = 0; i < statusChoices.length; i++) {
    // create option element
    let statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

let completeEditTask = function(taskName, taskType, taskId) {
  // find task list item with taskId value
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");

  // remove data attribute from form
  formEl.removeAttribute("data-task-id");
  // update formEl button to go back to saying "Add Task" instead of "Edit Task"
  formEl.querySelector("#save-task").textContent = "Add Task";
};

let taskButtonHandler = function(event) {
  // get target element from event
  let targetEl = event.target;
  //edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    let taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
    //deleted button was clicked
  } else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    let taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

let taskStatusChangeHandler = function(event) {
  console.log(event.target.value);

  // find task list item based on event.target's data-task-id attribute
  var taskId = event.target.getAttribute("data-task-id");

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // convert value to lower case
  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
};

let editTask = function(taskId) {
  console.log(taskId);

  // get task list item element
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  let taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  let taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  // write values of taskname and taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form with a value of the task's id so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);
  // update form's button to reflect editing a task rather than creating a new one
  formEl.querySelector("#save-task").textContent = "Save Task";
};

let deleteTask = function(taskId) {
  console.log(taskId);
  // find task list element with taskId value and remove it
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

 