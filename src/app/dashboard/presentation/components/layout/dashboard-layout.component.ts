import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderContentComponent } from '../../../../shared/presentation/components/header-content/header-content.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'dashboard-layout',
  standalone: true,
  imports: [HeaderContentComponent, MatIcon, RouterLink],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  selectedAction: 'properties' | 'consultas' | null = null;

  toggleAction(action: 'properties' | 'consultas'): void {
    this.selectedAction = this.selectedAction === action ? null : action;
  }
}
