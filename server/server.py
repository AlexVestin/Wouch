from SimpleWebSocketServ import SimpleWebSocketServer, WebSocket
import socket
clients = []
global_id_counter = 0

class SimpleServer(WebSocket): 
    initialized = False
    name = ""
    id = -1
    is_client = False
    is_host = False

    def send_to_servers(self, msg):
        for client in clients:
            if not client.is_client and client != self:
                client.sendMessage(str(chr(self.id) + msg))                

    def handleMessage(self):
        if "CLIENT" in self.data:
            self.is_client = True
            return
        elif "SERVER" in self.data:
            self.is_client = False
            if not [x for x in clients if x.is_host]:
                self.is_host = True
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
        elif self.is_host:
            self.send_to_servers(self.data)

    def handleConnected(self):
       print(self.address, 'connected')
       clients.append(self)

    def handleClose(self):
       if self.is_host:
           for c in clients:
               if not c.is_client:
                   c.is_host = True
                   c.sendMessage("HOSTING")
                   break
                
       clients.remove(self)
       print(self.address, 'closed')

server = SimpleWebSocketServer('', 8000, SimpleServer)
server.serveforever()
