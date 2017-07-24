import { Injectable } from '@angular/core';
import { UsuarioProvider } from "../usuario/usuario";

//Geolocalizacion
import { Geolocation } from '@ionic-native/geolocation';
//Firebase
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class UbicacionProvider {

  usuario: FirebaseObjectObservable<any[]>;
  private watch:any;

  constructor(private geolocation: Geolocation,
              private afDB: AngularFireDatabase,
              private _usuario: UsuarioProvider) {
    console.log('Hello UbicacionProvider Provider');
  }

  iniciar_localizacion(){
    if(!this._usuario.clave){
      return;
    }
    this.usuario = this.afDB.object("/usuarios/" + this._usuario.clave);

    this.watch = this.geolocation.watchPosition()
      .subscribe((data) => {
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude
       //console.log(data);
       if(!this._usuario.clave){
         return;
       }
       this.usuario.update({lat: data.coords.latitude, lng: data.coords.longitude});
      });
  }

  detener_watch(){
    this.watch.unsubscribe();
  }

}
