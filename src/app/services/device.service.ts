import { Injectable } from '@angular/core';
import { Device } from '../Interfaces/Device';
import {User} from '../Interfaces/User';
import {Quiz} from '../Interfaces/Quiz';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { FormService } from './form.service'; 
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

  updateDeviceUuid(uuid: string, rangoEtario: string, latlng: any) {
    let currentDevice = this.getCurrentDevice()
    currentDevice.uuid = uuid;
    currentDevice.latlng = latlng;
    currentDevice.user.rangoEtario = rangoEtario;
    this.deviceSubject.next(currentDevice)
    this.storage.saveStorage('device', JSON.stringify(currentDevice));

  }

  updateDeviceUser(user: User) {
    let currentDevice = this.getCurrentDevice()
    currentDevice.user = {...user};
    currentDevice.user_update = true;
    this.deviceSubject.next(currentDevice)
    this.storage.saveStorage('device', JSON.stringify(currentDevice));
    
  }
 
  updateDeviceForm(form : any){
    let currentDevice = this.getCurrentDevice()
    currentDevice.quiz = {...form};
    currentDevice.form_update = true;
    this.deviceSubject.next(currentDevice)
    this.storage.saveStorage('device', JSON.stringify(currentDevice));
    
  }

  

}
