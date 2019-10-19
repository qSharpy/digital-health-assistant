import { TestBed } from '@angular/core/testing';

import { AppointmantsService } from './appointmants.service';

describe('AppointmantsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmantsService = TestBed.get(AppointmantsService);
    expect(service).toBeTruthy();
  });
});
