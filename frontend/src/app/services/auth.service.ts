import {inject, Injectable} from '@angular/core';
import {HttpHandlerFn, HttpRequest} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly token:string = "8tb0439tovnl72if7d1ui6j9tgrglm8aqn4i6qutrqd5b74k71v9";

  constructor() { }

  getAuthToken():string {
    return this.token;
  }
}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers:req.headers.append('ZakupayToken', authToken),
    });
  return next(newReq);
}

