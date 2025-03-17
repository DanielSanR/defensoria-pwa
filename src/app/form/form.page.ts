import { OnInit, Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import PreguntasformArrKid from '../../assets/datos/DinamicFormKid.json';
import PreguntasformArr from '../../assets/datos/DinamicForm.json';
import { Help } from '../models/Help';
import { FormService } from '../services/form.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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
  
  @ViewChildren('preguntasList', { read: ElementRef }) preguntasListRef: QueryList<ElementRef>;
  @ViewChild('swiper', { read: ElementRef }) swiperRef: ElementRef;
  
  swiper: Swiper;
  edadesDisponibles: number[] = [];
  edadSeleccionada: number = 0;
  public myForm: FormGroup;
  public dinamicForm: PreguntasForm[];
  public help: Help = new Help();
  public bandera = false;
  public selected: boolean = false;
  public disablePrev: boolean = false;
  public selectedAge: any;
  public background = '#F5F3FF';
  public finalized: boolean = false;
  public backgroundChecked = '#5A4BB2';
  public rangoEtario: string;
  isckecked: boolean = false;
  animation: Animation;
  currentTimer: any = null;
  sub$: Subscription;
  public loaded = false;
  public showPopup = true;
  public currentSection: PreguntasForm = null;

  constructor(
    private router: Router, 
    private formService: FormService,
    private loadingController: LoadingController,
    private fb: FormBuilder, 
    private animationCtrl: AnimationController, 
    private toastService: ToastService
  ) {
    this.myForm = this.fb.group({});
  }

  ngOnInit() {
    this.myForm = this.fb.group({});
    
    setTimeout(() => {
      this.sub$ = this.formService.getSelectedData().subscribe((data) => {
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
          this.currentSection = this.dinamicForm[0];
          this.setupPopupTimeout();
        }
      });
      this.loaded = true;
    }, 1000);
  }

  setupPopupTimeout() {
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }

  inicializarEdades(edadMinima: number, edadMaxima: number) {
    this.edadesDisponibles = [];
    for (let edad = edadMinima; edad <= edadMaxima; edad++) {
      this.edadesDisponibles.push(edad);
    }
  }

  seleccionarEdad(edad: number) {
    this.edadSeleccionada = edad;
    this.myForm.get('age').setValue(edad);
    this.selected = true;
  }

  swiperReady(swiperContainer: SwiperContainer) {
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
      const pregunta = group.preguntas[preguntaIndex];
      group.preguntas[preguntaIndex].isChecked = !group.preguntas[preguntaIndex].isChecked;
      
      if (pregunta.isChecked) {
        this.manageInputs(pregunta);
      }
    } else {
      group.preguntas.forEach(pregunta => {
        if (pregunta.val === val && pregunta.isChecked) {
          wasDeselected = true;
          pregunta.isChecked = false;
        } else {
          pregunta.isChecked = pregunta.val === val;
        }
        
        if (pregunta.isChecked) {
          this.manageInputs(pregunta);
        }
      });
    }

    if (this.swiperInstance.activeIndex === 6) {
      this.enableBandera(key, val);
    }
    
    this.selected = this.filterItems(group.preguntas);
    this.updateFormControl(key, group.preguntas, group.multiple);
  }

  manageInputs(pregunta) {
    if (pregunta.isChecked && pregunta.inputs && pregunta.inputs.length > 0) {
      pregunta.inputs.forEach(input => {
        if (!this.myForm.contains(input.key)) {
          this.myForm.addControl(input.key, this.fb.control(''));
        }
      });
    } else if (pregunta.inputs) {
      pregunta.inputs.forEach(input => {
        if (this.myForm.contains(input.key)) {
          this.myForm.removeControl(input.key);
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
      return age ? true : false;
    } else {
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
    } else {
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
    } else {
      this.router.navigateByUrl('/inicio', { replaceUrl: true });
    }
  }

  async resetForm() {
    this.myForm.reset();
    this.dinamicForm.forEach(group => {
      if (group.type === 'item') {
        group.preguntas.forEach(pregunta => {
          pregunta.isChecked = false;
        });
      }
    });
  }

  async next() {
    this.selected = false;
    if (this.swiperInstance.activeIndex < this.dinamicForm.length - 1) {
      this.swiperInstance.slideNext(500);
      setTimeout(() => {
        this.currentSection = this.dinamicForm[this.swiperInstance.activeIndex];
        this.setupPopupTimeout();
      }, 500);
    }
  }

  prev() {
    if (this.swiperInstance.activeIndex === 0) {
      this.close();
    } else {
      this.swiperInstance.slidePrev(500);
      setTimeout(() => {
        this.currentSection = this.dinamicForm[this.swiperInstance.activeIndex];
        this.setupPopupTimeout();
      }, 500);
    }
  }

  async close() {
    this.router.navigateByUrl('/inicio', { replaceUrl: true });
  }

  async backHome() {
    this.router.navigateByUrl('/inicio', { replaceUrl: true });
  }

  async swiperChange() {
    this.selected = this.filterItems(this.dinamicForm[this.swiperInstance.activeIndex]?.preguntas);
  }

  ionViewDidEnter() {
    this.background = '#F5F3FF';
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
    await this.resetForm();
    loading.dismiss();
    
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}