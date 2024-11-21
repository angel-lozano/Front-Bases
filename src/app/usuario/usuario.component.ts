import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MenuComponent, FormsModule, CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  usuarios: any[] = [];
  nuevoUsuario = { usuario: '', nombre: '', apellido: '', password: '', telefono: '', dpi: '' };
  usuarioParaActualizar: any = null;
  mostrarFormularioAgregar = false;
  mostrarFormularioActualizar = false;
  usuario: any;

  constructor(private http: HttpClient) {
    // Obtener el usuario de sessionStorage
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');

  }

  ngOnInit(): void {
    this.buscarUsuarios();
  }

  buscarUsuarios() {
    this.http.get<any[]>('http://localhost:8080/usuario/buscar').subscribe({
      next: response => this.usuarios = response,
      error: error => console.error('Error al obtener usuarios:', error)
    });
  }

  toggleFormularioAgregar() {
    this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar;
    this.mostrarFormularioActualizar = false;
    this.usuarioParaActualizar = null;
  }

  agregarUsuario() {
    if (!this.nuevoUsuario.usuario || !this.nuevoUsuario.password) {
      alert('El usuario y la contraseña son requeridos');
      return;
    }

    const usuarioData = {
      ...this.nuevoUsuario,
      password: this.nuevoUsuario.password,  // Enviar la contraseña tal cual, será encriptada en el backend
    };

    this.http.post('http://localhost:8080/usuario/guardar', usuarioData).subscribe({
      next: () => {
        alert('Usuario agregado exitosamente.');
        this.buscarUsuarios();
        this.nuevoUsuario = { usuario: '', nombre: '', apellido: '', password: '', telefono: '', dpi: '' };
        this.mostrarFormularioAgregar = false;
      },
      error: error => console.error('Error al agregar usuario:', error)
    });
  }

  cargarUsuarioParaActualizar(usuario: any) {
    this.usuarioParaActualizar = { ...usuario };
    this.mostrarFormularioActualizar = true;
    this.mostrarFormularioAgregar = false;
  }

  actualizarUsuario() {
    if (!this.usuarioParaActualizar?.usuario) {
      alert('El usuario es requerido');
      return;
    }

    const usuarioData = {
      ...this.usuarioParaActualizar,
      password: this.usuarioParaActualizar.password || null,  // Si la contraseña no está presente, no se actualizará
    };

    this.http.put(`http://localhost:8080/usuario/actualizar/${usuarioData.usuario}`, usuarioData).subscribe({
      next: () => {
        alert('Usuario actualizado exitosamente.');
        this.buscarUsuarios();
        this.usuarioParaActualizar = null;
        this.mostrarFormularioActualizar = false;
      },
      error: error => console.error('Error al actualizar usuario:', error)
    });
  }

  eliminarUsuario(usuario: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.http.delete(`http://localhost:8080/usuario/eliminar/${usuario}`).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente.');
          this.buscarUsuarios();
        },
        error: error => console.error('Error al eliminar usuario:', error)
      });
    }
  }
}
