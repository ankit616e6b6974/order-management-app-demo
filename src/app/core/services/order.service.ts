import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { OrderRes } from '../dto/order-res.dto';
import { CreateOrderReq, ProductRes } from '../dto';
import { ApiResponse } from '../common/api-response.dto';

@Injectable({providedIn: 'root'})
export class OrderService {
  private baseUrl = `${environment.apiBaseUrl}/orders`;
  private httpClient = inject(HttpClient);

  getAllOrders(): Observable<OrderRes[]> {
  
  return this.httpClient
    .get<ApiResponse<OrderRes[]>>(this.baseUrl)
    .pipe(
      //tap(raw => console.log('Raw HTTP response:', raw)),
      map(response => response.data || []),
      tap(mapped => console.log('After map:', mapped)),
      catchError(err => {
        console.error('HTTP error caught:', err);
        return of([]);
      })
    );
  }

  createOrder(order: CreateOrderReq): Observable<OrderRes> {
    return this.httpClient.
    post<ApiResponse<OrderRes>>(this.baseUrl, order)
    .pipe(map(response => response.data));;
  }

  cancelOrder(id: string | undefined): Observable<boolean> {
    return this.httpClient
    .delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`, {})
    .pipe(map(response => response.data));
    
  }

  searchByProduct(productName: string): Observable<OrderRes[]> {
    return this.httpClient
    .get<ApiResponse<OrderRes[]>>(`${this.baseUrl}`, { params: { productName } })
    .pipe(map(response => response.data));
  }

  getAllProduct(): Observable<ProductRes[]> {
    return this.httpClient
    .get<ApiResponse<ProductRes[]>>(`${this.baseUrl}/products`)
    .pipe(map(response => response.data));;
  }
}