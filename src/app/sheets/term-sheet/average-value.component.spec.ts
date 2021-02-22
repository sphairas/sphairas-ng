import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageValueComponent } from './average-value.component';

describe('FunctionValueComponent', () => {
  let component: AverageValueComponent;
  let fixture: ComponentFixture<AverageValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AverageValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
