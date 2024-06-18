import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DTOProduct } from '../DTO/dto';

@Injectable({
  providedIn: 'root'
})
export class BkapiService {

  private shopUrl = 'https://4jjl5xvc-5000.asse.devtunnels.ms/';

  constructor(private http: HttpClient) {}
  //#region product
  // API lấy tất cả các sản phẩm
  GetListProduct(page?: number, pageSize?: number, sort?: string) {
    let a = {
      page: page,
      pageSize: pageSize,
      sort: sort,
    };

    return new Observable<any>((obs) => {
      this.http.post(this.shopUrl, a).subscribe(
        (res) => {
          obs.next(res);
          obs.complete();
        },
        (error) => {
          obs.error(error);
          obs.complete();
        }
      );
    });
  }

  GetProductBycatagoertID(cata:string): Observable<DTOProduct[]>{
    let body = {
      CatalogId: cata
    };
    return this.http.post<DTOProduct[]>(`${this.shopUrl}/GetProductBycatagoertID`, body)
      .pipe(
        map((res: DTOProduct[]) => {
          return res;
        }),
        catchError((error) => {
          console.log('API Error:', error);
          return throwError('Something went wrong; please try again later.');
        })
      );
  }

  loadProducts(): Observable<DTOProduct[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer token' // Nếu không cần thiết, hãy xóa các header không cần thiết
    });

    return this.http.get<DTOProduct[]>(`${this.shopUrl}/products`, { headers }).pipe(
      map((res: DTOProduct[]) => res), 
      catchError((error) => {
        console.error('Error fetching products:', error);
        throw 'Error fetching products'; 
      })
    );
  }

  GetProduct(name: string): Observable<DTOProduct> {
    let body = {
      name: name
    };
    return this.http.post<DTOProduct>(`${this.shopUrl}/getProductByName`, body);
  }

}
