
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CountryData} from '../../models/CountryData';
import { OlympicService } from '../../services/olympic.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;

  private _countryData!: CountryData | undefined;

  public chartYears: number[] = [];
  public chartMedals: number[] = [];

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {

    const countryName = this.route.snapshot.params['countryName'];
    if (!countryName) {
      this.error = 'No country provided in route.';
      throw new Error('No country provided');
    }

    this.olympicService.getByCountry$(countryName).pipe(takeUntil(this.destroy$)).subscribe({
      next: (country) => {
        this._countryData = country;
      }
    });
    //this._countryData = this.olympicService.getByCountry$(countryName);
     if (!this._countryData) {
          this.error = 'Country not found.';
          this.router.navigateByUrl(`not-found`);
          return;
      }

    this.titlePage = this._countryData.country;

    this.totalEntries = this._countryData.participations.length;
    this.totalMedals = this._countryData.totalMedals;
    this.totalAthletes = this._countryData.totalAthletes;

    this.chartYears  = this._countryData.participations.map(p => p.year);
    this.chartMedals  = this._countryData.participations.map(p => p.medalsCount);

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBackMenu():void
  {
    this.router.navigateByUrl(``);
  }
}
