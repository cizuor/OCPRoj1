import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, shareReplay, throwError  } from 'rxjs';
import { CountryData} from '../models/CountryData';
import { CountryDataJSON } from '../models/CountryDataJSON';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root'   // <- garantit le singleton 
})

export class OlympicService{

  private _olympicUrl = 'assets/mock/olympic.json';

  //private _countryData!: Observable<CountryData[]>;

  constructor(private http: HttpClient) {
    //this.loadData();
  }


  public countryData$: Observable<CountryData[]> = this.http.get<CountryDataJSON[]>(this._olympicUrl).pipe(
    // transformation JSON -> instances de classes
    map((raw) =>
      raw.map(
        (c) =>
          new CountryData(
            c.id,
            c.country,
            c.participations.map(
              (p) => new Participation(p.year, p.city, p.medalsCount, p.athleteCount)
            )
          )
      )
    ),

    //bufferSize nombre de valeur gardé (la dernière en l'occurence)
    //refCount: false on garde les donné même si personne les demande
    shareReplay({ bufferSize: 1, refCount: false }),
    // gestion d'erreur et transformation en Error observable
    catchError((err: HttpErrorResponse) => {
      console.error('Erreur HTTP dans OlympicService:', err);
      return throwError(() => new Error('Impossible de charger les données olympiques'));
    })
  );


  //Charge toutes les données 
  getAll$(): Observable<CountryData[]> {
    return this.countryData$;
  }

  //Cherche un pays par nom
  getByCountry$(name: string): Observable<CountryData|undefined> {
    return this.getAll$().pipe(
      map((countries) => countries.find((c) => c.country === name))
    );
  }
}