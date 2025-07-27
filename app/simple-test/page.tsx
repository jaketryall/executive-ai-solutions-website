"use client";

import { useState } from "react";

export default function SimpleTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-3xl text-white mb-8">Simple Interactivity Test</h1>
      
      <div className="bg-zinc-800 p-6 rounded-lg max-w-md">
        <p className="text-white mb-4">Count: {count}</p>
        <button
          onClick={() => {
            console.log("Button clicked!");
            setCount(count + 1);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Click me
        </button>
      </div>
    </div>
  );
}