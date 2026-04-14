import { Component, OnInit } from '@angular/core';
import { HeaderContentComponent } from '../../../../shared/presentation/components/header-content/header-content.component';
import { PropertyEntity } from '../../../domain/model/Property.entity';
import { PropertiesService } from '../../../application/properties.service';

@Component({
  selector: 'app-properties-layout',
  standalone: true,
  imports: [HeaderContentComponent],
  templateUrl: './properties-layout.component.html',
  styleUrl: './properties-layout.component.css'
})
export class PropertiesLayoutComponent implements OnInit {
  properties: PropertyEntity[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private readonly propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.propertiesService.getPaged().subscribe({
      next: (page) => {
        this.properties = page.data;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}

