import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CountryData } from '../../models/CountryData';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public totalCountries = 0
  public totalJOs = 0
  public error: string | null = null;
  titlePage = "Medals per Country";


  private _countryData!: CountryData[];

  //variable accèssible pour le graphique
  public chartCountries: string[] = [];
  public chartMedals: number[] = [];

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private olympicService: OlympicService) { }

  ngOnInit(): void {
    

    // on souscrit a l'observable
    //takeUntil(this.destroy$) permet de s'abboné jusqu'a la destruction
    this.olympicService.countryData$.pipe(takeUntil(this.destroy$)).subscribe({
    next: (data) => {
      this.error = null; // reset
      this._countryData = data;
      console.log("Données chargées :", data);

      if (!this._countryData || this._countryData.length === 0) {
        this.error = 'No data available';
        return;
      }
      // Trier par nombre total de médailles (ordre décroissant)
      const sortedData = [...this._countryData].sort(
        (a, b) => b.totalMedals - a.totalMedals
      );

      // Liste des pays
      this.chartCountries = sortedData.map((c) => c.country);
      this.chartMedals = sortedData.map(c => c.totalMedals);

      this.totalCountries = this.chartCountries.length;


      // Calcul du nombre total de JO (années uniques)
      const yearsSet = new Set<number>();
      this._countryData.forEach((c) =>
        c.participations.forEach((p) => yearsSet.add(p.year))
      );
      this.totalJOs = yearsSet.size;


    },
    error: (err) => {
      console.error("Erreur :", err);
      this.error = err.message;
    }

    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onCountryChartSelect(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }

}

