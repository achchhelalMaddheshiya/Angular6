import { TestBed, inject } from '@angular/core/testing';

import { NomineeService } from './nominee.service';

describe('NomineeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NomineeService]
    });
  });

  it('should be created', inject([NomineeService], (service: NomineeService) => {
    expect(service).toBeTruthy();
  }));
});
