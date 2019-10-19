import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureClinicsComponent } from './secure-clinics.component';

describe('SecureClinicsComponent', () => {
  let component: SecureClinicsComponent;
  let fixture: ComponentFixture<SecureClinicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureClinicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
