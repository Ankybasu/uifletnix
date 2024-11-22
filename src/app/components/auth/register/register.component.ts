import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports:[ReactiveFormsModule,FormsModule,CommonModule],
  standalone:true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{12,}$/),
        ],
      ],
      age: ['', [Validators.required, Validators.min(1)]],
    });
    
  }

  register() {
    if (this.registerForm.valid) {
      const { email, password, age } = this.registerForm.value;
      this.authService.register(email, password, age).subscribe(
        () => {
          localStorage.setItem('userAge',age);
          this.successMessage = 'Registration successful!';
          this.router.navigate(['/login']);
        },
        (error) => {
          this.errorMessage = error.error.message || 'Registration failed';
        }
      );
    }
  }
}
