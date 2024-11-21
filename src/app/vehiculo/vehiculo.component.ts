import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css'
})
export class VehiculoComponent {
  vehiculos: any[] = [];
  nuevoVehiculo = { modelo: '', marca: '', color: '', matricula: '', fechainicio: '', fechafin: '', idestado: 0 };
  vehiculoParaActualizar: any = null;
  mostrarFormularioAgregar = false;
  mostrarFormularioActualizar = false;
  usuario: any;

  constructor(private http: HttpClient) {
    // Obtener el usuario de sessionStorage
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');

  }

  ngOnInit(): void {
    this.buscarVehiculos();
  }

  buscarVehiculos() {
    this.http.get<any[]>('http://localhost:8080/vehiculo/buscar').subscribe({
      next: response => this.vehiculos = response,
      error: error => console.error('Error al obtener vehículos:', error)
    });
  }

  toggleFormularioAgregar() {
    this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar;
    this.mostrarFormularioActualizar = false;
    this.vehiculoParaActualizar = null;
  }

  agregarVehiculo() {
    if (!this.nuevoVehiculo.modelo || !this.nuevoVehiculo.matricula) {
      alert('El modelo y la matrícula son requeridos');
      return;
    }

    const vehiculoData = {
      ...this.nuevoVehiculo,
      fechainicio: new Date(),
      fechafin: this.nuevoVehiculo.fechafin || '',
      usuariocreacion: this.usuario.nombre,
      usuariomodificacion: this.usuario.nombre
    };

    this.http.post('http://localhost:8080/vehiculo/guardar', vehiculoData).subscribe({
      next: () => {
        alert('Vehículo agregado exitosamente.');
        this.buscarVehiculos();
        this.nuevoVehiculo = { modelo: '', marca: '', color: '', matricula: '', fechainicio: '', fechafin: '', idestado: 1 };
        this.mostrarFormularioAgregar = false;
      },
      error: error => console.error('Error al agregar vehículo:', error)
    });
  }

  cargarVehiculoParaActualizar(vehiculo: any) {
    this.vehiculoParaActualizar = { ...vehiculo };
    this.mostrarFormularioActualizar = true;
    this.mostrarFormularioAgregar = false;
  }

  actualizarVehiculo() {
    if (!this.vehiculoParaActualizar?.modelo || !this.vehiculoParaActualizar?.matricula) {
      alert('El modelo y la matrícula son requeridos');
      return;
    }

    const vehiculoData = {
      ...this.vehiculoParaActualizar,
      fechafin: this.vehiculoParaActualizar.fechafin || '',
      usuariomodificacion: this.usuario.nombre
    };

    this.http.put(`http://localhost:8080/vehiculo/actualizar/${vehiculoData.idvehiculo}`, vehiculoData).subscribe({
      next: () => {
        alert('Vehículo actualizado exitosamente.');
        this.buscarVehiculos();
        this.vehiculoParaActualizar = null;
        this.mostrarFormularioActualizar = false;
      },
      error: error => console.error('Error al actualizar vehículo:', error)
    });
  }

  eliminarVehiculo(idvehiculo: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.http.delete(`http://localhost:8080/vehiculo/eliminar/${idvehiculo}`).subscribe({
        next: () => {
          alert('Vehículo eliminado exitosamente.');
          this.buscarVehiculos();
        },
        error: error => console.error('Error al eliminar vehículo:', error)
      });
    }
  }
}
