import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Platform } from "ionic-angular";

@Injectable()
export class UsuarioProvider {
  clave:string = null;

  constructor(private afDB: AngularFireDatabase,
              private storage: Storage,
              private platform: Platform) {}

  verifica_usuario( clave:string ){
    clave = clave.toLowerCase();
    let promesa = new Promise((resolve,reject)=>{
      this.afDB.list('/usuarios/'+clave)
                .subscribe(data => {
                  if(data.length === 0){
                    // clave no es correcta
                    resolve(false);
                  }else{
                    // la clave es válida
                    this.clave = clave;
                    this.guardar_storage();
                    resolve(true);
                  }
                  console.log(data);
                  resolve();
                });
    }).catch(error=>{
      console.log("Error en promesa services: " + JSON.stringify(error));
    });
    return promesa;
  }

  guardar_storage(){
    let promesa = new Promise( (resolve,reject)=>{
      if(this.platform.is("cordova")){
        //dispositivo
        this.storage.set("clave",this.clave);
      }else{
        //escritorio
        if(this.clave){
          localStorage.setItem("clave", this.clave);
        }else{
          localStorage.removeItem("clave");
        }
      }
    });
    return promesa;
  }

  cargar_storage(){
    let promesa = new Promise( (resolve,reject)=>{
      if(this.platform.is("cordova")){
        //dispositivo
        this.storage.ready().then( ()=>{
          //leer storage
          this.storage.get("clave").then(clave=>{
            this.clave = clave;
            resolve();
          });
        });
      }else{
        //escritorio
        this.clave = localStorage.getItem("clave");
        resolve();
      }
    });
    return promesa;
  }

}
