export type AppCategory = 'social' | 'games' | 'other';

export type AppInfo = {
  id: string;
  name: string;
  category: AppCategory;
  color: string;
};

export const SampleApps: AppInfo[] = [
  { id: 'tiktok', name: 'TikTok', category: 'social', color: '#FF3DA6' },
  { id: 'instagram', name: 'Instagram', category: 'social', color: '#FF6B57' },
  { id: 'snapchat', name: 'Snapchat', category: 'social', color: '#FFE55A' },
  { id: 'facebook', name: 'Facebook', category: 'social', color: '#2E7BFF' },

  { id: 'candycrush', name: 'Candy Crush', category: 'games', color: '#FF7A3C' },
  { id: 'minecraft', name: 'Minecraft', category: 'games', color: '#2ED47A' },
  { id: 'clash', name: 'Clash Royale', category: 'games', color: '#7B61FF' },

  { id: 'youtube', name: 'YouTube', category: 'other', color: '#FF3D3D' },
  { id: 'reddit', name: 'Reddit', category: 'other', color: '#FF5C2D' },
  { id: 'browser', name: 'Browser', category: 'other', color: '#5CC8FF' },
];

export const CategoryLabels: Record<AppCategory, { label: string; icon: string }> = {
  social: { label: 'Social', icon: 'chatbubble-ellipses-outline' },
  games: { label: 'Games', icon: 'game-controller-outline' },
  other: { label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
};


