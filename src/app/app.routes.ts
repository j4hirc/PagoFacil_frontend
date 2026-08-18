import { Routes } from '@angular/router';
import { Pago } from './pago/pago';
import { Bloque } from './bloque/bloque';
import { Departamento } from './departamento/departamento';
import { Condomino } from './condomino/condomino';

export const routes: Routes = [
    { path: 'pagos', component: Pago },
    { path: 'bloques', component: Bloque },
    { path: 'departamentos', component: Departamento },
    { path: 'condominos', component: Condomino },
    { path: '', redirectTo: '/pagos', pathMatch: 'full' }
];