const API_URL = "https://task-manager-xvpc.onrender.com";
let editMode = false;
document.getElementById("editbut").addEventListener("click",()=>{
    editMode= !editMode;
    document.getElementById("editbut").textContent = editMode ? "Done" : "Edit";
    getTask();
})



async function createTask(title){
    const response= await fetch(`${API_URL}/api/tasks`,{
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
    const response = await fetch(`${API_URL}/api/tasks`);
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

        let titleElement;
        if(editMode){
            titleElement = document.createElement("input");
            titleElement.type = "text";
            titleElement.value = task.title;

            titleElement.addEventListener("keydown",async (e)=>{
                if(e.key === "Enter") {
                    await updateTask(task.id,task.completed,titleElement.value);
                    getTask();
                }
            })

            titleElement.addEventListener("blur",async ()=>{
                
                    await updateTask(task.id,task.completed,titleElement.value);
                    getTask();
                
            });
        
        } else {
            titleElement= document.createElement("span");
            titleElement.classList.add("title");
            
            titleElement.textContent = task.title;
        }


        

        taskDiv.appendChild(id);
        taskDiv.appendChild(titleElement);
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(deletebut);

        tasklist.appendChild(taskDiv);
    })
}
async function updateTask(taskId,completed,title){
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},

        body:JSON.stringify({completed : completed,title:title})
    });
    return await response.json();

}

async function deleteTask(taskId){
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},

        
    });
    return await response.json();
}
async function test(){
    const tasks = await (await fetch(`${API_URL}/api/tasks`)).json();
    console.log(tasks);
}
async function handleAdd(){
    const input = document.getElementById("taskenter");
    const title = input.value.trim();

    if (title === "") return;


    await createTask(title);
    input.value = "";
    getTask();
    }

document.getElementById("taskenter").addEventListener("keydown",async(e)=>{
    if(e.key === "Enter"){
        handleAdd();}
});
document.getElementById("addTask").addEventListener("click", handleAdd);


test();
getTask();

