import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { Vehiculo } from "../modelo/vehiculo.model";
import { map } from 'rxjs/operators';

@Injectable()
export class VehiculoServicio{
    vehiculoColeccion: AngularFirestoreCollection<Vehiculo>;
    vehiculoDoc: AngularFirestoreDocument<Vehiculo>;
    vehiculos: Observable<Vehiculo[]>;
    vehiculo: Observable<Vehiculo>;

    constructor(private db: AngularFirestore){ //recuperar los vehiculos 
        this.vehiculoColeccion = db.collection('vehiculos', ref => ref.orderBy('placa', 'asc'));
    }

    getVehiculos(): Observable<Vehiculo[]>{ //Detalles del cehiculo
        //Obtener los vehiculos
        this.vehiculos = this.vehiculoColeccion.snapshotChanges().pipe(
            map( cambios => {
                return cambios.map( accion => {
                    const datos = accion.payload.doc.data() as Vehiculo;
                    datos.id = accion.payload.doc.id;
                    return datos;
                })
            })
        );
        return this.vehiculos;
    }
    agregarVehiculo(vehiculo: Vehiculo){
        this.vehiculoColeccion.add(vehiculo);
    }

    getVehiculo(id:string): Observable<Vehiculo>{
        
        this.vehiculoDoc = this.db.doc<Vehiculo>(`vehiculos/${id}`);
 
        return this.vehiculo = this.vehiculoDoc.snapshotChanges().pipe(
            map( accion => {
                if(accion.payload.exists === false){
                    return null;
                }else{
                    const datos = accion.payload.data() as Vehiculo;
                    datos.id = accion.payload.id;
                    return datos as any;
                }
            })
        )
    }

    modificarVehiculo(vehiculo: Vehiculo){
        this.vehiculoDoc = this.db.doc(`vehiculos/${vehiculo.id}`);
        this.vehiculoDoc.update(vehiculo);
    }

    eliminarVehiculo(vehiculo: Vehiculo){
        this.vehiculoDoc = this.db.doc(`vehiculos/${vehiculo.id}`);
        this.vehiculoDoc.delete();
    }
}