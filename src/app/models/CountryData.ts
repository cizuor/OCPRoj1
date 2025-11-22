import { Participation } from "./Participation";

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
  get totalAthletes(): number {
    return this._participations.reduce((sum, p) => sum + (p.athleteCount ?? 0), 0);
  }
}