import { Logger } from '../logger.service'
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService]
    });
  });

  beforeEach(inject([AuthenticationService], (_authenticationService: AuthenticationService) => {
    authenticationService = _authenticationService;
  }));

  afterEach(() => {
    // empty
  });

  describe('login', () => {
    it('should return credentials', fakeAsync(() => {
      const log = new Logger('Login');
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(bool:boolean => {
        log.info(bool);
        expect(bool).toBeDefined();
        expect(bool).toBeTrue();
      });
    }));

    it('should authenticate user', fakeAsync(() => {
      expect(authenticationService.isAuthenticated).toBe(false);

      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(authenticationService.isAuthenticated).toBe(true);
      });
    }));

  });

  describe('logout', () => {
    it('should clear user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated).toBe(true);

        authenticationService.logout({});
        tick();

        expect(authenticationService.isAuthenticated).toBe(false);
      });
    }));

    it('should clear persisted user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated).toBe(true);

        authenticationService.logout({});
        tick();

        expect(authenticationService.isAuthenticated).toBe(false);
      });
    }));
  });
});
