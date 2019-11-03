$(document).ready(function () {
    var modalCreateTask = document.getElementById("modalCreateTask");
    var btnCreate = document.getElementById("btnCreate");
    var btnCancel = document.getElementById("btnCancel");

    btnCreate.onclick = function () {
        modalCreateTask.style.display = "block";
    };

    btnCancel.onclick = function () {
        modalCreateTask.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modalCreateTask) {
            btnCreate.style.display = "none";
        }
    };
});