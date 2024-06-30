import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CompanyDocument} from "../models/company-document";


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http: HttpClient) {
  }

  rearrangeDocumentsAsTree(objects: CompanyDocument[]) {

    if (!objects) return [];

    const objectsMap = {};
    objects.forEach(o => {
      if (o.parent?.id) {
        let exist = objects.some(ob => ob.id === o.parent.id);
        if (!exist) {
          delete o.parent;
        }
      }
      objectsMap[o.id] = o;
    });

    objects.forEach(object => {
      if (object?.parent?.id) {
        const parent = objectsMap[object.parent.id];
        if (parent) {
          parent.children ??= [];
          parent.children.every(child => child.id != object.id) && parent.children.push(object);
          object.parent = parent;
        }
      }
    });
    return objects.filter(o => !o.parent);
  }

  calculateVatAmount(amount: number, vat: number, vatInclude: boolean): number {
    let vatAmount = 0.0;
    if (vat) {
      vatAmount = vatInclude ? amount - (amount / (1 + vat)) : amount * vat;
    }
    return vatAmount;
  }

}
