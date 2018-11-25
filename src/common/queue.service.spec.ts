import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoreModule, HttpCacheService } from '@app/core';
import { QueueService, Queue, routes } from './queue.service';
import { Logger, I18nService } from '@app/core';

describe('QueueService', () => {
  let queueService: QueueService;
  let httpMock: HttpTestingController;
  const log = new Logger('QueueServiceSpec');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, HttpClientTestingModule],
      providers: [HttpCacheService, QueueService]
    });
  }));

  beforeEach(inject(
    [HttpCacheService, QueueService, HttpTestingController],
    (htttpCacheService: HttpCacheService, _queueService: QueueService, _httpMock: HttpTestingController) => {
      queueService = _queueService;
      httpMock = _httpMock;

      htttpCacheService.cleanCache();
    }
  ));

  afterEach(() => {
    httpMock.verify();
  });

  describe('queuePop', () => {
    const q = { queue: 'BreachedAccounts-test' };
    it('should return 3 messages from a  queue, 4th attempt should fail', () => {
      // Arrange
      // const mockMessage = { value: 'a random message' };
      // // Act
      // const queuePushSubscription = queueService.queuePush({ queue: 'BreachedAccounts-test' }, mockMessage);
      // // Assert
      // queuePushSubscription.subscribe((ret) => {
      //   expect(ret).toEqual(mockMessage);
      // });
      // let req = httpMock.expectOne(routes.queue(q));
      // req.flush(mockMessage);
      // expect(req.request.method).toBe('POST');
      // const queuePopSubscription = queueService.queuePop({ queue: 'BreachedAccounts-test' });
      // queuePopSubscription.subscribe((message: string) => {
      //   expect(message).toEqual(mockMessage.value);
      // });
      // req = httpMock.expectOne(routes.queue(q))
      // expect(req.request.method).toBe('GET');
      // req.flush(mockMessage);
    });

    it('should return null if queue is empty', () => {
      // Act
      const queuePopSubscription = queueService.queuePop(q);

      // Assert
      queuePopSubscription.subscribe((message: any) => {
        expect(typeof message).toEqual('object');
        expect(message.status).toEqual(500);
        expect(message.statusText).toEqual('error');
      });
      httpMock.expectOne(routes.queue(q)).flush(null, {
        status: 500,
        statusText: 'error'
      });
    });
  });
});
