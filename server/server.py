from SimpleWebSocketServ import SimpleWebSocketServer, WebSocket
import socket
clients = []
global_id_counter = 0

class SimpleServer(WebSocket): 
    initialized = False
    id = -1
    is_client = False
    is_host = False

    def send_to_servers(self, msg):
        for client in clients:
            if not client.is_client and client != self:
                client.sendMessage(str(chr(self.id) + msg))                

    def handleMessage(self):
        global global_id_counter
        if "CLIENT" in self.data:
            self.is_client = True
            self.id = global_id_counter
            global_id_counter += 1
            return
        elif "SERVER" in self.data:
            self.is_client = False
            self.id = global_id_counter
            if not [x for x in clients if x.is_host]:
                self.is_host = True
                self.sendMessage(chr(self.id)+"HOSTING")
            else:
                self.sendMessage(chr(self.id)+"CLONING")
            global_id_counter += 1
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
       clients.append(self)

    def handleClose(self):
       if self.is_host:
           for c in clients:
               if not c.is_client:
                   c.is_host = True
                   c.sendMessage("HOSTING")
                   break
                
       clients.remove(self)
       self.send_to_servers("CLOSED")
       print(self.address, 'closed')

server = SimpleWebSocketServer('0.0.0.0', 8000, SimpleServer)
server.serveforever()
