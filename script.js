let taskIdCounter = 0;

let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let pageContentEl = document.querySelector("#page-content");

//creates an array to hold tasks for saving
let task = [];

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
      type: taskTypeInput,
      status: "to do"
    }

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

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }
//save task as object with the name, type, status, and id properties then push it into tasks array
  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  //save tasks to localStorage
  saveTasks();
  
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

  //loop through tasks array and task object with the new content
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
    
  }

  alert("Task Updated!");

  // remove data attribute from form
  formEl.removeAttribute("data-task-id");
  // update formEl button to go back to saying "Add Task" instead of "Edit Task"
  formEl.querySelector("#save-task").textContent = "Add Task";
  //save tasks to localStorage
  saveTasks();
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
  let taskId = event.target.getAttribute("data-task-id");

  // find the parent task item element based on the id 
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // convert value to lower case
  let statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  // update task's in tasks array
  for (let i = 0; i < tasks.length; i ++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  } 
  //save to local storage
  saveTasks()
};

let editTask = function(taskId) {
  console.log(taskId);  

  // get task list item element
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  let taskName = taskSelected.querySelector("h3.task-name").textContent;
  

  let taskType = taskSelected.querySelector("span.task-type").textContent;
  

  // write values of taskname and taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form with a value of the task's id so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);
  // update form's button to reflect editing a task rather than creating a new one
  formEl.querySelector("#save-task").textContent = "Save Task";
};

let deleteTask = function(taskId) {
  
  // find task list element with taskId value and remove it
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  taskSelected.remove();
  //create a new array to hold updated list of tasks
  let updatedTaskArr =[];
  //loop through current task
  for (let i=0; i < tasks.length; i ++) {
    //this means if tasks[id] doesnt match the value of task id lets keep task and push into new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
    let saveTasks = function() {
      localStorage.setItem("tasks",JSON.stringify (tasks));
    }
  }
  // reassign tasks array to the teh same as updatedTask Array
  tasks = updatedTaskArr;
  saveTasks();
};
let saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};


let loadTasks = function () {
  tasks = localStorage.getItem("tasks");
//if there are no tasks, set tasks to an empty arrat and return out of the function
  if (!savedtasks) {
      return false;
  }
  console.log("Saved Tasks found!");
  //else load up saved tasks

  //parse into an array of opjects
  savedTasks = JSON.parse(savedTasks);
  //loop into an array
  for (let i = 0; i < saveTasks.length; i++){
    //pass each object into the createtaskel function
    createTaskEl(savedTasks[i]);
  }
};
// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

 