import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {PropertyEntity} from '../domain/model/Property.entity';
import {
  CreatePropertyRequest,
  ImageUploadResource,
  PropertyResource,
  PropertiesResponse,
  PropertySearchParams
} from './properties-response';
import {PropertiesAssembler} from './properties-assembler';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

export interface PropertiesPage {
  data: PropertyEntity[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  sort: string;
}

@Injectable({ providedIn: 'root' })
export class PropertiesApiEndpoint extends BaseApiEndpoint<PropertyEntity, PropertyResource, PropertiesResponse, PropertiesAssembler>{

  constructor(http: HttpClient) {
    super(http, `${environment.serverBasePath}${environment.propertiesEndpointPath}`,
      new PropertiesAssembler());
  }

  getAllPaged(page = 0, size = 20, sort = 'id,desc'): Observable<PropertiesPage> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', sort);

    return this.http.get<PropertiesResponse>(this.endpointUrl, { params }).pipe(
      map((response) => ({
        data: this.assembler.toEntitiesFromResponse(response),
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
        sort: response.sort
      })),
      catchError(this.handleError('Failed to fetch paged properties'))
    );
  }

  getFeatured(): Observable<PropertyEntity[]> {
    return this.http.get<PropertyResource[]>(`${this.endpointUrl}/featured`).pipe(
      map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to fetch featured properties'))
    );
  }

  search(params: PropertySearchParams): Observable<PropertyEntity[]> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          httpParams = httpParams.append(key, String(item));
        });
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return this.http.get<PropertyResource[]>(`${this.endpointUrl}/search`, { params: httpParams }).pipe(
      map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to search properties'))
    );
  }

  uploadImages(propertyId: number, files: File[]): Observable<ImageUploadResource[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));

    return this.http.post<ImageUploadResource[]>(`${this.endpointUrl}/${propertyId}/images`, formData).pipe(
      catchError(this.handleError('Failed to upload property images'))
    );
  }

  createProperty(request: CreatePropertyRequest): Observable<PropertyEntity> {
    return this.http.post<PropertyResource>(this.endpointUrl, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to create property'))
    );
  }

}
