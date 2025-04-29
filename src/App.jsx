import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import EmotionGame from "./components/EmotionGame";
import AttentionGame from "./components/AttentionGame"; 
import SocialGame from "./components/SocialGame";
import Results from "./components/Results";
import GameSelection from "./components/GameSelection";
import ProgressBar from "./components/ProgressBar";
import Header from "./components/Header";
import BubbleGame from "./components/BubbleGame";

function App() {
  const [stage, setStage] = useState("landing");
  const [gameType, setGameType] = useState(null);
  const [result, setResult] = useState({ score: 0, total: 0 });
  const [allResults, setAllResults] = useState({
    emotion: { score: 0, total: 0, completed: false },
    attention: { score: 0, total: 0, completed: false },
    social: { score: 0, total: 0, completed: false },
    focus: { score: 0, total: 0, completed: false }  // Fixed typo here from "foucs" to "focus"
  });
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  // Load saved results if available
  useEffect(() => {
    const savedResults = localStorage.getItem('autismScreeningResults');
    const savedChildInfo = localStorage.getItem('childInfo');
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        // Make sure all required game types exist in the loaded data
        const validatedResults = {
          emotion: parsedResults.emotion || { score: 0, total: 0, completed: false },
          attention: parsedResults.attention || { score: 0, total: 0, completed: false },
          social: parsedResults.social || { score: 0, total: 0, completed: false },
          focus: parsedResults.focus || { score: 0, total: 0, completed: false }
        };
        setAllResults(validatedResults);
      } catch (error) {
        console.error("Error parsing saved results:", error);
        // Reset to default if there's an error
        setAllResults({
          emotion: { score: 0, total: 0, completed: false },
          attention: { score: 0, total: 0, completed: false },
          social: { score: 0, total: 0, completed: false },
          focus: { score: 0, total: 0, completed: false }
        });
      }
    }
    
    if (savedChildInfo) {
      try {
        const info = JSON.parse(savedChildInfo);
        setChildName(info.name || "");
        setChildAge(info.age || "");
      } catch (error) {
        console.error("Error parsing saved child info:", error);
      }
    }
  }, []);

  // Save results when they change
  useEffect(() => {
    localStorage.setItem('autismScreeningResults', JSON.stringify(allResults));
  }, [allResults]);

  // Save child info when it changes
  useEffect(() => {
    if (childName || childAge) {
      localStorage.setItem('childInfo', JSON.stringify({ name: childName, age: childAge }));
    }
  }, [childName, childAge]);

  const handleGameFinish = (score, total) => {
    setResult({ score, total });
    
    // Update the specific game result
    setAllResults(prev => ({
      ...prev,
      [gameType]: { score, total, completed: true }
    }));
    
    setStage("results");
  };

  const startSpecificGame = (game) => {
    setGameType(game);
    setStage("game");
  };

  const goToGameSelection = () => {
    setStage("gameSelection");
  };

  const resetAllProgress = () => {
    setAllResults({
      emotion: { score: 0, total: 0, completed: false },
      attention: { score: 0, total: 0, completed: false },
      social: { score: 0, total: 0, completed: false },
      focus: { score: 0, total: 0, completed: false }  // Added focus game to reset
    });
    localStorage.removeItem('autismScreeningResults');
    setStage("landing");
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header 
        stage={stage} 
        goHome={() => setStage("landing")} 
        childName={childName}
      />
      
      {stage === "landing" && (
        <Landing 
          startGame={goToGameSelection} 
          setChildName={setChildName}
          setChildAge={setChildAge}
          childName={childName}
          childAge={childAge}
        />
      )}
      
      {stage === "gameSelection" && (
        <GameSelection 
          startGame={startSpecificGame} 
          results={allResults}
          resetProgress={resetAllProgress}
          childName={childName}
        />
      )}
      
      {stage === "game" && gameType === "emotion" && (
        <EmotionGame
          onFinish={handleGameFinish}
          childName={childName}
        />
      )}
      
      {stage === "game" && gameType === "attention" && (
        <AttentionGame
          onFinish={handleGameFinish}
          childName={childName}
        />
      )}
      
      {stage === "game" && gameType === "social" && (
        <SocialGame
          onFinish={handleGameFinish}
          childName={childName}
        />
      )}
      {stage === "game" && gameType === "focus" && (
        <BubbleGame
          onFinish={handleGameFinish}
          childName={childName}
        />
      )}
      {stage === "results" && (
        <Results
          score={result.score}
          total={result.total}
          gameType={gameType}
          returnToMenu={() => setStage("gameSelection")}
          playAgain={() => setStage("game")}
          allResults={allResults}
          childName={childName}
        />
      )}
    </div>
  );
}

export default App;