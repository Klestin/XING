export interface Profile {
  id: string;
  name: string;
  age: number;
  state: string;
  interests: string[];
  hobbies: string[];
  cgpa: number;
  bio: string;
  photos: string[];
  instagramId: string;
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: Date;
  active: boolean;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface SwipeAction {
  direction: 'left' | 'right';
  profile: Profile;
  timestamp: Date;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: {
    matches: boolean;
    messages: boolean;
    profileViews: boolean;
  };
  visibility: boolean;
  maxDistance?: number;
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface StudentProfile {
  id?: string;  // Optional for form data, but required in database
  email: string;
  password: string;
  name: string;
  student_id: string;
  department: string;
  year: number;
  cgpa: number;
  bio: string;
  photos: string[];
  instagram_id: string;
  created_at?: string;
  updated_at?: string;
}