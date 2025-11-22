export interface CountryDataJSON {
  id: number;
  country: string;
  participations: {
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
  }[];
}