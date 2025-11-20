import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { NgIf } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-incident-info-dialog',
  standalone: true,
  imports: [TagModule,DividerModule,ImageModule,ButtonModule],
  templateUrl: './incident-info-dialog.component.html',
  styleUrl: './incident-info-dialog.component.css'
})
export class IncidentInfoDialogComponent {

}
