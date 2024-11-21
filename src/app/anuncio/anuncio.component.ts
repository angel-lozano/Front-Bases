import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anuncio',
  standalone: true,
  imports: [MenuComponent, FormsModule, CommonModule],
  templateUrl: './anuncio.component.html',
  styleUrl: './anuncio.component.css'
})
export class AnuncioComponent {
  anuncios: any[] = [];
  nuevoAnuncio: any = { texto: '', imagen: null, modelo: '', marca: '' };
  anuncioParaActualizar: any = null;
  mostrarFormularioAgregar = false;
  mostrarFormularioActualizar = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.buscarAnuncios();
  }

  buscarAnuncios() {
    this.http.get<any[]>('http://localhost:8080/anuncio/buscar').subscribe({
      next: response => this.anuncios = response,
      error: error => console.error('Error al obtener anuncios:', error)
    });
  }

  toggleFormularioAgregar() {
    this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar;
    this.mostrarFormularioActualizar = false;
    this.anuncioParaActualizar = null;
  }

  agregarAnuncio(form: any) {
    if (form.invalid) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    const formData = new FormData();
    formData.append('texto', this.nuevoAnuncio.texto);
    formData.append('modelo', this.nuevoAnuncio.modelo);
    formData.append('marca', this.nuevoAnuncio.marca);
    if (this.nuevoAnuncio.imagen) {
      formData.append('imagen', this.nuevoAnuncio.imagen);
    }

    this.http.post('http://localhost:8080/anuncio/guardar', formData).subscribe({
      next: () => {
        alert('Anuncio agregado exitosamente.');
        this.buscarAnuncios();
        this.nuevoAnuncio = { texto: '', imagen: null, modelo: '', marca: '' };
        this.mostrarFormularioAgregar = false;
      },
      error: error => console.error('Error al agregar anuncio:', error)
    });
  }

  cargarAnuncioParaActualizar(anuncio: any) {
    this.anuncioParaActualizar = { ...anuncio };
    this.mostrarFormularioActualizar = true;
    this.mostrarFormularioAgregar = false;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];  // Obtenemos el primer archivo
    if (file) {
      if (this.anuncioParaActualizar) {
        this.anuncioParaActualizar.imagen = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.anuncioParaActualizar.imagenPreview = reader.result as string;
        };
        reader.readAsDataURL(file); // Convertir imagen a formato base64
      } else {
        this.nuevoAnuncio.imagen = file;
      }
    }
  }

  actualizarAnuncio(form: any) {
    if (form.invalid) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    if (!this.anuncioParaActualizar?.idanuncio || !this.anuncioParaActualizar.texto || !this.anuncioParaActualizar.modelo || !this.anuncioParaActualizar.marca) {
      alert('El texto, modelo y marca son requeridos');
      return;
    }

    const formData = new FormData();
    formData.append('texto', this.anuncioParaActualizar.texto);
    formData.append('modelo', this.anuncioParaActualizar.modelo);
    formData.append('marca', this.anuncioParaActualizar.marca);
    if (this.anuncioParaActualizar.imagen) {
      formData.append('imagen', this.anuncioParaActualizar.imagen);
    }

    this.http.put(`http://localhost:8080/anuncio/actualizar/${this.anuncioParaActualizar.idanuncio}`, formData).subscribe({
      next: () => {
        alert('Anuncio actualizado exitosamente.');
        this.buscarAnuncios();
        this.anuncioParaActualizar = null;
        this.mostrarFormularioActualizar = false;
      },
      error: error => console.error('Error al actualizar anuncio:', error)
    });
  }

  eliminarAnuncio(idAnuncio: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      this.http.delete(`http://localhost:8080/anuncio/eliminar/${idAnuncio}`).subscribe({
        next: () => {
          alert('Anuncio eliminado exitosamente.');
          this.buscarAnuncios();
        },
        error: error => console.error('Error al eliminar anuncio:', error)
      });
    }
  }

}
