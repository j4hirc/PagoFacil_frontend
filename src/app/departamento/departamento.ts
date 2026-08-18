import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ Añadido ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { forkJoin } from 'rxjs'; // ✅ Importado forkJoin

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departamento.html',
  styleUrl: './departamento.css',
})
export class Departamento implements OnInit {
  departamentoForm!: FormGroup;
  departamentos: any[] = [];
  bloques: any[] = [];
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
    this.departamentoForm = this.fb.group({
      numeroDepartamento: ['', Validators.required],
      descripcionDepartamento: ['', Validators.required],
      bloqueId: ['', Validators.required]
    });
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    // ✅ OPTIMIZACIÓN: Carga Bloques y Departamentos al mismo tiempo
    forkJoin({
      bloq: this.api.getBloques(),
      deptos: this.api.getDepartamentos()
    }).subscribe({
      next: (resultados) => {
        this.bloques = resultados.bloq;
        this.departamentos = resultados.deptos;
        this.cargando = false;
        this.cdr.detectChanges(); // ✅ Le decimos a Angular que pinte la tabla YA
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.mensajeError = 'No se pudo conectar con el servidor para listar los datos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackByDepartamento(index: number, d: any): number {
    return d.id;
  }

  onSubmit() {
    this.submitted = true;
    if (this.departamentoForm.invalid) {
      this.departamentoForm.markAllAsTouched();
      return;
    }

    const data = this.departamentoForm.value;

    // Convertimos a número por si el select manda un string
    if (data.bloqueId !== null && data.bloqueId !== '') {
      data.bloqueId = Number(data.bloqueId);
    }

    this.cargando = true;
    this.cdr.detectChanges(); // ✅ Activamos el spinner al hacer clic en guardar

    if (this.editMode && this.selectedId !== null) {
      this.api.actualizarDepartamento(this.selectedId, data).subscribe({
        next: () => this.mostrarExito('¡Departamento actualizado correctamente!'),
        error: () => this.mostrarError('Error al actualizar el departamento.')
      });
    } else {
      this.api.registrarDepartamento(data).subscribe({
        next: () => this.mostrarExito('¡Departamento registrado correctamente!'),
        error: () => this.mostrarError('Error al registrar el departamento.')
      });
    }
  }

  onEdit(d: any) {
    this.editMode = true;
    this.selectedId = d.id;
    this.departamentoForm.patchValue({
      numeroDepartamento: d.numeroDepartamento,
      descripcionDepartamento: d.descripcionDepartamento,
      bloqueId: d.bloqueId || (d.bloque ? d.bloque.id : '')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges(); // ✅ Refresca el formulario de inmediato
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      this.cargando = true;
      this.cdr.detectChanges();

      this.api.eliminarDepartamento(id).subscribe({
        next: () => this.mostrarExito('¡Departamento eliminado correctamente!'),
        error: () => this.mostrarError('No se pudo eliminar el departamento.')
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.selectedId = null;
    this.submitted = false;
    this.departamentoForm.reset();
    this.cdr.detectChanges();
  }

  mostrarExito(msg: string) {
    this.mensajeExito = msg;
    this.resetForm();
    this.cargarDatos(); // Actualiza la tabla de fondo
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