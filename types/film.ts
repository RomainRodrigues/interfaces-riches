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
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
}

export interface AudioDescription {
  time: number;
  text: string;
}

export interface POI {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  scenes: number[];
}
