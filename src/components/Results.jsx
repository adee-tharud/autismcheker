// import React from "react";

// export default function Results({ score, total, restart }) {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-green-50">
//       <h2 className="text-3xl font-bold mb-4">Results</h2>
//       <p className="mb-4 text-lg">
//         You identified {score} out of {total} emotions correctly!
//       </p>
//       <p className="mb-8 text-gray-700">
//         This is a screening tool and not a diagnosis. If you have concerns, please consult a professional.
//       </p>
//       <button
//         onClick={restart}
//         className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Play Again
//       </button>
//     </div>
//   );
// }

import React from "react";
import { Home, BarChart2, ArrowRight, Repeat } from "lucide-react";

// Helper function to determine score categories
function getScoreCategory(score, total) {
  const percentage = (score / total) * 100;
  if (percentage >= 85) return "high";
  if (percentage >= 60) return "medium";
  return "low";
}

// Helper function to get game-specific feedback
function getGameFeedback(gameType, scoreCategory) {
  const feedback = {
    emotion: {
      high: "Shows strong emotion recognition skills - able to identify facial expressions well.",
      medium: "Shows developing emotion recognition skills - sometimes identifies emotions accurately.",
      low: "May need additional support with emotion recognition - identifying facial expressions can be challenging."
    },
    attention: {
      high: "Demonstrates strong attention skills - able to focus and find targets quickly.",
      medium: "Shows developing attention skills - sometimes able to focus on specific targets.",
      low: "May benefit from activities that build attention and focus skills."
    },
    social: {
      high: "Shows good understanding of appropriate social responses and interactions.",
      medium: "Developing understanding of social situations - sometimes identifies appropriate responses.",
      low: "May benefit from additional support with understanding social situations and responses."
    }
  };
  
  return feedback[gameType][scoreCategory];
}

export default function Results({ 
  score, 
  total, 
  gameType,
  returnToMenu, 
  playAgain,
  allResults,
  childName
}) {
  const percentage = Math.round((score / total) * 100);
  const scoreCategory = getScoreCategory(score, total);
  const gameFeedback = getGameFeedback(gameType, scoreCategory);
  
  // Determine if all games have been completed
  const allGamesCompleted = Object.values(allResults).every(result => result.completed);
  
  // Calculate overall score if all games are completed
  const overallScore = allGamesCompleted ? 
    Object.values(allResults).reduce((sum, game) => sum + game.score, 0) : 0;
  const overallTotal = allGamesCompleted ? 
    Object.values(allResults).reduce((sum, game) => sum + game.total, 0) : 0;
  const overallPercentage = overallTotal > 0 ? 
    Math.round((overallScore / overallTotal) * 100) : 0;
  
  // Game type names for display
  const gameNames = {
    emotion: "Emotion Recognition",
    attention: "Attention & Focus",
    social: "Social Understanding"
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {gameNames[gameType]} Results
          </h2>
          
          {childName && (
            <p className="text-gray-600 mb-4">
              Great job, {childName}!
            </p>
          )}
          
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={percentage >= 85 ? "#10B981" : percentage >= 60 ? "#F59E0B" : "#EF4444"}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
              <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" fontWeight="bold">
                {percentage}%
              </text>
            </svg>
          </div>
          
          <p className="text-lg font-medium">
            {score} out of {total} questions answered correctly
          </p>
        </div>
        
        <div className="p-4 rounded-lg mb-6 bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Observations:</h3>
          <p className="text-blue-800">
            {gameFeedback}
          </p>
        </div>
        
        {allGamesCompleted && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Overall Progress Summary</h3>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Score:</span>
                <span className="font-bold">{overallScore}/{overallTotal} ({overallPercentage}%)</span>
              </div>
              
              <div className="space-y-3">
                {Object.entries(allResults).map(([game, result]) => (
                  <div key={game} className="flex justify-between items-center">
                    <span className="text-sm">{gameNames[game]}:</span>
                    <div className="flex items-center">
                      <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden mr-2">
                        <div 
                          className={`h-full rounded-full ${
                            (result.score / result.total) >= 0.85 ? "bg-green-500" : 
                            (result.score / result.total) >= 0.6 ? "bg-yellow-500" : 
                            "bg-red-500"
                          }`}
                          style={{ width: `${(result.score / result.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{result.score}/{result.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">Important Note:</h3>
          <p className="text-sm text-yellow-800">
            This is a screening tool and not a diagnostic test. Results should be discussed with healthcare professionals.
            If you have concerns about your child's development, please consult with a pediatrician or specialist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={playAgain}
            className="flex items-center justify-center px-5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
          >
            <Repeat size={18} className="mr-2" />
            Play Again
          </button>
          
          <button
            onClick={returnToMenu}
            className="flex items-center justify-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Home size={18} className="mr-2" />
            Return to Games
          </button>
        </div>
      </div>
    </div>
  );
}