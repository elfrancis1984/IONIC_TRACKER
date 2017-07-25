import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { UbicacionProvider } from "../../providers/ubicacion/ubicacion";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { LoginPage } from "../login/login";

import { Insomnia } from '@ionic-native/insomnia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuario:any = {};

  constructor(public navCtrl: NavController,
              private _ubicacion: UbicacionProvider,
              private _usuario: UsuarioProvider,
              private insomnia: Insomnia,
              private platform: Platform) {
      this._ubicacion.iniciar_localizacion();
      this._ubicacion.usuario.subscribe( data=>{
        console.log(data);
        this.usuario = data;
      });

      if(this.platform.is("cordova")){
        this.insomnia.keepAwake()
        .then(
          () => console.log('success'),
          () => console.log('error')
        );
      }
  }

  salir(){
    this._usuario.borrar_usuario();
    this._ubicacion.detener_watch();
    this.navCtrl.setRoot(LoginPage);

    if(this.platform.is("cordova")){
      this.insomnia.allowSleepAgain()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );
    }
  }

}
