import { ApiError } from "./ApiError.js";

const openRouterAI = async (prompt) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.ROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "openai/gpt-5.1-codex-max",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": false,
                "max_tokens": 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(response.status, `OpenRouter API Error: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || "";

        return content;

    } catch (error) {
        console.error("OpenRouter Request Failed:", error);
        throw error;
    }
}

export default openRouterAI;