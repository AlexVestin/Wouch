let get_end = function(len) {
  let end = "";
  for(var i = 0; i < 14 - len; i++) {
    end += "|";
  }
  return end;
}

var msg_list = new Array();
open = false;
var exampleSocket;
add_msg = function(msg) {
    msg_list.push(msg);
}


send_debug = function(msg) {
    if(msg.includes("LEFTEND") || msg.includes("LEFTSTART"))
        console.log("sending: " +  msg)
    exampleSocket.send(msg)
}


send = function() {
    if(open && msg_list.length > 0) {
        send_debug(msg_list[msg_list.length - 1]);
        msg_list = new Array();
    }
}

window.onload = function() {
    exampleSocket = new WebSocket("ws:3.8.115.45:8000");

    var optionsLeft = {
        zone: document.getElementById("left_controller"),
        mode: 'static',
        position: {left: '50%', top: '50%'}
    }
    
    var managerLeft = nipplejs.create(optionsLeft);
    var url = new URL(window.location.href);
    var c = url.searchParams.get("nick");

    console.log("??")
    exampleSocket.onopen = function() {
        console.log("????")
        send_debug("CLIENT" +get_end("CLIENT".length));
        send_debug(";" +c + get_end(c.length - 1));
        open = true;
    }

    var shootButton = document.getElementById("shoot");
    var switchButton = document.getElementById("switch");

    var sendShoot = function() {
        send_debug("SHOOT" + get_end("SHOOT".length));
        shootButton.style.color = "white";
    }
    var sendSwitch = function() {
        send_debug("SWITCH" + get_end("SWITCH".length));
        switchButton.style.color = "white";
    }
    var endShoot = function() {
        shootButton.style.color = "black";
    }
    var endSwitch = function() {
        switchButton.style.color = "black";
    }

    shootButton.addEventListener("touchstart", sendShoot, false);
    switchButton.addEventListener("touchstart", sendSwitch, false);
    switchButton.addEventListener("touchend", endShoot, false);
    shootButton.addEventListener("touchend", endSwitch, false);

    shootButton.addEventListener("click", sendShoot, false);
    switchButton.addEventListener("click", sendSwitch, false);


    managerLeft.on('start', function(evt, data) {
      if(open) {
        send_debug("LEFTSTART" + get_end("LEFTSTART".length));
      }
      }).on('end', function(evt, data) {
      if(open) {
        send_debug("LEFTEND" + get_end("LEFTEND".length));
      }
    }).on('move', function(evt, data) {
      if(open) {
        let str = "*"+data.angle.radian.toString().substring(0, 4);
        add_msg(str)
      }
    });

    setInterval(send, 25);
}


