import { InferenceClient } from "@huggingface/inference";

const executeAiModelRequest = async (prompt, age, sex, height, weight, foodScore, drinkScore, waterIntake, coffee, alcohol, drugs, smoking) => {
  const apiToken = process.env.REACT_APP_API_KEY;
  const client = new InferenceClient(apiToken);

  const context = `
          Age: ${age}
          Sex: ${sex}
          Height: ${height} cm
          Weight: ${weight} kg
          Food Intake Score (0-5): ${foodScore}
          Drink Intake Score (0-5): ${drinkScore}
          Water Intake: ${waterIntake} ml
          Coffee Consumption: ${coffee ? "Yes" : "No"}
          Alcohol Consumption: ${alcohol ? "Yes" : "No"}
          Drug Consumption: ${drugs ? "Yes" : "No"}
          Smoking: ${smoking ? "Yes" : "No"}
      `;

  const fullPrompt = `
          User Information:
          ${context}

          Symptoms: ${prompt}

          Based on this information, please provide a brief summary of potential related medical conditions. Remember, this is for informational purposes only and should not be used for medical advice.
      `;

  try {
    const chatCompletion = await client.chatCompletion({
      provider: "hf-inference",
      model: "mistralai/Mistral-Nemo-Instruct-2407",
      messages: [
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      max_tokens: 500,
    });

    return chatCompletion;
  } catch (error) {
    console.error("Error fetching from Hugging Face API:", error);
    throw error; // Re-throw the error to be handled in LandingPage.js
  }
};

export default executeAiModelRequest;