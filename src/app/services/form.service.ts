import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Help } from '../models/Help';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  public form: BehaviorSubject<Help> = new BehaviorSubject(new Help());
  public id: BehaviorSubject<any> = new BehaviorSubject(null);
  public optionChosed: BehaviorSubject<any> = new BehaviorSubject(null);
  private url= environment.url;
  constructor(public  http: HttpClient,private storageService: StorageService,
    private toastService: ToastService) {
    this.loadSelected();
    this.loadForm();
  }

  async getId(){
    if(await this.storageService.getStorage2('id') !== null){
      this.id  = await this.storageService.getStorage2('id').then(val=> val.id);
      return this.id;
    }
    else {
      return null;
    }
  }

  setId(value: any){
    this.id.next(value);
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
   async loadForm(){
  await this.storageService.getStorage('form').then
   (form =>{
      if(form !=null){
        this.form.next(form);
      }
      else{
        this.form.next(new Help());
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


getForm(){
  return this.form.asObservable();
}

async setTypeForm(value: any){
  this.storageService.setStorage('selected',value);
  await this.storageService.setOnboarding();
}

update(value: any, fieldsFor: string){
    if(fieldsFor === 'user'){
    this.form.getValue().name = value.name;
    this.form.getValue().address = value.address;
    this.form.getValue().phone = value.phone;
    this.form.getValue().email = value.email;
    this.form.next(this.form.getValue());
    this.storageService.setStorage('form',this.form.getValue());
    }
    else if(fieldsFor === 'form'){
      this.form.getValue().victim = value.victim;
      this.form.getValue().reason = value.reason;
      this.form.getValue().agressor = value.agressor;
      this.form.getValue().agressorGender = value.agressorGender;
      this.form.getValue().age = value.age;
      this.form.getValue().gender = value.gender;
      this.form.getValue().place = value.place;
      this.form.next(this.form.getValue());
      this.storageService.setStorage('form',this.form.getValue());
    }
    else {
      this.form.getValue().latitude = value[0];
      this.form.getValue().longitude = value[1];
      this.form.next(this.form.getValue());
      this.storageService.setStorage('form',this.form.getValue());
    }

}
}
