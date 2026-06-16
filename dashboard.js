const API_URL =
    "http://localhost:8080/dashboard";

async function loadDashboard(){

    const response =
        await fetch(API_URL);

    const data =
        await response.json();

    document.getElementById("total").innerText =
        data["Total Files"] || 0;

    document.getElementById("pending").innerText =
        data["Pending Files"] || 0;

    document.getElementById("approved").innerText =
        data["Approved Files"] || 0;

    document.getElementById("rejected").innerText =
        data["Rejected Files"] || 0;

    document.getElementById("review").innerText =
        data["Under Review Files"] || 0;

    const ctx =
        document.getElementById("myChart");

    new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: [
                'Pending',
                'Approved',
                'Rejected',
                'Under Review'
            ],

            datasets: [{

                data: [

                    data["Pending Files"],

                    data["Approved Files"],

                    data["Rejected Files"],

                    data["Under Review Files"]
                ]
            }]
        },

        options: {

            responsive:true,

            maintainAspectRatio:false
        }
    });
}

function updateClock(){

    const now =
        new Date();

    document.getElementById("clock")
        .innerText =
        now.toLocaleTimeString();
}

setInterval(updateClock,1000);

updateClock();

function logout(){

    localStorage.clear();

    alert("Logged Out");

    window.location.href =
        "login.html";
}

loadDashboard();