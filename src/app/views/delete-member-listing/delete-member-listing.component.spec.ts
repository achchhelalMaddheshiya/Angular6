import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemberListingComponent } from './delete-member-listing.component';

describe('DeleteMemberListingComponent', () => {
  let component: DeleteMemberListingComponent;
  let fixture: ComponentFixture<DeleteMemberListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMemberListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemberListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
