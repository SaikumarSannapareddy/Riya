import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Phone, Grid, Send } from 'lucide-react';

export default function ChatScreen() {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello there!', sent: true },
    { id: 2, text: 'Hi! How are you?', sent: false },
    { id: 3, text: 'I\'m doing well, thanks for asking.', sent: false },
    { id: 4, text: 'That\'s great to hear!', sent: true },
    { id: 5, text: 'What are you up to today?', sent: true },
    { id: 6, text: 'Just working on some projects.', sent: false },
    { id: 7, text: 'Sounds interesting!', sent: true },
    { id: 8, text: 'Yeah, it\'s keeping me busy.', sent: false }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, sent: true }]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-indigo-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-5 h-5" />
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold">U</span>
            </div>
            <div className="ml-2">
              <p className="font-medium text-sm">User Name</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                <span className="text-xs text-gray-200">Online</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`p-3 rounded-2xl max-w-xs break-words ${
                  msg.sent 
                    ? 'bg-indigo-700 text-white rounded-br-none' 
                    : 'bg-indigo-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white p-2 flex items-center border-t">
        <Grid className="w-6 h-6 text-gray-500 mx-2" />
        <div className="flex-1 bg-indigo-100 rounded-full flex items-center px-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 py-2 bg-transparent outline-none text-gray-800"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="ml-2 bg-indigo-200 p-2 rounded-full"
            onClick={handleSendMessage}
          >
            <Send className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>
    </div>
  );
}