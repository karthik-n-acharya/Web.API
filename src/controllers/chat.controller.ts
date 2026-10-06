import type { RequestHandler } from "express";
import { chatRequestSchema } from "../schemas/chat.schema.js";
import { generatePortfolioAnswer } from "../services/gemini.service.js";

export const postChat: RequestHandler = async (request, response) => {
  const parsedRequest = chatRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    response.status(400).json({
      error: "Message must be a non-empty string.",
    });
    return;
  }

  const answer = await generatePortfolioAnswer(parsedRequest.data.message);
  response.status(200).json({ answer });
};
