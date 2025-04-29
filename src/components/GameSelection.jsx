import React from "react";
import { Smile, Glasses, Users, RotateCcw } from "lucide-react";

export default function GameSelection({ startGame, results, resetProgress, childName }) {
  const totalCompleted = Object.values(results).filter(r => r.completed).length;
  const totalGames = Object.keys(results).length;
  
  const games = [
    {
      id: "emotion",
      name: "Emotion Recognition",
      description: "Identify different facial expressions and emotions",
      icon: <Smile size={32} className="text-yellow-500" />,
      color: "bg-yellow-100 border-yellow-300",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      completed: results.emotion.completed
    },
    {
      id: "attention",
      name: "Attention & Focus",
      description: "Test attention span and response to visual stimuli",
      icon: <Glasses size={32} className="text-purple-500" />,
      color: "bg-purple-100 border-purple-300",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      completed: results.attention.completed
    },
    {
      id: "social",
      name: "Social Interaction",
      description: "Recognize appropriate social responses and interactions",
      icon: <Users size={32} className="text-green-500" />,
      color: "bg-green-100 border-green-300",
      buttonColor: "bg-green-500 hover:bg-green-600",
      completed: results.social.completed
    },
    {
      id: "focus",
      name: "focus Recognition",
      description: "Recognize foucs and response time",
      icon: <Users size={32} className="text-red-500" />,
      color: "bg-red-100 border-red-300",
      buttonColor: "bg-red-500 hover:bg-red-600",
      completed: results.focus.completed
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {childName ? `${childName}'s Games` : 'Select a Game'}
        </h2>
        
        <div className="bg-white rounded-full h-4 w-64 mx-auto mb-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${(totalCompleted / totalGames) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-gray-600">
          {totalCompleted} of {totalGames} activities completed
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div 
            key={game.id}
            className={`${game.color} border p-6 rounded-xl shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md`}
          >
            {game.completed && (
              <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className="flex justify-center mb-4">
              {game.icon}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-center">
              {game.name}
            </h3>
            
            <p className="text-gray-700 mb-6 text-center text-sm">
              {game.description}
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={() => startGame(game.id)}
                className={`px-5 py-2 text-white rounded-lg transition ${game.buttonColor}`}
              >
                {game.completed ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {totalCompleted > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={resetProgress}
            className="flex items-center text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset All Progress
          </button>
        </div>
      )}
    </div>
  );
}