// gpt.js
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getDoctorResponse(userInput) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: userInput }],
        model: "gpt-4o-mini",
    });

    return chatCompletion.choices[0].message.content;
}
