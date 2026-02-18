import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Game, User, Sport, ExperienceLevel } from '../types';
import { Calendar, MapPin, Users, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface EventsProps {
  games: Game[];
  users: User[];
  currentUser: User;
  onCreateGame: (game: Partial<Game>) => void;
  onJoinGame: (gameId: string) => void;
}

export function Events({ games, users, currentUser, onCreateGame, onJoinGame }: EventsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<Sport>('cricket');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate');

  const handleCreateGame = () => {
    const newGame: Partial<Game> = {
      title,
      sport,
      description,
      location: {
        name: locationName,
        latitude: currentUser.location.latitude + (Math.random() - 0.5) * 0.05,
        longitude: currentUser.location.longitude + (Math.random() - 0.5) * 0.05,
      },
      dateTime: new Date(dateTime),
      maxParticipants: parseInt(maxParticipants),
      experienceLevel,
    };

    onCreateGame(newGame);
    setIsCreateOpen(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setLocationName('');
    setDateTime('');
    setMaxParticipants('10');
  };

  const getUserById = (userId: string) => users.find(u => u.id === userId);

  const upcomingGames = games.filter(game => game.dateTime > new Date());
  const myGames = upcomingGames.filter(game => 
    game.participants.includes(currentUser.id)
  );
  const availableGames = upcomingGames.filter(game => 
    !game.participants.includes(currentUser.id) && 
    game.participants.length < game.maxParticipants
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Games & Events</h2>
          <p className="text-muted-foreground">Create or join sports activities near you</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Organize a sports activity and invite others to join
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Weekend Cricket Match"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-sport">Sport</Label>
                  <Select value={sport} onValueChange={(value) => setSport(value as Sport)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cricket">Cricket</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="badminton">Badminton</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-level">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Oval Maidan, Mumbai"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-datetime">Date & Time</Label>
                  <Input
                    id="event-datetime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-max">Max Participants</Label>
                  <Input
                    id="event-max"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    min="2"
                  />
                </div>
              </div>

              <Button onClick={handleCreateGame} className="w-full">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Events */}
      {myGames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Events you're participating in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  users={users}
                  currentUser={currentUser}
                  isParticipating={true}
                  onJoin={onJoinGame}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Events */}
      <Card>
        <CardHeader>
          <CardTitle>Available Events</CardTitle>
          <CardDescription>Join upcoming sports activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableGames.length > 0 ? (
              availableGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  users={users}
                  currentUser={currentUser}
                  isParticipating={false}
                  onJoin={onJoinGame}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="size-12 mx-auto mb-4 opacity-50" />
                <p>No available events at the moment.</p>
                <p className="text-sm">Create one to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface GameCardProps {
  game: Game;
  users: User[];
  currentUser: User;
  isParticipating: boolean;
  onJoin: (gameId: string) => void;
}

function GameCard({ game, users, currentUser, isParticipating, onJoin }: GameCardProps) {
  const creator = users.find(u => u.id === game.creatorId);
  const participants = users.filter(u => game.participants.includes(u.id));

  return (
    <div className="border rounded-lg p-4 space-y-4 hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{game.title}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>{game.sport}</Badge>
            <Badge variant="outline">{game.experienceLevel}</Badge>
          </div>
        </div>
        {!isParticipating && (
          <Button 
            onClick={() => onJoin(game.id)}
            disabled={game.participants.length >= game.maxParticipants}
          >
            {game.participants.length >= game.maxParticipants ? 'Full' : 'Join'}
          </Button>
        )}
        {isParticipating && game.creatorId === currentUser.id && (
          <Badge variant="default">Organizer</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{game.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" />
          {format(game.dateTime, 'PPp')}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          {game.location.name}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="size-4" />
          {game.participants.length} / {game.maxParticipants} participants
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          Organized by {creator?.name}
        </div>
      </div>

      {participants.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Participants:</span>
          <div className="flex -space-x-2">
            {participants.slice(0, 5).map((user) => (
              <Avatar key={user.id} className="size-8 border-2 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 5 && (
              <div className="size-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                +{participants.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}