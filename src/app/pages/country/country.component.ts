import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import Chart from 'chart.js/auto';
import { CountryData } from '../../core/models/olympic.model';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public lineChart!: Chart<"line", (number | string)[], number>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;

  constructor(private route: ActivatedRoute,private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.http.get<CountryData[]>(this.olympicUrl).subscribe(
      (data) => {
        if (!countryName) { /* si il n'y a pas de nom au pays on peu rien en faire */ 
          this.error = 'No country provided in route.';
          return;
        }
        const selectedCountry = data.find(c => c.country === countryName); /* on cherche si le pays existe */

        if (!selectedCountry) { /* si le pays n'est pas dans la liste on peu rien en faire */ 
          this.error = 'Country not found.';
          return;
        }
        /* on affiche les donné grace a l'objet pays obtenue */
        this.titlePage = selectedCountry.country;

        const participations = selectedCountry.participations;

        this.totalEntries = participations.length;
        const years = participations.map(p => p.year);
        const medals = participations.map(p => p.medalsCount);
        const athletes = participations.map(p => p.athleteCount);

        this.totalMedals = medals.reduce((acc, m) => acc + m, 0);
        this.totalAthletes = athletes.reduce((acc, a) => acc + a, 0);

        this.buildChart(years, medals);


        /* ancien code garder au cas ou  */
        /*if (data && data.length > 0) {
          const selectedCountry = data.find((i: any) => i.country === countryName);
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry?.participations.map((i: any) => i);
          this.totalEntries = participations?.length ?? 0;
          const years = selectedCountry?.participations.map((i: any) => i.year) ?? [];
          const medals = selectedCountry?.participations.map((i: any) => i.medalsCount.toString()) ?? [];
          this.totalMedals = medals.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          const nbAthletes = selectedCountry?.participations.map((i: any) => i.athleteCount.toString()) ?? []
          this.totalAthletes = nbAthletes.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          this.buildChart(years, medals);
        }*/
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
    );
  }

  buildChart(years: number[], medals: number[]) {
    const lineChart = new Chart("countryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }
}
