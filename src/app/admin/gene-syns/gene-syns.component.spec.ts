import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneSynsComponent } from './gene-syns.component';

describe('GeneSynsComponent', () => {
  let component: GeneSynsComponent;
  let fixture: ComponentFixture<GeneSynsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneSynsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneSynsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
