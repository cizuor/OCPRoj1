
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { CountryData} from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;

  public chartYears: number[] = [];
  public chartMedals: number[] = [];

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

        this.chartYears  = country.participations.map(p => p.year);
        this.chartMedals  = country.participations.map(p => p.medalsCount);

      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load country data.';
      }
    });
  }
}
