import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  administrador: any = {};

  constructor(private http: HttpClient) {}

  login() {
    const formulario: HTMLFormElement | null = document.getElementById('loginForm') as HTMLFormElement;
    if (formulario && formulario.reportValidity()) {
      this.servicioLogin().subscribe(
        (resultado: any) => this.darBienvenida(resultado),
      );
    }
  }

  servicioLogin() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<string>(
      'http://localhost:8080/administrador/login',
      this.administrador,
      httpOptions
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  darBienvenida(resultado: any) {
    if (resultado.mensaje === "Login exitoso") {
      sessionStorage.setItem('administrador', this.administrador.correo);
      this.administrador = {};
      location.href = '/menu';
    }
  }

}
