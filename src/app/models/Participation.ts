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