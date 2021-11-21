var IntervalID;


function loadDummyData(){ //In case of the first start of the website, this data will be loaded to the local storage
    var array = [];

    var time1 = {
        id: 1,
        title: "User-Tracking einrichten",
        notes: "F&uuml;r ein datengetriebenes Vorgehen ben&ouml;tigen wir fr&uuml;hzeitig die M&ouml;glichkeit, die Benutzer besser zu verstehen.",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }

       var time2 = {
        id: 2,
        title: "Werbema&szlig;nahmen ergreifen",
        notes: "Wir sollten fr&uuml;hzeitig mit Marketing-Ma&szlig;nahmen starten. Insbesondere Werbung in sozialen Netzwerken.",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }

       var time3 = {
        id: 3,
        title:"Web-Anwendungen implementieren",
        notes: "Grundstruktur in Form von HTML-Seiten aufbauen, mit CSS stylen und dynamisches Verhalten mit Javascript implementieren.",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }    

       var time4 = {
        id: 4,
        title:"Blog-Posts erstellen",
        notes: "Wir sollten darauf achten, dass wir initial mindestens zwei Blog-Posts anzeigen k&ouml;nnen.",
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
       }

       array.push(time1);
       array.push(time2);
       array.push(time3);
       array.push(time4);
       window.localStorage.setItem("Times", JSON.stringify(array));
}

function DocumentLoaded() {//Whenever list-page is loaded, this script is triggered to display entries in the right form
    var time_array = window.localStorage.getItem("Times");
    if (time_array){
        time_array = JSON.parse(time_array);
        for (var times in time_array){
            var li = document.createElement("li");
            li.id = `${time_array[times].id}`;
            li.innerHTML =
            `
            <div class="list-track-description">
                <p class="list-track-title">${time_array[times].title}</p>
                <p class="list-track-notes">${time_array[times].notes}</p>
            </div>
            <div class="list-track-time">
                <img id = "clock${time_array[times].id}" src="bilder/watch-1-black.png">
                <label id="hours${time_array[times].id}">${time_array[times].hours}</label>
                <label id="colon1">:</label>
                <label id="minutes${time_array[times].id}">${time_array[times].minutes}</label>
                <label id="colon2">:</label>
                <label id="seconds${time_array[times].id}">${time_array[times].seconds}</label>
            </div>
            <div class="list-track-delete">
                <img id = "delete${time_array[times].id}" onclick=Delete(event) src="bilder/delete-black.png">
            </div>
            <div class="list-track-control">
            <a onclick = TimerClick(event)><img id = "play${time_array[times].id}" src="bilder/play-black.png"></a>
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

function isActive(id){ //Checks if current item has an active counter
    var time_array = window.localStorage.getItem("Times");
    time_array = JSON.parse(time_array);
    for (element in time_array){
        if (time_array[element].id == id){
            if (time_array[element].active == true){
                return true;
            } else {
                return false;
            }
        }
    }
}

function stopTimer(IndexOfRunningTimer){//Stops current timer
    var time_array = window.localStorage.getItem("Times");
    time_array = JSON.parse(time_array);
    clearInterval(IntervalID);

    if (IndexOfRunningTimer){//if running timer is delelted, active is set false before
        time_array[IndexOfRunningTimer].active = false;
    }
    else{
        for (element in time_array){
            if (time_array[element].active == true){
                time_array[element].active = false;
                unhighlight(time_array[element].id);
                window.localStorage.setItem("Times", JSON.stringify(time_array));
            }
        }
    }
}

function highlight(id){//Highlights current list entry visibly
    document.getElementById(id).style.backgroundColor = "#f01c24";
    document.getElementById(id).style.color = "white";
    document.getElementById("clock"+id).src = "./bilder/watch-1-white.png";
    document.getElementById("delete"+id).src = "./bilder/delete-white.png";
    document.getElementById("play"+id).src = "./bilder/stop-white.png";
}

function unhighlight(id){//Unhighlights current list entry visibly
    document.getElementById(id).style.backgroundColor = "";
    document.getElementById(id).style.color = "black";
    document.getElementById("clock"+id).src = "./bilder/watch-1-black.png";
    document.getElementById("delete"+id).src = "./bilder/delete-black.png";
    document.getElementById("play"+id).src = "./bilder/play-black.png";
}

function anotherTimeisRunning(id){//Checks if any other Timers are running
    var time_array = window.localStorage.getItem("Times");
    time_array = JSON.parse(time_array);

    for (element in time_array){
        if (time_array[element].id == id){
            continue;
        }
        else{
            if (time_array[element].active == true){
                return true; //evtl. hioer direkt in stopTimer() reinspringen, wäre geschickter
            }
            else {
                continue;
            }
        }
    }
    return false;
}

function StartTimer(event, id){//starts timer and lets it run during the time being on the site
    var hoursLabel = document.getElementById("hours"+id)
    var minutesLabel = document.getElementById("minutes"+id);
    var secondsLabel = document.getElementById("seconds"+id);
    var totalSeconds = 0;
    var index = 0;
    var time_array = window.localStorage.getItem("Times");
    time_array = JSON.parse(time_array);

    for (tasks in time_array){
        if (time_array[tasks].id == id){
            index = tasks;
            totalSeconds = calculateTotalSeconds(time_array, index);
            time_array[index].active = true;
            window.localStorage.setItem("Times", JSON.stringify(time_array));
        }
    }

    IntervalID = setInterval(setTime, 1000);

    function setTime()
    {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds%60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
        hoursLabel.innerHTML = pad(parseInt(totalSeconds/60/60));

        time_array[index].seconds = pad(totalSeconds%60);
        time_array[index].minutes = pad(parseInt(totalSeconds/60));
        time_array[index].hours = pad(parseInt(totalSeconds/60/60));

        window.localStorage.setItem("Times", JSON.stringify(time_array));
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

function calculateTotalSeconds(time_array, index){//calculated total seconds from hours, minutes and seconds
    var seconds;

    seconds = parseInt(time_array[index].seconds);
    seconds = seconds + parseInt(time_array[index].minutes)*60;
    seconds = seconds + parseInt(time_array[index].hours)*60*60;

    return seconds;
}

function Delete(event) { //Deletes entry from list
    var id = event.target.parentElement.parentElement.id;
    var time_array = window.localStorage.getItem("Times");
    time_array = JSON.parse(time_array);

    document.getElementById(id).remove();
    for (element in time_array){
        if (time_array[element].id == id){
            if (time_array[element].active == true){
                stopTimer(element); //if its a running timer set active = false before, otherwise it will go on running and be shown in the list
            }
            time_array.splice(element, 1);
        }
    window.localStorage.setItem("Times", JSON.stringify(time_array));
    }
}

function ButtonClick(event) {//Is triggered when new Entry is submitted, saves data in local Storage in Item "Tasks"
    var title = window.document.getElementById("title").value.trim();
    var notes = window.document.getElementById("notes").value;
    var random = crypto.randomUUID();

    var time = {
        id: random,
        title: title,
        notes: notes,
        hours: "00",
        minutes: "00",
        seconds: "00",
        active: false
        }

    if (window.localStorage.getItem("Times")){
        var item = window.localStorage.getItem("Times");
        var existing_array = JSON.parse(item);
        window.localStorage.setItem("Times", JSON.stringify(existing_array.concat(time)));
    } else {
        var array = [];
        window.localStorage.setItem("Times", JSON.stringify(array.concat(time)));
    }
}