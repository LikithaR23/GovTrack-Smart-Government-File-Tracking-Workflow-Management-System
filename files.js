const API_URL =
"http://localhost:8080/files";

const CURRENT_USER =
localStorage.getItem("username")
|| "ADMIN";

async function loadFiles(){

    try{

        const response =
            await fetch(API_URL);

        const files =
            await response.json();

        console.log(files);

        let total = files.length;
        let pending = 0;
        let approved = 0;
        let rejected = 0;
        let overdue = 0;

        const tbody =
            document.getElementById(
                "tableBody"
            );

        tbody.innerHTML = "";

        const today =
            new Date();

        files.forEach(file => {

            if(file.status === "PENDING"){
                pending++;
            }

            if(file.status === "APPROVED"){
                approved++;
            }

            if(file.status === "REJECTED"){
                rejected++;
            }

            if(
                file.deadline &&
                new Date(file.deadline) < today &&
                file.status !== "APPROVED"
            ){
                overdue++;
            }

            tbody.innerHTML += `

<tr>

<td>${file.id}</td>

<td>${file.title}</td>

<td>${file.description}</td>

<td>${file.department || "N/A"}</td>

<td>${file.priority || "NOT SET"}</td>

<td>${file.status}</td>

<td>${file.currentHolder}</td>

<td>${file.deadline || "NOT SET"}</td>

<td>

<button onclick="forwardFile(${file.id})">
Forward
</button>

<button onclick="approveFile(${file.id})">
Approve
</button>

<button onclick="rejectFile(${file.id})">
Reject
</button>

<button onclick="viewHistory(${file.id})">
History
</button>

</td>

</tr>

`;
        });

        document.getElementById("totalCount")
            .innerText = total;

        document.getElementById("pendingCount")
            .innerText = pending;

        document.getElementById("approvedCount")
            .innerText = approved;

        document.getElementById("rejectedCount")
            .innerText = rejected;

        document.getElementById("overdueCount")
            .innerText = overdue;

    }catch(error){

        console.log(error);

        alert(error);
    }
}

async function createFile(){

    const title =
        document.getElementById("title").value;

    const description =
        document.getElementById("description").value;

    const holder =
        document.getElementById("holder").value;

    const department =
        document.getElementById("department").value;

    const priority =
        document.getElementById("priority").value;

    const deadline =
        document.getElementById("deadline").value;

    await fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            title:title,

            description:description,

            currentHolder:holder,

            department:department,

            priority:priority,

            deadline:deadline,

            status:"PENDING"
        })
    });

    alert("File Created");

    loadFiles();
}

async function approveFile(id){

    await fetch(

`http://localhost:8080/files/${id}/approve?movedBy=${CURRENT_USER}`,

        {
            method:"PUT"
        }
    );

    loadFiles();
}

async function rejectFile(id){

    await fetch(

`http://localhost:8080/files/${id}/reject?movedBy=${CURRENT_USER}`,

        {
            method:"PUT"
        }
    );

    loadFiles();
}

async function forwardFile(id){

    const newHolder =
        prompt("Enter New Holder");

    if(!newHolder) return;

    await fetch(

`http://localhost:8080/files/${id}/forward?newHolder=${newHolder}&movedBy=${CURRENT_USER}`,

        {
            method:"PUT"
        }
    );

    loadFiles();
}

async function viewHistory(id){

    const response =
        await fetch(

`http://localhost:8080/files/${id}/history`
        );

    const history =
        await response.json();

    let text =
"FILE MOVEMENT HISTORY\n\n";

    history.forEach(item => {

        text +=

`${item.action}

By : ${item.movedBy}

At : ${item.movedAt}

-----------------------

`;
    });

    alert(text);
}

loadFiles();
function updateClock(){

    const now =
        new Date();

    document.getElementById(
        "clock"
    ).innerText =
        now.toLocaleTimeString();
}

setInterval(
    updateClock,
    1000
);

updateClock();