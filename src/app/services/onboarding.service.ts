import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private url = environment.url;
  constructor(private storageService: StorageService, private deviceService: DeviceService) { }

 // Para guardar el onboarding en el storage y en la base de datos
  async saveOnboarding(selected: any, latlng: any, uuid: any){
    await this.storageService.setStorage('selected',selected) ;
    await this.storageService.setOnboarding();
    const rangoEtario  = selected == 'teen'? 'Adolescente' : ' Niño/Niña';
    this.deviceService.updateDeviceUuid(uuid, rangoEtario, latlng);
     const datos  = {
      uuid,
      latlng,
      rangoEtario : rangoEtario
     }
     return new Promise((resolve) => {
      console.log(datos)
       resolve(true);
     });
     }
  
  }

