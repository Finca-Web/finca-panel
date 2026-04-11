import { Component } from '@angular/core';
import { HeaderContentComponent } from '../../../../shared/presentation/components/header-content/header-content.component';

@Component({
  selector: 'app-properties-layout',
  standalone: true,
  imports: [HeaderContentComponent],
  templateUrl: './properties-layout.component.html',
  styleUrl: './properties-layout.component.css'
})
export class PropertiesLayoutComponent {}
