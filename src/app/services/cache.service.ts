import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, { value: any; expiry: number }>();
  private cacheData:any[]=[];

  constructor() {}
  setData(cacheData: any[]){
    this.cacheData=cacheData;
  }
  getData(){
    return this.cacheData;
  }

  /**
   * Sets a value in the cache.
   * @param key - The unique key for the cache entry.
   * @param value - The data to store in the cache.
   * @param ttl - Optional time-to-live (TTL) in milliseconds. Default is 5 minutes.
   */
  set(key: string, value: any, ttl: number = 300000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Gets a value from the cache if it exists and hasn't expired.
   * @param key - The unique key for the cache entry.
   * @returns The cached data or `null` if not found or expired.
   */
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null; // No entry for this key
    }

    if (Date.now() > cached.expiry) {
      this.cache.delete(key); // Remove expired entry
      return null;
    }

    return cached.value;
  }

  /**
   * Removes a specific entry from the cache.
   * @param key - The unique key for the cache entry.
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all entries in the cache.
   */
  clear(): void {
    this.cache.clear();
  }
}
