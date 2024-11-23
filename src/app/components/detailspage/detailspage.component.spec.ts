import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DetailspageComponent } from './detailspage.component';
import { DataService } from '../../services/data.service';
import { CacheService } from '../../services/cache.service';

class MockDataService {
  getShowDetails(showId: string) {
    if (showId === 'valid-id') {
      return of({ id: 'valid-id', title: 'Test Show', description: 'Test description' });
    }
    return throwError('Error fetching item details');
  }
}

class MockCacheService {
  getData() {
    return [{ id: '1', title: 'Show 1' }, { id: '2', title: 'Show 2' }];
  }
}

xdescribe('DetailspageComponent', () => {
  let component: DetailspageComponent;
  let fixture: ComponentFixture<DetailspageComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailspageComponent], // Standalone component
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: CacheService, useClass: MockCacheService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'show_id' ? 'valid-id' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailspageComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch show details on valid show ID', () => {
    spyOn(dataService, 'getShowDetails').and.callThrough();
    component.ngOnInit();

    expect(dataService.getShowDetails).toHaveBeenCalledWith('valid-id');
    expect(component.itemDetails).toEqual({
      id: 'valid-id',
      title: 'Test Show',
      description: 'Test description',
    });
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should handle errors when fetching show details fails', () => {
    spyOn(dataService, 'getShowDetails').and.returnValue(throwError('Error fetching item details'));
    component.ngOnInit();

    expect(component.itemDetails).toBeUndefined();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Error fetching item details');
  });

  it('should populate shows from cache service', () => {
    const cacheService = TestBed.inject(CacheService);
    spyOn(cacheService, 'getData').and.callThrough();
    component.ngOnInit();

    expect(cacheService.getData).toHaveBeenCalled();
    expect(component.shows).toEqual([
      { id: '1', title: 'Show 1' },
      { id: '2', title: 'Show 2' },
    ]);
  });

  it('should toggle `hide` state using emitToggle method', () => {
    component.emitToggle(true);
    expect(component.hide).toBeTrue();

    component.emitToggle(false);
    expect(component.hide).toBeFalse();
  });
});
