/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { OnInit,ChangeDetectorRef, Component, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RangeCustomEvent, LoadingController } from '@ionic/angular';
import PreguntasformArrKid from '../../assets/datos/DinamicFormKid.json';
import PreguntasformArr from '../../assets/datos/DinamicForm.json';
import { Help } from '../models/Help';
import { FormService } from '../services/form.service';
import { DeviceService } from '../services/device.service';
import { SendmailService } from '../services/sendmail.service';
import { FormBuilder, FormGroup, FormArray,FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
export interface PreguntasForm {
  key: string;
  title: string;
  type: string;
  multiple: boolean;
  preguntas?: Array<OpcForm>;
  icon?:boolean
}
interface OpcForm {
id: number;
val: string;
isChecked?: boolean | false;
icon?:string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  private swiperInstance: any;
  @ViewChild('swiper')
  set swiper(swiperRef: ElementRef) {
    setTimeout(() => {
      this.swiperInstance = swiperRef.nativeElement.swiper;
      
    }, 0);
  } 
  edadesDisponibles: number[] = [];
  edadSeleccionada: number = 0;
  public myForm: FormGroup;
  public dinamicForm: PreguntasForm[];
  public help: Help = new Help();
  public bandera = false;
  public selected: boolean = false;
  public selectedAge: any;
  public background ='#ffff';
  public finalized: boolean = false;
  public backgroundChecked='#5A4BB2';
  public rangoEtario:string;
  isckecked: boolean = false;
  constructor(private router: Router,private formService: FormService,
    private mailService: SendmailService,
    private cd: ChangeDetectorRef, private loadingController: LoadingController,
    private fb: FormBuilder) { 
      this.inicializarEdades(4, 18);
      this.myForm = this.fb.group({});
    }

  ngOnInit() {
    
    this.formService.getSelectedData().subscribe((data) => {
      this.rangoEtario = data;
      this.dinamicForm = this.rangoEtario === 'teen' ? PreguntasformArr : PreguntasformArrKid;
    });
    this.createControls(this.dinamicForm);
  }
  inicializarEdades(edadMinima: number, edadMaxima: number) {
    for (let edad = edadMinima; edad <= edadMaxima; edad++) {
      this.edadesDisponibles.push(edad);
    }
  }
  seleccionarEdad(edad: number) {
    this.edadSeleccionada = edad;
    this.myForm.get('edad').setValue(edad);
    this.selected=true
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

  getFormArray(formArrayName: string): FormArray {
    return this.myForm.get(formArrayName) as FormArray;
  }

  updateSelections(key: string, value: string, isChecked: boolean) {
  const selections = this.myForm.get(key).value as Array<string>;
  if (isChecked) {
    this.myForm.get(key).setValue([...selections, value]);
   } 
  else {
    this.myForm.get(key).setValue(selections.filter(v => v !== value));
   }
  }
  
  submitForm(){
    console.log(this.myForm.value);
    
  }

  toggleSelection(key: string, val: string) {
    const groupIndex = this.dinamicForm.findIndex(group => group.key === key);
    const group = this.dinamicForm[groupIndex];
    if (group.multiple) {
      const preguntaIndex = group.preguntas.findIndex(pregunta => pregunta.val === val);
      group.preguntas[preguntaIndex].isChecked = !group.preguntas[preguntaIndex].isChecked;
    } 
    else {
      group.preguntas.forEach(pregunta => {
        pregunta.isChecked = pregunta.val === val ? !pregunta.isChecked : false;
       });
    }
    if(this.swiperInstance.activeIndex === 6){
      this.enableBandera(key,val);
      console.log("entro en enable")
    }
    this.selected = this.filterItems(group.preguntas);
    this.updateFormControl(key, group.preguntas);
  }
   
  updateFormControl(key: string, preguntas: any[]) {
    const selectedValues = preguntas.filter(pregunta => pregunta.isChecked).map(pregunta => pregunta.val);
    this.myForm.get(key).setValue(selectedValues);
  }

  isChecked(key: string, value: string): boolean {
    const currentValues = this.myForm.get(key).value || [];
    return currentValues.includes(value);
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter'); 
    this.background ='#FFF';
    this.finalized = false;
  }

  next(){ 
    this.selected = false;
    if(this.swiperInstance.activeIndex === this.swiperInstance.slides.length - 1){
    }
    else{
      this.swiperInstance.slideNext(500);
    }
  }
  prev(){
    if(this.swiperInstance.activeIndex ===0){
      this.close();
    }
    this.selected = false;
    this.swiperInstance.slidePrev(500);;  
    }
   
  close(){
    this.selected = false;
    this.swiperInstance.slideTo(0, 500,false);
    this.swiperInstance.update();
    this.resetForm()
    this.router.navigateByUrl('/principal/inicio');
  }

  filterItems(arr: any) {
    return arr.filter((el: any) => el).map((e: any) => e.isChecked).includes(true);
  }

  enableBandera(key: string, val: string){
    const groupIndex = this.dinamicForm.findIndex(group => group.key === key);
    const group = this.dinamicForm[groupIndex];
    const isSelected= this.filterItems(group.preguntas);
    if(isSelected){
      this.bandera = true;
      this.selected = true;
    } 
    else{ 
      this.bandera = false;
    }

  }
  
  async backHome(){
    const loading = await this.loadingController.create({
      message: 'Cerrando Formulario...',
      spinner: 'circles',
    });
    await loading.present();
    this.finalized = false;
     this.swiperInstance.slideTo(0, 500,false);
     this.swiperInstance.update();
     this.resetForm()
       loading.dismiss();
  }
  
  async enviar(){
    this.bandera= false;
    console.log(this.myForm.value);
    /* const t = await this.mailService.sendForm('form', this.myForm.value); */
    const t = true;
    if(t){
      this.swiperInstance.slideNext(500);
      this.swiperInstance.update();
      this.finalized = true;
    }
    else { 
      this.finalized = false;
    }
  }

  async ionViewWillLeave() {
    console.log('ionViewWillLeave');
    const loading = await this.loadingController.create({
      message: 'Cerrando Formulario...',
      spinner: 'circles',
    });
    await loading.present();
    this.finalized = false;
    this.swiperInstance.slideTo(0, 500,false);
    this.resetForm()
    loading.dismiss(); 
  }

  resetForm(){
    this.myForm.reset();
    this.dinamicForm.forEach(group => {
      if(group.type === 'item'){
        group.preguntas.forEach(pregunta => {
          pregunta.isChecked = false;
        });
      }
    });
  }
}
