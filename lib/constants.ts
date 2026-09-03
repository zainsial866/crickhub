export const APP_NAME = 'CricketHub';
export const APP_TAGLINE = 'Book. Play. Repeat.';

export const CITIES = ['Islamabad', 'Rawalpindi'] as const;

export const PITCH_TYPES = [
  { id: 'all', label: 'All Arenas' },
  { id: 'indoor_net', label: 'Indoor Nets' },
  { id: 'turf_box', label: 'Turf Box' },
  { id: 'matting', label: 'Matting Wicket' },
] as const;

export const ROLE_HOME_ROUTES = {
  player: '/player/discover',
  ground_owner: '/ground-owner/dashboard',
  admin: '/admin/dashboard',
} as const;

export const DEFAULT_THEME = 'dark';
