import { DisplayGradePipe } from './display-grade.pipe';
import { ConventionsService } from '../conventions.service';
import { TestBed } from '@angular/core/testing';

describe('DisplayGradePipe', () => {
  let service: ConventionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConventionsService);
  });

  it('create an instance', () => {
    const pipe = new DisplayGradePipe(service);
    expect(pipe).toBeTruthy();
  });
});
