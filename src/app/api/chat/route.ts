import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/content";

// Edge runtime for low-latency streaming on Vercel.
export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: CHAT_SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
