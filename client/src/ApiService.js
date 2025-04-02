import { InferenceClient } from "@huggingface/inference";

const localDebug = false;

const executeAiModelRequest = async (
  prompt,
  age,
  sex,
  height,
  weight,
  foodScore,
  drinkScore,
  waterIntake,
  coffee,
  alcohol,
  drugs,
  smoking
) => {
  if (localDebug) {
    const chatCompletion = JSON.parse(
      `{"object":"chat.completion","id":"","created":1743601664,"model":"mistralai/Mistral-Nemo-Instruct-2407","system_fingerprint":"3.2.1-native","choices":[{"index":0,"message":{"role":"assistant","content":"Based on the provided information, here are some potential medical conditions that could be related to the user's headaches. Please note that these are possibilities and a thorough medical evaluation is required for an accurate diagnosis.\\n\\n1. **Hydration-related issues**: Given the user's low water intake (1200 ml), despite their high body weight (180 kg), dehydration could be a factor contributing to headaches. Proper hydration is crucial for overall health and can help prevent headaches.\\n\\n2. **Poor diet**: A Food Intake Score of 2 suggests a suboptimal diet. Poor nutrition can lead to various health issues, including chronic headaches or migraines.\\n\\n3. **Substance use and abuse**: The user's consumption of alcohol, drugs, and coffee (assuming it's caffeinated) could contribute to headaches. Regular and excessive use of these substances can cause or worsen headaches.\\n\\n4. **Tobacco use**: Smoking can cause headaches, and chronic smoking can lead to various health issues, including migraines and increased blood pressure, which could potentially cause headaches.\\n\\n5. **Obesity**: With a BMI of approximately 61 (extremely obese), the user is at a higher risk for various health issues that could cause headaches, such as:\\n  - **Sleep apnea**: This condition can cause headaches and is more common in obese individuals.\\n  - **High blood pressure (hypertension)**: Obesity is a risk factor for hypertension, which can cause headaches.\\n  - **Metabolic disorders**: Some metabolic disorders can cause or worsen headaches.\\n\\n6. **Other possible conditions**: Since headaches can have many causes, other potential conditions to consider could include:\\n  - **Eye strain**: Given the user's short stature (28 cm), incorrect posture or eye strain could potentially cause headaches.\\n  - **Stress and anxiety**: These can lead to tension headaches or migraines.\\n  - **Underlying medical conditions**: Certain medical conditions like infections, sinus problems, or brain tumors can also cause headaches, although these are less likely given the limited information provided."}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 148, "completion_tokens": 427, "total_tokens": 575}}`
    );
    await delay();
    return chatCompletion;
  } else {
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
    
    Based on this information, please provide some of potential related medical conditions. Remember, this is for informational purposes only and should not be used for medical advice. Also provide some Nutrition Suggestions and some Workout Tips. 
    The result should display 3 sections, the Potential Medical Conditions, the Nutrition Suggestions and the Workout Tips. And each section should contain the information short and simplified, nothing too extended.
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
  }
};

async function delay() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Waited for 3 seconds");
}

export default executeAiModelRequest;
