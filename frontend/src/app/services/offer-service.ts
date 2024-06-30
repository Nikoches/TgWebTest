import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OfferDataForServer, ServerDataForOffer} from "../models/server-data-for-offer";

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) {
  }

  public getSuppliers(param?: string): Observable<Partial<ServerDataForOffer>> {
    return this.http.get<Partial<ServerDataForOffer>>(`/core/offerrequest/emailac?q=${param ??= ''}`);
  }

  public getPayers(): Observable<Partial<ServerDataForOffer>> {
    return this.http.get<Partial<ServerDataForOffer>>(`/api/v1/util/company/accounts`);
  }

  public getCompanyDocuments(param: string): Observable<Partial<ServerDataForOffer>> {
    return this.http.get<Partial<ServerDataForOffer>>(`/core/offer/company-documents?companyInn=${param}`);
  }

  public sendToProcess(data: OfferDataForServer, id: number): Observable<Partial<ServerDataForOffer>> {
    return this.http.post(`/core/orders/${id}/send/to/offer/process`, data);
  }

  public sendRecognizeRequest(id: number): Observable<Partial<ServerDataForOffer>> {
    return this.http.get<Partial<ServerDataForOffer>>(`/core/files/recognize/${id}?counter=1`);
  }

  public sendCheckDuplicatesRequest(id: number): Observable<Partial<ServerDataForOffer>> {
    return this.http.get(`/core/offers/${id}/checkOfferFileDuplicates`);
  }

  public uploadFile(formData: FormData): Observable<any> {
    return this.http.post('/core/orders/upload?checkFormat=true', formData);
  }
}
