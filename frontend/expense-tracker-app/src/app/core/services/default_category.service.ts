import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DefaultCategory, DefaultCategoryRequest } from '../models/default_category.model';

// All HTTP communication for defaultcategories lives here; components stay free of API details.
@Injectable({ providedIn: 'root' })
export class DefaultCategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/defaultcategories`;

  getAll(): Observable<DefaultCategory[]> {
    return this.http.get<DefaultCategory[]>(this.baseUrl);
  }  
}
