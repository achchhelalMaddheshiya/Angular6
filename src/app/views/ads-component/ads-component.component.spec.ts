import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsComponentComponent } from './ads-component.component';

describe('AdsComponentComponent', () => {
  let component: AdsComponentComponent;
  let fixture: ComponentFixture<AdsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
