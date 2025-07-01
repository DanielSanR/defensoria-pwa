import { Component, OnInit } from '@angular/core';

interface ContactFeature {
  icon: string;
  text: string;
}

interface Contact {
  iconSrc: string;
  title: string;
  subtitle?: string;
  phoneNumber?: string;
  displayNumber?: string;
  contactInfo?: string;
  displayInfo?: string;
  hours?: string;
  responseTime?: string;
  features?: ContactFeature[];
  isEmail?: boolean;
}

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.page.html',
  styleUrls: ['./telefono.page.scss'],
})
export class TelefonoPage {
  
  emergencyContacts: Contact[] = [
    {
      iconSrc: '../../assets/icon/numeros-utiles/911.svg',
      title: 'Línea de Emergencia 911',
      phoneNumber: '911',
      displayNumber: '911',
      hours: 'Atención inmediata las 24 horas'
    },
    {
      iconSrc: '../../assets/icon/numeros-utiles/defensoria.svg',
      title: 'Defensoría de los Derechos',
      phoneNumber: '3764345421',
      displayNumber: '3764-345421',
      hours: 'Lunes a viernes de 8:00 a 20:00 hs'
    }
  ];

  otherContacts: Contact[] = [
    {
      iconSrc: '../../assets/icon/numeros-utiles/102.svg',
      title: 'Secretaría Nacional',
      subtitle: 'Línea 102 y 137',
      contactInfo: '3764433019',
      displayInfo: '3764-433019',
      responseTime: 'Atención y asistencia las 24 horas',
      features: [
        { icon: 'heart', text: 'Asistencia Psicológica' },
        { icon: 'heart', text: 'Orientación Legal' },
        { icon: 'heart', text: 'Apoyo Emocional' }
      ]
    },
    {
      iconSrc: '../../assets/icon/numeros-utiles/mail.svg',
      title: 'Correo Electrónico',
      subtitle: 'Escríbenos en cualquier momento',
      contactInfo: 'defensoriadennya.misiones@gmail.com',
      displayInfo: 'defensoriadennya.misiones@gmail.com',
      responseTime: 'Respuesta en 6-12 horas hábiles',
      isEmail: true,
      features: [
        { icon: 'heart', text: 'Consultas Generales' },
        { icon: 'heart', text: 'Seguimiento de Casos' },
        { icon: 'heart', text: 'Documentación' }
      ]
    }
  ];

  constructor() { }

 

  callNumber(number: string) {
    window.location.href = `tel:${number}`;
  }
}