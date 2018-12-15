from flask import Flask
from server import Server
import time

#Schedule removal of rooms
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
cron = BackgroundScheduler()


app = Flask(__name__)
rooms = []

@app.route("/getroom")
def hello():
    global rooms
    last_id = -1
    room_ids = [x.port - 10000 for x in rooms]
    for i in range(100):
        if i not in room_ids:
            s = Server("0.0.0.0", 10000+i)
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
            to_remove.push(room)
    rooms = [x for x in rooms if x not in to_remove]
    print("ROOMS UPDATED")
    print("current rooms active: ", len(rooms))

cron.add_job(job_function, "interval", minutes=1)
cron.start()
atexit.register(lambda: cron.shutdown(wait=False))
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
