import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MatDialog } from '@angular/material';

import { Auth0Module, Auth0Service } from 'ngx-auth0';
import { Logger } from '@app/core';

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private log = new Logger('AuthenticationService');
  private _isAuthenticated = false;
  constructor(private auth0: Auth0Service) {}

  public set isAuthenticated(is: boolean) {
    this._isAuthenticated = is;
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  public loginWithCredentials(config: any): Observable<any> {
    this.isAuthenticated = true;
    const observable = this.auth0.loginWithCredentials(config);
    observable.subscribe(next => {
      this.log.info(next);
    });
    return observable;
  }

  public login(config: any): Observable<any> {
    this.isAuthenticated = true;
    return this.auth0.login(config);
  }

  public logout(config: any): void {
    this.isAuthenticated = false;
    this.auth0.logout(config);
  }

  public changePassword(): void {
    this.auth0.changePassword();
  }

  public loginByDialog(err?: any): Observable<any> {
    this.isAuthenticated = true;
    return this.auth0.loginByDialog(err);
  }
}
