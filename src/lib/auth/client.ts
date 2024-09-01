'use client';

import type { User } from '@/types/user';
import { logger } from '@/lib/default-logger';
import { AuthorError, smartdnsServer } from '../backend/server';
import type { ServerError } from '../backend/server';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  username: string;
}

class AuthClient {
  private refreshTokenIntervalId: NodeJS.Timeout | null = null;
  private refreshTokenInterval: number = 1000 * 60;
  private user: User = { id: "" };
  private isLogin = false;

  constructor() {
    smartdnsServer.setSignOut(this.signOut.bind(this));
  }

  destroy(): void {
    this.stopRefreshTokenInterval();
  }

  private startRefreshTokenInterval(): void {
    if (this.refreshTokenIntervalId) {
      return;
    }

    this.isLogin = true;
    logger.debug('[AuthClient]: start refresh token.');
    this.refreshTokenIntervalId = setInterval(() => {
      this.refreshTokens().catch(async (_err: unknown) => {
        logger.debug('[AuthClient]: start refresh token failed.');
      });
    }, this.refreshTokenInterval);
  }

  private stopRefreshTokenInterval(): void {
    if (this.refreshTokenIntervalId) {
      clearInterval(this.refreshTokenIntervalId);
      this.refreshTokenIntervalId = null;
    }
  }

  private checkStartRefreshTokenInterval(): void {
    if (localStorage.getItem('custom-auth-token')) {
      this.startRefreshTokenInterval();
    }
  }

  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async refreshTokens(): Promise<{ error?: ServerError }> {
    await smartdnsServer.RefreshToken();
    return {};
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: ServerError }> {
    const { username, password } = params;

    const { error } = await smartdnsServer.Login(username, password);
    if (error) {
      return { error };
    }

    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    this.user.username = username;

    this.checkStartRefreshTokenInterval();
    this.isLogin = true;
    logger.debug('[AuthClient]: sigIn');

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    this.startRefreshTokenInterval();
    return { data: this.user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    if (this.isLogin) {
      const _result = await smartdnsServer.Logout();
      logger.debug('[AuthClient]: signOut');
    }
    this.stopRefreshTokenInterval();
    this.user.id = "";
    this.isLogin = false;
    return {};
  }

  async checkLogin(): Promise<{ error?: ServerError }> {
    const err = await smartdnsServer.CheckLoginStatus();
    if (err.error) {
      if (err.error instanceof AuthorError) {
        return { error: err.error };
      }
    }

    const user = await this.getUser();
    if (user.error) {
      return { error: user.error };
    }
  
    return {};
  }
}

export const authClient = new AuthClient();
