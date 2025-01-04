
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../models/log.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrl = 'https://logs-behm-api.onrender.com/api/v1/logs';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }
  

  getLog(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  createLog(log: Log): Observable<Log> {
    return this.http.post<Log>(this.apiUrl, log, { headers: this.authService.getAuthHeaders() });
  }

  updateLog(id: number, log: Log): Observable<Log> {
    return this.http.put<Log>(`${this.apiUrl}/${id}`, log, { headers: this.authService.getAuthHeaders() });
  }

  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}