import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import Chart from 'chart.js/auto';
import { CountryData,CountryDataJSON,Participation } from '../../models/olympic.model';


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
    this.http.get<CountryDataJSON[]>(this.olympicUrl).subscribe({
      next: (rawData) => {
            try {
              // Transformer le JSON en instances de classe
              const data: CountryData[] = rawData.map(
                (c) =>
                  new CountryData(
                    c.id,
                    c.country,
                    c.participations.map(
                      (p) =>
                        new Participation(
                          p.year,
                          p.city,
                          p.medalsCount,
                          p.athleteCount
                        )
                    )
                  )
              );
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
            } catch (e) {
              console.error('Error processing Olympic data:', e);
              this.error = 'Error processing data';
          }
        },
      error: (error: HttpErrorResponse) => {
        console.error('HTTP error loading Olympic data:', error);
        this.error = error.message || 'Unknown error';
    },
  });
}


  buildChart(years: number[], medals: number[]) {
    // on delete si il existe déja pour pas crée de fuite mêmoire
    if (this.lineChart) {
      try {
        this.lineChart.destroy();
      } catch {
        // ignore errors on destroy
      }
    }

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
