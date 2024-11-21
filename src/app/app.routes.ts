import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { AnuncioComponent } from './anuncio/anuncio.component';

export const routes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'usuario', component: UsuarioComponent },
    { path: 'vehiculo', component: VehiculoComponent },
    { path: 'anuncio', component: AnuncioComponent },

];
