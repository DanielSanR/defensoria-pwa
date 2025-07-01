import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import packageInfo from '../../../package.json';
@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.page.html',
  styleUrls: ['./sobre-nosotros.page.scss'],
})
export class SobreNosotrosPage  {
  v = packageInfo.version; 

  features = [
    {
      icon: 'shield-outline',
      title: 'Plataforma Segura',
      description: 'Implementamos las más altas medidas de seguridad para proteger tu privacidad.'
    },
    {
      icon: 'lock-closed-outline',
      title: 'Confidencialidad',
      description: 'Todas las denuncias son manejadas de manera estrictamente confidencial.'
    },
    {
      icon: 'chatbubble-ellipses-outline',
      title: 'Apoyo Continuo',
      description: 'Estamos aquí para escucharte y brindarte el apoyo que necesitas.'
    },
    {
      icon: 'heart-outline',
      title: 'Compromiso',
      description: 'Trabajamos incansablemente para proteger tus derechos y bienestar.'
    }
  ];
  pageContent = {
    hero: {
      title: 'Sobre Nosotros',
      text: 'Trabajamos para proporcionar un espacio seguro donde puedas expresarte y recibir la ayuda que necesitas.'
    },
    paragraphs: [
      'Nuestra aplicación ha sido diseñada como un espacio seguro donde niños, niñas y adolescentes pueden expresarse y buscar ayuda. Entendemos que a veces es difícil hablar sobre situaciones incómodas o preocupantes, y queremos ofrecerte un lugar donde puedas compartir lo que te está pasando con total confianza.',
      'Todo lo que nos cuentes será tratado con el mayor cuidado y respeto. Solo las personas que pueden ayudarte tendrán acceso a esta información, y siempre protegeremos tu privacidad. Nos comprometemos a escucharte y a tomar en serio cada mensaje que recibimos.',
      'Recuerda que no estás solo. Si necesitas hablar con alguien después de usar nuestra aplicación, siempre puedes contactarnos. Hay un equipo de personas preparadas para escucharte, responder tus preguntas y acompañarte en todo momento. Puedes comunicarte con nosotros a través de la sección "Teléfono" o enviando un mensaje por correo electrónico. Estamos aquí para ti, cuando nos necesites.'
    ]
  };
  institutions = [
    {
      name: 'Silicon Misiones',
      logo: '../../assets/icon/silicon.png',
      description: 'Desarrollo tecnológico e innovación',
      contact: {
        address: 'Coronel López N° 1916, Posadas',
        phone: '0376 444-5000',
        email: 'info@siliconmisiones.gob.ar',
        web: 'www.siliconmisiones.gob.ar'
      }
    },
    {
      name: 'Defensoría de los Derechos',
      logo: '../../assets/icon/defe.jpg',
      description: 'Protección y defensa de derechos',
      contact: {
        address: 'Felix de Azara N° 2560, Posadas',
        phone: '0376 443-3019',
        email: 'defensoriadennya.misiones@gmail.com',
        web: 'www.defensoria.misiones.gob.ar'
      }
    },
    {
      name: 'Gobierno de Misiones',
      logo: '../../assets/icon/misiones.jpg',
      description: 'Gobierno provincial',
      contact: {
        address: 'Félix de Azara N° 1749, Posadas',
        phone: '0376 444-5002',
        email: 'info@comunicacion.misiones.gob.ar',
        web: 'www.misiones.gob.ar'
      }
    }
  ];
  constructor(public modalController: ModalController) { }

  volver() {
    return this.modalController.dismiss();
  }
}
