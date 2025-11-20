import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-incident-edit-dialog',
  standalone: true,
  imports: [TagModule,DividerModule,ImageModule,ButtonModule],
  templateUrl: './incident-edit-dialog.component.html',
  styleUrl: './incident-edit-dialog.component.css'
})
export class IncidentEditDialogComponent {

}
