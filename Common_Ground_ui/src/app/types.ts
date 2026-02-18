export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type UserRole = 'player' | 'coach';
export type Sport = 'cricket' | 'football' | 'badminton' | 'basketball' | 'tennis' | 'volleyball';
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location: {
    city: string;
    latitude: number;
    longitude: number;
  };
  sports: Sport[];
  experienceLevel: ExperienceLevel;
  role: UserRole;
  bio?: string;
  joined: Date;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ConnectionStatus;
  createdAt: Date;
}

export interface Game {
  id: string;
  title: string;
  sport: Sport;
  description: string;
  creatorId: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  dateTime: Date;
  maxParticipants: number;
  participants: string[];
  experienceLevel: ExperienceLevel;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatThread {
  userId: string;
  lastMessage: Message;
  unreadCount: number;
}
