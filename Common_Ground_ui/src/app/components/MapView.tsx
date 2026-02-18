import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '../types';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

interface MapViewProps {
  currentUser: User;
  users: User[];
  onConnect: (userId: string) => void;
  onSendMessage: (userId: string) => void;
}

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const currentUserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function MapView({ currentUser, users, onConnect, onSendMessage }: MapViewProps) {
  const center: [number, number] = [currentUser.location.latitude, currentUser.location.longitude];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Nearby Athletes
          </CardTitle>
          <CardDescription>
            Explore athletes and events near your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden border">
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Current user marker */}
              <Marker 
                position={[currentUser.location.latitude, currentUser.location.longitude]}
                icon={currentUserIcon}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold text-indigo-600">You are here</p>
                    <p className="text-sm">{currentUser.location.city}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Other users markers */}
              {users.filter(u => u.id !== currentUser.id).map((user) => (
                <Marker
                  key={user.id}
                  position={[user.location.latitude, user.location.longitude]}
                  icon={icon}
                >
                  <Popup maxWidth={300}>
                    <div className="p-2 space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {user.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.experienceLevel}
                            </Badge>
                          </div>
                        </div>
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
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onConnect(user.id)} className="flex-1">
                          Connect
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onSendMessage(user.id)} className="flex-1">
                          Message
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Other Athletes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
