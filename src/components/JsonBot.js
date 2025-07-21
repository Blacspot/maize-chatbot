import React, { useState, useEffect, useRef }from 'react';
import axios from 'axios' 
import '../components/Chatbot.css';
import { FaRobot } from 'react-icons/fa';
import { GiFarmer } from 'react-icons/gi';

const intents = [
  {
    name: 'greeting',
    patterns: ['hi', 'hello', 'hey','good morning', 'good afternoon', 'good evening'],
     response: 'Hello!  Welcome to the Maize Farming Assistant. How can I help you today?',
  },
  {
   name: 'planting',
    patterns: ['when to plant', 'planting time', 'how to plant'],
    response: 'Plant maize when rains begin. Ensure the soil is fertile and well-drained.',
  },
   {
    name: 'harvesting',
    patterns: ['when to harvest', 'harvest time', 'ready to harvest'],
    response: 'Harvest maize when husks dry and kernels are hard. Typically 90–120 days after planting.',
  },
  {
    name: 'farewell',
    patterns: ['bye', 'goodbye', 'see you'],
    response: 'Goodbye! Wishing you a productive season! ',
  }
]

const detectIntent = (input) => {
  const lowerInput = input.toLowerCase();
  
  for (let intent of intents) {
    for (let pattern of intent.patterns) {
      if (lowerInput.includes(pattern)) {
        return intent.response;
      }
    }
  }
  return null;
};


const JsonBot = () => {

    
    const [history, setHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

     useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [history]);

   const handleTextSubmit = async() => {
    const input = userInput.trim();
    if (!input) return;

    setHistory((prev) => [
      ...prev,
      { sender: 'user', text: input }
    ]);
    setUserInput('');
    setIsTyping(true);

    const intentResponse = detectIntent(input);
    if (intentResponse) {
    setTimeout(() => {
      setHistory((prev) => [...prev, { sender: 'bot', text: '' }]);
      streamBotResponse(intentResponse);
      setIsTyping(false);
    }, 600); 
    return;
  }

    try {
      const response = await axios.post('http://localhost:5000/api/ask', {
        question: input
      });
      const data = response.data.answer;
      setHistory((prev) => [...prev, { sender: 'bot', text: '' }]);
      streamBotResponse(data);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { sender: 'bot', text: `Sorry, I couldn't find any info about "${input}".` }
      ]);
    }
    setIsTyping(false);
  };

  const streamBotResponse = (fullText) => {
    let index = 1;
    const interval = setInterval(() => {
      setHistory((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage?.sender === 'bot') {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText.slice(0, index);
          return updated;
        } else {
          return [...prev, { sender: 'bot', text: fullText.slice(0, index)}];
        }
      });

      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 75);
  };


  const Typingloader = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
      <FaRobot style={{ marginRight: '10px' }} />
      <span className="dot-flashing">Typing...</span>
    </div>
  );


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🌽 Maize Q&A Bot</h2>

      {history.map((msg, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          {msg.sender === 'bot' ? (
            <div style={{ backgroundColor: '#e0f7fa', padding: '10px', borderRadius: '8px' }}>
              <FaRobot style={{ marginRight: '10px' }} size={20} color="#333" />
              <strong>Bot:</strong> <pre>{msg.text}</pre>
            </div>
          ) : (
            <div style={{ backgroundColor: '#c8e6c9', padding: '10px', borderRadius: '8px', textAlign: 'right' }}>
              <strong>You:</strong> {msg.text}
              <GiFarmer style={{ marginLeft: '10px' }} size={20} color="#333" />
            </div>
          )}
        </div>
      ))}

      {isTyping && <Typingloader />}
          


          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Type your answer..."
            style={{ width: '80%', padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />

          <button
            onClick={handleTextSubmit}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#aed581',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>

          <div ref={bottomRef}></div>
        </div>
      );
      };

      
    

export default JsonBot