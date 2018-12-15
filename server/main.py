from flask import Flask
from server import Server
import time

#Schedule removal of rooms
import atexit
from apscheduler.scheduler import Scheduler
cron = Scheduler(daemon=True)
cron.start()

app = Flask(__name__)
rooms = []


@app.route("/test")
def test():
    return "test"

@app.route("/getroom")
def getroom():
    last_id = -1
    room_ids = [x.port - 10000 for x in rooms]
    for i in range(100):
        if i not in room_ids:
            s = Server("0.0.0.0", 10000+i)
            s.start()
            rooms.append(s)
            last_id = 10000 + i
       
    return str(last_id)

@cron.interval_schedule(minutes=5)
def job_function():
    to_remove = []
    for room in rooms:
        if time.time() - room.server.last_update_time > 300:
            room.close()
            to_remove.push(room)
    
    rooms = [x for x in rooms if x not in to_remove]

atexit.register(lambda: cron.shutdown(wait=False))
app.run()