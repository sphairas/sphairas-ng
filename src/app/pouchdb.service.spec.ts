import { TestBed } from '@angular/core/testing';

import { PouchDBService } from './pouchdb.service';

describe('TimesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PouchDBService = TestBed.get(PouchDBService);
    expect(service).toBeTruthy();
  });
});
