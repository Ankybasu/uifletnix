import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LogoutComponent } from './logout.component';
import { AuthService } from '../../../services/auth.service';

class MockAuthService {
  logout = jasmine.createSpy('logout'); // Spy on the logout method
}

class MockRouter {
  navigate = jasmine.createSpy('navigate'); // Spy on the navigate method
}

xdescribe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutComponent], // Import the standalone component
      providers: [
        { provide: AuthService, useClass: MockAuthService }, // Provide the mock AuthService
        { provide: Router, useClass: MockRouter }, // Provide the mock Router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.logout() on initialization', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should navigate to "/login" after logout', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
