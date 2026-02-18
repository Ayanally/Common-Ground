import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { User, Sport, ExperienceLevel } from '../types';
import { X } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (profile: Partial<User>) => void;
}

const sports: Sport[] = ['cricket', 'football', 'badminton', 'basketball', 'tennis', 'volleyball'];

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate');
  const [role, setRole] = useState<'player' | 'coach'>('player');
  const [bio, setBio] = useState('');
  const [currentSport, setCurrentSport] = useState<Sport | ''>('');

  const handleAddSport = () => {
    if (currentSport && !selectedSports.includes(currentSport)) {
      setSelectedSports([...selectedSports, currentSport]);
      setCurrentSport('');
    }
  };

  const handleRemoveSport = (sport: Sport) => {
    setSelectedSports(selectedSports.filter(s => s !== sport));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock location data based on city
    const locationData = {
      city,
      latitude: 19.0760 + Math.random() * 0.1,
      longitude: 72.8777 + Math.random() * 0.1,
    };

    onComplete({
      name,
      location: locationData,
      sports: selectedSports,
      experienceLevel,
      role,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us about yourself to find the perfect sports partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Sports Interests</Label>
              <div className="flex gap-2">
                <Select value={currentSport} onValueChange={(value) => setCurrentSport(value as Sport)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddSport}>
                  Add
                </Button>
              </div>
              {selectedSports.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSports.map((sport) => (
                    <Badge key={sport} variant="secondary" className="gap-1">
                      {sport}
                      <button
                        type="button"
                        onClick={() => handleRemoveSport(sport)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
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

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as 'player' | 'coach')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your sports journey..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={selectedSports.length === 0}>
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
