import { GoogleGenerativeAI } from "@google/generative-ai";


export const generateResponse = async (context, question, apiKey) => {
    try {
        const key = apiKey || process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(key);
        // Using gemini-1.5-flash for speed and efficiency
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an academic assistant for a university student.
      Your goal is to answer questions strictly based on the provided context (Syllabus and Notes).
      
      CONTEXT:
      ${context}
      
      QUESTION:
      ${question}
      
      INSTRUCTIONS:
      - Answer clearly, concisely, and in a helpful tone.
      - If the answer is not in the context, explicitly state: "Lo siento, no encuentro esa información en tu syllabus o apuntes."
      - Do not hallucinate or provide external information not found in the context.
      - Answer in the same language as the question (likely Spanish).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw new Error("Failed to generate response from AI service.");
    }
};
