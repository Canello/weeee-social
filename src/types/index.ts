export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creator: User;
  imageUrl?: string;
  interestedUsers: string[];
  interestedUsersPreview: User[];
  minimumInterested: number;
  expirationDate: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  visibilityOption: 'followers' | 'followers-share' | 'public';
}

export interface Interest {
  id: string;
  ideaId: string;
  userId: string;
  user: User;
  status: 'interested';
  message?: string;
  createdAt: Date;
}

export interface FeedItem {
  idea: Idea;
  interestCount: number;
  isInterested: boolean;
} 