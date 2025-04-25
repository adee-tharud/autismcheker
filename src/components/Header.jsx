import React from "react";
import { Home } from "lucide-react";

export default function Header({ stage, goHome, childName }) {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={goHome}
            className="mr-4 p-2 rounded-full hover:bg-blue-700 transition"
            aria-label="Go to home page"
          >
            <Home size={24} />
          </button>
          <h1 className="text-xl font-bold">Autism Early Screening Games</h1>
        </div>
        
        {childName && (
          <div className="bg-blue-700 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">Playing as: </span>
            <span className="font-bold">{childName}</span>
          </div>
        )}
      </div>
    </header>
  );
}