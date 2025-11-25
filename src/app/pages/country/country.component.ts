
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { CountryData} from '../../models/CountryData';
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

  private _countryData!: CountryData | undefined;

  public chartYears: number[] = [];
  public chartMedals: number[] = [];

  constructor(private route: ActivatedRoute,private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {

    const countryName = this.route.snapshot.params['countryName'];
    if (!countryName) {
      this.error = 'No country provided in route.';
      throw new Error('No country provided');
    }

    this.olympicService.getByCountry$(countryName).subscribe({
      next: (country) => {
        this._countryData = country;
        console.log("Pays trouvé :", country);
      },
      error: (err) => {
        console.error("Erreur :", err);
      }
    });
    //this._countryData = this.olympicService.getByCountry$(countryName);
     if (!this._countryData) {
          this.error = 'Country not found.';
          return;
      }

    this.titlePage = this._countryData.country;

    this.totalEntries = this._countryData.participations.length;
    this.totalMedals = this._countryData.totalMedals;
    this.totalAthletes = this._countryData.totalAthletes;

    this.chartYears  = this._countryData.participations.map(p => p.year);
    this.chartMedals  = this._countryData.participations.map(p => p.medalsCount);

    /*this.route.paramMap
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
    });*/
  }
}
