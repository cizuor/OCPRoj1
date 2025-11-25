import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-medal-chart',
  template: '<canvas #chartCanvas></canvas>',
  styleUrls: ['./medal-chart.component.scss']
})
export class MedalChartComponent implements OnChanges {
  @Input() labels: (number | string)[] = [];
  @Input() data: number[] = [];
  @Input() label = ''; // Pour la légende du dataset
  @Input() backgroundColor = '#0b868f'; // Couleur par défaut
  @Input() aspectRatio = 2.5;

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  public chart!: Chart<"line", number[], (string | number)>;

  ngOnChanges(changes: SimpleChanges): void {
    // Reconstruire le graphique chaque fois que les inputs changent
    if (changes['labels'] || changes['data'] || changes['label'] || changes['backgroundColor'] || changes['aspectRatio']) {
      this.buildChart();
    }
  }

  buildChart() {
    // Détruire le graphique existant avant d'en créer un nouveau
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: this.label,
              data: this.data,
              backgroundColor: this.backgroundColor,
              borderColor: this.backgroundColor, // Pour la ligne
              fill: false // Ne pas remplir la zone sous la ligne
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'transparent',
          aspectRatio: this.aspectRatio,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}