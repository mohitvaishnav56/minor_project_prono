import prompt from "../prompts/challengePrompt.js";
import gemini from "../utils/gemini.js";

export const generateChallenge = async () => {
    // 1. Get the raw response string from the Gemini model
    const rawResponse = await gemini(prompt());
    
    // 2. Define a function to clean the response string
    const cleanJSONString = (responseString) => {
        // Remove Markdown code block fences (```json, ```) and any surrounding whitespace
        // This regex handles various languages (json, js, etc.) or no language marker
        let cleanedString = responseString.replace(/```(json|javascript|js)?\s*|```/gs, '').trim();
        
        // Sometimes the model might add a leading/trailing newline or whitespace
        return cleanedString.trim();
    };

    // 3. Clean the response string
    const jsonString = cleanJSONString(rawResponse);

    let challengeData;
    
    try {
        // 4. Parse the cleaned string into a JavaScript object
        challengeData = JSON.parse(jsonString);

        // console.log("Successfully generated and parsed challenge data:");
        // console.log(challengeData);
        return challengeData;
        
        // The challengeData object is now ready to be used, e.g., validated and stored in MongoDB
        // return challengeData; 

    } catch (error) {
        console.error("Error parsing challenge JSON. Raw response was:", rawResponse);
        console.error("Cleaned string was:", jsonString);
        console.error("Parsing error:", error);
        // Handle the failure (e.g., regenerate the prompt, log the error)
        return null;
    }

    return challengeData;
};