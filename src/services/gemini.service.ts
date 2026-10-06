import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";
import { createPortfolioPrompt } from "../prompts/portfolio.prompt.js";

const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function generatePortfolioAnswer(
  message: string,
): Promise<string> {
  try {
    const response = await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: createPortfolioPrompt(message),
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      throw new Error("Gemini returned an empty response");
    }

    return answer;
  } catch (error: unknown) {
    const logContext: { name: string; status?: number; message?: string } = {
      name: error instanceof Error ? error.name : "Unknown error",
    };

    if (typeof error === "object" && error !== null && "status" in error) {
      if (typeof error.status === "number") {
        logContext.status = error.status;
      }
    }

    if (error instanceof Error) {
      logContext.message = error.message
        .replaceAll(env.GEMINI_API_KEY, "[REDACTED]")
        .replaceAll(message, "[REDACTED]")
        .slice(0, 500);
    }

    console.error("Gemini request failed:", logContext);
    throw new AppError(502, "Unable to process your request.");
  }
}
