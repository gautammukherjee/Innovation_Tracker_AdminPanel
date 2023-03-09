import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSynsComponent } from './drug-syns.component';

describe('DrugSynsComponent', () => {
  let component: DrugSynsComponent;
  let fixture: ComponentFixture<DrugSynsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugSynsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugSynsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
