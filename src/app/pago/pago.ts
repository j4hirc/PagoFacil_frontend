import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ Añadido ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css'
})
export class Pago implements OnInit {
  pagoForm!: FormGroup;
  pagos: any[] = [];
  condominios: any[] = [];
  editMode: boolean = false;
  selectedId: number | null = null;
  mensajeExito: string = '';
  mensajeError: string = '';

  cargando: boolean = true;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private cdr: ChangeDetectorRef // ✅ Inyectamos el detector de cambios
  ) { }

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      fechaPago: ['', Validators.required],
      anioMesPago: ['', Validators.required],
      valorPagoAlicuota: ['', [Validators.required, Validators.min(0)]],
      valorPagoConsumoServicios: ['', [Validators.required, Validators.min(0)]],
      condominioId: ['', Validators.required]
    });
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    forkJoin({
      condominiosData: this.api.getCondominios(),
      pagosData: this.api.getPagos()
    }).subscribe({
      next: (resultados) => {
        this.condominios = resultados.condominiosData;
        this.pagos = resultados.pagosData;
        this.cargando = false;
        this.cdr.detectChanges(); // ✅ Despierta a Angular y muestra la tabla
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.mensajeError = 'No se pudo conectar con el servidor para listar los datos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackByPago(index: number, p: any): number {
    return p.id;
  }

  onSubmit() {
    this.submitted = true;
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const data = this.pagoForm.value;

    // Convertimos a número por seguridad
    if (data.condominioId !== null && data.condominioId !== '') {
      data.condominioId = Number(data.condominioId);
    }

    this.cargando = true;
    this.cdr.detectChanges(); // ✅ Muestra el spinner mientras guarda

    if (this.editMode && this.selectedId !== null) {
      this.api.actualizarPago(this.selectedId, data).subscribe({
        next: () => this.mostrarExito('¡Pago actualizado correctamente!'),
        error: () => this.mostrarError('Error al actualizar el pago.')
      });
    } else {
      this.api.registrarPago(data).subscribe({
        next: () => this.mostrarExito('¡Pago registrado correctamente!'),
        error: () => this.mostrarError('Error al registrar el pago.')
      });
    }
  }

  onEdit(p: any) {
    this.editMode = true;
    this.selectedId = p.id;
    this.pagoForm.patchValue({
      fechaPago: p.fechaPago,
      anioMesPago: p.anioMesPago,
      valorPagoAlicuota: p.valorPagoAlicuota,
      valorPagoConsumoServicios: p.valorPagoConsumoServicios,
      condominioId: p.condominioId || (p.condominio ? p.condominio.id : '')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges(); // ✅ Actualiza el formulario al instante
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro de pago?')) {
      this.cargando = true;
      this.cdr.detectChanges();

      this.api.eliminarPago(id).subscribe({
        next: () => this.mostrarExito('¡Pago eliminado correctamente!'),
        error: () => this.mostrarError('No se pudo eliminar el pago.')
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.selectedId = null;
    this.submitted = false;
    this.pagoForm.reset();
    this.cdr.detectChanges();
  }

  mostrarExito(msg: string) {
    this.mensajeExito = msg;
    this.resetForm();
    this.cargarDatos();
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges(); // ✅ Limpia el mensaje a los 4s
    }, 4000);
  }

  mostrarError(msg: string) {
    this.mensajeError = msg;
    this.cargando = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensajeError = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}