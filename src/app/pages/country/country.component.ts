
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import Chart from 'chart.js/auto';
import { CountryData,CountryDataJSON,Participation } from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  public lineChart!: Chart<"line", (number | string)[], number>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;

  constructor(private route: ActivatedRoute,private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.route.paramMap
    .pipe(
      // 1. On récupère le nom du pays dans l’URL
      switchMap((params: ParamMap) => {
        const countryName = params.get('countryName');

        if (!countryName) {
          this.error = 'No country provided in route.';
          throw new Error('No country provided');
        }

        // 2. On appelle le service qui renvoie un Observable<CountryData | undefined>
        return this.olympicService.getByCountry(countryName);
      })
    )
    .subscribe({
      next: (country : CountryData | undefined ) => {
        if (!country) {
          this.error = 'Country not found.';
          return;
        }

        // Ici tu as TON PAYS avec toutes ses données typées
        this.titlePage = country.country;

        this.totalEntries = country.participations.length;
        this.totalMedals = country.totalMedals;
        this.totalAthletes = country.totalAthletes;

        const years = country.participations.map(p => p.year);
        const medals = country.participations.map(p => p.medalsCount);

        // Tu construis ton graphique
        this.buildChart(years, medals);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load country data.';
      }
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
