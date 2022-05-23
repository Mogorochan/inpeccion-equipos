import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Vehiculo } from 'src/app/modelo/vehiculo.model';
import { VehiculoServicio } from 'src/app/servicios/vehiculo.service';

@Component({
  selector: 'app-editar-vehiculo',
  templateUrl: './editar-vehiculo.component.html',
  styleUrls: ['./editar-vehiculo.component.css']
})
export class EditarVehiculoComponent implements OnInit {

  vehiculo: Vehiculo = {
    placa: '',
    tipo: '',
    caracteristica1: '',
    caracteristica2: ''
  }

  id:string;

  constructor(private vehiculosServicio: VehiculoServicio, 
    private flashMessages: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.vehiculosServicio.getVehiculo(this.id).subscribe( vehiculo =>{
      this.vehiculo = vehiculo;
    });
  }
  guardar({value,valid}:NgForm){
    if(!valid){
      this.flashMessages.show('Por favor, llenar el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }else{
      value.id = this.id; 
      //modificar el vehiculo
      this.vehiculosServicio.modificarVehiculo(value);
      this.router.navigate(['/']);
    }
  }

  eliminar(){
    if(confirm('¿Seguro que desea eliminar el registro?')){
      this.vehiculosServicio.eliminarVehiculo(this.vehiculo);
      this.router.navigate(['/']);
    }
  }
}
