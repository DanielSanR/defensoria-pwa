import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  toastFormPopUp: any;
  constructor( private alertController: AlertController, 
    private router: Router) {
  }
  async changeForm(confirmHandler: () => void){
    const alert = await this.alertController.create({
        header: '¿Estas seguro de cambiar el formulario?',
        cssClass: 'alert',
        buttons: [
          {
            text: 'No',
            cssClass: 'alert-button-cancel',
          },
          {
            text: 'Cambiar',
            cssClass: 'alert-button-confirm',
            handler: confirmHandler,
          },
        ],
      });
  
      await alert.present();
     }

     async deleteData(confirmHandler: () => void){
        const alert = await this.alertController.create({
            header: '¿Estás seguro de eliminar tus datos?',
            cssClass: 'alert',
            buttons: [
              {
                text: 'No',
                cssClass: 'alert-button-cancel',
              },
              {
                text: 'Eliminar',
                cssClass: 'alert-button-confirm',
                handler: confirmHandler,
              },
            ],
          });
      
          await alert.present(); 
     }
  }  

 