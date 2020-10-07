import { TestBed } from '@angular/core/testing';

import { ConventionsService } from './conventions.service';

describe('ConventionsService', () => {
  let service: ConventionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConventionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
