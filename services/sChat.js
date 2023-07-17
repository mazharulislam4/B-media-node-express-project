import Conversation from "../models/chat/conversation.modal.js";
import Message from "../models/chat/message.modal.js";
import User from "../models/user.model.js";
import { erro } from "../utils/utils.js";

export const sCreateConversation = async (creatorId, participant) => {
  if (creatorId && participant) {
    if (!creatorId && !participant)
      throw erro("creator and participant can't be same user", 404);
    // distructuring property from participant
    if (participant) {
      const user = await User.findById(creatorId);
      const participantUser = await User.findById(participant);

      if (!user && !participantUser) throw erro("not found participant", 404);

      let participantConversation;
      let creatorConversation;
      // check if already created conversation with current participant

      const creatorExistConvasation = await Conversation.findOne({
        creator: creatorId,
        participant: participant,
      });
      // if participant have already a conversation then return it
      const participanExisttConvasation = await Conversation.findOne({
        creator: participant,
        participant: creatorId,
      });

      if (creatorExistConvasation && participanExisttConvasation) {
        return [creatorExistConvasation, participanExisttConvasation];
      }

      if (!creatorExistConvasation) {
        // creating new conversation in DB
        const conversation = new Conversation({
          creator: creatorId,
          participant: participant,
        });
        // save conversation

        creatorConversation = await conversation.save();
      }else{
        creatorConversation = creatorExistConvasation; 
      }

      // if successfully create creator conversation than create participant conversation in db
      if (creatorConversation && !participanExisttConvasation) {
        const conversation = new Conversation({
          creator: participant,
          participant: creatorId,
        });
        participantConversation = await conversation.save();
      } else {
        participantConversation = participanExisttConvasation;
      }

      if (!creatorConversation || !participantConversation) {
        await Conversation.findByIdAndDelete(participant);
        await Conversation.findByIdAndDelete(creatorId);
      }

      return [creatorConversation, participantConversation];
    }
  }

  throw erro("invalid conversation cradentials", 400);
};

// ---------------------create message service------------------

export const sCreateMessage = async (messageObj) => {
  const { conversation_id, text, attachment, sender, receiver } = messageObj;

  const conversation = await Conversation.findById(conversation_id);

  if (!conversation) throw erro("no conversation found", 404);

  const messege = new Message({
    conversation_id,
    text,
    attachment,
    sender,
    receiver,
  });
  return await messege.save();
};

// get conversations
export const sGetConversations = () => {
  return Conversation.find().populate(
    "creator participant",
    "email , _id , avatar , fullName , firstName"
  );
};

// get conversations
export const sGetConversationById = (id) => {
  return Conversation.find({creator: id}).populate(
    "creator participant",
    "email , _id , avatar , fullName , firstName , lastName"
  );
};

//  get masseges

export const sGetMessages = (conversationId) => {
  if (conversationId) {
    return Message.find({ conversation_id: conversationId }).populate(
      "sender receiver",
      "email, avatar , _id , firstName , lastName"
    );
  }
};
