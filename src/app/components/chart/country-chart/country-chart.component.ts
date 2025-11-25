import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, Output, EventEmitter,AfterViewInit,OnDestroy  } from '@angular/core';
import Chart from 'chart.js/auto';
import type { ChartEvent, ActiveElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-country-chart',
  template: '<canvas #chartCanvas></canvas>',
  styleUrl: './country-chart.component.scss',
})
export class CountryChartComponent implements OnChanges, AfterViewInit {
  @Input() countries: string[] = [];
  @Input() medals: number[] = [];
  @Input() backgroundColor: string[] = ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d']; // Couleurs par défaut
  @Input() label = 'Medals'; // Label par défaut pour le dataset
  @Input() aspectRatio = 2.5;


  @Output() countrySelected = new EventEmitter<string>();

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  public pieChart!: Chart<"pie", number[], string>; // Type correct pour un pie chart

  private chartInitialized = false;

  // OnChanges est utilisé pour reconstruire le graphique lorsque les inputs changent
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chartInitialized) return;

    const hasRelevantChange = !!(changes['countries'] || changes['medals'] || changes['backgroundColor'] || changes['label'] || changes['aspectRatio']);
    if (hasRelevantChange && this.countries?.length && this.medals?.length) {
      this.buildPieChart();
    }
  }

  ngAfterViewInit(): void {
    this.chartInitialized = true; // Marquer le graphique comme initialisé
    // Le DOM est garanti d'être prêt ici
    if (this.countries?.length && this.medals?.length) { // S'assurer qu'il y a des données dès l'initialisation
      this.buildPieChart();
    }
  }


  buildPieChart(): void {
    // Supprimer le graphique existant pour éviter les fuites de mémoire
    if (this.pieChart) {
      try {
        this.pieChart.destroy();
      } catch {
        // Ignorer les erreurs de destruction
      }
    }

    if (!this.countries.length || !this.medals.length) {
        // Pas de données pour construire le graphique
        return;
    }

    // Identification du pays avec le plus de médailles pour l'icône
    const maxMedals = Math.max(...this.medals);
    const indexMax = this.medals.indexOf(maxMedals);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context for chart canvas.');
      return;
    }

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.countries,
        datasets: [{
          label: this.label,
          data: this.medals,
          backgroundColor: this.backgroundColor,
          hoverOffset: 4
        }],
      },
      options: {
        layout: {
          padding: {
            top: 60,
            bottom: 60,
            left: 60,
            right: 60,
          }
        },
        aspectRatio: this.aspectRatio,
        responsive: true,
        plugins: {
          tooltip: {
            displayColors: false,
            titleColor: '#fff',
            bodyColor: '#fff',
            backgroundColor: '#0b868f',
            titleFont: {
              weight: 'normal',
              size: 12
            },
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw as number;
                if (tooltipItem.dataIndex === indexMax) {
                  return `🏆${value} `;
                } else {
                  return ` ${value}`;
                }
              },
            },
          },
          datalabels: {
            color: '#111',
            anchor: 'end',
            align: 'end',
            offset: 30,
            formatter: (value: number, ctx) =>
              String(ctx.chart.data.labels ? ctx.chart.data.labels[ctx.dataIndex] : ''),
            font: {
              weight: 'bold',
              size: 15,
            },
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 4,
            padding: 4,
            clamp: true,
          },
          legend: {
            display: false,
          }
        },
        onClick: (evt?: ChartEvent): void => {
          const points: ActiveElement[] =
            this.pieChart.getElementsAtEventForMode(
              evt as unknown as Event,
              'point',
              { intersect: true },
              true
            );
          if (points.length > 0) {
            const index = points[0].index;
            // Émet l'événement avec le nom du pays sélectionné
            this.countrySelected.emit(this.countries[index]);
          }
        }
      }
    });
  }

}
