var IntervalID;

function checkNecessaryInput(){ //Checks if neccassary input boxes have content, if so button will be enabled, otherwise keeps disabled
    var button = document.getElementById("CreateButton");
    var textBox = document.getElementById("title");

    if (textBox.value.trim() != ""){
        button.disabled = false;
        button.style = "background-color: ; color: ;";
    }
    else{
        button.disabled = true;
        button.style = "background-color: lightgrey; color: black;";
    }
}

function ButtonClick(event) {//Is triggered when new Entry is submitted, saves data in local Storage in Item "Tasks"
    //Hier prüfen ob es Werte gibt
    var title = window.document.getElementById("title").value.trim();
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

function loadDummyData(){ //In case of the first start of the website, this data will be loaded to the local storage
    var array = [];

    var task1 = {
        id: 1,
        title: "Dummy1",
        notes: "Dummy1",
        due: "Dummy1",
        responsible: "Dummy1",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }

       var task2 = {
        id: 2,
        title: "Dummy2",
        notes: "Dummy2",
        due: "Dummy2",
        responsible: "Dummy2",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }

       var task3 = {
        id: 3,
        title:"Dummy3",
        notes: "Dummy3",
        due: "Dummy3",
        responsible: "Dummy3",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }    

       array.push(task1);
       array.push(task2);
       array.push(task3);
       window.localStorage.setItem("Tasks", JSON.stringify(array));
}

function DocumentLoaded() {//Whenever list-page is loaded, this script is triggered to display entries in the right form
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
                    <img id = "clock${task_array[tasks].id}" src="img/watch-1-black.png"/>
                    <label id="hours${task_array[tasks].id}">${task_array[tasks].hours}</label>
                    <label id="colon1">:</label>
                    <label id="minutes${task_array[tasks].id}">${task_array[tasks].minutes}</label>
                    <label id="colon2">:</label>
                    <label id="seconds${task_array[tasks].id}">${task_array[tasks].seconds}</label>
                </div>
                <div class="list-task-responsible">
                    <img id = "delete${task_array[tasks].id}" src="img/delete-black.png"/>
                    <p>${task_array[tasks].responsible}</p>
                </div>
                <div class="list-task-edit">
                    <a onclick = TimerClick(event)><img id = "play${task_array[tasks].id}" src="img/play-black.png"/></a>
                </div>
            `
            document.getElementById("unordered_list").append(li);
        }
        stopTimer();
    }
    else {
        loadDummyData(); //Lädt die Dummy Daten in den Local Storage
        DocumentLoaded(); //Aktualisiert die Seite mit den neu eingefügten Dummy-Daten
    }
}

function Delete(event) { //Deletes entry from list
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

function isActive(id){ //Checks if current item has an active counter
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);
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

function anotherTimeisRunning(id){//Checks if any other Timers are running
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

function stopTimer(){//Stops current timer
    var task_array = window.localStorage.getItem("Tasks");
    task_array = JSON.parse(task_array);
    clearInterval(IntervalID);

    for (element in task_array){
        if (task_array[element].active == true){
            task_array[element].active = false;
            unhighlight(task_array[element].id);
            window.localStorage.setItem("Tasks", JSON.stringify(task_array));
        }
    }
}

function highlight(id){//Highlights current list entry visibly
    document.getElementById(id).style.backgroundColor = "#f01c24";
    document.getElementById(id).style.color = "white";
    document.getElementById("clock"+id).src = "./img/watch-1-white.png";
    document.getElementById("delete"+id).src = "./img/delete-white.png";
    document.getElementById("play"+id).src = "./img/stop-white.png";
}

function unhighlight(id){//Unhighlights current list entry visibly
    document.getElementById(id).style.backgroundColor = "";
    document.getElementById(id).style.color = "black";
    document.getElementById("clock"+id).src = "./img/watch-1-black.png";
    document.getElementById("delete"+id).src = "./img/delete-black.png";
    document.getElementById("play"+id).src = "./img/play-black.png";

}

function TimerClick(event){//Is triggered when start-button is triggered
    var id = event.target.parentElement.parentElement.parentElement.id;

    if (isActive(id)){
        stopTimer();
    }
    else{
        if (anotherTimeisRunning(id)){
            stopTimer();
            StartTimer(event, id);
            highlight(id);
        }
        else{
            StartTimer(event, id);
            highlight(id);
        }
    }

}

function getTotalSeconds(task_array, index){//calculated total seconds from hours, minutes and seconds
    var seconds;

    seconds = parseInt(task_array[index].seconds);
    seconds = seconds + parseInt(task_array[index].minutes)*60;
    seconds = seconds + parseInt(task_array[index].hours)*60*60;

    return seconds;
}

function StartTimer(event, id){//starts timer and lets it run during the time being on the site
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