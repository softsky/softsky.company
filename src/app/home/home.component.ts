import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, fromEvent, of, from } from 'rxjs';
import { map, scan, reduce } from 'rxjs/operators';

import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { QueueService } from './queue.service';
import { HttpClient } from '@angular/common/http';
import { Logger } from '@app/core';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineChartComponent } from '../line-chart/line-chart.component';

import * as moment from 'moment';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
  //  directives: [LineChartComponent]
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  emailForm: FormGroup;
  report: string;
  state: number = 0;
  breachedSites: Array<any> = [];
  breachedCount: number = 0;

  @ViewChild(LineChartComponent) chart: LineChartComponent;

  constructor(
    private queueService: QueueService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.emailForm = fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.isLoading = false;
    this.route.fragment.subscribe((fragment: string) => {
      this.emailForm.controls.email.setValue(fragment);
    });
    document.querySelectorAll('button.open-next').forEach((e, idx) =>
      fromEvent(e, 'click')
        .pipe(map(it => this.state++))
        .subscribe(it => log.debug('Debug', this.state))
    );
    // fetch data
    // https://haveibeenpwned.com/api/v2/breaches
  }

  initChart(event: LineChartComponent) {
    if (['', null, undefined].indexOf(this.emailForm.controls.email.value) > -1) return; // leaving if value is empty
    const o = this.http.get('https://haveibeenpwned.com/api/v2/breachedaccount/' + this.emailForm.controls.email.value);

    o.subscribe(
      (arr: Array<any>) => {
        this.breachedSites = arr;
        this.breachedCount = this.breachedSites.length;

        const breachedByDate: Array<any> = arr
          .map((it: any) => {
            return { date: new Date(it.BreachDate), size: it.PwnCount };
          })
          .sort((a: any, b: any) => {
            if (a.date > b.date) {
              return 1;
            }
            if (a.date < b.date) {
              return -1;
            }
            return 0;
          });

        const researchedByDate: Array<any> = arr
          .map((it: any) => {
            return { date: new Date(it.AddedDate), size: it.PwnCount };
          })
          .sort((a: any, b: any) => {
            if (a.date > b.date) {
              return 1;
            }
            if (a.date < b.date) {
              return -1;
            }
            return 0;
          });

        this.chart.lineChartData = [
          { data: breachedByDate.map(it => it.size), label: 'Breached' },
          { data: researchedByDate.map(it => it.size), label: 'Researched' }
        ];
        this.chart.lineChartLabels = breachedByDate.map(it => moment(it.date).format('MM/YYYY'));
        this.breachedCount = breachedByDate.length;

        if (this.chart && this.chart.baseChart && this.chart.baseChart.chart && this.chart.baseChart.chart.config) {
          this.chart.baseChart.chart.config.data.labels = this.chart.lineChartLabels;
          this.chart.baseChart.chart.update();
        }
      },
      err => {
        // 404
        if (this.chart && this.chart.baseChart && this.chart.baseChart.chart && this.chart.baseChart.chart.config) {
          this.chart.lineChartData = [];
          this.chart.baseChart.chart.update();
        }
      }
    );

    // Draw chart
  }

  handleMainClick(e: any) {
    this.isLoading = true;
    log.debug('Target', e, e.target);
    this.queueService
      .queuePop({
        queue: 'BreachedAccounts'
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((msg: any) => {
        if (msg.ReceiveMessageResponse && msg.ReceiveMessageResponse.ReceiveMessageResult) {
          const a = document.createElement('a');

          a.appendChild(document.createTextNode('Click to send first email'));
          a.href = msg.ReceiveMessageResponse.ReceiveMessageResult.messages[0].Body;
          a.target = '_new';
          e.target.parentElement.parentElement.appendChild(a);
          var evt = document.createEvent('MouseEvents');
          evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(evt);
          // you can check allowDefault for false to see if
          // any handler called evt.preventDefault().
          // Firefox will *not* redirect to anchorObj.href
          // for you. However every other browser will.
        } else {
          window.alert('Sorry, no more emails are available to sent yet');
        }
      });
  }
}
