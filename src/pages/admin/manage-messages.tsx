import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Search, 
  ChevronDown,
  User
} from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface Guide {
  id: number;
  name: string;
  email: string;
  status: string;
}

const ManageMessages: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for guides
  const dummyGuides: Guide[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Inactive' },
  ];

  // Dummy data for messages
  const dummyMessages: Message[] = [
    { id: 1, sender: 'admin', content: 'Hello Guide!', timestamp: '2024-04-06 10:30' },
    { id: 2, sender: 'guide', content: 'Hi Admin!', timestamp: '2024-04-06 10:32' },
    { id: 3, sender: 'admin', content: 'How are you today?', timestamp: '2024-04-06 10:33' },
    { id: 4, sender: 'guide', content: 'I\'m doing well, thank you!', timestamp: '2024-04-06 10:35' },
  ];

  useEffect(() => {
    // Simulate API call to fetch guides
    setGuides(dummyGuides);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedGuide) {
      // Simulate API call to fetch messages for selected guide
      setMessages(dummyMessages);
    }
  }, [selectedGuide]);

  const handleSendMessage = () => {
    if (message.trim() && selectedGuide) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'admin',
        content: message,
        timestamp: new Date().toLocaleString(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Guides List Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search guides..."
              className="w-full px-4 py-2 pl-10 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedGuide?.id === guide.id ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
              onClick={() => setSelectedGuide(guide)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div className="ml-3">
                  <div className="font-medium">{guide.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{guide.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedGuide ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div className="ml-3">
                  <div className="font-medium">{selectedGuide.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedGuide.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === 'admin' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {msg.timestamp}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a guide to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMessages; 