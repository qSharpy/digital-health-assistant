import { TestBed } from '@angular/core/testing';

import { WebCallService } from './web-call.service';

describe('WebCallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebCallService = TestBed.get(WebCallService);
    expect(service).toBeTruthy();
  });
});
