// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'https://api.chucknorris.io',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'fr-FR'
  ],
  AUTH_CONFIG : {
    backend: {
      clientID: 'FIhO7vNId2Al1wdfKJDhBuY4NwGZLB5i',
      domain: 'softsky.eu.auth0.com',
      redirectUri: 'http://avalache.github.io/auth-callback',
      scope: 'openid',
      responseType: 'token id_token'
    },
    storage: localStorage,
    storageKey: 'currentUser',
    publicRoute: ['public'],
    defaultUrl: ''
  }
};
