import React, { useState } from 'react';
import { Auth } from './components/Auth';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './components/Dashboard';
import { MapView } from './components/MapView';
import { Events } from './components/Events';
import { Chat } from './components/Chat';
import { Connections } from './components/Connections';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { User, Game, Message, Connection } from './types';
import { mockUsers, mockGames, mockMessages, mockConnections, currentUser as initialUser } from './mock-data';
import {
  Home,
  Map,
  Calendar,
  MessageSquare,
  Users,
  Dumbbell,
  LogOut,
  Bell,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

type AppView = 'dashboard' | 'map' | 'events' | 'chat' | 'connections';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [games, setGames] = useState<Game[]>(mockGames);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [connections, setConnections] = useState<Connection[]>(mockConnections);

  // Filter matches based on interests and location
  const getMatches = () => {
    return users.filter(user => {
      if (user.id === currentUser.id) return false;
      
      // Check if they share at least one sport
      const hasCommonSport = user.sports.some(sport => currentUser.sports.includes(sport));
      
      // Check if they're in the same city or nearby
      const isNearby = user.location.city === currentUser.location.city;
      
      return hasCommonSport && isNearby;
    });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setHasProfile(true); // In demo, skip profile setup for existing user
  };

  const handleCompleteProfile = (profile: Partial<User>) => {
    const updatedUser = {
      ...currentUser,
      ...profile,
    };
    setCurrentUser(updatedUser);
    setHasProfile(true);
    toast.success('Profile created successfully!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasProfile(false);
    setCurrentView('dashboard');
    toast.info('Logged out successfully');
  };

  const handleConnect = (userId: string) => {
    const existingConnection = connections.find(
      conn =>
        (conn.fromUserId === currentUser.id && conn.toUserId === userId) ||
        (conn.fromUserId === userId && conn.toUserId === currentUser.id)
    );

    if (existingConnection) {
      toast.info('Connection request already sent or exists');
      return;
    }

    const newConnection: Connection = {
      id: `c${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId: userId,
      status: 'pending',
      createdAt: new Date(),
    };

    setConnections([...connections, newConnection]);
    toast.success('Connection request sent!');
  };

  const handleAcceptConnection = (connectionId: string) => {
    setConnections(
      connections.map(conn =>
        conn.id === connectionId ? { ...conn, status: 'accepted' as const } : conn
      )
    );
    toast.success('Connection accepted!');
  };

  const handleRejectConnection = (connectionId: string) => {
    setConnections(
      connections.map(conn =>
        conn.id === connectionId ? { ...conn, status: 'rejected' as const } : conn
      )
    );
    toast.info('Connection request declined');
  };

  const handleSendMessage = (toUserId: string, content?: string) => {
    if (!content) {
      // Just open chat
      setCurrentView('chat');
      return;
    }

    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      content,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    toast.success('Message sent!');
  };

  const handleCreateGame = (gameData: Partial<Game>) => {
    const newGame: Game = {
      id: `g${Date.now()}`,
      title: gameData.title || '',
      sport: gameData.sport || 'cricket',
      description: gameData.description || '',
      creatorId: currentUser.id,
      location: gameData.location || currentUser.location,
      dateTime: gameData.dateTime || new Date(),
      maxParticipants: gameData.maxParticipants || 10,
      participants: [currentUser.id],
      experienceLevel: gameData.experienceLevel || currentUser.experienceLevel,
    };

    setGames([...games, newGame]);
    toast.success('Event created successfully!');
  };

  const handleJoinGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    if (game.participants.includes(currentUser.id)) {
      toast.info('Already joined this event');
      return;
    }

    if (game.participants.length >= game.maxParticipants) {
      toast.error('Event is full');
      return;
    }

    setGames(
      games.map(g =>
        g.id === gameId
          ? { ...g, participants: [...g.participants, currentUser.id] }
          : g
      )
    );
    toast.success('Joined event successfully!');
  };

  // Not authenticated - show auth screen
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // Authenticated but no profile - show profile setup
  if (!hasProfile) {
    return <ProfileSetup onComplete={handleCompleteProfile} />;
  }

  const matches = getMatches();
  const unreadCount = messages.filter(
    m => m.toUserId === currentUser.id && !m.read
  ).length;
  const pendingConnectionsCount = connections.filter(
    conn => conn.toUserId === currentUser.id && conn.status === 'pending'
  ).length;

  // Main app interface
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="size-8 text-primary" />
              <span className="text-2xl font-bold">SportConnect</span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                {(unreadCount > 0 || pendingConnectionsCount > 0) && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount + pendingConnectionsCount}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.location.city}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('dashboard')}
              className="gap-2"
            >
              <Home className="size-4" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'map' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('map')}
              className="gap-2"
            >
              <Map className="size-4" />
              Map View
            </Button>
            <Button
              variant={currentView === 'events' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('events')}
              className="gap-2"
            >
              <Calendar className="size-4" />
              Events
            </Button>
            <Button
              variant={currentView === 'chat' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('chat')}
              className="gap-2 relative"
            >
              <MessageSquare className="size-4" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={currentView === 'connections' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('connections')}
              className="gap-2 relative"
            >
              <Users className="size-4" />
              Connections
              {pendingConnectionsCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingConnectionsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            matches={matches}
            onViewProfile={(userId) => console.log('View profile:', userId)}
            onSendMessage={handleSendMessage}
            onConnect={handleConnect}
          />
        )}

        {currentView === 'map' && (
          <MapView
            currentUser={currentUser}
            users={users}
            onConnect={handleConnect}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentView === 'events' && (
          <Events
            games={games}
            users={users}
            currentUser={currentUser}
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
          />
        )}

        {currentView === 'chat' && (
          <Chat
            currentUser={currentUser}
            users={users}
            messages={messages}
            onSendMessage={(userId, content) => handleSendMessage(userId, content)}
          />
        )}

        {currentView === 'connections' && (
          <Connections
            currentUser={currentUser}
            users={users}
            connections={connections}
            onAcceptConnection={handleAcceptConnection}
            onRejectConnection={handleRejectConnection}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
}
