import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermSheetComponent } from './term-sheet.component';

describe('TermSheetComponent', () => {
  let component: TermSheetComponent;
  let fixture: ComponentFixture<TermSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
