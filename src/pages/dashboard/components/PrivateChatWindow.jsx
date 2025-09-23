import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from 'src/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/Avatar';

const PrivateChatWindow = () => {
  const { chatId } = useParams(); // Get chat ID from URL parameters
  const [user] = useState({ uid: 'user123', displayName: 'Test User', email: 'test@example.com' }); // Dummy user
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [allUsers, setAllUsers] = useState({}); // To store user profiles by UID

  useEffect(() => {
    if (!user || !chatId) return;

    // Fetch all users once to map UIDs to display names
    const fetchAllUsers = async () => {
      // This part would typically fetch from Firebase
      // For now, we'll just set a dummy user for demonstration
      setAllUsers({ 'bot': { displayName: 'Chatbot', email: 'bot@example.com' } });
    };
    fetchAllUsers();

    // Dummy messages for demonstration without Firebase
    const dummyMessages = [
      { id: 'msg1', text: 'Hi there!', senderId: 'bot', timestamp: new Date() },
      { id: 'msg2', text: 'How can I help you?', senderId: 'bot', timestamp: new Date() },
      { id: 'msg3', text: 'I have a question about my account.', senderId: 'user123', timestamp: new Date() },
    ];
    setMessages(dummyMessages);

  }, [user, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !chatId) return;

    // This part would typically add to Firebase
    // For now, we'll just add to the dummy messages
    const newDummyMessage = {
      id: `msg${messages.length + 1}`,
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || user.email, // Use displayName, fallback to email
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newDummyMessage]);

    // Update parent chat document with last message info
    // This part would typically update Firebase
    console.log(`Simulating update for chatId: ${chatId} with message: ${newMessage}`);

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground shadow-lg rounded-lg">
      <header className="bg-card p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold">Private Chat</h1>
        {/* You might want to display the other participant's name/email here */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const senderProfile = allUsers[msg.senderId];
          const senderDisplayName = senderProfile?.displayName || senderProfile?.email || msg.senderName || 'Unknown User';
          return (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs p-3 rounded-lg ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <p className="font-medium text-sm">{senderDisplayName}</p> {/* Display senderDisplayName */}
              <p className="text-base">{msg.text}</p>
              <span className="text-xs opacity-75 block mt-1">
                {msg.timestamp?.toDate().toLocaleString()}
              </span>
            </div>
          </div>
        )})}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-card p-4 border-t border-border">
        <form onSubmit={sendMessage} className="flex space-x-2 items-end">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!user || !chatId}
          />
          <Button type="submit" disabled={!user || !chatId || newMessage.trim() === ''}>
            <AppIcon name="Send" className="mr-2" />
            Send
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default PrivateChatWindow;
