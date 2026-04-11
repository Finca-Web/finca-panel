import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './shared/presentation/components/layout/layout.component';
import { routeTransition } from './shared/presentation/animations/route-transition.animation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeTransition]
})
export class AppComponent {
  title = 'finca-frontend';

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['animation'] ?? 'default';
  }
}
