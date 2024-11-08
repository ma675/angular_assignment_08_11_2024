import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeserviceService {

  constructor(private http: HttpClient) { }


  // for getting all Product details
  public getProductDetailsList() {
    return this.http.get<any>("http://localhost:5200/data")
      .pipe(map((res: any) => {
        return res;
      }))
  }

  // for get Product details by id
  public getProductDetailsById(id: any) {
    return this.http.get<any>("http://localhost:5200/data/" + id)
  }

  // for adding Product details
  public addProductDetails(data: any) {
    return this.http.post<any>("http://localhost:5200/data", data)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  // for update Product detail
  public updateProductDetails(id: any, data: any) {
    return this.http.put<any>("http://localhost:5200/data/" + id, data)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  // for delete Product detail
  public deleteProductDetails(id: any) {
    return this.http.delete<any>("http://localhost:5200/data/" + id)
      .pipe(map((res: any) => {
        return res;
      }))
  }


}
