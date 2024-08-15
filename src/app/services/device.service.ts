import { Injectable } from '@angular/core';
import { Device } from '../Interfaces/Device';
import {Profile} from '../Interfaces/Profile';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public selectedeSubject = new BehaviorSubject<string>('');
  public deviceSubject  = new BehaviorSubject(new Device);
  constructor(private storage : StorageService) {
    this.loadBehaviorData();
  }
  async loadBehaviorData() {
    this.storage.getStorage('device').then((device) => {
      if (device) {
        this.deviceSubject.next(JSON.parse(device));
      }
    });
  }

  updateDevice(device: Device): void {
    this.deviceSubject.next(device);
  }
  
  getCurrentDevice(): Device | null {
    return this.deviceSubject.getValue();
  }
  clearDevice() {
    this.deviceSubject.next(new Device());
    this.storage.clearData();
  }
  getDeviceObservable(): Observable<Device> {
    return this.deviceSubject.asObservable();
  }

  async updateDeviceUuid(uuid: string, ageRange: string, latlong: any) {
    let currentDevice = this.getCurrentDevice()
    currentDevice.uuid = uuid;
    currentDevice.latlong = latlong;
    currentDevice.ageRange = ageRange;
    this.deviceSubject.next(currentDevice) 
    await this.storage.saveStorage('device', JSON.stringify(currentDevice));

  }

   async updateDeviceProfile(profile: Profile) { 
    let currentDevice = this.getCurrentDevice()
    currentDevice.profile = {...profile}; 
    this.deviceSubject.next(currentDevice)
    await this.storage.saveStorage('device', JSON.stringify(currentDevice)); 
    
  }
 
  async updateDeviceForm(form : any){
    let currentDevice = this.getCurrentDevice()
    currentDevice.quiz = {...form};
    this.deviceSubject.next(currentDevice)
    await this.storage.saveStorage('device', JSON.stringify(currentDevice));
    
  }

  

}
