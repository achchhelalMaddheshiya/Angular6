import { TestBed, inject } from '@angular/core/testing';

import { FamilyMemberService } from './family-member.service';

describe('FamilyMemberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FamilyMemberService]
    });
  });

  it('should be created', inject([FamilyMemberService], (service: FamilyMemberService) => {
    expect(service).toBeTruthy();
  }));
});
