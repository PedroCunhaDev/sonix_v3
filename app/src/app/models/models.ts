export interface Song {
  id: number;
  name: string;
  length: number; // second
  time?: string; // formatted mm:ss
  artist?: string;
  album?: string;
}

export enum Pages { Start, AllSongs, Playlists, Albums, Artists, Upload, About, Profile }
