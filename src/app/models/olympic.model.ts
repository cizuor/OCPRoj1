/* creation des objet de base pour séparer le model du reste*/

// je n'arrive pas a viré les any et a me passé d'une interface
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


export class Participation {
  // propriétés privées
  private _year: number;
  private _city: string;
  private _medalsCount: number;
  private _athleteCount: number;

  constructor(year: number, city: string, medalsCount: number, athleteCount: number) {
    this._year = year;
    this._city = city;
    this._medalsCount = medalsCount;
    this._athleteCount = athleteCount;
  }

  // getters publics
  get year(): number {
    return this._year;
  }

  get city(): string {
    return this._city;
  }

  get medalsCount(): number {
    return this._medalsCount;
  }

  get athleteCount(): number {
    return this._athleteCount;
  }
}


export class CountryData { /* le pays qui contien la liste de ses participation */
    private _id: number;
    private _country: string;
    private _participations: Participation[];

    constructor(id: number, country: string, participations: Participation[]){
        this._id = id;
        this._country = country;
        this._participations = participations;
    }

    // Getters publics
    get id(): number {
        return this._id;
    }

    get country(): string {
        return this._country;
    }

    get participations(): Participation[] {
        return this._participations;
    }
    get totalMedals(): number {
    return this._participations.reduce((sum, p) => sum + (p.medalsCount ?? 0), 0);
  }
}