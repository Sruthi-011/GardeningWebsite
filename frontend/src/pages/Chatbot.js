import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "🌿 Hi there! I'm BloomBot your Root & Bloom gardening assistant. Ask me anything about plants, watering, sunlight, or tools!" }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    "How often should I water plants?",
    "Best fertilizer for indoor plants",
    "Why are my plant leaves turning yellow?",
    "How much sunlight do succulents need?",
    "Tips for growing herbs at home"
  ];

  const getBotResponse = (message) => {
    const text = message.toLowerCase();

    if (text.includes('water')) {
      return "💧 Most plants prefer being watered when the top inch of soil is dry. Early morning watering is best — avoid waterlogging!";
    }
    if (text.includes('fertilizer') || text.includes('feed')) {
      return "🌱 Use organic compost or balanced NPK fertilizer once every 2–3 weeks during growth season. Avoid over-fertilizing — it can burn roots.";
    }
    if (text.includes('sunlight') || text.includes('light')) {
      return "☀️ Most indoor plants love bright, indirect sunlight. Succulents and cacti thrive in direct light, while ferns prefer shade.";
    }
    if (text.includes('yellow') || text.includes('leaf') || text.includes('leaves')) {
      return "🍃 Yellow leaves usually mean overwatering, lack of sunlight, or nutrient deficiency. Trim damaged leaves and check soil moisture.";
    }
    if (text.includes('succulent')) {
      return "🌵 Succulents love sunlight and dry soil. Water them once every 7–10 days and keep them near a sunny window.";
    }
    if (text.includes('herb') || text.includes('mint') || text.includes('basil')) {
      return "🌿 Herbs grow best in sunlight (4–6 hrs/day). Use well-draining soil and pinch off flowers to encourage leaf growth.";
    }
    if (text.includes('tool') || text.includes('buy')) {
      return "🛒 You can find gardening tools in our Products section, including watering cans, soil kits, and pruning shears.";
    }
    if (text.includes('soil')) {
      return "🌾 Use loose, nutrient-rich soil with compost. For indoor plants, a mix of coco peat, sand, and organic compost works best.";
    }
    if (text.includes('pest') || text.includes('insect')) {
      return "🐞 Use neem oil spray or mild soap solution to remove pests naturally. Keep affected plants isolated temporarily.";
    }
    if (text.includes('share') || text.includes('donate')) {
      return "🌸 You can share your plant through our 'Plant Sharing' page — click 'Share a Plant' and add details and a photo!";
    }

    return "🌼 I’m still learning! Try asking me about watering, sunlight, soil, fertilizer, or common plant problems.";
  };

  const handleSend = (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const reply = getBotResponse(messageText);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💬 Root & Bloom Chatbot</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#c8e6c9' : '#f1f8e9',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.suggestions}>
        {suggestions.map((s, i) => (
          <button key={i} style={styles.suggestionButton} onClick={() => handleSend(s)}>
            {s}
          </button>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          placeholder="Ask me anything about gardening..."
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <button onClick={() => handleSend(input)} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
  },
  title: {
    textAlign: 'center',
    color: '#2e7d32',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  chatBox: {
    flexGrow: 1,
    overflowY: 'auto',
    border: '1px solid #c8e6c9',
    borderRadius: '10px',
    padding: '15px',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  message: {
    padding: '10px 15px',
    borderRadius: '10px',
    maxWidth: '80%',
    fontSize: '0.95rem',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    marginTop: '15px',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#43a047',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '15px',
  },
  suggestionButton: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #a5d6a7',
    borderRadius: '20px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: '0.3s',
  },
};

export default Chatbot;
