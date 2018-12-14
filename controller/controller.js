
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
        send_debug("CLIENT");
        if(!c) {
            send_debug(";rando");
        }else {
            send_debug(";" +c );
        }
        
        open = true;
    }

    var shootButton = document.getElementById("shoot");
    var switchButton = document.getElementById("switch");

    var sendShoot = function() {
        send_debug("SHOOT");
        shootButton.style.color = "white";
    }
    var sendSwitch = function() {
        send_debug("SWITCH" );
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
        send_debug("LEFTSTART");
      }
      }).on('end', function(evt, data) {
      if(open) {
        send_debug("LEFTEND");
      }
    }).on('move', function(evt, data) {
      if(open) {
        let str = "*"+data.angle.radian.toString().substring(0, 4);
        add_msg(str)
      }
    });

    setInterval(send, 25);
}


