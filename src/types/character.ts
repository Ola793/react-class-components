export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  gender?: string;
  origin?: {
    name: string;
  };
  location?: {
    name: string;
  };
}

export interface CharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
