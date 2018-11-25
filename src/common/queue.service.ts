import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const routes = {
  queue: (c: Queue) =>
    `https://sqs.eu-central-1.amazonaws.com/800070360327/${c.queue}` +
    (c.attributes ? '?' : '') +
    (c.attributes ? c.attributes : []).map((it: any) => `&${Object.keys(it)[0]}=${it[Object.keys(it)[0]]}`)
};

export interface Queue {
  // The queue's category: 'dev', 'explicit'...
  queue: string;
  attributes?: any;
}

@Injectable()
export class QueueService {
  constructor(private httpClient: HttpClient) {}

  queuePush(context: Queue, message: any): Observable<any> {
    context.attributes = context.attributes || [];
    context.attributes.push({ Action: 'SendMessage' });
    return this.httpClient
      .post(routes.queue(context), message, { headers: { 'Access-Control-Allow-Origin': '*' } })
      .pipe(
        map((body: any) => body),
        catchError(e => of(e))
      );
  }
  queuePop(context: Queue): Observable<any> {
    context.attributes = context.attributes || [];
    context.attributes.push({ Action: 'ReceiveMessage' });
    return this.httpClient.get(routes.queue(context)).pipe(
      map((body: any) => {
        return body;
      }),
      catchError(e => of(e))
    );
  }
}
