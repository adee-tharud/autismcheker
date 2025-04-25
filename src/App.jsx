// import React, { useState } from "react";
// import Landing from "./components/Landing";
// import EmotionGame from "./components/EmotionGame";
// import Results from "./components/Results";

// function App() {
//   const [stage, setStage] = useState("landing");
//   const [result, setResult] = useState({ score: 0, total: 0 });

//   return (
//     <>
//       {stage === "landing" && (
//         <Landing startGame={() => setStage("game")} />
//       )}
//       {stage === "game" && (
//         <EmotionGame
//           onFinish={(score, total) => {
//             setResult({ score, total });
//             setStage("results");
//           }}
//         />
//       )}
//       {stage === "results" && (
//         <Results
//           score={result.score}
//           total={result.total}
//           restart={() => setStage("landing")}
//         />
//       )}
//     </>
//   );
// }

// export default App;

// App.jsx
import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import EmotionGame from "./components/EmotionGame";
import AttentionGame from "./components/AttentionGame"; 
import SocialGame from "./components/SocialGame";
import Results from "./components/Results";
import GameSelection from "./components/GameSelection";
import ProgressBar from "./components/ProgressBar";
import Header from "./components/Header";

function App() {
  const [stage, setStage] = useState("landing");
  const [gameType, setGameType] = useState(null);
  const [result, setResult] = useState({ score: 0, total: 0 });
  const [allResults, setAllResults] = useState({
    emotion: { score: 0, total: 0, completed: false },
    attention: { score: 0, total: 0, completed: false },
    social: { score: 0, total: 0, completed: false }
  });
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  // Load saved results if available
  useEffect(() => {
    const savedResults = localStorage.getItem('autismScreeningResults');
    const savedChildInfo = localStorage.getItem('childInfo');
    
    if (savedResults) {
      setAllResults(JSON.parse(savedResults));
    }
    
    if (savedChildInfo) {
      const info = JSON.parse(savedChildInfo);
      setChildName(info.name);
      setChildAge(info.age);
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
      social: { score: 0, total: 0, completed: false }
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