import { Router } from "express";
import { postChat } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/chat", postChat);

export default chatRouter;
