import React, { useState } from "react";
import { InferenceClient } from "@huggingface/inference";

function LandingPage() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [foodScore, setFoodScore] = useState(3); // Default to 3
  const [drinkScore, setDrinkScore] = useState(3); // Default to 3
  const [waterIntake, setWaterIntake] = useState(1600); // Default to 1600ml
  const [coffee, setCoffee] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [drugs, setDrugs] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [symptoms, setSymptoms] = useState("");

  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    const prompt = `
        User Information:
        ${context}

        Symptoms: ${symptoms}

        Based on this information, please provide a brief summary of potential related medical conditions. Remember, this is for informational purposes only and should not be used for medical advice.
    `;

    try {
      const chatCompletion = await client.chatCompletion({
        provider: "hf-inference",
        model: "mistralai/Mistral-Nemo-Instruct-2407",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
      });

      setResult(chatCompletion);
    } catch (error) {
      console.error("Error fetching from Hugging Face API:", error);
      setResult({ error: error.message });
    }
  };

  const formatResult = (result) => {
    if (!result || result.error) {
      return <p>Error: {result?.error || "No results available."}</p>;
    }

    const content = result.choices[0].message.content;
    const paragraphs = content
      .split("\n")
      .filter((paragraph) => paragraph.trim() !== "");

    return (
      <div class="resultDiv">
        {paragraphs.map((paragraph, index) => {
          const cleanParagraph = paragraph.replace(/\*\*/g, ""); 
          return <p key={index}>{cleanParagraph}</p>;
        })}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 class="appTitle">PreDoc</h1>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div>
        <label>Sex:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Height (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div>
        <label>Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div>
        <label>Food Intake Score (0-5):</label>
        <input
          type="range"
          min="0"
          max="5"
          value={foodScore}
          onChange={(e) => setFoodScore(parseInt(e.target.value))}
        />
        <span>{foodScore}</span>
      </div>
      <div>
        <label>Drink Intake Score (0-5):</label>
        <input
          type="range"
          min="0"
          max="5"
          value={drinkScore}
          onChange={(e) => setDrinkScore(parseInt(e.target.value))}
        />
        <span>{drinkScore}</span>
      </div>
      <div>
        <label>Daily Water Intake (ml):</label>
        <input
          type="range"
          min="200"
          max="3000"
          step="100"
          value={waterIntake}
          onChange={(e) => setWaterIntake(parseInt(e.target.value))}
        />
        <span>{waterIntake} ml</span>
      </div>
      <div>
        <label>Coffee:</label>
        <input
          type="checkbox"
          checked={coffee}
          onChange={(e) => setCoffee(e.target.checked)}
        />
      </div>
      <div>
        <label>Alcohol:</label>
        <input
          type="checkbox"
          checked={alcohol}
          onChange={(e) => setAlcohol(e.target.checked)}
        />
      </div>
      <div>
        <label>Drugs:</label>
        <input
          type="checkbox"
          checked={drugs}
          onChange={(e) => setDrugs(e.target.checked)}
        />
      </div>
      <div>
        <label>Smoking:</label>
        <input
          type="checkbox"
          checked={smoking}
          onChange={(e) => setSmoking(e.target.checked)}
        />
      </div>
      <div>
        <label>Symptoms (max 350 characters):</label>
      </div>
      <div>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value.slice(0, 350))}
          maxLength="350"
        />
      </div>
      <button class="submitBtn" type="submit">
        Submit
      </button>
      {result && (
        <div class="resultDiv">
          <h3>Results:</h3>
          {formatResult(result)}
          <p>
            <strong>Disclaimer:</strong> This information is for demonstration
            purposes only and should not be used for medical advice. Always
            consult with a qualified healthcare professional.
          </p>
        </div>
      )}
    </form>
  );
}

export default LandingPage;
