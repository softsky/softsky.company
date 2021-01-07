import { Component, OnInit, HostListener, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from '@app/core';
import { BaseChartDirective } from 'ng2-charts';

import * as moment from 'moment';
const log = new Logger('Home');

export const EMPTY_DATA = [
  { data: [0, 0, 0, 0, 0, 0, 0], label: 'Breached' },
  { data: [0, 0, 0, 0, 0, 0, 0], label: 'Researched' }
];

export const EMPTY_LABELS = [2012, 2013, 2014, 2015, 2016, 2017, 2018];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  outputs: ['onInitialized']
})
export class LineChartComponent implements OnInit {
  @ViewChild(BaseChartDirective)
  baseChart: BaseChartDirective;

  private onInitialized = new EventEmitter<LineChartComponent>();

  // lineChart
  public lineChartData: Array<any> = EMPTY_DATA;
  public lineChartLabels: Array<any> = EMPTY_LABELS;
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(204,0,0,0.2)',
      borderColor: 'rgba(204,0,0,1)',
      pointBackgroundColor: 'rgba(204,0,0,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(204,0,0,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(0,102,102,0.2)',
      borderColor: 'rgba(0,102,102,1)',
      pointBackgroundColor: 'rgba(0,102,102,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,102,102,1)'
    }
  ];

  constructor() {}

  ngOnInit() {
    this.onInitialized.emit(this);
  }

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
