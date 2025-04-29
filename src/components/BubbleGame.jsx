import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";

export default function BubbleGame({ onFinish, childName }) {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [missedBubbles, setMissedBubbles] = useState(0);
  const gameAreaRef = useRef(null);
  const maxBubbles = 12; // Maximum number of bubbles on screen
  const totalGameLevels = 3;
  const bubbleColors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#118AB2", "#73D2DE"];
  const maxMissedBubbles = 10; // Game ends if this many bubbles are missed
  
  // Start the game
  const startGame = () => {
    setShowInstructions(false);
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(45);
    setMissedBubbles(0);
    setCurrentLevel(1);
    setBubbles([]);
    generateBubble();
  };
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);
  
  // Bubble generation effect
  useEffect(() => {
    let bubbleTimer;
    if (isPlaying) {
      const bubbleInterval = currentLevel === 1 ? 2000 : currentLevel === 2 ? 1500 : 1000;
      bubbleTimer = setInterval(() => {
        if (bubbles.length < maxBubbles) {
          generateBubble();
        }
      }, bubbleInterval);
    }
    
    return () => clearInterval(bubbleTimer);
  }, [isPlaying, bubbles, currentLevel]);
  
  // Level progression based on score
  useEffect(() => {
    if (score >= 10 && currentLevel === 1) {
      setCurrentLevel(2);
    } else if (score >= 20 && currentLevel === 2) {
      setCurrentLevel(3);
    }
  }, [score, currentLevel]);
  
  // Check for missed bubbles
  useEffect(() => {
    let missedTimer;
    if (isPlaying) {
      missedTimer = setInterval(() => {
        const now = Date.now();
        const oldBubbles = bubbles.filter(bubble => (now - bubble.createdAt) > bubble.lifespan);
        
        if (oldBubbles.length > 0) {
          setMissedBubbles(prev => prev + oldBubbles.length);
          setBubbles(bubbles.filter(bubble => (now - bubble.createdAt) <= bubble.lifespan));
        }
      }, 500);
    }
    
    return () => clearInterval(missedTimer);
  }, [bubbles, isPlaying]);
  
  // Game over if too many bubbles missed
  useEffect(() => {
    if (missedBubbles >= maxMissedBubbles && isPlaying) {
      endGame();
    }
  }, [missedBubbles]);
  
  const generateBubble = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const bubbleSize = Math.floor(Math.random() * 30) + 30; // Random size between 30-60px
    
    // Random position within game area bounds
    const maxX = gameArea.width - bubbleSize;
    const maxY = gameArea.height - bubbleSize;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    
    // Random speed based on level
    const baseSpeed = currentLevel === 1 ? 3000 : currentLevel === 2 ? 2500 : 2000;
    const lifespan = baseSpeed + Math.floor(Math.random() * 1000);
    
    // Random color
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    
    const newBubble = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: bubbleSize,
      color,
      lifespan,
      createdAt: Date.now()
    };
    
    setBubbles(prevBubbles => [...prevBubbles, newBubble]);
  };
  
  const popBubble = (id) => {
    setBubbles(bubbles.filter(bubble => bubble.id !== id));
    setScore(score + 1);
  };
  
  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    // Total possible score is the sum of bubbles popped and missed
    const total = score + missedBubbles;
    onFinish(score, total);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {showInstructions ? (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Bubble Pop Game</h2>
          
          <div className="mb-6">
            <p className="text-lg mb-3">
              {childName ? `${childName}, pop` : "Pop"} as many bubbles as you can before they disappear!
            </p>
            <p className="text-gray-700 mb-4">
              This game tests attention, visual tracking, and motor skills.
            </p>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-400 mr-2"></div>
                <span>Pop bubbles</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-red-400 rounded-full mr-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-red-400 font-bold">✕</div>
                </div>
                <span>Don't miss too many</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold">
              Score: {score}
            </div>
            <div className="text-lg font-medium">
              Level: {currentLevel}
            </div>
            <div className="text-lg font-bold">
              Time: {timeLeft}s
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-red-500">
              Missed: {missedBubbles}/{maxMissedBubbles}
            </div>
          </div>
          
          <ProgressBar current={maxMissedBubbles - missedBubbles} total={maxMissedBubbles} />
          
          <div 
            ref={gameAreaRef}
            className="relative w-full bg-blue-50 rounded-xl border-2 border-blue-200"
            style={{ height: "400px", overflow: "hidden" }}
          >
            {bubbles.map(bubble => (
              <button
                key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className="absolute rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                style={{
                  left: `${bubble.x}px`,
                  top: `${bubble.y}px`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  background: bubble.color,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transform: "translate3d(0,0,0)", // Hardware acceleration
                }}
              >
                <span className="text-white text-opacity-80 select-none" style={{ fontSize: `${bubble.size / 3}px` }}>
                  pop!
                </span>
              </button>
            ))}
            
            {!isPlaying && gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <h3 className="text-xl font-bold mb-2">Game Over!</h3>
                  <p className="mb-4">
                    You popped {score} bubbles!
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Analyzing results...
                  </p>
                  <div className="animate-pulse w-8 h-8 mx-auto rounded-full bg-blue-600"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Tip: Try to pop the bubbles before they disappear. The game gets faster as you level up!</p>
          </div>
        </div>
      )}
    </div>
  );
}