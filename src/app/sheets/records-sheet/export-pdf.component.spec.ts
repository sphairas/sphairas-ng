import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRecordsPdfComponent } from './export-pdf.component';

describe('ExportPdfComponent', () => {
  let component: ExportRecordsPdfComponent;
  let fixture: ComponentFixture<ExportRecordsPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRecordsPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRecordsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
