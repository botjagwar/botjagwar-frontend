export type RecentChangeType = 'word' | 'definition';

export interface RecentChange {
  id: number;
  type: RecentChangeType;
  label: string;
  language: string;
  timestamp: string;
}
