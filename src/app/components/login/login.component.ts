/*import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
*/

/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService  // Cambiado a authService (minúscula)
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const success = this.authService.login(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Invalid username or password';
    }
  }
}
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }
  /*
    onSubmit() {
      this.submitted = true;
  
      if (this.loginForm.invalid) {
        return;
      }
  
      this.authService.login(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value
      ).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 401) {
            this.error = 'Usuario o contraseña inválidos.';
          } else {
            this.error = 'Error inesperado. Intente nuevamente.';
          }
        }
      });
    }
  */



    onSubmit() {
      this.submitted = true;
  
      if (this.loginForm.invalid) {
          return;
      }
  
      this.authService.login(
          this.loginForm.get('username')?.value,
          this.loginForm.get('password')?.value
      ).subscribe({
          next: () => {
              this.router.navigate(['/']);
          },
          error: (err) => {
              console.error('Error en la solicitud:', err); // Log para debugging
              if (err.status === 401) {
                  this.error = 'Usuario o contraseña inválidos.';
              } else if (err.status === 403) {
                  this.error = 'No tienes permiso para acceder.';
              } else {
                  this.error = 'Error inesperado. Intente nuevamente.';
              }
          }
      });
  }
  

}