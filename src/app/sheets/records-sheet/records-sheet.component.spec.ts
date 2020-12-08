import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsSheetComponent } from './records-sheet.component';

describe('RecordsSheetComponent', () => {
  let component: RecordsSheetComponent;
  let fixture: ComponentFixture<RecordsSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordsSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
