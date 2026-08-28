
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
function renderTask(tasks) {
    const tasklist = document.getElementById("taskList");
    tasklist.innerHTML = "";
    tasks.forEach((task,index)=>{

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task-row");

        const id= document.createElement("span")
        id.textContent = index + 1;
        id.classList.add("task-id");

        const checkbox = document.createElement("input");
        checkbox.classList.add("cbox");
        checkbox.type="checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change",async()=>{
            await updateTask(task.id,checkbox.checked);
            getTask();
        });

        const deletebut = document.createElement("button");
        deletebut.classList.add("delete")
        deletebut.textContent="X";
        deletebut.addEventListener("click",async ()=>{
            await deleteTask(task.id);
            getTask();
        });



        const titlespan = document.createElement("span");
        titlespan.classList.add("title")
        titlespan.textContent = task.title;

        taskDiv.appendChild(id);
        taskDiv.appendChild(titlespan);
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(deletebut);

        tasklist.appendChild(taskDiv);
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

