import { Server } from "socket.io";
import { sActiveStatus } from "../services/sUser.js";
import { getMessage, getParticipants } from "./services/socketServices.js";
import { isExist, removeUser } from "./utils/utils.js";
   
const usersStatus = {};
let connectedUsers = [];

function SocketIo(httpServer) {
  // socket instance
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:3000" },
  });

 
  // connection
  io.on("connection", async (socket) => {
    console.log("socket connected with client");
    const id = socket.handshake.auth?.id;
   

if(id && !isExist(connectedUsers, id)){
  connectedUsers.push({ userId: id, socketId: socket.id });
}else{
  
  const index = connectedUsers.findIndex((ele)=>ele.userId === id)
  
 if (index > -1){
  connectedUsers[index].socketId = socket.id
 } 
  
}

    /* -------------------- from /services/socketServices.js -------------------- */

    try {

      await getParticipants(socket , connectedUsers );
      await getMessage(socket  , connectedUsers);
      /* ---------------------- // updating db active status ---------------------- */

      const activeUser = await sActiveStatus(id, "online");
      if (activeUser) {
        usersStatus[id] = { isOnline: true, user: activeUser };
           // activer status
      await activeStatus();
      await allActiveUsers();
      }
      
   
   
    } catch (err) {
      console.log(err);
    }

    // disconnect
    socket.on("disconnect", async () => {
      console.log('disconnected');
      // remove disconnected user from connectedUser array 
      try {
        const inActiveUser = await sActiveStatus(id, "offline");
        // io?.emit('inActiveUser' , inActiveUser)
        if (inActiveUser) {
          usersStatus[id] = { isOnline: false, user: inActiveUser };
        }

        await activeStatus();
  
        connectedUsers = removeUser(connectedUsers, id);

      } catch (err) {
        console.log(err);
      }
    });

    // user active status emit

    async function activeStatus() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(io.emit("activeStatus", usersStatus));
        }, 3000);
      });
    }

    // all active users
    async function allActiveUsers() {
      let activeUsers = [];

      for (let keys in usersStatus) {
        if (usersStatus[keys].isOnline) {
          activeUsers.push(usersStatus[keys]);
        } else {
          activeUsers = activeUsers.filter((value) => !value.isOnline);
        }
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(socket.broadcast.emit("allActiveUsers", activeUsers));
        }, 1000);
      });
    }
  });
}

export default SocketIo;
