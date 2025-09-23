import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/Avatar';
import Button from '../../../components/ui/Button'; 
import Input from '../../../components/ui/Input'; 
import AppIcon from '../../../components/AppIcon';
// Removed: import { serverTimestamp } from 'firebase/firestore';

const PrivateChatList = () => {
  // Using dummy user and chat data since Firebase is removed
  const [user] = useState({ uid: 'u1', displayName: 'Test User', email: 'test@example.com' });
  const [users, setUsers] = useState([
    { id: 'u2', displayName: 'Alice', email: 'alice@example.com' },
    { id: 'u3', displayName: 'Bob', email: 'bob@example.com' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([
    { id: 'chat1', participants: ['u1', 'u2'], lastMessageText: 'Hello, how can I help you?', lastMessageAt: new Date(), otherParticipantId: 'u2' },
    { id: 'chat2', participants: ['u1', 'u3'], lastMessageText: 'Meeting at 3 PM', lastMessageAt: new Date(Date.now() - 3600000), otherParticipantId: 'u3' },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching users (for starting new chats)
    // In a real app, you'd fetch from your Supabase backend
    const dummyAllUsers = [
      { id: 'u1', displayName: 'Test User', email: 'test@example.com' },
      { id: 'u2', displayName: 'Alice', email: 'alice@example.com' },
      { id: 'u3', displayName: 'Bob', email: 'bob@example.com' },
      { id: 'u4', displayName: 'Charlie', email: 'charlie@example.com' },
    ];
    setUsers(dummyAllUsers.filter(u => u.id !== user.uid)); // Filter out the current user

    // Simulate fetching existing private chats
    // In a real app, you'd fetch from your Supabase backend
    const dummyExistingChats = [
      { id: 'chat1', participants: ['u1', 'u2'], lastMessageText: 'Hello, how can I help you?', lastMessageAt: new Date(), otherParticipantId: 'u2' },
      { id: 'chat2', participants: ['u1', 'u3'], lastMessageText: 'Meeting at 3 PM', lastMessageAt: new Date(Date.now() - 3600000), otherParticipantId: 'u3' },
    ];
    setChats(dummyExistingChats.map(chat => ({
      ...chat,
      otherParticipantId: chat.participants.find(pId => pId !== user.uid)
    })));

  }, [user]);

  const handleStartChat = async (targetUserId) => {
    if (!user) return;

    // Simulate checking for existing chat or creating a new one
    // In a real app, this would involve your Supabase backend
    const participants = [user.uid, targetUserId].sort();
    const existingChat = chats.find(chat => 
      JSON.stringify(chat.participants.sort()) === JSON.stringify(participants)
    );

    let chatId;
    if (existingChat) {
      chatId = existingChat.id;
    } else {
      // Simulate creating a new chat ID
      chatId = `chat-${participants[0]}-${participants[1]}`;
      // Add dummy new chat to state for immediate display (optional)
      setChats(prevChats => [
        ...prevChats,
        { id: chatId, participants, lastMessageText: '', lastMessageAt: new Date(), otherParticipantId: targetUserId }
      ]);
    }

    navigate(`/dashboard/private-chat/${chatId}`);
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Private Messages</h2>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <Card key={u.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.displayName || u.email}`} />
                  <AvatarFallback>{(u.displayName || u.email).substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{u.displayName || u.email}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <Button onClick={() => handleStartChat(u.id)}>Chat</Button>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No users found for new chats.</p>
        )}

        {chats.length > 0 && (
          <>
            <h3 className="text-xl font-bold mt-6 mb-3">Your Chats</h3>
            {chats.map((chat) => {
              const otherParticipant = users.find(u => u.id === chat.otherParticipantId);
              return (
                <Card key={chat.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${otherParticipant?.displayName || otherParticipant?.email || 'Unknown User'}`} />
                      <AvatarFallback>{(otherParticipant?.displayName || otherParticipant?.email || '??').substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{otherParticipant?.displayName || otherParticipant?.email || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">Last message: {chat.lastMessageText || 'No messages yet'}</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate(`/dashboard/private-chat/${chat.id}`)}>Open Chat</Button>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PrivateChatList;
