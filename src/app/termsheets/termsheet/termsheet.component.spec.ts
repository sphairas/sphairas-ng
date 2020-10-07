import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsheetComponent } from './termsheet.component';

describe('TermsheetComponent', () => {
  let component: TermsheetComponent;
  let fixture: ComponentFixture<TermsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
