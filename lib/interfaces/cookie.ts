export interface Cookie {
    name: string;
    value: string;
    domain?: string;
    expirationDate?: number;
    hostOnly?: boolean;
    httpOnly?: boolean;
    path?: string;
    sameSite?: 'unspecified' | 'no_restriction' | 'lax' | 'strict';
    secure?: boolean;
    session?: boolean;
  }
  