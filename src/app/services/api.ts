import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private url = environment.apiUrl;

    constructor(private http: HttpClient) { }


    getBloques(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/bloques`);
    }

    registrarBloque(data: any): Observable<any> {
        return this.http.post(`${this.url}/bloques`, data);
    }

    actualizarBloque(id: number, data: any): Observable<any> {
        return this.http.put(`${this.url}/bloques/${id}`, data);
    }

    eliminarBloque(id: number): Observable<any> {
        return this.http.delete(`${this.url}/bloques/${id}`);
    }


    getDepartamentos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/departamentos`);
    }

    registrarDepartamento(data: any): Observable<any> {
        return this.http.post(`${this.url}/departamentos`, data);
    }

    actualizarDepartamento(id: number, data: any): Observable<any> {
        return this.http.put(`${this.url}/departamentos/${id}`, data);
    }

    eliminarDepartamento(id: number): Observable<any> {
        return this.http.delete(`${this.url}/departamentos/${id}`, { responseType: 'text' });
    }


    getCondominios(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/condominio`);
    }

    registrarCondominio(data: any): Observable<any> {
        return this.http.post(`${this.url}/condominio`, data);
    }

    actualizarCondominio(id: number, data: any): Observable<any> {
        return this.http.put(`${this.url}/condominio/${id}`, data);
    }

    eliminarCondominio(id: number): Observable<any> {
        return this.http.delete(`${this.url}/condominio/${id}`);
    }


    getPagos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/pagos`);
    }

    registrarPago(data: any): Observable<any> {
        return this.http.post(`${this.url}/pagos`, data);
    }

    actualizarPago(id: number, data: any): Observable<any> {
        return this.http.put(`${this.url}/pagos/${id}`, data);
    }

    eliminarPago(id: number): Observable<any> {
        return this.http.delete(`${this.url}/pagos/${id}`);
    }
}