import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { User, Message } from '../types';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface ChatProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  onSendMessage: (toUserId: string, content: string) => void;
}

export function Chat({ currentUser, users, messages, onSendMessage }: ChatProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Get unique chat threads
  const getChatThreads = () => {
    const threads = new Map<string, { user: User; lastMessage: Message; unreadCount: number }>();
    
    messages.forEach(msg => {
      const otherUserId = msg.fromUserId === currentUser.id ? msg.toUserId : msg.fromUserId;
      const existingThread = threads.get(otherUserId);
      
      if (!existingThread || msg.timestamp > existingThread.lastMessage.timestamp) {
        const user = users.find(u => u.id === otherUserId);
        if (user) {
          const unreadCount = messages.filter(
            m => m.fromUserId === otherUserId && m.toUserId === currentUser.id && !m.read
          ).length;
          
          threads.set(otherUserId, {
            user,
            lastMessage: msg,
            unreadCount,
          });
        }
      }
    });

    return Array.from(threads.values()).sort(
      (a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
  };

  const chatThreads = getChatThreads();
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  // Get messages for selected chat
  const chatMessages = selectedUserId
    ? messages.filter(
        msg =>
          (msg.fromUserId === currentUser.id && msg.toUserId === selectedUserId) ||
          (msg.fromUserId === selectedUserId && msg.toUserId === currentUser.id)
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : [];

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUserId) {
      onSendMessage(selectedUserId, messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground">Connect with your sports partners</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Chat List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>{chatThreads.length} active chats</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {chatThreads.length > 0 ? (
                chatThreads.map(({ user, lastMessage, unreadCount }) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                      selectedUserId === user.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold truncate">{user.name}</p>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(lastMessage.timestamp, 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start connecting with athletes!</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedUser.name}</CardTitle>
                    <CardDescription className="flex gap-2">
                      <Badge variant="secondary">{selectedUser.role}</Badge>
                      <Badge variant="outline">{selectedUser.experienceLevel}</Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[450px] p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => {
                      const isCurrentUser = msg.fromUserId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}
                            >
                              {format(msg.timestamp, 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="size-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
