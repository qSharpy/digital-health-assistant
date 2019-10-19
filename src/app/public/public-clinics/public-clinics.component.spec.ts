import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicClinicsComponent } from './public-clinics.component';

describe('PublicClinicsComponent', () => {
  let component: PublicClinicsComponent;
  let fixture: ComponentFixture<PublicClinicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicClinicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
