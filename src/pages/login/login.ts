import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ViewChild, AfterViewInit } from '@angular/core';
import { Slides } from 'ionic-angular';

//Providers
import { UsuarioProvider } from "../../providers/usuario/usuario";

//Pages
import { HomePage } from "../home/home";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements AfterViewInit {
   @ViewChild(Slides) slides: Slides;
   clave:string = "fco-1";

  constructor(public navCtrl: NavController,
              private _up: UsuarioProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  continuar(){
    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();
    // verificar si la clave es valida
    this._up.verifica_usuario(this.clave).then( valido=>{
      loading.dismiss();
      if(valido){
        // continuar a la siguiente pantalla
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
      }else{
        this.alertCtrl.create({
          title: "Clave no es correcta",
          subTitle: "Por favor verifique su clave",
          buttons: ["Ok!"]
        }).present();
      }
    }).catch(error=>{
      loading.dismiss();
      console.log("ERROR: " + JSON.stringify(error));
    });
  }

  ingresar(){
    // tenemos la clave, ir al home
    this.navCtrl.setRoot(HomePage);

  }

  ngAfterViewInit(){
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = "progress";
  }

}
