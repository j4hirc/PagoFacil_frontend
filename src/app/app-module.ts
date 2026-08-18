import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { App } from './app';
import { Pago } from './pago/pago';
import { Bloque } from './bloque/bloque';
import { Departamento } from './departamento/departamento';
import { Condomino } from './condomino/condomino';
import { ApiService } from './services/api';

const routes: Routes = [
    { path: 'pagos', component: Pago },
    { path: 'bloques', component: Bloque },
    { path: 'departamentos', component: Departamento },
    { path: 'condominos', component: Condomino },
    { path: '', redirectTo: '/pagos', pathMatch: 'full' }
];

@NgModule({
    declarations: [

    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        Pago,
        Bloque,
        Departamento,
        Condomino
    ],
    providers: [ApiService],

})
export class AppModule { }