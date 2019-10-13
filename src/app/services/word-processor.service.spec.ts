import { TestBed } from '@angular/core/testing';

import { WordProcessorService } from './word-processor.service';

describe('WordProcessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WordProcessorService = TestBed.get(WordProcessorService);
    expect(service).toBeTruthy();
  });
});
