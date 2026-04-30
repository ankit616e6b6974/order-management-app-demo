import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomerRes } from '../dto/customer-res.dto';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../common/api-response.dto';

@Injectable({providedIn: 'root'})
export class CustomerService {
  private baseUrl = `${environment.apiBaseUrl}/customers`;
  private httpClient = inject(HttpClient);

  getAllCustomers(): Observable<CustomerRes[]> {
    console.log("Get all customer search");
    return this.httpClient
    .get<ApiResponse<CustomerRes[]>>(this.baseUrl)
    .pipe(
      map(response => response.data || []),
      catchError(err => {
        console.error('getTopCustomers error:', err);
        return of([]);
      })
    );
  }

  getTopCustomers(): Observable<CustomerRes[]> {
    console.log("Top customer search");
    return this.httpClient
    .get<ApiResponse<CustomerRes[]>>(`${this.baseUrl}/top`)
    .pipe(map(response => response.data));
  }

  getCustomerById(id: number): Observable<CustomerRes> {
    return this.httpClient
    .get<ApiResponse<CustomerRes>>(`${this.baseUrl}/${id}`)
    .pipe(map(response => response.data));
  }
  
}