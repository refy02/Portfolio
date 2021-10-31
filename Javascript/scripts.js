var IntervalID;

function editFields() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id")
    var task_array = window.localStorage.getItem("Tasks");
    if (task_array){
        task_array = JSON.parse(task_array);
        for (tasks in task_array){
            if(task_array[tasks].id == id){
               window.document.getElementById("title").value = task_array[tasks].title;
               window.document.getElementById("notes").value = task_array[tasks].notes;
               window.document.getElementById("due").value = task_array[tasks].due;
               window.document.getElementById("responsible").value = task_array[tasks].responsible;
            }
        }
    }
}

function SaveEdit(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id")
    var title = window.document.getElementById("title").value;
    var notes = window.document.getElementById("notes").value;
    var due = window.document.getElementById("due").value;
    var responsible = window.document.getElementById("responsible").value;
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);
    for (tasks in task_array){
                if(task_array[tasks].id == id){
                    task_array[tasks].title = title;
                    task_array[tasks].notes = notes;
                    task_array[tasks].due = due;
                    task_array[tasks].responsible = responsible;
                }
    }
    window.localStorage.setItem("Tasks", JSON.stringify(task_array));
}

function ButtonClick() {
    var title = window.document.getElementById("title").value;
    var notes = window.document.getElementById("notes").value;
    var due = window.document.getElementById("due").value;
    var responsible = window.document.getElementById("responsible").value;
    var random = crypto.randomUUID();

    var task = {
        id: random,
        title: title,
        notes: notes,
        due: due,
        responsible: responsible,
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }
    if (window.localStorage.getItem("Tasks")){
        var item = window.localStorage.getItem("Tasks");
        var new_array = JSON.parse(item);
        window.localStorage.setItem("Tasks", JSON.stringify(new_array.concat(task)));
    } else {
        var array = [];
        window.localStorage.setItem("Tasks", JSON.stringify(array.concat(task)));
    }
}

function DocumentLoaded() {
    stopTimer();
    var task_array = window.localStorage.getItem("Tasks");
    if (task_array){
        task_array = JSON.parse(task_array);
        for (var tasks in task_array){
            var li = document.createElement("li");
            li.id = `${task_array[tasks].id}`;
            li.innerHTML =
            `
                <div class="list-task-checkbox">
                    <img onclick="Delete(event)"img src="img/unchecked-box.png"/>
                </div>
                <div class="list-task-description">
                    <p class="list-task-title">${task_array[tasks].title}</p>
                    <p class="list-task-notes">${task_array[tasks].notes}</p>
                </div>
                <div class="list-task-due">
                    <img src="img/faelligkeit.svg"/>
                    <label id="hours${task_array[tasks].id}">${task_array[tasks].hours}</label>
                    <label id="colon1">:</label>
                    <label id="minutes${task_array[tasks].id}">${task_array[tasks].minutes}</label>
                    <label id="colon2">:</label>
                    <label id="seconds${task_array[tasks].id}">${task_array[tasks].seconds}</label>
                </div>
                <div class="list-task-responsible">
                    <img src="img/verantwortlich.svg"/>
                    <p>${task_array[tasks].responsible}</p>
                </div>
                <div class="list-task-edit">
                    <a onclick = TimerClick(event)><img src="img/bearbeiten.svg"/></a>
                </div>
            `
            document.getElementById("unordered_list").append(li);
        }
    }
}

function Delete(event) {
    var id = event.target.parentElement.parentElement.id;
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);


    document.getElementById(id).remove();
    for (element in task_array){
        if (task_array[element].id == id){
            task_array.splice(element, 1);
        }
    window.localStorage.setItem("Tasks", JSON.stringify(task_array));

    }
}

function isActive(id){
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);
    var id = event.target.parentElement.parentElement.parentElement.id;
    for (element in task_array){
        if (task_array[element].id == id){
            if (task_array[element].active == true){
                return true;
            } else {
                return false;
            }
        }
    }
}

function anotherTimeisRunning(id){
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);

    for (element in task_array){
        if (task_array[element].id == id){
            continue;
        }
        else{
            if (task_array[element].active == true){
                return true;
            }
            else {
                continue;
            }
        }
    }
    return false;
}

function stopTimer(){
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);
    clearInterval(IntervalID);

    for (element in task_array){
        if (task_array[element].active == true){
            task_array[element].active = false;
            window.localStorage.setItem("Tasks", JSON.stringify(task_array));
        }
    }
}

function highlight(event){
    //event.target.outerHTML = "<img src=img/play-black.png>";
    //event.target.parentElement.parentElement.parentElement.children[2].children[0].outerHTML = "<img src=img/play-black.png>";
    //event.target.parentElement.parentElement.parentElement.outerHTML =   "<li style='color: white; background-color: #f01c24'>";
}

function unhighlight(){

}

function TimerClick(event){
    var id = event.target.parentElement.parentElement.parentElement.id;

    if (isActive(id)){
        stopTimer();
    }
    else{
        if (anotherTimeisRunning(id)){
            stopTimer();
            StartTimer(event, id);
            highlight(event);
        }
        else{
            StartTimer(event, id);
            highlight(event);
        }
    }

}

function getTotalSeconds(task_array, index){
    var seconds;

    seconds = parseInt(task_array[index].seconds);
    seconds = seconds + parseInt(task_array[index].minutes)*60;
    seconds = seconds + parseInt(task_array[index].hours)*60*60;

    return seconds;
}

function StartTimer(event, id){
    var hoursLabel = document.getElementById("hours"+id)
    var minutesLabel = document.getElementById("minutes"+id);
    var secondsLabel = document.getElementById("seconds"+id);
    var totalSeconds = 0;
    var index = 0;
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);

    for (tasks in task_array){
        if (task_array[tasks].id == id){
            index = tasks;
            totalSeconds = getTotalSeconds(task_array, index);
            task_array[index].active = true;
            window.localStorage.setItem("Tasks", JSON.stringify(task_array));
        }
    }

    IntervalID = setInterval(setTime, 1000);

    function setTime()
    {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds%60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
        hoursLabel.innerHTML = pad(parseInt(totalSeconds/60/60));

        task_array[index].seconds = pad(totalSeconds%60);
        task_array[index].minutes = pad(parseInt(totalSeconds/60));
        task_array[index].hours = pad(parseInt(totalSeconds/60/60));

        window.localStorage.setItem("Tasks", JSON.stringify(task_array));
    }

    function pad(val)
    {
        var valString = val + "";
        if(valString.length < 2)
        {
            return "0" + valString;
        }
        else
        {
            return valString;
        }
    }
}











