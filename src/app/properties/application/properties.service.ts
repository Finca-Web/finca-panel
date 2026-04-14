import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PropertyEntity} from '../domain/model/Property.entity';
import {
  ImageUploadResource,
  PropertySearchParams
} from '../infrastructure/properties-response';
import {PropertiesApiEndpoint, PropertiesPage} from '../infrastructure/properties-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  constructor(private readonly propertiesApiEndpoint: PropertiesApiEndpoint) {}

  getPaged(page = 0, size = 20, sort = 'id,desc'): Observable<PropertiesPage> {
    return this.propertiesApiEndpoint.getAllPaged(page, size, sort);
  }

  getById(id: number): Observable<PropertyEntity> {
    return this.propertiesApiEndpoint.getById(id);
  }

  getFeatured(): Observable<PropertyEntity[]> {
    return this.propertiesApiEndpoint.getFeatured();
  }

  search(filters: PropertySearchParams): Observable<PropertyEntity[]> {
    return this.propertiesApiEndpoint.search(filters);
  }

  uploadImages(propertyId: number, files: File[]): Observable<ImageUploadResource[]> {
    return this.propertiesApiEndpoint.uploadImages(propertyId, files);
  }
}

