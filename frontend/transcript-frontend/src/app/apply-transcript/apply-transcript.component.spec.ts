import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyTranscriptComponent } from './apply-transcript.component';

describe('ApplyTranscriptComponent', () => {
  let component: ApplyTranscriptComponent;
  let fixture: ComponentFixture<ApplyTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyTranscriptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
