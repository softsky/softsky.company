import { Injectable } from '@angular/core';
import { Observer, Observable, Subscriber, of } from 'rxjs';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import * as auth0 from 'auth0-js';
import * as _ from 'lodash';

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
const log = new Logger('AuthenticationService');

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: Credentials | null;
  readonly auth0: auth0.WebAuth;

  constructor() {
    this.auth0 = new auth0.WebAuth(environment.AUTH_CONFIG.backend);

    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  signup() {
    this.auth0.authorize({
      mode: 'signUp'
    });
  }
  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data: any = {
      grant_type: 'password',
      audience: 'https://softsky.eu.auth0.com/userinfo',
      connection: 'Username-Password-Authentication',
      username: context.username,
      password: context.password

      //FIXME fix typing here
      // // Code below was added to prevent typing compilation error
      // // /** url that the Auth0 will redirect after Auth with the Authorization Response */
      //  redirectUri: "",
      // // /** type of the response used. It can be any of the values `code` and `token` */
      //  responseType: "",
      // // /** how the AuthN response is encoded and redirected back to the client. */
      //  responseMode: "",
      // // /** scopes to be requested during AuthN. e.g. `openid email` */
      //  scope: "",
    };

    const observer = (subscriber: Subscriber<Credentials>) => {
      data.realm = 'Username-Password-Authentication';
      this.auth0.popup.loginWithCredentials(
        data,
        //;_.merge(environment.AUTH_CONFIG.backend, data) /* using that way to prevent from typing error */,
        (err: any, result: Credentials) => {
          log.debug('parameters', err, result);
          if (err) subscriber.error(err);
          else {
            log.info('Succesfully logged in:', result);
            result.username = data.username; // saving username
            this.setCredentials(result, context.remember);
            subscriber.next(result);
          }
        }
      );
    };

    return new Observable<Credentials>(observer);
  }
  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.auth0.logout({
      clientID: environment.AUTH_CONFIG.backend.clientID,
      returnTo: 'http://localhost:4200/home'
    });
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
