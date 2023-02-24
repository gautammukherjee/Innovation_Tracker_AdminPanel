import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoasComponent } from './moas.component';

describe('MoasComponent', () => {
  let component: MoasComponent;
  let fixture: ComponentFixture<MoasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
