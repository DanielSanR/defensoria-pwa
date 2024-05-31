import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../services/form.service';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { ModalController, AlertController } from '@ionic/angular';
import { SobreNosotrosPage } from '../sobre-nosotros/sobre-nosotros.page';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
   
  myForm!: FormGroup;
  title: string= '';
  $obs = new  Subscription(); 

  constructor(private formBuilder: FormBuilder,private formService: FormService,private router:Router,
    private userService: UserService, private toastService: ToastService,
    private modalCtrl: ModalController,private alertService: AlertService
    
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
      await this.alertService.deleteData(this.handleConfirmDelete.bind(this));
    }

     async changeForm(){
      await this.alertService.changeForm(this.handleConfirmChangeForm.bind(this));
     }
     async handleConfirmDelete() {
      await this.userService.clearData();
       this.router.navigateByUrl('/onboarding', { replaceUrl: true });
    }

    async handleConfirmChangeForm() {
      await this.formService.changeForm();
      this.router.navigateByUrl('/onboarding', { replaceUrl: true });
    }
}
