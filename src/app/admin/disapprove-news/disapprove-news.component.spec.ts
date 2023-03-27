import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisapproveNewsComponent } from './disapprove-news.component';

describe('DisapproveNewsComponent', () => {
  let component: DisapproveNewsComponent;
  let fixture: ComponentFixture<DisapproveNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisapproveNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisapproveNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
