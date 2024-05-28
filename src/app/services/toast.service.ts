import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor( private toastController: ToastController) {

  }


  async toast(text: string, color: string){
    const toast = await this.toastController.create({
      message: text, 
      duration: 5000,
      color: color
    });
    await toast.present();
  }

  async toastForm(message: string,position:any,icon:string,side:any,direction?: string){
    const toast = await this.toastController.create({
      message: '"'+message+'"',
      duration: 5000,
      position,
      cssClass: 'toast '+ position + ' ' + (direction? direction : ''),
      
      buttons: [
        {
          side,
          icon: '/../../assets/icon/form/'+icon
        }
      ],
    });
    await toast.present();
  }

  async toastSucess(){
    const toast = await this.toastController.create({
      message: 'Tus datos se guardaron correctamente',
      duration: 5000,
      position: 'bottom',
      cssClass: 'toast-sucess',
      buttons: [
        {
          side:'end',
          icon: '/../../assets/icon/form/smile.svg'
        }
      ],
    });
    await toast.present();
  }
  async toastError(){
    const toast = await this.toastController.create({
      message: 'Hubo un problema, lo intentaremos de nuevo más tarde.',
      duration: 5000,
      position: 'bottom',
      cssClass: 'toast-error',
      buttons: [
        {
          side:'end',
          icon: '/../../assets/icon/form/smile.svg'
        }
      ],
    });
    await toast.present();
  }
}
