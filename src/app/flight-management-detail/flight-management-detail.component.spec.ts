import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightManagementDetailComponent } from './flight-management-detail.component';

describe('FlightManagementDetailComponent', () => {
  let component: FlightManagementDetailComponent;
  let fixture: ComponentFixture<FlightManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightManagementDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
