$(document).ready(function () {
    var modalCreateTask = document.getElementById("modalCreateTask");
    var btnCreate = document.getElementById("btnCreate");
    var btnCancel = document.getElementById("btnCancel");
    var tasksArr = [];
    var tasksObjects = [];
    var count = 0;
    var task = {
        id     : count,
        title: "",
        desc : "",
        priority : ""
    };


    btnCreate.onclick = function () {
        modalCreateTask.style.display = "block";
    };

    btnCancel.onclick = function () {
        modalCreateTask.style.display = "none";
    };

    $( "form" ).submit(function( event ) {

        var arr = $( this ).serializeArray();
        console.log(arr);
        var title = arr[0]["value"];
        var desc = arr[1]["value"];
        var priority = arr[2]["value"];
        var new_task = document.createElement('div');
        var new_task_title = document.createElement('div');
        new_task_title.className = "task-title";
        new_task_title.textContent = title;
        var new_task_priority = document.createElement('div');
        new_task_priority.className = "task-priority";
        new_task_priority.textContent = priority;
        var new_task_desc = document.createElement('div');
        new_task_desc.className = "task-desc";
        new_task_desc.textContent = desc;
        var tasks = document.getElementById("tasks");
        new_task.appendChild(new_task_title);
        new_task.appendChild(new_task_desc);
        new_task.appendChild(new_task_priority);

        task.id = count;
        count++;
        task.title = title;
        task.desc = desc;
        task.priority = priority;
       console.log("task: ");
       console.log(task);

        tasks.appendChild(new_task);
        tasksArr.push(title);
        tasksArr.push(desc);
        tasksArr.push(priority);
        console.log(tasksArr);

        const filterValues = (name) => {
            return tasksObjects.filter(data => {
                return data.toLowerCase().indexOf(name.toLowerCase()) > -1;
            });
        }
        var filterWOrd = "ta";
        var newArray = tasksObjects.filter(function (task) {
            return task.title === filterWOrd ||
                task.desc === filterWOrd ||
                task.priority === filterWOrd;
        });
        console.log("newArray: ");
        console.log(newArray);
        console.log("filtered: ");
        console.log(filterValues('ta'));
        event.preventDefault();
    });

    window.onclick = function (event) {
        if (event.target === modalCreateTask) {
            btnCreate.style.display = "none";
        }
    };
});