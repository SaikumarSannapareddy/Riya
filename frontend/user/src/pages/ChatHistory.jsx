import React from 'react';
import { Link } from 'react-router-dom';

const ChatHistory = () => {
  const items = [
    { id: 'u1', name: 'User One', lastMessage: 'See you soon!', time: '2m ago' },
    { id: 'u2', name: 'User Two', lastMessage: 'Thanks!', time: '1h ago' },
  ];

  return (
    <div className="pt-24 p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Chat History</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {items.map((c) => (
          <Link key={c.id} to="/chat" className="p-3 flex justify-between hover:bg-gray-50">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">{c.lastMessage}</div>
            </div>
            <div className="text-xs text-gray-400">{c.time}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;


