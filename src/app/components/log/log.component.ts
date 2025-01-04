import { Component, OnInit, ViewChild } from '@angular/core';
import { LogsService } from '../../services/logs.service';
import { AuthService } from '../../services/auth.service';
import { Log } from '../../models/log.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class LogComponent implements OnInit {
  @ViewChild('logModal') logModal: any;
  listadoLogs: Log[] = [];
  loading = false;
  logForm: FormGroup;
  isEditMode = false;
  currentLogId: number | null = null;

  constructor(
    private logsService: LogsService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.logForm = this.fb.group({
      log_date: ['', Validators.required],
      user_id: ['', [Validators.required, Validators.min(1)]],
      action: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarLogs();
  }

  cargarLogs() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.logsService.getLogs().subscribe({
        next: (logs) => {
          this.listadoLogs = logs;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading logs:', error);
          this.loading = false;
        }
      });
    }
  }

  createLog() {
    this.isEditMode = false;
    this.logForm.reset();
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
  }

  editLog(log: Log) {
    this.isEditMode = true;
    this.currentLogId = log.log_id;
    this.logForm.patchValue({
      log_date: this.formatDateForInput(log.log_date),
      user_id: log.user_id,
      action: log.action
    });
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  eliminarLog(id: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar este registro?')) {
        this.logsService.deleteLog(id).subscribe({
          next: () => {
            this.cargarLogs();
          },
          error: (error) => {
            console.error('Error deleting log:', error);
          }
        });
      }
    }
  }

  onSubmitLog(modal: any) {
    if (this.logForm.invalid) {
      return;
    }

    const logData: Log = this.logForm.value;

    if (this.isEditMode && this.currentLogId) {
      if (!this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar registros.');
        return;
      }
      this.logsService.updateLog(this.currentLogId, logData).subscribe({
        next: () => {
          modal.close();
          this.cargarLogs();
        },
        error: (err) => {
          console.error('Error updating log:', err);
        }
      });
    } else {
      if (!this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear registros.');
        return;
      }
      this.logsService.createLog(logData).subscribe({
        next: () => {
          modal.close();
          this.cargarLogs();
        },
        error: (err) => {
          console.error('Error creating log:', err);
        }
      });
    }
  }
}