import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ Añadido ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-condomino',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './condomino.html',
  styleUrl: './condomino.css',
})
export class Condomino implements OnInit {
  condominoForm!: FormGroup;
  condominios: any[] = [];
  departamentos: any[] = [];
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
    this.condominoForm = this.fb.group({
      cedulaCondominio: ['', Validators.required],
      nombreCondomino: ['', Validators.required],
      apellidoCondomino: ['', Validators.required],
      celularCondominio: ['', Validators.required],
      telefonoCondomino: [''],
      departamentoId: ['', Validators.required]
    });
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    forkJoin({
      deptos: this.api.getDepartamentos(),
      condos: this.api.getCondominios()
    }).subscribe({
      next: (resultados) => {
        this.departamentos = resultados.deptos;
        this.condominios = resultados.condos;
        this.cargando = false;
        this.cdr.detectChanges(); // ✅ Despierta a Angular y muestra la tabla YA
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.mensajeError = 'No se pudo conectar con el servidor para listar los datos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackByCondominio(index: number, c: any): number {
    return c.id;
  }

  onSubmit() {
    this.submitted = true;
    if (this.condominoForm.invalid) {
      this.condominoForm.markAllAsTouched();
      return;
    }

    const data = this.condominoForm.value;

    // departamentoId a veces llega como string desde el select; forzar número
    if (data.departamentoId !== null && data.departamentoId !== '') {
      data.departamentoId = Number(data.departamentoId);
    }

    this.cargando = true;
    this.cdr.detectChanges(); // ✅ Muestra el spinner al guardar

    if (this.editMode && this.selectedId !== null) {
      this.api.actualizarCondominio(this.selectedId, data).subscribe({
        next: () => this.mostrarExito('¡Condómino actualizado correctamente!'),
        error: (err) => {
          console.error(err);
          const msg = err?.error?.message || err?.message || 'Error al actualizar el condómino.';
          this.mostrarError(typeof msg === 'string' ? msg : 'Error al actualizar el condómino.');
        }
      });
    } else {
      this.api.registrarCondominio(data).subscribe({
        next: () => this.mostrarExito('¡Condómino registrado correctamente!'),
        error: (err) => {
          console.error(err);
          const msg = err?.error?.message || err?.error || err?.message || 'Error al registrar el condómino.';
          this.mostrarError(typeof msg === 'string' ? msg : 'Error al registrar el condómino. Revisa la consola (F12).');
        }
      });
    }
  }

  onEdit(c: any) {
    this.editMode = true;
    this.selectedId = c.id;
    this.condominoForm.patchValue({
      cedulaCondominio: c.cedulaCondominio,
      nombreCondomino: c.nombreCondomino,
      apellidoCondomino: c.apellidoCondomino,
      celularCondominio: c.celularCondomino,
      telefonoCondomino: c.telefonoCondomino,
      departamentoId: c.departamentoId || (c.departamento ? c.departamento.id : '')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges(); // ✅ Actualiza el formulario al instante
  }

  onDelete(id: number) {
    if (!id) {
      this.mostrarError('No se puede eliminar: ID no encontrado. Revisa tu DTO.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este condómino?')) {
      this.cargando = true;
      this.cdr.detectChanges();

      this.api.eliminarCondominio(id).subscribe({
        next: () => this.mostrarExito('¡Condómino eliminado correctamente!'),
        error: () => this.mostrarError('No se pudo eliminar el condómino.')
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.selectedId = null;
    this.submitted = false;
    this.condominoForm.reset();
    this.cdr.detectChanges();
  }

  mostrarExito(msg: string) {
    this.mensajeExito = msg;
    this.resetForm();
    this.cargarDatos(); // Recarga la tabla de inmediato
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges();
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