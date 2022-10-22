import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTpoComponent } from './admin-tpo.component';

describe('AdminTpoComponent', () => {
  let component: AdminTpoComponent;
  let fixture: ComponentFixture<AdminTpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
