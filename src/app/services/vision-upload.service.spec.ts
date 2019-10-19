import { TestBed } from '@angular/core/testing';

import { VisionUploadService } from './vision-upload.service';

describe('VisionUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisionUploadService = TestBed.get(VisionUploadService);
    expect(service).toBeTruthy();
  });
});
