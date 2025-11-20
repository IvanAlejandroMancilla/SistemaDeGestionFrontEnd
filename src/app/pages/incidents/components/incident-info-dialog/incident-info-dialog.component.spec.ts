import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInfoDialogComponent } from './incident-info-dialog.component';

describe('IncidentInfoDialogComponent', () => {
  let component: IncidentInfoDialogComponent;
  let fixture: ComponentFixture<IncidentInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
