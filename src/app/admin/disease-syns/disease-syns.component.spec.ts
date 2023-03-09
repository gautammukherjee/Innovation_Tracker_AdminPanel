import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseSynsComponent } from './disease-syns.component';

describe('DiseaseSynsComponent', () => {
  let component: DiseaseSynsComponent;
  let fixture: ComponentFixture<DiseaseSynsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseSynsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseSynsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
