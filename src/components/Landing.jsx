// import React from "react";

// export default function Landing({ startGame }) {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
//       <h1 className="text-4xl font-bold mb-4">Autism Early Screening Games</h1>
//       <p className="mb-6 text-lg text-gray-700">
//         Play simple games to help identify early signs of autism in children.
//       </p>
//       <button
//         onClick={startGame}
//         className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//       >
//         Start Emotion Recognition Game
//       </button>
//     </div>
//   );
// }

import React from "react";
import { Play } from "lucide-react";

export default function Landing({ startGame, setChildName, setChildAge, childName, childAge }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 text-center">
          Autism Early Screening Games
        </h1>
        
        <p className="mb-6 text-gray-700 text-center">
          These fun interactive games help identify potential early signs of autism in children aged 2-6 years.
        </p>
        
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
              Child's Name (Optional)
            </label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter child's name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-1">
              Child's Age (years)
            </label>
            <select
              id="childAge"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select age</option>
              {[2, 3, 4, 5, 6].map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={startGame}
            disabled={!childAge}
            className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition ${
              childAge 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Play size={20} className="mr-2" />
            Start Games
          </button>
        </div>
        
        {!childAge && (
          <p className="text-sm text-red-500 text-center">
            Please select the child's age to continue
          </p>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Important Note</h3>
          <p className="text-sm text-gray-700">
            This is a screening tool and not a diagnostic test. Results should be discussed with healthcare professionals.
            If you have concerns about your child's development, please consult with a pediatrician or specialist.
          </p>
        </div>
      </div>
    </div>
  );
}