import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { QueueService } from './queue.service';
import { Logger } from '@app/core';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;

  constructor(private queueService: QueueService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.isLoading = false;
    this.route.fragment.subscribe((fragment: string) => {});
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
          const a = document.createElement('a'),
            p = document.createElement('p');

          a.appendChild(document.createTextNode('Click to send first email'));
          a.href = msg.ReceiveMessageResponse.ReceiveMessageResult.messages[0].Body;
          a.target = '_new';
          e.target.parentElement.parentElement.appendChild(p);
          p.appendChild(a);
        } else {
          window.alert('Sorry, no more emails are available to sent yet');
        }
        //a.click();
      });
  }
}
