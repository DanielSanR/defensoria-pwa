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
   return new Promise((resolve) => {
    this.http.post(`${this.url}`,device).subscribe((res: any) => {
     console.log(res)
    });
    resolve(true);
  });
}

 async changeForm(){
  const selected =  await this.storageService.getStorage('selected')
  const newSelected = selected == 'teen'? 'kid' : 'teen';
  const rangoEtario  = newSelected == 'teen'? 'Adolescente' : ' Niño/Niña'; 
  await this.storageService.setStorage('selected', newSelected);
  let currentDevice = this.deviceService.getCurrentDevice()
  this.deviceService.deviceSubject.next(currentDevice)

 }
}
