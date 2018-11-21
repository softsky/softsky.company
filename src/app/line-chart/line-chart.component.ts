import { Component, OnInit, HostListener, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from '@app/core';
import { BaseChartDirective } from 'ng2-charts';

import * as moment from 'moment';
const log = new Logger('Home');

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  outputs: ['onInitialized']
})
export class LineChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  private width: number;
  private onInitialized = new EventEmitter<LineChartComponent>();

  // lineChart
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  public lineChartLabels: Array<any> = [1, 2, 3, , 4, 5, 6, 7];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  constructor() {}

  ngOnInit() {
    this.onInitialized.emit(this);
    this.onResize(null); // initial set size
  }

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'bar';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = window.innerWidth * 0.9;
    log.debug('Setting size', this.width);
  }
}
