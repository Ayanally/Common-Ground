import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '../types';
import { MapPin, User as UserIcon, Medal, MessageSquare, Calendar } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  matches: User[];
  onViewProfile: (userId: string) => void;
  onSendMessage: (userId: string) => void;
  onConnect: (userId: string) => void;
}

export function Dashboard({ currentUser, matches, onViewProfile, onSendMessage, onConnect }: DashboardProps) {
  // Calculate distance (mock calculation)
  const calculateDistance = (user: User) => {
    const distance = Math.random() * 10;
    return distance.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {currentUser.name}! 👋</CardTitle>
          <CardDescription className="text-indigo-100">
            You have {matches.length} potential matches nearby
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <UserIcon className="size-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{matches.length}</p>
                <p className="text-sm text-muted-foreground">Nearby Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Upcoming Games</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Medal className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentUser.experienceLevel}</p>
                <p className="text-sm text-muted-foreground">Your Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Matches</CardTitle>
          <CardDescription>
            Athletes near you with similar interests and skill level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((user) => (
              <div
                key={user.id}
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

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {user.location.city} • {calculateDistance(user)} km away
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {user.sports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>

                  {user.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => onConnect(user.id)}>
                    Connect
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onSendMessage(user.id)}>
                    <MessageSquare className="size-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            ))}

            {matches.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserIcon className="size-12 mx-auto mb-4 opacity-50" />
                <p>No matches found yet. Try updating your profile or location.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
