import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { CountryData } from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public totalCountries = 0
  public totalJOs = 0
  public error!:string
  titlePage = "Medals per Country";


  //variable accèssible pour le graphique
  public chartCountries: string[] = [];
  public chartMedals: number[] = [];

  constructor(private router: Router, private olympicService: OlympicService) { }

  ngOnInit(): void {
    

    this.olympicService.getAll().subscribe({
      next: (data: CountryData[]) => {
        if (!data || data.length === 0) {
          this.error = 'No data available';
          return;
        }

        // Liste des pays
        this.chartCountries = data.map((c) => c.country);
        this.chartMedals = data.map(c => c.totalMedals);

        this.totalCountries = this.chartCountries.length;

        console.log(this.chartCountries)
        console.log(this.chartMedals)

        // Calcul du nombre total de JO (années uniques)
        const yearsSet = new Set<number>();
        data.forEach((c) =>
          c.participations.forEach((p) => yearsSet.add(p.year))
        );
        this.totalJOs = yearsSet.size;

      },
      error: (err) => {
        console.error(err);
        this.error = err.message || 'error loading Olympic data';
      },
    });
  }
  onCountryChartSelect(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }

}

