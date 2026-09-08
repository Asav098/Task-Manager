const API_URL = "https://task-manager-xvpc.onrender.com";
let editMode = false;
document.getElementById("editbut").addEventListener("click",()=>{
    editMode= !editMode;
    document.getElementById("editbut").textContent = editMode ? "Done" : "Edit";
    getTask();
})

document.getElementById("loginBtn").addEventListener("click",async ()=>{
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const data =await login(username,password);
     if(data.error){
        console.log(data.error)
        return;
    }

    getTask();
})

document.getElementById("signupBtn").addEventListener("click",async ()=>{
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    const data =await signup(username,password);
     if(data.error){
        console.log(data.error)
        return;
    }

    console.log("login now")
})


async function createTask(title){
    const token = localStorage.getItem("token");
    const response= await fetch(`${API_URL}/api/tasks`,{
        method : 'POST',
        headers: {
            'Content-Type':'application/json', 'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({title : title})
    });
    const data = await response.json();



}
async function getTask(){
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/tasks`,{
        method : "GET",
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        
    }
    );
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
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json', 'Authorization' : `Bearer ${token}`},

        body:JSON.stringify({completed : completed,title:title})
    });
    return await response.json();

}

async function deleteTask(taskId){
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'
            , 'Authorization' : `Bearer ${token}`
        },

        
    });
    return await response.json();
}

async function handleAdd(){
    const input = document.getElementById("taskenter");
    const title = input.value.trim();

    if (title === "") return;


    await createTask(title);
    input.value = "";
    getTask();
    }
async function login(username,password){
    const response = await fetch(`${API_URL}/api/login`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({username:username,password:password})

    });
    const data = await response.json();

    if(data.token){
        localStorage.setItem('token',data.token)
        localStorage.setItem('username',data.username)
    }

    return data;
}
async function signup(username, password){
    const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    });
    const data = await response.json();
    console.log(data);
    return data;
}
document.getElementById("taskenter").addEventListener("keydown",async(e)=>{
    if(e.key === "Enter"){
        handleAdd();}
});
document.getElementById("addTask").addEventListener("click", handleAdd);


test();
getTask();

