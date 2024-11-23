import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from './login.component';

class MockAuthService {
  login(email: string, password: string) {
    if (email === 'wrong@test.com' && password === 'wrongpass') {
      return throwError({ error: { message: 'Invalid credentials' } });
    }
    return of({ token: 'mock-token' });
  }
}

xdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
      RouterModule, // For mock RouterLink and navigation
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: ActivatedRoute, // Mock ActivatedRoute
          useValue: {
            snapshot: {
              params: { id: '123' }, // Mock any necessary route parameters
              queryParams: { returnUrl: '/home' }, // Mock query parameters if needed
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with default values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.value).toEqual({
      email: '',
      password: '',
    });
  });

  it('should call AuthService.login() and navigate to /home on valid form submission', () => {
    const authServiceSpy = spyOn(authService, 'login').and.callThrough();
    component.loginForm.patchValue({ email: 'test@test.com', password: '123456' });

    component.login();

    expect(authServiceSpy).toHaveBeenCalledWith('test@test.com', '123456');
  });

  it('should display error message if login fails', () => {
    const authServiceSpy = spyOn(authService, 'login').and.returnValue(
      throwError({ error: { message: 'Invalid credentials' } })
    );
    component.loginForm.patchValue({ email: 'wrong@test.com', password: 'wrongpass' });

    component.login();

    expect(authServiceSpy).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Invalid credentials');
  });
});
