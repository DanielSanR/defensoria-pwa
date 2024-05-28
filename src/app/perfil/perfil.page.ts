import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../services/form.service';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { SobreNosotrosPage } from '../sobre-nosotros/sobre-nosotros.page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
   
  myForm!: FormGroup;
  title: string= '';
  $obs = new  Subscription(); 

  constructor(private formBuilder: FormBuilder,private formService: FormService,
    private userService: UserService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router
     ) { }

     async ngOnInit() {
       this.myForm = this.formBuilder.group({
         name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]*$')]],
         phone: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
         email: ['', [Validators.required,Validators.email]],
         address: ['',[Validators.required]],
        });
        await this.userService.getUser();
        const sub =  this.userService.getData().subscribe( res=> {this.patchForm(res);});
        this.$obs.add(sub);
      
    }
    async onSubmit(){
      if(this.myForm.invalid){
        this.toastService.toast('Por favor, complete los campos requeridos','red');
        return;
      }
      else{
        const result = await this.userService.updateUser(this.myForm.value);
        console.log(result)
        if(result){
          this.toastService.toastSucess();
        }
      }
     
    }
    ionViewWillLeave(){
      this.$obs.unsubscribe();
    }
    patchForm(res: any){
      this.myForm.patchValue({
           name: res?.name,
           phone: res?.phone,
           email: res?.email,
           address: res?.address
      });
      this.title = res?.name ? res.name: 'Queremos conocerte más';
    }
    async modalAboutUs(){
      const modal = await this.modalCtrl.create({
        component: SobreNosotrosPage,
      });
      modal.present();
      await modal.onWillDismiss();
    }
    async deleteData(){
      const alert = await this.alertController.create({
        header: 'Estás seguro de eliminar tus datos?',
        buttons: [
          {
            text: 'No',
            cssClass: 'alert-button-cancel',
          },
          {
            text: 'Si',
            cssClass: 'alert-button-confirm',
            handler: () => {
              this.userService.clearData();
              this.router.navigateByUrl('/onboarding',{replaceUrl: true})
            },
          },
        ],
      });
  
      await alert.present();
    }

     async changeForm(){
      const alert = await this.alertController.create({
        header: 'Estás seguro de cambiar el formulario?',
        buttons: [
          {
            text: 'No',
            cssClass: 'alert-button-cancel',
          },
          {
            text: 'Si',
            cssClass: 'alert-button-confirm',
            handler: async () => {
                 await this.formService.changeForm();
                  this.router.navigateByUrl('/onboarding',{replaceUrl: true})
            },
          },
        ],
      });
  
      await alert.present();
     }
    
}
