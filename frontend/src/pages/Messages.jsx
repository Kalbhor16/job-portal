import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get('user');
  const jobId = searchParams.get('job');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/messages/conversation/${otherUserId}`);
        setMessages(res.data.messages || []);

        // Get other user info from first message
        if (res.data.messages && res.data.messages.length > 0) {
          const msg = res.data.messages[0];
          const other = msg.sender._id === user.id ? msg.receiver : msg.sender;
          setOtherUser(other);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (otherUserId) {
      fetchMessages();
    }
  }, [otherUserId, user.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post('/messages', {
        receiver: otherUserId,
        jobId,
        message: newMessage,
      });

      setMessages([...messages, res.data.data]);
      setNewMessage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 h-screen flex flex-col bg-gray-50">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-emerald-700">
          {otherUser ? `Messaging with ${otherUser.name}` : 'Messages'}
        </h1>
        {otherUser && <p className="text-sm text-gray-600">{otherUser.email}</p>}
      </div>

      {loading ? (
        <div className="text-center py-20 flex-1 flex items-center justify-center">Loading messages...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      ) : (
        <>
          <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto mb-4 border">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No messages yet. Start a conversation!</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender._id === user.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Messages;
