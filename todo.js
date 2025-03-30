const input = document.getElementById("inp");
const list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");

const tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (email) {
    document.getElementById(
      "user-email"
    ).textContent = `Current User Id : ${email}`;

    fetch(`/getUserTasks?email=${encodeURIComponent(email)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.tasks) {
          tasks.push(...data.tasks);
          renderTasks();
        }
      });  
  }  
});
  
function renderTasks() {
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("list-item");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.classList.toggle("completed", task.completed);

    const btns = document.createElement("span");
    btns.className = "btns-box";
  
    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit edit-btn";
    editIcon.addEventListener("click", () => editTask(index));

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash delete-btn";
    deleteIcon.addEventListener("click", () => deleteTask(index));

    const markIcon = document.createElement("i");
    markIcon.className = task.completed
      ? "fas fa-undo mark-btn"
      : "fas fa-check mark-btn";
    markIcon.addEventListener("click", () => toggleComplete(index));

    btns.appendChild(editIcon);
    btns.appendChild(deleteIcon);
    btns.appendChild(markIcon);

    li.appendChild(taskText);
    li.appendChild(btns);

    list.appendChild(li);
  });
}

function addTask() {
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    input.value = "";
    renderTasks();
    saveTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

function editTask(index) {
  const newText = prompt("Edit your Task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    renderTasks();
    saveTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
  saveTasks();
}

function saveTasks() {
  const email = new URLSearchParams(window.location.search).get("email");

  fetch("/saveTasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "saveTasks",
      email,
      tasks,
    }),
  })
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
    });
}

renderTasks();
addBtn.addEventListener("click", addTask);
