/* creation des objet de base pour séparer le model du reste*/

export interface Participation {/* les participation unitaire au JO */
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

export interface CountryData { /* le pays qui contien la liste de ses participation */
  id: number;
  country: string;
  participations: Participation[];
}