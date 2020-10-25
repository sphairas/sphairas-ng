import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSheetComponent } from './exam-sheet.component';

describe('ExamSheetComponent', () => {
  let component: ExamSheetComponent;
  let fixture: ComponentFixture<ExamSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
