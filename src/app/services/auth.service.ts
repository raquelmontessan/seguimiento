import { Injectable, computed, signal } from '@angular/core';
import { ProfileType, SessionUser } from '../models/qa.models';
import { DIRECTORIO } from '../data/seed.data';

const STORAGE_KEY = 'qa-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly directorio = DIRECTORIO;
  private readonly dirSet = new Set(DIRECTORIO.map(d => d.e.toLowerCase()));

  readonly profile = signal<ProfileType | null>(null);
  readonly user = signal<SessionUser | null>(null);
  readonly isLoggedIn = computed(() => this.profile() !== null);
  readonly isQa = computed(() => this.profile() === 'qa');

  /** Fecha (inclusive) a partir de la cual la app queda restringida a la bienvenida: 10/07/2026. */
  private readonly fechaBloqueo = new Date(2026, 6, 10);

  /** True cuando la fecha actual es 10/07/2026 o posterior. */
  appBloqueada(): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy.getTime() >= this.fechaBloqueo.getTime();
  }

  constructor() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.profile) { this.profile.set(s.profile); this.user.set(s.user || null); }
      }
    } catch { /* noop */ }
  }

  /** Intenta iniciar sesión como Equipo QA con un correo del directorio. */
  loginQa(email: string): boolean {
    const val = (email || '').trim().toLowerCase();
    if (val && this.dirSet.has(val)) {
      const u = DIRECTORIO.find(d => d.e.toLowerCase() === val) || null;
      this.setSession('qa', u);
      return true;
    }
    return false;
  }

  loginGuest(): void {
    this.setSession('guest', null);
  }

  logout(): void {
    this.profile.set(null);
    this.user.set(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }

  private setSession(p: ProfileType, u: SessionUser | null): void {
    this.profile.set(p);
    this.user.set(u);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: p, user: u })); } catch { /* noop */ }
  }
}
