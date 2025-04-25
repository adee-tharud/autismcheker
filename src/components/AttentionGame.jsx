import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { ChevronRight } from "lucide-react";

const shapes = ["circle", "square", "triangle", "star", "heart"];
const colors = ["red", "blue", "green", "yellow", "purple"];

function generateAttentionTest(level) {
  // Generate an array of shapes with colors
  const shapeCount = Math.min(level + 3, 9);
  const targetColor = colors[Math.floor(Math.random() * colors.length)];
  const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
  
  let items = [];
  for (let i = 0; i < shapeCount; i++) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    let shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Ensure at least one target item exists
    if (i === 0) {
      color = targetColor;
      shape = targetShape;
    }
    
    items.push({ shape, color });
  }
  
  // Shuffle items
  items = items.sort(() => Math.random() - 0.5);
  
  return {
    items,
    target: { shape: targetShape, color: targetColor },
    timeLimit: Math.max(10 - level, 5) // Decreasing time limit as levels progress
  };
}

const levels = [
  generateAttentionTest(1),
  generateAttentionTest(2),
  generateAttentionTest(3),
  generateAttentionTest(4),
  generateAttentionTest(5)
];

export default function AttentionGame({ onFinish, childName }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameState, setGameState] = useState("intro"); // intro, playing, feedback, finished
  const [selectedItem, setSelectedItem] = useState(null);
  const [timerId, setTimerId] = useState(null);
  
  useEffect(() => {
    // Reset states when component mounts
    setCurrentLevel(0);
    setScore(0);
    setGameState("intro");
    setSelectedItem(null);
    
    // Cleanup timer when component unmounts
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, []);
  
  // Cleanup timer when component unmounts or when timerId changes
  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);
  
  const startLevel = () => {
    setGameState("playing");
    setSelectedItem(null);
    setTimeLeft(levels[currentLevel].timeLimit);
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setTimerId(timer);
  };
  
  const handleTimeout = () => {
    setGameState("feedback");
    if (timerId) clearInterval(timerId);
  };
  
  const handleSelection = (index) => {
    if (gameState !== "playing") return;
    
    const selected = levels[currentLevel].items[index];
    setSelectedItem(index);
    
    if (
      selected.color === levels[currentLevel].target.color &&
      selected.shape === levels[currentLevel].target.shape
    ) {
      setScore(score + 1);
    }
    
    setGameState("feedback");
    if (timerId) clearInterval(timerId);
  };
  
  const nextLevel = () => {
    if (currentLevel + 1 < levels.length) {
      setCurrentLevel(currentLevel + 1);
      setGameState("intro");
    } else {
      // Calculate final score including current level if answered correctly
      const finalScore = score + (
        selectedItem !== null && 
        levels[currentLevel].items[selectedItem].color === levels[currentLevel].target.color &&
        levels[currentLevel].items[selectedItem].shape === levels[currentLevel].target.shape ? 1 : 0
      );
      
      // Pass the final score and total levels to the parent component
      onFinish(finalScore, levels.length);
    }
  };
  
  const renderShape = (shape, color, index) => {
    const isSelected = selectedItem === index;
    const isTarget = gameState === "feedback" && 
      shape === levels[currentLevel].target.shape && 
      color === levels[currentLevel].target.color;
      
    let shapeJsx = null;
    
    // Render different shapes based on shape type
    switch (shape) {
      case "circle":
        shapeJsx = <div className={`w-16 h-16 rounded-full bg-${color}-500 shadow-md`}></div>;
        break;
      case "square":
        shapeJsx = <div className={`w-16 h-16 bg-${color}-500 shadow-md`}></div>;
        break;
      case "triangle":
        shapeJsx = (
          <div className="w-0 h-0 border-l-[32px] border-r-[32px] border-b-[64px] border-l-transparent border-r-transparent" 
               style={{ borderBottomColor: `var(--tw-color-${color}-500)` }}>
          </div>
        );
        break;
      case "star":
        shapeJsx = (
          <div className={`w-16 h-16 flex items-center justify-center text-${color}-500`}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
        );
        break;
      case "heart":
        shapeJsx = (
          <div className={`w-16 h-16 flex items-center justify-center text-${color}-500`}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
        break;
      default:
        shapeJsx = <div className={`w-16 h-16 bg-${color}-500 rounded shadow-md`}></div>;
    }
    
    return (
      <button
        key={index}
        onClick={() => handleSelection(index)}
        disabled={gameState !== "playing"}
        className={`p-4 rounded-lg transition transform ${
          isSelected ? "scale-110 border-4 border-blue-500" : ""
        } ${
          isTarget && gameState === "feedback" ? "border-4 border-green-500" : ""
        } ${
          gameState === "playing" ? "hover:bg-gray-100" : ""
        }`}
      >
        {shapeJsx}
      </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-2">Attention & Focus Game</h2>
      <p className="text-gray-600 text-center mb-6">
        Find the matching shape and color
      </p>
      
      <ProgressBar current={currentLevel + 1} total={levels.length} />
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        {gameState === "intro" && (
          <div className="text-center py-4">
            <h3 className="text-xl font-bold mb-4">Level {currentLevel + 1}</h3>
            <p className="mb-6">
              Find the {levels[currentLevel].target.color} {levels[currentLevel].target.shape} as quickly as you can!
            </p>
            <button
              onClick={startLevel}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Start Level
            </button>
          </div>
        )}
        
        {(gameState === "playing" || gameState === "feedback") && (
          <>
            {gameState === "playing" && (
              <div className="mb-4 text-center">
                <div className="bg-purple-100 inline-block px-4 py-2 rounded-full text-purple-800 font-medium">
                  Time left: {timeLeft} seconds
                </div>
              </div>
            )}
            
            <div className="mb-6 text-center">
              <p className="text-lg font-medium">
                Find the {levels[currentLevel].target.color} {levels[currentLevel].target.shape}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 justify-items-center mb-6">
              {levels[currentLevel].items.map((item, index) => (
                renderShape(item.shape, item.color, index)
              ))}
            </div>
            
            {gameState === "feedback" && (
              <div className={`p-4 rounded-lg mb-4 ${
                selectedItem !== null && 
                levels[currentLevel].items[selectedItem].color === levels[currentLevel].target.color &&
                levels[currentLevel].items[selectedItem].shape === levels[currentLevel].target.shape
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                <p className="font-medium">
                  {selectedItem !== null && 
                  levels[currentLevel].items[selectedItem].color === levels[currentLevel].target.color &&
                  levels[currentLevel].items[selectedItem].shape === levels[currentLevel].target.shape
                    ? "Great job! You found the correct shape!"
                    : `Time's up! The ${levels[currentLevel].target.color} ${levels[currentLevel].target.shape} was highlighted.`}
                </p>
              </div>
            )}
            
            {gameState === "feedback" && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={nextLevel}
                  className="flex items-center bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  {currentLevel + 1 < levels.length ? "Next Level" : "Finish Game"}
                  <ChevronRight size={20} className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}