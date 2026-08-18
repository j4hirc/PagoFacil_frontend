import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ Añadido ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-bloque',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bloque.html',
  styleUrl: './bloque.css',
})
export class Bloque implements OnInit {
  bloqueForm!: FormGroup;
  bloques: any[] = [];
  editMode: boolean = false;
  selectedBloqueId: number | null = null;
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private cdr: ChangeDetectorRef // ✅ Inyectamos el detector de cambios
  ) { }

  ngOnInit(): void {
    this.bloqueForm = this.fb.group({
      numeroBloque: ['', Validators.required],
      descripcionBloque: ['', Validators.required],
      ubicacion: ['', Validators.required]
    });
    this.cargarBloques();
  }

  cargarBloques() {
    this.cargando = true;
    this.api.getBloques().subscribe({
      next: (data) => {
        this.bloques = data;
        this.cargando = false;
        this.cdr.detectChanges(); // ✅ Obliga a Angular a actualizar la tabla INMEDIATAMENTE
      },
      error: (err) => {
        console.error('Error al cargar bloques', err);
        this.mensajeError = 'No se pudo conectar con el servidor para listar los bloques.';
        this.cargando = false;
        this.cdr.detectChanges(); // ✅ Obliga a Angular a mostrar el error INMEDIATAMENTE
      }
    });
  }

  trackByBloque(index: number, bloque: any): number {
    return bloque.id;
  }

  onSubmit() {
    if (this.bloqueForm.invalid) {
      this.bloqueForm.markAllAsTouched();
      return;
    }

    const bloqueData = this.bloqueForm.value;
    this.cargando = true;
    this.cdr.detectChanges(); // ✅ Actualiza la vista para mostrar el spinner

    if (this.editMode && this.selectedBloqueId !== null) {
      this.api.actualizarBloque(this.selectedBloqueId, bloqueData).subscribe({
        next: () => {
          this.mostrarMensajeExito('¡Bloque actualizado correctamente!');
        },
        error: (err) => this.mostrarMensajeError('Error al actualizar el bloque.', err)
      });
    } else {
      this.api.registrarBloque(bloqueData).subscribe({
        next: () => {
          this.mostrarMensajeExito('¡Bloque registrado correctamente!');
        },
        error: (err) => this.mostrarMensajeError('Error al registrar el bloque.', err)
      });
    }
  }

  onEdit(bloque: any) {
    this.editMode = true;
    this.selectedBloqueId = bloque.id;
    this.bloqueForm.patchValue({
      numeroBloque: bloque.numeroBloque,
      descripcionBloque: bloque.descripcionBloque,
      ubicacion: bloque.ubicacion
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges(); // ✅ Refresca el formulario
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este bloque?')) {
      this.cargando = true;
      this.cdr.detectChanges();

      this.api.eliminarBloque(id).subscribe({
        next: () => {
          this.mostrarMensajeExito('¡Bloque eliminado correctamente!');
        },
        error: (err) => this.mostrarMensajeError('No se pudo eliminar el bloque.', err)
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.selectedBloqueId = null;
    this.bloqueForm.reset();
    this.cdr.detectChanges();
  }

  private mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    this.resetForm();
    this.cargarBloques();
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges(); // ✅ Limpia el mensaje sin necesidad de clics
    }, 4000);
  }

  private mostrarMensajeError(mensaje: string, err: any) {
    console.error(mensaje, err);
    this.mensajeError = mensaje;
    this.cargando = false;
    this.cdr.detectChanges(); // ✅ Muestra el error al instante
    setTimeout(() => {
      this.mensajeError = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}