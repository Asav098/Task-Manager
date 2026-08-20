
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
        taskDiv.textContent = task.title;
        tasklist.appendChild(taskDiv);
    })
}

getTask();