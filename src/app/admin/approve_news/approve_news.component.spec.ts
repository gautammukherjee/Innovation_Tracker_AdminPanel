import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNewsComponent } from './approve_news.component';

describe('ApproveNewsComponent', () => {
  let component: ApproveNewsComponent;
  let fixture: ComponentFixture<ApproveNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveNewsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApproveNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
