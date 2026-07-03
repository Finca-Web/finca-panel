import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HeaderContentComponent } from '../../../../shared/presentation/components/header-content/header-content.component';
import { PropertyEntity } from '../../../domain/model/Property.entity';
import { PropertiesService } from '../../../application/properties.service';
import { NewPropertyDialogComponent } from '../new-property-dialog/new-property-dialog.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-properties-layout',
  standalone: true,
  imports: [
    HeaderContentComponent,
    CurrencyPipe,
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
  deleteErrorMessage = '';
  deletingPropertyId: number | null = null;
  pageIndex = 0;
  pageSize = 20;
  totalElements = 0;

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly dialog: MatDialog
  ) {}

  openNewRecordDialog(): void {
    this.openPropertyDialog();
  }

  openEditRecordDialog(property: PropertyEntity): void {
    this.openPropertyDialog(property);
  }

  readonly editProperty = (property: PropertyEntity): void => {
    this.openPropertyDialog(property);
  };

  private openPropertyDialog(property?: PropertyEntity): void {
    const dialogRef = this.dialog.open(NewPropertyDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      minHeight: '420px',
      autoFocus: false,
      disableClose: true,
      panelClass: 'new-property-dialog-panel',
      backdropClass: 'new-property-dialog-backdrop',
      data: property ? { mode: 'edit', property } : { mode: 'create' }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.componentInstance?.close();
    });

    dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        dialogRef.componentInstance?.close();
      }
    });

    dialogRef.afterClosed().subscribe((result?: { created?: boolean; updated?: boolean }) => {
      if (result?.created || result?.updated) {
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
    this.deleteErrorMessage = '';

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

  onDeleteProperty(property: PropertyEntity): void {
    if (this.deletingPropertyId !== null) {
      return;
    }

    const confirmed = window.confirm(`Seguro que deseas eliminar la propiedad "${property.title}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingPropertyId = property.id;
    this.deleteErrorMessage = '';

    this.propertiesService.deleteById(property.id).subscribe({
      next: () => {
        const targetPage = this.properties.length === 1 && this.pageIndex > 0
          ? this.pageIndex - 1
          : this.pageIndex;

        this.deletingPropertyId = null;
        this.loadProperties(targetPage, this.pageSize);
      },
      error: (error: Error) => {
        this.deletingPropertyId = null;
        this.deleteErrorMessage = error.message;
      }
    });
  }

  getCoverImage(property: PropertyEntity): string {
    const cover = property.images.find((image) => image.cover);
    const rawPath = cover?.filePath ?? property.images[0]?.filePath;
    return this.resolveImageUrl(rawPath);
  }

  private resolveImageUrl(rawPath?: string): string {
    const fallback = 'https://via.placeholder.com/640x360?text=Sin+imagen';
    if (!rawPath) {
      return fallback;
    }

    const normalizedPath = rawPath.replace(/\\/g, '/').trim();
    if (!normalizedPath) {
      return fallback;
    }

    if (/^(https?:|data:|blob:)/i.test(normalizedPath)) {
      return normalizedPath;
    }

    if (normalizedPath.startsWith('pending-upload/')) {
      return fallback;
    }

    const apiBase = environment.serverBasePath;
    const serverOrigin = apiBase.replace(/\/api\/v\d+$/i, '');
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${serverOrigin}${cleanPath}`;
  }
}

