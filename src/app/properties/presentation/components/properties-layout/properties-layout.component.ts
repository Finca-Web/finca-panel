import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HeaderContentComponent } from '../../../../shared/presentation/components/header-content/header-content.component';
import { PropertyEntity } from '../../../domain/model/Property.entity';
import { PropertiesService } from '../../../application/properties.service';
import { NewPropertyDialogComponent } from '../new-property-dialog/new-property-dialog.component';

@Component({
  selector: 'app-properties-layout',
  standalone: true,
  imports: [
    HeaderContentComponent,
    CurrencyPipe,
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './properties-layout.component.html',
  styleUrl: './properties-layout.component.css'
})
export class PropertiesLayoutComponent implements OnInit {
  properties: PropertyEntity[] = [];
  isLoading = false;
  errorMessage = '';
  pageIndex = 0;
  pageSize = 20;
  totalElements = 0;

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly dialog: MatDialog
  ) {}

  openNewRecordDialog(): void {
    const dialogRef = this.dialog.open(NewPropertyDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      minHeight: '420px',
      autoFocus: false,
      disableClose: true,
      panelClass: 'new-property-dialog-panel',
      backdropClass: 'new-property-dialog-backdrop'
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.componentInstance?.close();
    });

    dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        dialogRef.componentInstance?.close();
      }
    });

    dialogRef.afterClosed().subscribe((result?: { created: boolean }) => {
      if (result?.created) {
        this.loadProperties(this.pageIndex, this.pageSize);
      }
    });
  }

  ngOnInit(): void {
    this.loadProperties(this.pageIndex, this.pageSize);
  }

  loadProperties(page = 0, size = this.pageSize): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.propertiesService.getPaged(page, size).subscribe({
      next: (page) => {
        this.properties = page.data;
        this.pageIndex = page.page;
        this.pageSize = page.size;
        this.totalElements = page.totalElements;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadProperties(event.pageIndex, event.pageSize);
  }

  getCoverImage(property: PropertyEntity): string {
    const cover = property.images.find((image) => image.cover);
    return cover?.filePath ?? property.images[0]?.filePath ?? 'https://via.placeholder.com/640x360?text=Sin+imagen';
  }
}

