import {
  sCreateConversation,
  sCreateMessage,
  sGetConversationById,
  sGetConversations,
  sGetMessages,
} from "../../services/sChat.js";

export const cCreateConversation = async (req, res, next) => {
  const { participant, creator } = req.body;
  try {
    if (!participant || !creator)
      return res
        .status(400)
        .json({ error: true, data: null, message: "invalid data" });
    //   create conversation
    const conversation = await sCreateConversation(creator, participant);

    if (!conversation)
      return res
        .status(500)
        .json({ error: true, data: null, message: "internal sever error" });

    return res.status(201).json({
      error: null,
      data: conversation,
      message: "successfully created conversation",
    });
  } catch (err) {
    next(err);
  }
};

// send massege

export const cCreateMessage = async (req, res, next) => {
  try {
    const { sender, receiver, text, attachment, conversation_id } = req.body;

    if (!conversation_id || !sender || !receiver || !text)
      return res
        .status(400)
        .json({ error: true, data: null, message: "invalid data pass" });

    const massege = await sCreateMessage({
      conversation_id,
      sender,
      receiver,
      text,
      attachment,
    });

    if (!massege)
      return res
        .status(500)
        .json({ error: true, data: null, message: "internal sever error" });

    return res.status(201).json({
      error: null,
      data: massege,
      message: "successfully created message",
    });
  } catch (err) {
    next(err);
  }
};

// get conversations

export const cGetConversations = async (req, res, next) => {
  try {
    const conversations = await sGetConversations();
    if (!conversations)
      return res
        .status(404)
        .json({ error: false, data: null, message: "nof found!" });

    return res
      .status(200)
      .json({
        error: false,
        data: conversations,
        message: "succesfully got conversations",
      });
  } catch (err) {
    next(err);
  }
};


// get conversation

export const cGetConversation = async (req, res, next) => {
    try {
        const {id} = req.params 
    
      const conversation = await sGetConversationById(id);
      if (!conversation)
        return res
          .status(404)
          .json({ error: false, data: null, message: "nof found!" });
  
      return res
        .status(200)
        .json({
          error: false,
          data: conversation,
          message: "succesfully got conversations",
        });
    } catch (err) {
      next(err);
    }
  };
  

//   get masseges 
export const cGetMesseges =async (req  ,res, next)=>{
    try {
        const {id} = req.params 
       
      const message = await sGetMessages(id);
      if (!message)
        return res
          .status(404)
          .json({ error: false, data: null, message: "nof found!" });
  
      return res
        .status(200)
        .json({
          error: false,
          data: message,
          message: "succesfully got messages",
        });
    } catch (err) {
      next(err);
    }
}