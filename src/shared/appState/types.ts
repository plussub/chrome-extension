export interface TmdbState {
  tmdb_id: string;
  poster_path: string;
  title: string;
  media_type: string;
  release_date: string;
  description: string;
  vote_average: number;
  overview: string;
}

export interface OpensubtitlesState {
  SubFileName: string;
  SubDownloadLink: string;
  ZipDownloadLink: string;
  SubtitlesLink: string;
  SubRating: string;
  SubFormat: string;
  LanguageName: string;
}

export interface SearchState {
  inSelectionTmdb: TmdbState | null;
  tmdb: TmdbState | null;
  opensubtitles: OpensubtitlesState | null;
}

export interface OffsetTimeState {
  time: number;
  applied: boolean;
}

export interface AppState {
  version: string;
  debug: boolean;
  state: 'NONE' | 'SELECTED' | 'DOWNLOADING' | 'PARSING' | 'DONE';
  src: 'NONE' | 'FILE' | 'SEARCH';
  search: SearchState| null;
  offsetTime: OffsetTimeState;
}
