import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private url = environment.urlApi;
  constructor(private storageService: StorageService, private deviceService: DeviceService, private http: HttpClient) { }

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
       this.http.post(`${this.url}`, datos).subscribe((res: any) => {
        console.log(res)
       });
       resolve(true);
     });
     }
  
  }

