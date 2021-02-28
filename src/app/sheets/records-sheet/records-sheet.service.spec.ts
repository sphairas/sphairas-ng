import { TestBed } from '@angular/core/testing';

import { RecordsSheetService as RecordsSheetService } from './records-sheet.service';

describe('RecordsSheetService', () => {
  let service: RecordsSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordsSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  }); 
});
