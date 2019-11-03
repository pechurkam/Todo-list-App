document.addEventListener("DOMContentLoaded", function (_event) {

    var taskStorage = localStorage.getItem("tasks");

    if (taskStorage == null)
        taskStorage = {};
    else
        taskStorage = JSON.parse(taskStorage);

    var taskContainer = document.getElementById("taskContainer");

    var btnCreate = document.getElementById("btnCreate");
    var btnCancel = document.getElementById("btnCancel");

    var modal = document.getElementById("modalCreateTask");
    var span = document.getElementsByClassName("close")[0];

    var createTaskForm = document.getElementById("createTaskForm");

    var url = new URL(window.location.href);

    var searchFilterValue = url.searchParams.get("search");
    var isOpenFilterValue = url.searchParams.get("open");
    var priorityFilterValue = url.searchParams.get("priority");

    window.history.replaceState(null, null, window.location.pathname);

    var searchFilter = document.getElementById("filterTitle");
    var isOpenFilter = document.getElementById("filterOpen");
    var priorityFilter = document.getElementById("filterPriority");

    if (searchFilterValue != null)
        searchFilter.value = searchFilterValue;
    else
        searchFilter.value = "";

    if (isOpenFilterValue != null)
        isOpenFilter.value = Boolean(isOpenFilterValue) ? "open" : "none";
    else
        isOpenFilter.value = "all";

    if (priorityFilterValue != null)
        priorityFilter.value = priorityFilterValue;
    else
        priorityFilter.value = "all";

    searchFilter.onchange = function () {
        if (searchFilter.value !== "")
            searchFilterValue = searchFilter.value;
        else
            searchFilterValue = null;
        reloadTasksView(searchFilterValue, isOpenFilterValue, priorityFilterValue);
    };

    isOpenFilter.onchange = function () {
        switch (isOpenFilter.value) {
            case "all":
                isOpenFilterValue = null;
                break;
            case "done":
                isOpenFilterValue = false;
                break;
            case "open":
                isOpenFilterValue = true;
                break;
        }
        reloadTasksView(searchFilterValue, isOpenFilterValue, priorityFilterValue);
    };

    priorityFilter.onchange = function () {
        if (priorityFilter.value === "all")
            priorityFilterValue = null;
        else
            priorityFilterValue = priorityFilter.value;

        reloadTasksView(searchFilterValue, isOpenFilterValue, priorityFilterValue);
    };

    btnCreate.onclick = function () {
        modal.style.display = "block";
    };

    btnCancel.onclick = function () {
        modal.style.display = "none";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    createTaskForm.onsubmit = function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        let title = document.getElementById("title").value;
        let description = document.getElementById("description").value;
        let priority = document.getElementById("priority").value;

        taskStorage[uuidv4()] = {
            "title": title,
            "description": description,
            "priority": priority,
            "open": true,
        };

        localStorage.setItem("tasks", JSON.stringify(taskStorage));

        modal.style.display = "none";

        reloadTasksView();
    };

    function taskTemplate(title, description, priority, open, taskId) {
        return "<div class=\"task-item " + (!open ? "closed" : (priority + "-priority")) + "\">\n" +
            "            <div class=\"task-content\">\n" +
            "                <h2>" + title + "</h2>\n" +
            "                <p>" + description + "</p>\n" +
            "                <div class=\"priority\">\n" +
            "                    <select class='priority-change' data-task-id='" + taskId + "'>\n" +
            "                        <option value=\"high\" " + (priority === 'high' ? "selected" : "") + ">high</option>\n" +
            "                        <option value=\"normal\" " + (priority === 'normal' ? "selected" : "") + ">normal</option>\n" +
            "                        <option value=\"low\" " + (priority === 'low' ? "selected" : "") + ">low</option>\n" +
            "                    </select>\n" +
            "                    <button class=\"btn btn-default\">•••</button>\n" +
            "                    <div class=\"dropdown-content\">\n" +
            "                        <a class='done-task' data-task-id='" + taskId + "'>done</a>\n" +
            "                        <a>edit</a>\n" +
            "                        <a class='delete-task' data-task-id='" + taskId + "'>delete</a>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "                <img class=\"done-icon\" src=\"images/done.png\" alt=\"done-image-icon\">\n" +
            "            </div>\n" +
            "        </div>"
    }

    function reloadTasksView(search = null, open = null, priority = null) {
        while (taskContainer.firstChild) {
            taskContainer.removeChild(taskContainer.firstChild);
        }

        let toDisplay = taskStorage;

        if (search != null)
            toDisplay = filterObject(toDisplay, "title", search);

        if (open != null)
            toDisplay = filterObject(toDisplay, "open", Boolean(open));

        if (priority != null)
            toDisplay = filterObject(toDisplay, "priority", priority);

        for (let taskId in toDisplay) {
            taskContainer.innerHTML += taskTemplate(
                taskStorage[taskId]["title"],
                taskStorage[taskId]["description"],
                taskStorage[taskId]["priority"],
                taskStorage[taskId]["open"],
                taskId
            )
        }

        let doneTaskBtns = document.getElementsByClassName("done-task");
        for (let i = 0; i < doneTaskBtns.length; i++) {
            doneTaskBtns[i].addEventListener("click", doneTask, false);
        }
        let deleteTaskBtns = document.getElementsByClassName("delete-task");
        for (let i = 0; i < deleteTaskBtns.length; i++) {
            deleteTaskBtns[i].addEventListener("click", deleteTask, false);
        }
        let priorityBtns = document.getElementsByClassName("priority-change");
        for (let i = 0; i < priorityBtns.length; i++) {
            priorityBtns[i].addEventListener("change", onPriorityChange, false);
        }
    }

    function doneTask(event) {
        event.preventDefault();

        taskStorage[this.getAttribute("data-task-id")]["open"] = false;

        localStorage.setItem("tasks", JSON.stringify(taskStorage));

        reloadTasksView();
    }

    function deleteTask(event) {
        event.preventDefault();
        let res = confirm("Are you sure you want to delete this task?");
        if (res === true)
            delete taskStorage[this.getAttribute("data-task-id")];

        localStorage.setItem("tasks", JSON.stringify(taskStorage));

        reloadTasksView();
    }

    function onPriorityChange(event) {
        event.preventDefault();
        var x = (this.value || this.options[this.selectedIndex].value);
        taskStorage[this.getAttribute("data-task-id")]["priority"] = x;

        localStorage.setItem("tasks", JSON.stringify(taskStorage));

        reloadTasksView();
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const filterObject = (obj, filter, filterValue) =>
        Object.keys(obj).reduce((acc, val) =>
            (obj[val][filter] !== filterValue ? acc : {
                    ...acc,
                    [val]: obj[val]
                }
            ), {});

    reloadTasksView(searchFilterValue, isOpenFilterValue, priorityFilterValue);
});