// export interface WebAuthConfig {
//     domain: string;
//     clientID: string;
//     responseType?: string;
//     responseMode?: string;
//     redirectUri?: string;
//     scope?: string;
//     audience?: string;
//     leeway?: number;
//     plugins?: any[];
//     _disableDeprecationWarnings?: boolean;
//     _sendTelemetry?: boolean;
//     _telemetryInfo?: any;
// }

// export interface Configuration {
//     WebAuthConfig: WebAuthConfig;
//     connection: string;
// }

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'FIhO7vNId2Al1wdfKJDhBuY4NwGZLB5i',
  domain: 'softsky.eu.auth0.com',
  callbackURL: 'http://localhost:3000/callback'
};
