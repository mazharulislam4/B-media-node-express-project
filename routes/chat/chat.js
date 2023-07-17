import express from 'express';
import { cCreateConversation, cCreateMessage, cGetConversation, cGetConversations, cGetMesseges } from '../../controller/chat/chatController.js';
import { authenticate, isAdmin } from '../../middlewares/common/authorization.js';
const Router = express.Router();

// conversation  

Router.get('/conversation' , authenticate , isAdmin, cGetConversations);
Router.get('/conversation/:id' , authenticate ,  cGetConversation);
Router.get('/massege/:id' ,authenticate ,  cGetMesseges);
Router.post('/conversation' ,authenticate ,  cCreateConversation);
Router.post('/massege' ,authenticate ,  cCreateMessage);



export default Router;