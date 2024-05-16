import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private url = environment.url;
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
     return new Promise<boolean>((resolve, reject) => {
      // Realiza la solicitud POST
      this.http.post('https://defensoria-api.stagemnes.net.ar/api/Auth/denuncias/guardar', datos)
        .toPromise()
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          if (error instanceof HttpErrorResponse) {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
              errorMessage = `Error: ${error.error.message}`;
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            console.error(errorMessage);
            resolve(false);
          } else {
            console.error('An unknown error occurred:', error);
            resolve(false);
          }
        });
    });
  } catch (error) {
    return Promise.resolve(false);
  }
}
  


