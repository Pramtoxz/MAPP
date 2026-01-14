export interface Campaign {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'active' | 'completed' | 'upcoming';
  fullDescription: string;
  partsIncluded: string[];
  termsAndConditions: string;
  rewards: string[];
}
