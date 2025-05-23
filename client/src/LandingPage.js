import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import executeAiModelRequest from "./ApiService";
import "balloon-css";

function LandingPage() {
  let [loading, setLoading] = useState(false);

  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [foodScore, setFoodScore] = useState(3);
  const [drinkScore, setDrinkScore] = useState(3);
  const [waterIntake, setWaterIntake] = useState(1600);
  const [coffee, setCoffee] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [drugs, setDrugs] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [symptoms, setSymptoms] = useState("");

  const [result, setResult] = useState(null);

  function clearResults() {
    setResult("");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearResults();
    setLoading(true);
    try {
      const chatCompletion = await executeAiModelRequest(
        symptoms,
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
      );

      setResult(chatCompletion);
      setLoading(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setResult({ error: error.message });
      setLoading(false);
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
      <div className="resultDiv">
        {paragraphs.map((paragraph, index) => {
          const cleanParagraph = paragraph.replace(/\*\*/g, "");
          return <p key={index}>{cleanParagraph}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="appTitle">PreDoc</h1>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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
        </div>

        <div>
          <label
            class="tooltip-red"
            data-balloon-length="medium"
            aria-label="0 if you mainly consume processed food and fast food. 5 if you eat healhty on a daily basis."
            data-balloon-pos="right"
          >
            Food Intake Score (0-5):
          </label>
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
          <label
            class="tooltip-red"
            data-balloon-length="medium"
            aria-label="0 if you mainly consume sugary and/or alcoholic drinks. 5 if your main drink of choice is water."
            data-balloon-pos="right"
          >
            Drink Intake Score (0-5):
          </label>
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
          <span>{waterIntake}&nbsp;ml</span>
        </div>

        <div className="form-row checkbox-wrapper-2">
          <div>
            <label>Coffee:</label>
            <input
              type="checkbox"
              class="sc-gJwTLC ikxBAC"
              checked={coffee}
              onChange={(e) => setCoffee(e.target.checked)}
            />
          </div>

          <div>
            <label>Alcohol:</label>
            <input
              type="checkbox"
              class="sc-gJwTLC ikxBAC"
              checked={alcohol}
              onChange={(e) => setAlcohol(e.target.checked)}
            />
          </div>

          <div>
            <label>Drugs:</label>
            <input
              type="checkbox"
              class="sc-gJwTLC ikxBAC"
              checked={drugs}
              onChange={(e) => setDrugs(e.target.checked)}
            />
          </div>

          <div>
            <label>Smoking:</label>
            <input
              type="checkbox"
              class="sc-gJwTLC ikxBAC"
              checked={smoking}
              onChange={(e) => setSmoking(e.target.checked)}
            />
          </div>
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
        <div className="submitDiv">
          <button className="submitBtn" type="submit">
            Submit
          </button>
        </div>
        {result && (
          <div className="resultDiv">
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
      {loading && (
        <div className="loading-overlay">
          <BeatLoader color="#ffffff" loading={loading} size={12} />
        </div>
      )}
    </>
  );
}

export default LandingPage;
