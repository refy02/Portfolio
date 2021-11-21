/* Javascript Implementation for TimeTrack.

   Authors:
   Fynn Reinders <fynn.reinders@gmail.com> */

   var IntervalID;

   function DocumentLoaded() {
       /*Function that is triggered automatically when loading zeiterfassung.html. Displays existing entries.
       
         Args: 
           None.
         Returns:
           None.
       */
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
   }
   
   function TimerClick(event){
       /*Starts and filters different use cases (start or stop) of play-button, when play-button is pressen. 
       
         Args:
           event (event): Contains inforamtion about clicked element as well as surrounding elements. Offers access via DOM.
         Returns;
           None.
        */
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
   
   function isActive(id){
       /*Checks if referenced list item of clicked play-button is active.
       
         Args:
           id (int): id-number of referenced list item.
         Returns:
           booleans.
       */
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
   
   function stopTimer(index){
       /*Stops currently running timer. Either by receiving index of active entry (list item) or by iterating over array to find active entry.
         
         Args:
           index (int): index number of active list item thas is supposed to be be deleted. Inforamtion optional.
         Returns:
           None.
        */
       var time_array = window.localStorage.getItem("Times");
       time_array = JSON.parse(time_array);
       clearInterval(IntervalID);
   
       if (index){//if running timer is delelted, active is set false before
           time_array[index].active = false;
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
   
   function highlight(id){
       /*Highlights currently active timer visibly.
         
         Args:
           id (int): id number of active list item.
         Returns:
           None.
        */
       document.getElementById(id).style.backgroundColor = "#f01c24";
       document.getElementById(id).style.color = "white";
       document.getElementById("clock"+id).src = "./bilder/watch-1-white.png";
       document.getElementById("delete"+id).src = "./bilder/delete-white.png";
       document.getElementById("play"+id).src = "./bilder/stop-white.png";
   }
   
   function unhighlight(id){
       /*Unhighlights currently active timer visibly.
         
         Args:
           id (int): id number of active list item.
         Returns:
           None.
        */
       document.getElementById(id).style.backgroundColor = "";
       document.getElementById(id).style.color = "black";
       document.getElementById("clock"+id).src = "./bilder/watch-1-black.png";
       document.getElementById("delete"+id).src = "./bilder/delete-black.png";
       document.getElementById("play"+id).src = "./bilder/play-black.png";
   }
   
   function anotherTimeisRunning(id){
       /*In case timer is sippused to stop, this function checks if there is any other timer still running.
         
         Args:
           id (int): id number of active list item.
         Returns:
           None.
        */
       var time_array = window.localStorage.getItem("Times");
       time_array = JSON.parse(time_array);
   
       for (element in time_array){
           if (time_array[element].id == id){
               continue;
           }
           else{
               if (time_array[element].active == true){
                   return true;
               }
               else {
                   continue;
               }
           }
       }
       return false;
   }
   
   function StartTimer(event, id){
       /*Starts counting-process of timer.
         
         Args:
           id (int): id number of list item, that requires counting timer.
         Returns:
           None.
        */
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
   
       function setTime(){
           /*Updates inforamtion in local-storage item and html-file every singele second. Also sums up total seconds.
         
             Args:
               None.
             Returns:
               None.
           */
           ++totalSeconds;
           secondsLabel.innerHTML = pad(totalSeconds%60);
           minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
           hoursLabel.innerHTML = pad(parseInt(totalSeconds/60/60));
   
           time_array[index].seconds = pad(totalSeconds%60);
           time_array[index].minutes = pad(parseInt(totalSeconds/60));
           time_array[index].hours = pad(parseInt(totalSeconds/60/60));
   
           window.localStorage.setItem("Times", JSON.stringify(time_array));
       }
   
       function pad(val){
           /*Returns numbers as string, adds 0 if number only consist of 1 digit.
         
             Args:
               val(int): number of seconds, minutes or hours.
             Returns:
               String.
           */
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
   
   function calculateTotalSeconds(time_array, index){
        /*Sums up total of seconfs from seconds, minuted and hours.
         
         Args:
           time_array (array): array from local storage that contains all list entries.
           index (int): index in time_array of currently selected entry (list item).
         Returns:
           seconds (int): Total of seconds as Integer.
        */
       var seconds;
   
       seconds = parseInt(time_array[index].seconds);
       seconds = seconds + parseInt(time_array[index].minutes)*60;
       seconds = seconds + parseInt(time_array[index].hours)*60*60;
   
       return seconds;
   }
   
   function Delete(event) { //Deletes entry from list
        /*Deletes item that has been selcted for deleting via image-click on delete-picture.
         
         Args:
            event (event): Contains inforamtion about clicked element as well as surrounding elements. Offers access via DOM.
         Returns:
           None.
        */
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
   
   function ButtonClick() {
       /*Cretes new entry in timer-list with given inforamtion.
         
         Args:
           None.
         Returns:
           None.
        */
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