/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public isOnboardingDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
    this.isOnboarding();
  }

  async isOnboarding() {
    const onboarding = await this.storage.get('onboarding');
    if (onboarding) { 
      this.isOnboardingDone.next(true);
    } else {
      this.isOnboardingDone.next(false);
    }
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }
  async getStorage(key: string): Promise<any> {
    if (this._storage) {
      return this._storage.get(key);
    }
  }
  async setStorage(key: string, value: any){
    if (this._storage) {
      await this._storage.set(key,value);
    }
  }


  async setOnboarding(){
    if (this._storage) {
      await this._storage.set('onboarding',true);
      this.isOnboardingDone.next(true);
    }
  }
  async getStorage2(url: string){
    const storedValue = await this.storage.get(url);
    return  storedValue;
  }
  async saveStorage(url: string, value: any){
      await this.storage.set(url,value);
    }

    async hasValue(url: any){
      const value = await this.storage.get(url);
      if(!value){
        return Promise.resolve(false);
      }
      else {
        return Promise.resolve(true);
      }
    }

    async clearData(){
      this.storage.clear();
      this.isOnboardingDone.next(false);
      
    }

}
