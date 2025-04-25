
import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { ChevronRight } from "lucide-react";

// Images would be imported here
import happyImage from "../assets/happyface.jpg";
import sadImage from "../assets/sadface.jpg";
import angryImage from "../assets/angryface.jpg";
import surprisedImage from "../assets/surprisedface.jpg";
import afraidImage from "../assets/afraidface.jpg";
import disgustedImage from "../assets/disgustedface.jpg"


// We'll use placeholder URLs for now
const emotionImages = {
  happy: happyImage,
  sad: sadImage,
  angry: angryImage,
  surprised: surprisedImage,
  afraid: afraidImage,
  disgusted: disgustedImage
};

const questions = [
  {
    image: emotionImages.happy,
    choices: ["Happy", "Sad", "Angry"],
    answer: "Happy",
    feedback: "This person is smiling, which shows they are happy!"
  },
  {
    image: emotionImages.sad,
    choices: ["Surprised", "Sad", "Happy"],
    answer: "Sad",
    feedback: "The downturned mouth and droopy eyes show sadness."
  },
  {
    image: emotionImages.angry,
    choices: ["Happy", "Afraid", "Angry"],
    answer: "Angry",
    feedback: "The furrowed brows and tight mouth show anger."
  },
  {
    image: emotionImages.surprised,
    choices: ["Surprised", "Happy", "Afraid"],
    answer: "Surprised",
    feedback: "The wide open eyes and mouth show surprise!"
  },
  {
    image: emotionImages.afraid,
    choices: ["Sad", "Afraid", "Disgusted"],
    answer: "Afraid",
    feedback: "The raised eyebrows and wide eyes show fear."
  }
];

export default function EmotionGame({ onFinish, childName }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  useEffect(() => {
    // Reset state when starting a new game
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
  }, []);

  function handleChoice(choice) {
    setSelected(choice);
    setShowFeedback(true);
    
    if (choice === questions[current].answer) {
      setScore(score + 1);
    }
  }
  
  function handleNext() {
    setShowFeedback(false);
    setSelected(null);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      onFinish(score + (selected === questions[current].answer ? 1 : 0), questions.length);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-2">Emotion Recognition Game</h2>
      <p className="text-gray-600 text-center mb-6">
        {childName ? `${childName}, what` : 'What'} emotion is this person feeling?
      </p>
      
      <ProgressBar current={current + 1} total={questions.length} />
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <img
            src={questions[current].image}
            alt="Emotion"
            className="w-64 h-64 object-cover rounded-lg border-4 border-gray-200"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {questions[current].choices.map((choice) => (
            <button
              key={choice}
              onClick={() => !showFeedback && handleChoice(choice)}
              disabled={showFeedback}
              className={`py-3 rounded-lg font-medium transition-all ${
                showFeedback
                  ? choice === questions[current].answer
                    ? "bg-green-100 border-2 border-green-500 text-green-700"
                    : selected === choice
                    ? "bg-red-100 border-2 border-red-500 text-red-700"
                    : "bg-gray-100 text-gray-500"
                  : "bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        
        {showFeedback && (
          <div className={`p-4 rounded-lg mb-4 ${
            selected === questions[current].answer
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            <p className="font-medium">
              {selected === questions[current].answer
                ? "Correct! "
                : `Not quite. The correct answer is "${questions[current].answer}". `}
              {questions[current].feedback}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-gray-600">
            Question {current + 1} of {questions.length}
          </div>
          
          {showFeedback && (
            <button
              onClick={handleNext}
              className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {current + 1 < questions.length ? "Next Question" : "Finish Game"}
              <ChevronRight size={20} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}