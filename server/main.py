from flask import Flask, request
from server import Server
import time
from flask_cors import CORS, cross_origin

#Schedule removal of rooms
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
cron = BackgroundScheduler()

app = Flask(__name__)
cors = CORS(app)

rooms = []

@app.route("/test")
def test():
    return "test"


@app.route("/getcontroller", methods=["POST", "GET"])
@cross_origin()
def get_controller():
    global rooms
    print(int(request.data.decode()))
    room_s = [x for x in rooms if x.port == int(request.data.decode())]
    print([x.port for x in rooms])

    if room_s:
        return room_s[0].controller
    else: 
        return "No such room"
@app.route("/getroom", methods=["GET", "POST"])
@cross_origin()
def hello():
    print(request.data)
    global rooms
    last_id = -1
    room_ids = [x.port - 10000 for x in rooms]
    for i in range(100):
        if i not in room_ids:
            s = Server("0.0.0.0", 10000+i, request.data)
            s.start()
            rooms.append(s)
            last_id = 10000 + i
            break 
    return str(last_id)

def job_function():
    global rooms
    to_remove = []
    for room in rooms:
        if time.time() - room.server.last_update_time > 300:
            room.close()
            to_remove.append(room)
    rooms = [x for x in rooms if x not in to_remove]
    print("ROOMS UPDATED")
    print("current rooms active: ", len(rooms))

cron.add_job(job_function, "interval", minutes=1)
cron.start()
atexit.register(lambda: cron.shutdown(wait=False))
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
