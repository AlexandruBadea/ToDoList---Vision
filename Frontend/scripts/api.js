//Add task
const saveButton = document.querySelector('#addTask');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const uncompletedTaskContainer = document.querySelector('#uncompletedTasks');
const completedTaskContainer = document.querySelector('#completedTasks');
const addError = document.querySelector('#addError');

//Delete
const delModal = new bootstrap.Modal(document.querySelector('#deleteModal'));
const confirmButton = document.querySelector('#confirmDelete');

//Alerts
const addedAlert = new bootstrap.Toast(document.querySelector('#addedAlert'));
const completedAlert = new bootstrap.Toast(document.querySelector('#completedAlert'));
const editedAlert = new bootstrap.Toast(document.querySelector('#editedAlert'));
const uncompletedAlert = new bootstrap.Toast(document.querySelector('#uncompletedAlert'));
const deletedAlert = new bootstrap.Toast(document.querySelector('#deletedAlert'));

//Edit
const editTitleInput = document.querySelector('#editTitle');
const editDescriptionInput = document.querySelector('#editDescription');
const editSaveButton = document.querySelector('#editSaveBtn');
const editModal = new bootstrap.Modal(document.querySelector('#editModal'));

//Read More
const readMoreModal = new bootstrap.Modal(document.querySelector('#readMoreModal'));
const readMoreTitle = document.querySelector('#readMoreTitle');
const readMoreDesc = document.querySelector('#readMoreDescription');

//Search
const searchBtn = document.querySelector('#searchButton');
const searchModal = new bootstrap.Modal(document.querySelector('#searchModal'));
const searchInput = document.querySelector('#searchInput');
const searchInputBtn = document.querySelector('#searchButtonConfirm');
const searchError = document.querySelector('#searchError');


function addTask(title, description) {
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
        .then(response => {
            getAllUncompletedTasks();
            addedAlert.show();
        });
}

saveButton.addEventListener('click', function () {

    if(titleInput.value == '' && descriptionInput.value ==''){
        addError.innerHTML = "Please provide a title and a description for the task"
    }
    else{
        addTask(titleInput.value, descriptionInput.value);
        titleInput.value = '';
        descriptionInput.value = '';
        addError.innerHTML = '';
    }
    
});


function displayUncompletedTasks(tasks) {
    let allTasks = '';
    tasks.forEach(element => {

        let descCopy = element.description.substring(0, 180);
        if (descCopy.length > 179) {
            descCopy = descCopy + "<strong>...</strong>";
        }


        if (element.isCompleted == false) {
            const taskElement = `
                <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><span class="badge bg-secondary"><strong>${element.id}</strong></span> ${element.title}</h5>
                        <p class="card-text">${descCopy}</p>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-info" onclick="readMore('${element.title}', '${element.description}')"><i class="bi bi-book"></i></button>
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

function displayCompletedTasks(tasks) {
    let allTasks = '';
    tasks.forEach(element => {

        let descCopy = element.description.substring(0, 165);
        if (descCopy.length > 164) {
            descCopy = descCopy + "<strong>...</strong>";
        }

        if (element.isCompleted == true) {
            const taskElement = `
                <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><span class="badge bg-secondary"><strong>${element.id}</strong></span> ${element.title}</h5>
                        <p class="card-text">${descCopy}</p>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-info" onclick="readMore('${element.title}', '${element.description}')"><i class="bi bi-book"></i></button>
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

function getAllUncompletedTasks() {
    fetch('https://localhost:7091/ToDo/api/getAll')
        .then(data => data.json())
        .then(response => displayUncompletedTasks(response));
}

function getAllCompletedTasks() {
    fetch('https://localhost:7091/ToDo/api/getAll')
        .then(data => data.json())
        .then(response => displayCompletedTasks(response));
}

getAllUncompletedTasks();
getAllCompletedTasks();

function deleteTask(id) {
    fetch(`https://localhost:7091/ToDo/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
        .then(response => {
            getAllCompletedTasks();
            delModal.hide();
            deletedAlert.show();
        });
}

function showDeleteModal(id) {
    delModal.show();
    confirmButton.addEventListener('click', function () {
        deleteTask(id);
    });
}

function editTask(id, title, desc) {

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
            editedAlert.show();
        });
}

function showEditModal(id, title, desc) {
    editTitleInput.value = title;
    editDescriptionInput.value = desc;
    editModal.show();
    editSaveButton.addEventListener('click', function () {
        editTask(id, editTitleInput.value, editDescriptionInput.value);
    });
}



function markCompletedTask(id) {
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
            completedAlert.show();
        });
}

function markUncompletedTask(id) {
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
            uncompletedAlert.show();
        });
}

function readMore(title, desc) {
    readMoreTitle.innerHTML = title;
    readMoreDesc.innerHTML = desc;
    readMoreModal.show();
}

function getTaskById(id) {
    fetch(`https://localhost:7091/ToDo/api/getbyid/${id}`)
        .then(data => data.json())
        .then(response => {
            if (response.title == 'Not Found') {
                searchError.innerHTML = "This task dosen't exist";
            }
            else {
                readMore(response.title, response.description);
                searchInput.value = '';
                searchError.innerHTML = '';
                searchModal.hide();
            }
        });
}

searchBtn.addEventListener('click', function () {
    searchModal.show();
    searchInputBtn.addEventListener('click', function () {
        getTaskById(searchInput.value);
    });
});