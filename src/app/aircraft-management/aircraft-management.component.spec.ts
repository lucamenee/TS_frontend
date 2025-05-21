import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftManagementComponent } from './aircraft-management.component';

describe('AircraftManagementComponent', () => {
  let component: AircraftManagementComponent;
  let fixture: ComponentFixture<AircraftManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AircraftManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AircraftManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
