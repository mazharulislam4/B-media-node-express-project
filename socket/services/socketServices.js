import { sCreateMessage, sGetConversationById } from "../../services/sChat.js";

import { findAUserById } from "../utils/utils.js";

/* ----------------------  chat participants  events ---------------------- */
export const getParticipants = async (socket, users) => {
  /* --------------- // request to frontend to get participents --------------- */
  socket.on("reqParticipants", async (data) => {
    const id = data?.id;

    const particiapnts = await sGetConversationById(id);
    const payload = particiapnts ? particiapnts : { msg: "not found!" };
    /* //-------- send particiapants to frontend via getParticipants event -------- */
    socket.emit("getParticipants", payload);
  });
};
/* -----------------------/---- et participants end --------/------------------ */

/* ------------------------ get masseges from client ------------------------ */

export const getMessage = async (socket, users) => {
  try {
    /* //------------------------- get  message frpm client ------------------------- */
    socket.on("sendMessageToServer", async (data) => {
      const USER = findAUserById(users, data?.receiver);
  
      /* //-------------------------- create masseges in db ------------------------- */
      if (USER) {
        await sCreateMessage({
          conversation_id: data?.conversation_id,
          text: data?.message,
          attachment: data?.attachment,
          sender: data?.sender,
          receiver: data?.receiver,
        });

      const msgData = {
        conversation_id: data?.conversation_id,
        text: data?.text,
        attachment: data?.attachment,
        sender: data?.sender,
        receiver: data?.receiver,
      }
      
        /* //------------------------ // send message to client ----------------------- */
      
         socket.broadcast.emit("getMessages", msgData);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
