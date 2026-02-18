import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Connection } from '../types';
import { Check, X, Clock, MessageSquare, MapPin } from 'lucide-react';

interface ConnectionsProps {
  currentUser: User;
  users: User[];
  connections: Connection[];
  onAcceptConnection: (connectionId: string) => void;
  onRejectConnection: (connectionId: string) => void;
  onSendMessage: (userId: string) => void;
}

export function Connections({
  currentUser,
  users,
  connections,
  onAcceptConnection,
  onRejectConnection,
  onSendMessage,
}: ConnectionsProps) {
  const myConnections = connections.filter(
    conn => conn.fromUserId === currentUser.id || conn.toUserId === currentUser.id
  );

  const acceptedConnections = myConnections.filter(conn => conn.status === 'accepted');
  const pendingRequests = myConnections.filter(
    conn => conn.status === 'pending' && conn.toUserId === currentUser.id
  );
  const sentRequests = myConnections.filter(
    conn => conn.status === 'pending' && conn.fromUserId === currentUser.id
  );

  const getOtherUser = (conn: Connection) => {
    const otherUserId = conn.fromUserId === currentUser.id ? conn.toUserId : conn.fromUserId;
    return users.find(u => u.id === otherUserId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Connections</h2>
        <p className="text-muted-foreground">Manage your sports network</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({acceptedConnections.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Athletes</CardTitle>
              <CardDescription>People in your sports network</CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedConnections.length > 0 ? (
                <div className="space-y-4">
                  {acceptedConnections.map((conn) => {
                    const user = getOtherUser(conn);
                    if (!user) return null;

                    return (
                      <div
                        key={conn.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Avatar className="size-16">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={user.role === 'coach' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <Badge variant="outline">{user.experienceLevel}</Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            {user.location.city}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {user.sports.map((sport) => (
                              <Badge key={sport} variant="secondary" className="text-xs">
                                {sport}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSendMessage(user.id)}
                        >
                          <MessageSquare className="size-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No connections yet</p>
                  <p className="text-sm">Start connecting with athletes to build your network!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Requests</CardTitle>
              <CardDescription>People who want to connect with you</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((conn) => {
                    const user = getOtherUser(conn);
                    if (!user) return null;

                    return (
                      <div
                        key={conn.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <Avatar className="size-16">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={user.role === 'coach' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <Badge variant="outline">{user.experienceLevel}</Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            {user.location.city}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {user.sports.map((sport) => (
                              <Badge key={sport} variant="secondary" className="text-xs">
                                {sport}
                              </Badge>
                            ))}
                          </div>

                          {user.bio && (
                            <p className="text-sm text-muted-foreground">{user.bio}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onAcceptConnection(conn.id)}
                          >
                            <Check className="size-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRejectConnection(conn.id)}
                          >
                            <X className="size-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No pending requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Requests</CardTitle>
              <CardDescription>Requests waiting for response</CardDescription>
            </CardHeader>
            <CardContent>
              {sentRequests.length > 0 ? (
                <div className="space-y-4">
                  {sentRequests.map((conn) => {
                    const user = getOtherUser(conn);
                    if (!user) return null;

                    return (
                      <div
                        key={conn.id}
                        className="flex items-center gap-4 p-4 border rounded-lg opacity-60"
                      >
                        <Avatar className="size-16">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={user.role === 'coach' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            {user.location.city}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {user.sports.map((sport) => (
                              <Badge key={sport} variant="secondary" className="text-xs">
                                {sport}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Badge variant="outline">
                          <Clock className="size-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No sent requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
