
async function createTask(title){
    const response= await fetch('http://127.0.0.1:5000/api/tasks',{
        method : 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({title : title})
    });
    const data = await response.json();
    console.log(data);
}
async function getTask(){
    const response = await fetch('http://127.0.0.1:5000/api/tasks');
    const tasks = await response.json();
    renderTask(tasks);

}
function renderTask(tasks){
    const tasklist = document.getElementById("taskList");
    tasklist.innerHTML = "";
    tasks.forEach(task=>{
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task-row");

        const checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change",async()=>{
            updateTask(task.id,checkbox.checked);
            getTask();
        });

        const deletebut = document.createElement("button");
        deletebut.textContent="X";
        deletebut.addEventListener("click",async ()=>{
            deleteTask(task.id);
            getTask();
        })




        taskDiv.textContent = task.title;
        tasklist.appendChild(taskDiv);
        tasklist.appendChild(checkbox);
        tasklist.appendChild(deletebut);
    })
}
async function updateTask(taskId,completed){
    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},

        body:JSON.stringify({completed : completed})
    });
    return await response.json();

}

async function deleteTask(taskId){
    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},

        
    });
    return await response.json();
}
async function test(){
    const tasks = await (await fetch('http://127.0.0.1:5000/api/tasks')).json();
    console.log(tasks);
}

document.getElementById("addTask").addEventListener("click", async ()=>{
    const input = document.getElementById("taskenter");
    const title = input.value.trim();

    if (title === "") return;


    await createTask(title);
    input.value = "";
    getTask();


})


test();
getTask();

