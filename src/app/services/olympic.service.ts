import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { CountryData, CountryDataJSON, Participation } from '../models/olympic.model';

@Injectable({
  providedIn: 'root'   // <- garantit le singleton 
})

export class OlympicService {

  private olympicUrl = 'assets/mock/olympic.json';

  // Cache interne (singleton) -> chargé 1 seule fois
  private cache$?: Observable<CountryData[]>;

  constructor(private http: HttpClient) {}


  clearCache(): void {
    this.cache$ = undefined;
  }
  /**
   * Charge toutes les données 
   */
  getAll(): Observable<CountryData[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<CountryDataJSON[]>(this.olympicUrl).pipe(

        // Conversion JSON -> classes CountryData
        map(rawList =>
          rawList.map(raw =>
            new CountryData(
              raw.id,
              raw.country,
              raw.participations.map(p =>
                new Participation(
                  p.year,
                  p.city,
                  p.medalsCount,
                  p.athleteCount
                )
              )
            )
          )
        ),

        // Transforme l’observable en cache permanent 
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError(err => {
          this.cache$ = undefined;
          return throwError(() => err);
        })
      );
    }

    return this.cache$;
  }

  /**
   * Cherche un pays par nom
   */
  getByCountry(name: string): Observable<CountryData | undefined> {
    return this.getAll().pipe(
      map(list => list.find(c => c.country === name))
    );
  }
}