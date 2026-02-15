import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecruiterLayout from '../layouts/RecruiterLayout';
import { Send, Paperclip, X, File, Image, Video, Link as LinkIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch all conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations/all/list');
      if (response.data.success) {
        const conversationList = response.data.data || [];
        setApplicants(conversationList);
        // Select first applicant if available
        if (conversationList.length > 0) {
          setSelectedApplicant(conversationList[0]);
          fetchMessages(conversationList[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected applicant
  const fetchMessages = async (userId) => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/messages/conversation/${userId}`);
      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplicantSelect = (applicant) => {
    setSelectedApplicant(applicant);
    fetchMessages(applicant.id);
    setUploadedFiles([]);
  };

  const handleApplicantDetailsClick = () => {
    if (selectedApplicant?.id) {
      navigate(`/recruiter/seeker/${selectedApplicant.id}`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && uploadedFiles.length === 0) return;
    if (!selectedApplicant) return;

    try {
      setSending(true);

      if (newMessage.trim()) {
        const response = await api.post('/messages', {
          receiver: selectedApplicant.id,
          jobId: selectedApplicant.jobId,
          message: newMessage,
        });

        if (response.data.success) {
          setNewMessage('');
          // Refresh messages
          fetchMessages(selectedApplicant.id);
        }
      }

      // Handle file uploads (if implemented in backend)
      if (uploadedFiles.length > 0) {
        // TODO: Implement file upload to backend
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleAddLink = async () => {
    if (!linkInput.trim()) return;
    if (!selectedApplicant) return;

    try {
      setSending(true);
      const response = await api.post('/messages', {
        receiver: selectedApplicant.id,
        jobId: selectedApplicant.jobId,
        message: linkInput,
      });

      if (response.data.success) {
        setLinkInput('');
        setShowLinkInput(false);
        fetchMessages(selectedApplicant.id);
      }
    } catch (error) {
      console.error('Error sending link:', error);
      alert('Failed to send link');
    } finally {
      setSending(false);
    }
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <RecruiterLayout>
      <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-b from-slate-50 to-slate-100 gap-0">
        {/* Sidebar - Applicants List */}
        <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-emerald-700">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <p className="text-emerald-100 text-sm mt-1">{applicants.length} Conversations</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-slate-500 mt-4">Loading conversations...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No conversations yet</p>
              </div>
            ) : (
              applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  onClick={() => handleApplicantSelect(applicant)}
                  className={`p-3 border-b border-slate-100 cursor-pointer transition-all duration-200 ${
                    selectedApplicant?.id === applicant.id
                      ? 'bg-emerald-50 border-l-4 border-l-emerald-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full object-cover bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {applicant.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{applicant.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{applicant.email}</p>
                      {applicant.lastMessage && (
                        <p className="text-xs text-slate-400 truncate mt-1">{applicant.lastMessage}</p>
                      )}
                    </div>
                    {applicant.unread > 0 && (
                      <span className="px-2 py-1 text-xs font-bold bg-emerald-600 text-white rounded-full">
                        {applicant.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedApplicant ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full object-cover bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {selectedApplicant.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedApplicant.name}</h3>
                    <p className="text-xs text-slate-600">{selectedApplicant.email}</p>
                    <p className="text-xs text-slate-500">⚫ {selectedApplicant.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleApplicantDetailsClick}
                  className="px-4 py-2 rounded-lg text-white font-semibold transition-colors bg-emerald-600 hover:bg-emerald-700"
                >
                  View Profile
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSender = msg.sender._id === user._id;
                    return (
                      <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            isSender
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-slate-100 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <div
                            className={`flex items-center gap-1 mt-2 ${
                              isSender ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{formatTime(msg.createdAt)}</span>
                            {isSender && <CheckCircle className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-200 p-4 bg-white">
                {/* Link Input */}
                {showLinkInput && (
                  <div className="mb-3 flex gap-2">
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="Paste link here (https://...)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <button
                      onClick={handleAddLink}
                      disabled={!linkInput.trim() || sending}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-semibold"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => setShowLinkInput(false)}
                      className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:bg-slate-100"
                  />

                  {/* Link Button */}
                  <button
                    type="button"
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Share link"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!newMessage.trim() && uploadedFiles.length === 0 || sending}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">{sending ? 'Sending...' : 'Send'}</span>
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  />
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Messages;
