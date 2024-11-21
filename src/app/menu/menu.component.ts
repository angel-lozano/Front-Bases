import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {

  administrador: any = {};

  logout() {
    location.href = '/';
  }

  activeSubmenu: string | null = null;

  toggleSubmenu(submenu: string): void {
    this.activeSubmenu = this.activeSubmenu === submenu ? null : submenu;
  }

}
