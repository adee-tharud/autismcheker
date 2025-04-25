import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { ChevronRight } from "lucide-react";

// Sample scenarios for testing social understanding
const scenarios = [
  {
    question: "A child falls down at the playground. What would be the kind thing to do?",
    options: [
      { text: "Laugh at them", isAppropriate: false },
      { text: "Ask if they are okay", isAppropriate: true },
      { text: "Walk away", isAppropriate: false }
    ],
    explanation: "Asking if someone is okay shows empathy and concern for their wellbeing."
  },
  {
    question: "Your friend looks sad today. What could you do?",
    options: [
      { text: "Tell them a joke to cheer them up", isAppropriate: true },
      { text: "Ignore them completely", isAppropriate: false },
      { text: "Ask what's wrong", isAppropriate: true }
    ],
    explanation: "Both telling a joke to cheer them up and asking what's wrong are kind ways to respond to someone who is sad."
  },
  {
    question: "Someone gives you a gift you don't like. What should you say?",
    options: [
      { text: "I hate this!", isAppropriate: false },
      { text: "Thank you for thinking of me", isAppropriate: true },
      { text: "Can I exchange it?", isAppropriate: false }
    ],
    explanation: "Saying 'thank you' is polite and shows appreciation for the thought, even if you don't like the gift."
  },
  {
    question: "You want to play with a toy that another child is using. What should you do?",
    options: [
      { text: "Take it from them", isAppropriate: false },
      { text: "Ask if you can have a turn when they're done", isAppropriate: true },
      { text: "Cry until they give it to you", isAppropriate: false }
    ],
    explanation: "Asking politely to take turns is the respectful way to share toys."
  },
  {
    question: "You accidentally bump into someone. What should you do?",
    options: [
      { text: "Walk away quickly", isAppropriate: false },
      { text: "Say 'It's their fault'", isAppropriate: false },
      { text: "Say 'I'm sorry'", isAppropriate: true }
    ],
    explanation: "Saying 'I'm sorry' acknowledges the accident and shows respect for the other person."
  }
];

export default function SocialGame({ onFinish, childName }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    // Reset states when component mounts
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
  }, []);

  const handleSelection = (index) => {
    if (showFeedback) return;
    
    setSelected(index);
    setShowFeedback(true);
    
    if (scenarios[current].options[index].isAppropriate) {
      setScore(score + 1);
    }
  };
  
  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    
    if (current + 1 < scenarios.length) {
      setCurrent(current + 1);
    } else {
      // Calculate final score
      const finalScore = score + (
        selected !== null && scenarios[current].options[selected].isAppropriate ? 1 : 0
      );
      
      onFinish(finalScore, scenarios.length);
    }
  };
  
  // Function to get appropriate social scenario illustration
  const getScenarioImage = (index) => {
    // In a real application, you would import actual images
    // Here we're using placeholder images
    return "/api/placeholder/400/320";
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-2">Social Understanding Game</h2>
      <p className="text-gray-600 text-center mb-6">
        {childName ? `${childName}, what` : 'What'} would you do in these situations?
      </p>
      
      <ProgressBar current={current + 1} total={scenarios.length} />
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <img
            src={getScenarioImage(current)}
            alt="Social scenario"
            className="w-64 h-48 object-cover rounded-lg border-4 border-gray-200"
          />
        </div>
        
        <h3 className="text-xl font-medium mb-4 text-center">
          {scenarios[current].question}
        </h3>
        
        <div className="space-y-3 mb-6">
          {scenarios[current].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelection(index)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg transition ${
                showFeedback
                  ? option.isAppropriate
                    ? "bg-green-100 border border-green-500 text-green-800"
                    : selected === index
                    ? "bg-red-100 border border-red-500 text-red-800"
                    : "bg-gray-100 text-gray-500"
                  : "bg-green-50 border border-green-200 hover:bg-green-100 text-green-800"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
        
        {showFeedback && (
          <div className="p-4 rounded-lg mb-4 bg-blue-50 border border-blue-200 text-blue-800">
            <p className="font-medium">
              {scenarios[current].explanation}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-gray-600">
            Question {current + 1} of {scenarios.length}
          </div>
          
          {showFeedback && (
            <button
              onClick={handleNext}
              className="flex items-center bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {current + 1 < scenarios.length ? "Next Question" : "Finish Game"}
              <ChevronRight size={20} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}