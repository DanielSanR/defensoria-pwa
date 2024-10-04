import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { DeviceService } from './device.service';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  public optionChosed: BehaviorSubject<any> = new BehaviorSubject(null);
  private url= environment.urlApi;
  constructor(public  http: HttpClient,private storageService: StorageService,private deviceService: DeviceService) {
    this.loadSelected();
  }
  async loadSelected(){
    await this.storageService.getStorage('selected').then
    (select =>{
       if(select !=null){
         this.optionChosed.next(select);
       }
       else{
         this.optionChosed.next(null);
       }
     });
  }

 getSelectedData(){
  return this.optionChosed.asObservable();
}

async getSelected(): Promise<boolean>{
  let isData: boolean = false;
    await this.storageService.hasValue('selected').then(
      res=>{
          isData = res;
      }
    );
      if(isData){
          this.optionChosed.next(await  this.storageService.getStorage2('selected'));
          return Promise.resolve(true);
      }
      else{
         return Promise.resolve(false);
      }
  }
async updateForm(form: any){ 
  await this.deviceService.updateDeviceForm(form);
  const device = JSON.parse(await this.storageService.getStorage2('device'));
/*   let deviceForm = {device: {uuid: device.uuid,form: form}}; */
  let deviceForm = {userYoCuento: { uuid: device.uuid,"latlong": device.latlng,"ageRange": device.ageRange},"quiz" : device.quiz}
  console.log("POST para Formulario",deviceForm);
   let request = this.http.post(`${this.url}/Auth/denuncias/guardar`,deviceForm).toPromise().then((res: any) => {
    if (res.status === 200) {
      return true;
    }
  }).catch(err => {
     return false;
   });
   return request
   return request
    return true;
}

 async changeForm(){
  await this.storageService.setStorage('onboarding',false);
  this.optionChosed.next(null);
  return Promise.resolve(true);

 }
}
