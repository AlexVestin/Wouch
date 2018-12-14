from SimpleWebSocketServ import SimpleWebSocketServer, WebSocket
import socket
clients = []
global_id_counter = 0
class SimpleServer(WebSocket): 
    initialized = False
    name = ""
    id = -1
    is_client = False

    def send_to_servers(self, msg):
         for client in clients:
            if not client.is_client:
                client.sendMessage(str(chr(self.id) + msg))                

    def handleMessage(self):
        if "CLIENT" in self.data:
            self.is_client = True
            return
        elif "SERVER" in self.data:
            self.is_client = False
            return
        # ID handshake
        if self.is_client:
            if not self.initialized:
                global global_id_counter
                self.name = self.data
                self.id = global_id_counter
                self.initialized = True
                global_id_counter += 1
            else:
               self.send_to_servers(self.data)

    def handleConnected(self):
       print(self.address, 'connected')
       clients.append(self)

    def handleClose(self):
       clients.remove(self)
       print(self.address, 'closed')

server = SimpleWebSocketServer('0.0.0.0', 8000, SimpleServer)
server.serveforever()
