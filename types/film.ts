export interface FilmData {
  film: {
    file_url: string;
    title: string;
    synopsis_url: string;
  };
  subtitles: {
    en: string;
    fr: string;
    es: string;
  };
  "audio-description": string;
  chapters: string;
  poi: string;
}

export interface Chapter {
  chapter: number;
  description: string;
  description_es: string;
  description_fr: string;
  timestamp: string;
  title: string;
  title_es: string;
  title_fr: string;
}

export interface AudioDescription {
  time: number;
  text: string;
}

export interface POITimestamp {
  time: string;
  scene: string;
  scene_fr: string;
  scene_es: string;
}

export interface POI {
  id: number;
  title: string;
  title_fr: string;
  title_es: string;
  latitude: number;
  longitude: number;
  description: string;
  description_fr: string;
  description_es: string;
  timestamps?: POITimestamp[];
}
