import React, { useState } from 'react';
import decisionTree from '../decisiontree';
import { useEffect, useRef } from 'react';

const Chatbot = () => {
  const [currentNode, setCurrentNode] = useState("start");
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, [history]);

  const handleInput = (input) => {
    const node = decisionTree[currentNode];

    if (node.options && node.options[input]) {
      const next = node.options[input];
      setHistory([...history, { question: node.message, answer: input }]);
      setCurrentNode(next);
    } else if (node.next) {
      setHistory([...history, { question: node.message, answer: input }]);
      setCurrentNode(node.next);
    } else {
      setHistory([...history, { question: node.message, answer: input }]);
      setCurrentNode(null);
    }
  };

  const node = decisionTree[currentNode];

  if (!node && currentNode !== null) {
    return <p>Error: No data found for "{currentNode}" in decision tree.</p>;
  }


  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🌽 Maize Farming Assistant</h2>
      <div>
        {history.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ backgroundColor: "#e0f7fa", padding: "10px", borderRadius: "8px"}}>
            <strong>Bot:</strong> {item.question}
            </div>
            <div style={{ backgroundColor: "#c8e6c9", padding:"10px", borderRadius:"8px", textAlign:"right"}}>
              <strong>You:</strong> {item.answer}
            </div>
          </div>
        ))}
      </div>

      {node ? (
        <div>
          <p><strong>Bot:</strong> {node.message}</p>
          {node.options ? (
            Object.keys(node.options).map((opt) => (
              <button key={opt} 
              onClick={() => handleInput(opt)}
               style={{ 
                margin: "5px",
                padding: "10px 15px",
                backgroundColor: "#ffd54f",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
                }}>
                {opt}
              </button>
            ))
          ) : node.end ? (
            <p><em>End of session.</em></p>
          ) : (
            <button onClick={() => handleInput("next")}
               style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#aed581",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
               }}
            >
                Next
                </button>
          )}
        </div>
      ) : (
        
            <div>
              <p><em>Session complete</em></p>
              <button onClick={() =>{
                setCurrentNode("start");
                setHistory([]);
              }}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#64b5f6",
                color: "fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
              >Restart
              </button>
            </div>
        
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};


export default Chatbot