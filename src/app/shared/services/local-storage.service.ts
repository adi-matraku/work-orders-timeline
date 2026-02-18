import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to set item in localStorage for key: ${key}`);
    }
  }

  // Optional: A method to remove an item from localStorage
  // Right now it's a demo so we don't need it
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
