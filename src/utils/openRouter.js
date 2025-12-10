import { ApiError } from "./ApiError.js";

const MODELS = [
    "openai/gpt-5.1-codex-max", // Primary
    "google/gemini-2.0-flash-exp:free", // Fallback 1
    "meta-llama/llama-3.3-70b-instruct:free", // Fallback 2
    "mistralai/mistral-7b-instruct:free", // Fallback 3
    "mistralai/devstral-2512:free", // Fallback 4
];

const openRouterAI = async (prompt) => {
    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`Attempting with model: ${model}`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.ROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "model": model,
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
                // If it's a 4xx error (client error) or 5xx (server error), we might want to switch models.
                // Especially 402 (Payment Required) or 429 (Rate Limit).
                throw new ApiError(response.status, `OpenRouter API Error (${model}): ${errorText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || "";

            console.log(`Success with model: ${model}`);
            return content;

        } catch (error) {
            console.warn(`Failed with model ${model}:`, error.message);
            lastError = error;
            // Continue to the next model
        }
    }

    // If we exit the loop, it means all models failed
    console.error("All OpenRouter models failed.");
    throw lastError || new ApiError(500, "All OpenRouter models failed to respond.");
}

export default openRouterAI;