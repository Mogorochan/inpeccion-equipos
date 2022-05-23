import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehiculoServicio } from 'src/app/servicios/vehiculo.service';
import { Vehiculo } from 'src/app/modelo/vehiculo.model';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  vehiculos : Vehiculo[];
  vehiculo: Vehiculo = {
    placa: '',
    tipo: '',
    caracteristica1: '',
    caracteristica2: ''
  }
  @ViewChild('vehiculoForm', {static: false}) vehiculoForm: NgForm;
  @ViewChild('botonCerrar', {static: false}) botonCerrar:  ElementRef;

  id:string;

  constructor(private vehiculosServicio: VehiculoServicio, 
              private flashMessages: FlashMessagesService,
              private router: Router,
              private route: ActivatedRoute
    ) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.vehiculosServicio.getVehiculos().subscribe(
      vehiculos =>{
        this.vehiculos = vehiculos;
      }
    )
  }


  agregar(f:NgForm){
    console.log(f.value);
    if(!f.valid){
      this.flashMessages.show('Por favor, llena el formulario correctamente',{
        cssClass: 'alert-danger', timeout:4000
      });
    } else{
      //agregar el nuevo vehiculo
      this.vehiculosServicio.agregarVehiculo(f.value);
      this.vehiculoForm.resetForm();
      this.cerrarModal();
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }
  eliminar(){
    if(confirm('¿Seguro que desea eliminar el registro?')){
      this.vehiculosServicio.eliminarVehiculo(this.vehiculo);
      this.router.navigate(['/']);
    }
  }
}
