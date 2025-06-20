import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineComponent } from './airline.component';

describe('AirlineComponent', () => {
  let component: AirlineComponent;
  let fixture: ComponentFixture<AirlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
