/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { OnInit, ChangeDetectorRef, Component, ViewChild, ElementRef, QueryList, AfterViewInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import PreguntasformArrKid from '../../assets/datos/DinamicFormKid.json';
import PreguntasformArr from '../../assets/datos/DinamicForm.json'; // adolescentes
import { Help } from '../models/Help';
import { FormService } from '../services/form.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import type { Animation } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';
import { SwiperContainer } from 'swiper/element';
export interface PreguntasForm {
  key: string;
  title: string;
  type: string;
  multiple: boolean;
  preguntas?: Array<OpcForm>;
  popup?: Popup;
}
interface Popup {
  message: string;
  position: string;
  icon: string;
  side: string;
  direction?: string;
}
interface OpcForm {
  id: number;
  val: string;
  isChecked?: boolean | false;
  icon?: string;
  inputs?: Array<Inputs>;
}

interface Inputs {
  key?: string;
  type?: string;
  label?: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  private swiperInstance: any;
  @ViewChildren('preguntasList', { read: ElementRef }) preguntasListRef: QueryList<ElementRef>
  @ViewChild('titulo', { read: ElementRef }) tituloRef: ElementRef<HTMLIonLabelElement>;
  @ViewChild('icono', { read: ElementRef }) iconoRef: ElementRef<HTMLIonIconElement>;
  @ViewChild('itemVictimaOpcionalParaMi', { read: ElementRef }) itemVictimaOpcionalRef: ElementRef<HTMLIonItemElement>;
  swiper : Swiper;
  edadesDisponibles: number[] = [];
  edadSeleccionada: number = 0;
  public myForm: FormGroup;
  public dinamicForm: PreguntasForm[];
  public help: Help = new Help();
  public bandera = false;
  public selected: boolean = false;
  public disablePrev: boolean = false;
  public selectedAge: any;
  public background = '#ffff';
  public finalized: boolean = false;
  public backgroundChecked = '#5A4BB2';
  public rangoEtario: string;
  isckecked: boolean = false;
  animation: Animation;
  currentTimer: any = null;
  sub$: Subscription;
  public loaded = false;
  constructor(private router: Router, private formService: FormService,
    private loadingController: LoadingController,
    private fb: FormBuilder, private animationCtrl: AnimationController, private toastService: ToastService) {
 
    this.myForm = this.fb.group({});
  }

  ngOnInit() {
     setTimeout(() => {  
      this.sub$ = this.formService.getSelectedData().subscribe((data) => {
       console.log(data)
       console.log(PreguntasformArrKid);
       if (data) {
         if (data === 'Niño/Niña') {
           this.dinamicForm = PreguntasformArrKid;
          this.inicializarEdades(6, 11);
        } else {
          this.dinamicForm = PreguntasformArr;
          this.inicializarEdades(12, 17);
        }
        this.rangoEtario = data;
        this.createControls(this.dinamicForm);
        this.handlePopup(this.dinamicForm[0].key);
      }
    });
      this.loaded = true;
     }, 1000); 
     
  }


  inicializarEdades(edadMinima: number, edadMaxima: number) {
    for (let edad = edadMinima; edad <= edadMaxima; edad++) {
      this.edadesDisponibles.push(edad);
    }
  }
  seleccionarEdad(edad: number) {
    this.edadSeleccionada = edad;
    this.myForm.get('age').setValue(edad);
    this.selected = true
  }


  swiperReady(swiperContainer: SwiperContainer){
    setTimeout(() => {
      this.swiperInstance = swiperContainer.swiper;
      this.swiperInstance.update();
    }, 0);
     
  }
  createControls(controls: Array<PreguntasForm>) {
    controls.forEach(control => {
      if (control.key === 'edad') {
        const edadControl = this.fb.control(5, [Validators.required, Validators.min(5), Validators.max(17)]);
        this.myForm.addControl(control.key, edadControl);
      }
      else if (control.multiple) {
        const multipleControl = this.fb.control([], this.minSelectedCheckboxes(1));
        this.myForm.addControl(control.key, multipleControl);

      }
      else {
        const formControl = this.fb.control('', Validators.required);
        this.myForm.addControl(control.key, formControl);
      }
    });
  }
  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      const selectedCount = Array.isArray(formArray.value) ? formArray.value.filter(value => value).length : 0;
      return selectedCount >= min ? null : { required: true };
    };
    return validator;
  }

  submitForm() {
  }

  toggleSelection(key: string, val: string) {
    const groupIndex = this.dinamicForm.findIndex(group => group.key === key);
    const group = this.dinamicForm[groupIndex];
    let wasDeselected = false;
    if (group.multiple) {
      const preguntaIndex = group.preguntas.findIndex(pregunta => pregunta.val === val);
      const pregunta = group.preguntas[preguntaIndex]
      group.preguntas[preguntaIndex].isChecked = !group.preguntas[preguntaIndex].isChecked;
      if (pregunta.isChecked) {
        this.manageInputs(pregunta)
      }
    } else {
      group.preguntas.forEach(pregunta => {
        if (pregunta.val === val && pregunta.isChecked) {
          wasDeselected = true;
          pregunta.isChecked = false;
        } else {
          if (pregunta.val === val) {
            pregunta.isChecked = true;
          }
        }
        const preguntaContainer = document.getElementById(`question-container-${pregunta.id}`);
        if (preguntaContainer) {
          if (pregunta.isChecked) {
            this.animateAndShow(preguntaContainer);
            this.manageInputs(pregunta)
          } else {
            if (wasDeselected) {
              this.resetVisibility(preguntaContainer);
            }
            else { this.hideElement(preguntaContainer); }
          }
        }
      });
    }
    if (wasDeselected) {
      this.resetAllElementsVisibility(group);
    }
    if (this.swiperInstance.activeIndex === 6) {
      this.enableBandera(key, val);
    }
    this.selected = this.filterItems(group.preguntas);
    this.updateFormControl(key, group.preguntas, group.multiple);
  }

  manageInputs(pregunta) {
    if (pregunta.isChecked && pregunta.inputs.length > 0) {
      pregunta.inputs.forEach(input => {
        if (!this.myForm.contains(input.key)) {

          this.myForm.addControl(input.key, this.fb.control(''));
        }
      });
    } else {
      pregunta.inputs.forEach(input => {
        if (this.myForm.contains(input.key)) {
          this.myForm.removeControl(input.key);
          this.myForm.get(input.key).reset();
        }
      });
    }
  }

  updateFormControl(key: string, preguntas: any[], multiple: boolean) {
    const selectedValues = preguntas.filter(pregunta => pregunta.isChecked).map(pregunta => pregunta.val);
    if (this.myForm.contains(key)) {
      if (multiple) {
        this.myForm.get(key).setValue(selectedValues);
      } else {
        this.myForm.get(key).setValue(selectedValues.length > 0 ? selectedValues[0] : '');
      }
    } else {
      console.error(`El control con la clave '${key}' no existe en el FormGroup.`);
    }
  }


  // si hay inputs con "valores" correspondientes a la pregunta, se agregan al formGroup de esa pregunta exceptuando dni y name
  checkOthers() {
    this.dinamicForm.forEach(group => {
      if (group.preguntas) {
        group.preguntas.forEach(pregunta => {
          if (pregunta.isChecked && pregunta.inputs && pregunta.inputs.length > 0 && group.multiple) {
            const inputValues = [];
            pregunta.inputs.forEach(input => {
              const control = this.myForm.get(input.key);
              if (control && !['dniVictim', 'nameVictim'].includes(input.key)) {
                inputValues.push(control.value);
                this.myForm.removeControl(input.key);
              }
            });
            let finalValues = (this.myForm.get(group.key).value || []).filter(val => val !== 'Otro motivo. Especificar');
            finalValues = [...finalValues, ...inputValues.filter(val => !!val)];
            this.myForm.get(group.key).setValue(finalValues);
          }
        });
      }
    });
    return this.myForm.value;
  }

  filterItems(arr: any) {
    if (!arr) {
      const age = this.myForm.get('age').value;
      if(age) return true;else false
    }
    else{
    return arr.filter((el: any) => el).map((e: any) => e.isChecked).includes(true);
    }
  }

  enableBandera(key: string, val: string) {
    const groupIndex = this.dinamicForm.findIndex(group => group.key === key);
    const group = this.dinamicForm[groupIndex];
    const isSelected = this.filterItems(group.preguntas);
    if (isSelected) {
      this.bandera = true;
      this.selected = true;
    }
    else {
      this.bandera = false;
    }

  }

  async enviar() {
    const form = this.checkOthers();
    this.bandera = false;
    const result = await this.formService.updateForm(form);
    if (result) {
      this.swiperInstance.slideNext(500);
      this.swiperInstance.update();
      this.finalized = true;
    }
    else {
      this.router.navigateByUrl('/inicio', { replaceUrl: true });
    }

  }

  async resetForm() {
    this.myForm.reset();
    this.dinamicForm.forEach(group => {
      if (group.type === 'item') {
        this.resetAllElementsVisibility(group)
        group.preguntas.forEach(pregunta => {
          pregunta.isChecked = false;
        });
      }
    });
    await this.hidePopup()
  }

  ///////////////////////////////////////////ACCIONES NEXT PREV Y CLOSE///////////////////////////////////////////
  async next() {
    this.selected = false;
    if (this.swiperInstance.activeIndex === this.swiperInstance.length - 1) {
    }
    else {
      this.swiperInstance.slideNext(500);
      setTimeout(() => {
        this.handlePopup(this.dinamicForm[this.swiperInstance.activeIndex].key);
      }, 500);
    }
  }

  prev() {
    if (this.swiperInstance.activeIndex === 0) {
      this.close();
    }
    this.swiperInstance.slidePrev(500);
  }

  async close() {
    this.router.navigateByUrl('/inicio', { replaceUrl: true });
  }

  async backHome() {
    this.router.navigateByUrl('/inicio', { replaceUrl: true });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////// ANIMACIONES /////////////////////////////////////////////////
  animateAndShow(element: HTMLElement) {
    this.animationCtrl.create()
      .addElement(element)
      .duration(700)
      .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
        /* .fromTo('transform', 'translateY(0)', 'translateY(-50px)')   */
         .afterStyles({
         'z-index': -1
        })  
      .play();
  }

  hideElement(element: HTMLElement) {
    this.animationCtrl.create()
      .addElement(element)
      .duration(300)
        .fromTo('opacity', '1', '0')  
       .afterStyles({
           'display': 'none', 
        'pointer-events': 'none'
      })  
      .play();
  }

  resetVisibility(element: HTMLElement) {
    this.animationCtrl.create()
      .addElement(element)
      .duration(300)
      .easing('ease-in')
      .fromTo('opacity', '0', '1')
      .afterStyles({
               'display': 'block',  
        'pointer-events': 'auto'
      })
      .play();
  }

  resetAllElementsVisibility(group: any) {
    group.preguntas.forEach(pregunta => {
      const container = document.getElementById(`question-container-${pregunta.id}`);
      if (container && !pregunta.isChecked) {
        this.resetVisibility(container);
      }
    });
  }

  initListAnimation() {
    const itemRefArray = this.preguntasListRef.toArray();
    for (let i = 0; i < itemRefArray.length; i++) {
      const element = itemRefArray[i].nativeElement;

      this.animationCtrl
        .create()
        .addElement(element)
        .duration(900)
        .delay(i * (400 / 3))
        .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
        .fromTo('transform', 'translateY(100px)', 'translateY(0px)') 
          .fromTo('visibility', 'hidden', 'visible')
        .fromTo('opacity', '0', '1') 
        .play();
    }
    /* const itemRefArray = this.preguntasListRef.toArray();
    for (let i = 0; i < itemRefArray.length; i++) {
      const element = itemRefArray[i].nativeElement;
  
      this.animationCtrl
        .create()
        .addElement(element)
        .duration(1000)
        .delay(i * (1000 / 3)) 
        .fromTo('transform', 'translateY(50px)', 'translateY(0px)')
        .fromTo('opacity', '0', '1')
        .play();
    } */
  }
  initAnimationVictima(toggle: boolean) {
    const visibility = toggle ? 'visible' : 'hidden';
    const opacity = toggle ? '1' : '0';
    const itemRefArray = this.itemVictimaOpcionalRef.nativeElement;
    this.animationCtrl
      .create()
      .addElement(itemRefArray)
      .duration(900)
      .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
      /* .fromTo('transform', 'translateY(50px)', 'translateY(0px)') */
      .fromTo('visibility', visibility, visibility === 'visible' ? 'hidden' : 'visible')
      .fromTo('opacity', opacity, opacity === '1' ? '0' : '1')
      .play();
  }


  //////////////////////////////////////////////////// POPUPS ///////////////////////////////////////////////////////
  async handlePopup(key: string) {
    await this.findAndTriggerPopup(key);
  }

  async findAndTriggerPopup(key: string) {
    const groupIndex = this.dinamicForm.findIndex(group => group.key === key);
    if (this.dinamicForm[groupIndex].popup) {
      await this.clearPopups()
      this.currentTimer = setTimeout(async () => {
        if (this.swiperInstance.activeIndex === groupIndex) {
          await this.toastService.toastForm(
            this.dinamicForm[groupIndex].popup.message,
            this.dinamicForm[groupIndex].popup.position,
            this.dinamicForm[groupIndex].popup.icon,
            this.dinamicForm[groupIndex].popup.side,
            this.dinamicForm[groupIndex].popup.direction
          );
        }
      }, 2000);
    }
  }

  async hidePopup() {
    if (this.toastService.toastFormPopUp) {
      await this.toastService.toastFormPopUp.dismiss();
    }
  }

  async clearPopups() {
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////// ionViewWillLeave DidEnter ///////////////////////////////////////////
  ionViewDidEnter() {
    this.initListAnimation();
    this.background = '#FFF';
    this.finalized = false;
  }

  async ionViewWillLeave() {
    const loading = await this.loadingController.create({
      message: 'Cerrando Formulario...',
      spinner: 'circles',
    });
    await loading.present();
    this.finalized = false;
    this.swiperInstance.slideTo(0, 500, false);
    await this.clearPopups();
    await this.resetForm()
    loading.dismiss();
    this.sub$.unsubscribe();
  }

  async swiperChange() { 
    
    
    this.selected = this.filterItems(this.dinamicForm[this.swiperInstance.activeIndex]?.preguntas);
    console.log(this.selected);
    await this.hidePopup();
  }

}
