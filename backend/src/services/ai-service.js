// Cloudflare Workers AI Service

export const generateResponse = async (context, question, ai) => {
    try {
        if (!ai) throw new Error("AI binding is missing");

        const prompt = `You are an academic assistant for a university student.
Your goal is to answer questions strictly based on the provided context (Syllabus and Notes).

CONTEXT:
${context}

QUESTION:
${question}

INSTRUCTIONS:
- Answer clearly, concisely, and in a helpful tone.
- If the answer is not in the context, explicitly state: "Lo siento, no encuentro esa información en tu syllabus o apuntes."
- Do not hallucinate or provide external information not found in the context.
- Answer in the same language as the question (likely Spanish).`;

        const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
                { role: 'system', content: 'Eres un asistente académico útil que responde preguntas basándose únicamente en el contexto proporcionado.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1024
        });

        return response.response;
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw new Error(`AI Service Error: ${error.message}`);
    }
};
