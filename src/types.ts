export type Screen = 'onboarding' | 'home' | 'feed' | 'lock' | 'settings';

export interface Settings {
  dailyBudgetSeconds: number;
  onboarded: boolean;
}

export interface DailyUsage {
  date: string;
  usedSeconds: number;
}

export interface FeedPost {
  id: string;
  author: string;
  handle: string;
  avatarColor: string;
  timeAgo: string;
  content: string;
  imageHue?: number;
  likes: number;
  comments: number;
  reposts: number;
}
