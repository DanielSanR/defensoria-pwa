import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../services/form.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
   
  myForm!: FormGroup;
  title: string = '';
  $obs = new Subscription(); 
  updateProfile: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    private profileService: ProfileService, 
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private alertService: AlertService,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]*$')]],
      phone: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      mail: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    });
    
    await this.profileService.getProfile();
    const sub = this.profileService.getData().subscribe(res => {
      this.patchForm(res);
    });
    this.$obs.add(sub);
  }
  
  async onSubmit() {
    var result;
    
    if (this.myForm.valid) {
      if (this.updateProfile && !this.myForm.pristine) {
        const dirty = this.getDirtyValues(this.myForm);
        result = await this.profileService.updateProfile(this.myForm.value, dirty);
        this.myForm.markAsPristine();
      } else if (!this.updateProfile) {
        result = await this.profileService.saveNewProfile(this.myForm.value);
        this.myForm.markAsPristine();
      } else {
        this.toastService.toastError('No hay cambios en tus datos para ser guardados');
      }
      
      if (result) {
        this.toastService.toastSucess();
      }
    }
  }
  
  ionViewWillLeave() {
    this.$obs.unsubscribe();
  }
  
  patchForm(res: any) {
    if (res) {
      this.myForm.patchValue({
        name: res?.name,
        phone: res?.phone,
        mail: res?.mail,
        address: res?.address
      });
      this.title = res?.name;
      this.updateProfile = true;
    } else {
      this.title = 'Queremos conocerte más';
      this.updateProfile = false;
    }
  }
  
  async deleteData() {
    await this.alertService.deleteData(this.handleConfirmDelete.bind(this));
  }

  async changeForm() {
    await this.alertService.changeForm(this.handleConfirmChangeForm.bind(this));
  }
  
  async handleConfirmDelete() {
    await this.profileService.clearData();
    this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }

  async handleConfirmChangeForm() {
    await this.formService.changeForm();
    this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }

  getDirtyValues(form: any) {
    const dirtyValues = {};
    Object.keys(form.controls).forEach(key => {
      const currentControl = form.controls[key];

      if (currentControl.dirty) {
        dirtyValues[key] = currentControl.value;
      }
    });
    return dirtyValues;
  }
  
  async closePopover() {
    const popover = await this.popoverController.getTop();
    if (popover) {
      await popover.dismiss();
    }
  }
}