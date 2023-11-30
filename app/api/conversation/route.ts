import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAI, ChatCompletionMessage } from "openai"; // Import the necessary types

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAI(configuration);

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        // Make a request to OpenAI to create chat completions
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        // Extract the completion message from the response
        const completionMessage = response.choices[0].message;

        return new NextResponse(completionMessage, { status: 200 }); // Return the completion message as the response
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
