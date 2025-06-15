
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const generateResponse = async (userInput) => {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",
      prompt: `You are a conspiracy theorist. Your job is to convince people that all questions are linked to conspiracy theories. 
                Respond in a paranoid tone. Answer the following question: ${userInput}`,
      max_tokens: 150,
      temperature: 0.9,
    }, {
      headers: {
        "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
      }
    });

    return response.data.choices[0].text.trim();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const botResponse = await generateResponse(input);
    setMessages([...newMessages, { role: 'bot', content: botResponse }]);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Zadaj pytanie, np. 'Co sądzisz o 5G?'"
        />
        <button onClick={handleSend}>Wyślij</button>
      </div>
    </div>
  );
};

export default Chat;
