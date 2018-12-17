from SimpleWebSocketServ import SimpleWebSocketServer, WebSocket
import socket, time, threading

class SimpleServer(WebSocket): 
    initialized = False
    id = -1
    is_client = False
    is_host = False

    def send_to_servers(self, msg):
        for client in self.server.connections.values():
            if not client.is_client and client != self:
                client.sendMessage(str(chr(self.id) + msg))                

    def handleMessage(self):
        self.server.last_update_time = time.time()
        if "CLIENT" in self.data:
            self.is_client = True
            self.id = self.server.id_counter
            self.server.id_counter += 1
            return
        elif "SERVER" in self.data:
            self.is_client = False
            self.id = self.server.id_counter
            if not [x for x in self.server.connections.values() if x.is_host]:
                self.is_host = True
                self.sendMessage(chr(self.id)+"HOSTING")
            else:
                self.sendMessage(chr(self.id)+"CLONING")
            self.server.id_counter += 1
            return
        # ID handshake
        if self.is_client:
            if not self.initialized:
                self.initialized = True
                self.send_to_servers(self.data)
            else:
                 self.send_to_servers(self.data)
        elif self.is_host:
            self.send_to_servers(self.data)
    def handleConnected(self):
       print(self.address, 'connected')
       self.server.last_update_time = time.time()

    def handleClose(self):
       if self.is_host:
           for c in clients:
               if not c.is_client:
                   c.is_host = True
                   c.sendMessage("HOSTING")
                   break
       self.send_to_servers("CLOSED")
       print(self.address, 'closed')


class Server:
    def __init__(self, url, port, controller):
        self.server = SimpleWebSocketServer(url, port, SimpleServer)
        self.controller = controller
        self.port = port
        self.url = url
        self.running = True 
    def start(self):
        threading.Thread(target=self.serve).start()
    
    def serve(self):
        while True and self.running:
            self.server.serveonce()

    def close(self):
        self.running = False
        self.server.close()

