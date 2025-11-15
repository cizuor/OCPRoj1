import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import type { Chart as ChartJS, ChartEvent, ActiveElement, TooltipItem } from 'chart.js';
import { CountryData,CountryDataJSON,Participation } from '../../models/olympic.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries = 0
  public totalJOs = 0
  public error!:string
  titlePage = "Medals per Country";

  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get<CountryDataJSON[]>(this.olympicUrl).subscribe({ // on recup les donné sous forme d'interface pour s'assuré qu'elle sont propore
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

          // Vérification que les données sont valides
          if (!Array.isArray(data) || data.length === 0) {
            this.error = 'No data available';
            return;
          }

          // Liste des pays
          const countries: string[] = data.map((c) => c.country);
          this.totalCountries = countries.length;

          // Calcul du nombre total de JO (années uniques)
          const yearsSet = new Set<number>();
          data.forEach((c) =>
            c.participations.forEach((p) => yearsSet.add(p.year))
          );
          this.totalJOs = yearsSet.size;

          // Création du Pie Chart
          this.buildPieChart(data);
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

  buildPieChart(data: CountryData[]): void {

    const countries = data.map(c => c.country);
    const medals = data.map(c => c.totalMedals);

    // identification du pays avec le plus de medailles
    const maxMedals = Math.max(...medals);
    const indexMax = medals.indexOf(maxMedals)
    // delete si existe déja pour éviter les fuites mémoire
    if (this.pieChart) {
      try {
        this.pieChart.destroy();
      } catch {
        // ignore errors on destroy
      }
    }
    
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: medals,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        layout: {
          padding: {
            top: 40,
            bottom: 40,
            left: 40,   // laisse plus de place à gauche
            right: 40,  // laisse plus de place à droite
          }
        },
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            displayColors: false,
            titleColor: '#fff',          // couleur du texte du titre
            bodyColor: '#fff',           // couleur du texte du corps
            backgroundColor: '#0b868f', // couleur fixe pour tous les tooltips
            titleFont: {
              weight: 'normal', // titre non gras
              size: 12          // taille du texte si tu veux
            },
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw as number;
                if (tooltipItem.dataIndex === indexMax) {
                  return `🏆${value} `;
                }else{
                  return ` ${value}`;
                }
              },
            },
          },
          datalabels: {
            color: '#111',
            anchor: 'end',      // positionne le label à l'extérieur
            align: 'end',       // aligne à la fin de la ligne
            offset: 30,         // distance entre la tranche et le label
            formatter: (value: number, ctx) =>
              String(ctx.chart.data.labels ? ctx.chart.data.labels[ctx.dataIndex] : ''),font: {
              weight: 'bold',
              size: 15,
            },
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 4,
            padding: 4,
            // clamp true évite que le label sorte du canvas si trop proche du bord
            clamp: true,
          },
          legend: {
            display: false,
          }
        },
        onClick: (evt?: ChartEvent):void => {
          // on trouve ou le click a été fait
          const points: ActiveElement[] =
            this.pieChart.getElementsAtEventForMode(
              evt as unknown as Event,
              'point',
              { intersect: true },
              true
            );
          if (points.length > 0) {
            const index = points[0].index;
            this.router.navigate(['country', countries[index]]);
          } 
        }
      }
      
    });
    this.pieChart = pieChart;
  }
}

