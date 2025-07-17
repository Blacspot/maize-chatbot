import React, { useState, useEffect, useRef } from 'react';
import decisionTree from '../decisiontree';
import { FaRobot } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import '../components/Chatbot.css'


const Chatbot = () => {
  const [currentNode, setCurrentNode] = useState("start");// tracks which part of tree one is
  const [history, setHistory] = useState([]); // tracks the conversation history
  const [userInput, setUserInput] = useState(''); // tracks the user's input
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, [history]);

  const handleTextSubmit = () => {
    const node = decisionTree[currentNode];
    const input = userInput.trim().toLowerCase();

    if (!input) return;

    setIsTyping(true);
    
  setTimeout(() =>{
    if(node.options) {
      const validOptions = Object.keys(node.options).map(opt => opt.toLowerCase());
      if (validOptions.includes(input)) {
        const matchedKey = Object.keys(node.options).find(opt => opt.toLowerCase() === input);
        setHistory(history =>[...history, { question: node.message, answer: input}]);
        setCurrentNode(node.options[matchedKey]);
      } else {
        setHistory(history => [...history, { question: node.message, answer: input }, 
          { question: "⚠️ Invalid input. Please answer with: " + validOptions.join(" / ") }]);
      }
      
    } else if (node.next) {
      setHistory(history => [...history, { question: node.message, answer: input}]);
      setCurrentNode(node.next);
    } else {
      setHistory(history => [...history, { question: node.message, answer: input}]);
      setCurrentNode(null);
    }

    setUserInput("");
    setIsTyping(false);
    }, 2000);
  };


  const node = decisionTree[currentNode];

  if (!node && currentNode !== null) {
    return <p>Error: No data found for "{currentNode}" in decision tree.</p>;
  }

  const Typingloader = () => {
    return(
    <div style={{ display: 'flex', alignItems:'center',padding:"10px",fontStyle:"italic",color:"#666"}}>
      <FaRobot style={{ marginRight:"10px"}}/>
      <span className='dot-flashing'>Typing...</span>

    </div>
    );
  };


  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🌽 Maize Farming Assistant</h2>
      <div>
        {history.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ backgroundColor: "#e0f7fa", padding: "10px", borderRadius: "8px"}}>
            <FaRobot style={{marginRight:"10px"}} size={20} color='#333' />
            <strong>Bot:</strong> {item.question}
            </div>
            <div style={{ backgroundColor: "#c8e6c9", padding:"10px", borderRadius:"8px", textAlign:"right"}}>
              <strong>You:</strong> {item.answer}
              <GiFarmer style={{ marginLeft:"10px"}} size={20} color='#333' />
            </div>
          </div>
        ))}
      </div>
      {isTyping && <Typingloader />}

      {node ? (
        <div>
          <p><strong>Bot:</strong> {node.message}</p>
          
            <input 
              type='text'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
              placeholder='Type your answer...'
              disabled={isTyping}
              style={{ width: "80%", padding: "10px", marginRight: "10px", 
                borderRadius:"5px", border:"1px solid #ccc"}}
            />
          
            <button onClick={handleTextSubmit} disabled={isTyping}
               style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#aed581",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
               }}
            >
                Send
                </button>
          
        </div>
      ) : (
        
            <div>
              <p><em>Session complete</em></p>
              <button onClick={() =>{
                setCurrentNode("start");
                setHistory([]);
                setUserInput("");
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