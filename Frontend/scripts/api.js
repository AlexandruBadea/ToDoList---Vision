const saveButton = document.querySelector('#addTask');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');

const uncompletedTaskContainer = document.querySelector('#uncompletedTasks');
const completedTaskContainer = document.querySelector('#completedTasks');

const delModal = new bootstrap.Modal(document.querySelector('#deleteModal'));
const confirmButton = document.querySelector('#confirmDelete');


//Alerts
const markCompletedAlert = document.getElementById("completedAlert");
const editAlert = document.getElementById("editedAlert");
const markUncompletedAlert = document.getElementById("uncompletedAlert");
const deleteAlert = document.getElementById("deletedAlert");


//Edit
const editTitleInput = document.querySelector('#editTitle');
const editDescriptionInput = document.querySelector('#editDescription');
const editSaveButton = document.querySelector('#editSaveBtn');
const editModal = new bootstrap.Modal(document.querySelector('#editModal'));


function addTask(title, description){
    const body = {
        title: title,
        description: description,
        isCompleted: false
    };

    fetch('https://localhost:7091/ToDo/api/create', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => console.log(response));
}

saveButton.addEventListener('click', function() {
    addTask(titleInput.value, descriptionInput.value);
    titleInput.value = '';
    descriptionInput.value = '';
    getAllUncompletedTasks();
    getAllUncompletedTasks();
});


function displayUncompletedTasks(tasks){
    let allTasks = '';
    tasks.forEach(element => {
        if(element.isCompleted == false){
            const taskElement = `
                <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.description}</p>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-success" onclick="markCompletedTask(${element.id})"><i class="bi bi-check2-square"></i></button>
                            <button type="button" class="btn btn-warning" onclick="showEditModal(${element.id}, '${element.title}', '${element.description}')"><i class="bi bi-pencil-square"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        
            allTasks += taskElement; 
        }
    });
    uncompletedTaskContainer.innerHTML = allTasks;
}

function displayCompletedTasks(tasks){
    let allTasks = '';
    tasks.forEach(element => {
        if(element.isCompleted == true){
            const taskElement = `
                <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.description}</p>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-primary" onclick="markUncompletedTask(${element.id})"><i class="bi bi-x-square"></i></button>
                            <button type="button" class="btn btn-danger" onclick="showDeleteModal(${element.id})"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        
            allTasks += taskElement; 
        }
    });
    completedTaskContainer.innerHTML = allTasks;
}

function getAllUncompletedTasks(){
    fetch('https://localhost:7091/ToDo/api/getAll')
    .then(data => data.json())
    .then(response => displayUncompletedTasks(response));
}

function getAllCompletedTasks(){
    fetch('https://localhost:7091/ToDo/api/getAll')
    .then(data => data.json())
    .then(response => displayCompletedTasks(response));
}

getAllUncompletedTasks();
getAllCompletedTasks();

function deleteTask(id){
    fetch(`https://localhost:7091/ToDo/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => {
        getAllCompletedTasks();
        delModal.hide();
    });
}

function showDeleteModal(id){
    delModal.show();
    confirmButton.addEventListener('click', function(){
        deleteTask(id);
    });
}

function editTask(id, title, desc){

    const body = {
        title: title,
        description: desc,
        isCompleted: false
    };

    fetch(`https://localhost:7091/ToDo/api/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        getAllUncompletedTasks();
        editModal.hide();
    });
}

function showEditModal(id, title, desc){
    editTitleInput.value = title;
    editDescriptionInput.value = desc;
    editModal.show();
    editSaveButton.addEventListener('click', function(){
        editTask(id, editTitleInput.value, editDescriptionInput.value);
    });
}



function markCompletedTask(id){
    fetch(`https://localhost:7091/ToDo/api/markCompleted/${id}`, {
        method: 'PUT',
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        getAllCompletedTasks();
        getAllUncompletedTasks();
        markCompletedAlert.classList.remove('display-none');
    });
}

function markUncompletedTask(id){
    fetch(`https://localhost:7091/ToDo/api/markUncompleted/${id}`, {
        method: 'PUT',
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        getAllCompletedTasks();
        getAllUncompletedTasks();
        markUncompletedAlert.classList.remove('display-none');
    });
}