import React, { useEffect, useState } from "react";
import axios from "axios"; 

const App = () => {
  const [countries, setCountries] = useState([]);
  const [flagCountry, setFlagCountry] = useState(null);
  const [options, setOptions] = useState([]); 
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(3); 
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(""); 
  const [feedbackClass, setFeedbackClass] = useState(""); 


  const fetchCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

 
  const startGame = () => {
    if (countries.length === 0) return;

 
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];

    
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomOption =
        countries[Math.floor(Math.random() * countries.length)];
      if (
        !wrongOptions.includes(randomOption) &&
        randomOption.name.common !== randomCountry.name.common
      ) {
        wrongOptions.push(randomOption);
      }
    }

    
    const shuffledOptions = [...wrongOptions, randomCountry].sort(
      () => Math.random() - 0.5
    );

    setFlagCountry(randomCountry);
    setOptions(shuffledOptions);
    setFeedback(""); 
    setFeedbackClass(""); 
  };

  
  const handleAnswer = (selectedCountry) => {
    if (selectedCountry.name.common === flagCountry.name.common) {
      setScore(score + 1);
      setFeedback("Congratulations! 🎉");
      setFeedbackClass("correct");


      setTimeout(() => {
        startGame();
      }, 2000);
    } else {
      if (attempts > 1) {
        setAttempts(attempts - 1);
        setFeedback("Wrong! 😞");
        setFeedbackClass("incorrect");


        setTimeout(() => {
          startGame();
        }, 2000);
      } else {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    if (countries.length > 0) {
      startGame();
    }
  }, [countries]);

  return (
    <div className={`app ${feedbackClass}`} style={{ textAlign: "center" }}>
      <h1>Flag Finder Game</h1>
      <p>Score: {score}</p>
      <p>Attempts Left: {attempts}</p>

      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Your final score: {score}</p>
          <button
            onClick={() => {
              setGameOver(false);
              setScore(0);
              setAttempts(3); // Reset attempts
              startGame();
            }}
          >
            Play Again
          </button>
        </div>
      ) : flagCountry && options.length > 0 ? (
        <div>
          <img
            src={flagCountry.flags.svg}
            alt="Flag"
            style={{ width: "200px", marginBottom: "20px" }}
          />
          <div>
            {options.map((option) => (
              <button
                key={option.name.common}
                onClick={() => handleAnswer(option)}
                style={{
                  display: "block",
                  margin: "10px auto",
                  width: "200px",
                  padding: "10px",
                }}
              >
                {option.name.common}
              </button>
            ))}
          </div>
          <div className="feedback">
            <h2>{feedback}</h2>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
