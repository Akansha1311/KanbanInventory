var socket = io();
let ul = document.getElementById("notificationMain");
let deleteAll = document.getElementById("deleteNotifications");

function createNotifications() {
  console.log("Function fires");
  socket.on("dept completed", (msg) => {
    console.log("Dept Completed");
    msg = "One " + msg;
    let li = document.createElement("li");
    li.innerText = msg;
    let p = document.createElement("p");
    let time = moment().format("llll");
    p.innerText = time;
    li.appendChild(p);
    ul.insertBefore(li, ul.firstChild);
    try {
      document.getElementById("notification").muted = false;
      document.getElementById("notification").play();
    } catch (error) {
      alert("click somewhere on the page to get notification sound");
    }
  });
  socket.on("workcycle complete", (msg) => {
    console.log(msg, "workcycle completed");
    let li = document.createElement("li");
    li.innerText = msg;
    let p = document.createElement("p");
    let time = moment().format("llll");
    p.innerText = time;
    li.appendChild(p);
    ul.insertBefore(li, ul.firstChild);
    try {
      document.getElementById("notification").muted = false;
      document.getElementById("notification").play();
    } catch (error) {
      alert("click somewhere on the page to get notification sound");
    }
  });
}

createNotifications();
