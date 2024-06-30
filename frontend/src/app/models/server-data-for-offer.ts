
import {FormGroup} from "@angular/forms";
import {Supplier} from "./supplier";
import {Account} from "./account";
import {CompanyDocument} from "./company-document";
import {OfferFile} from "./offer-file";
import {OrderItem} from "./order-item";

export class ServerDataForOffer {
  items: Supplier[];
  accounts: Account[];
  documents: CompanyDocument[];
  result: boolean;
}


export class OuterOfferCreateModel {
  bankGuarantee: boolean;
  companyDocumentId: number;
  delay: boolean;
  deliveryIncluded: boolean;
  documentId: number;
  orderItems: OrderItem[];
  filesForChat: any[];
  fillInClient: boolean;
  comment: string;
  orderId: number;
  orderItemIds: number[];
  prepaidPercent: number;
  recognizedBik: any;
  recognizedCurrentAccount: any;
  validityPeriod: number;
  withoutVAT: any;
  accountId: Account;
  brandId: any;
  code: null;
  offerViewModel: null;
  transactCheckbox: boolean;

  constructor() {
  }

  public static createFromForms(formgroup:FormGroup,
                                fileId: number,
                                items: OrderItem[],
                                orderId: number): OuterOfferCreateModel {
    const outerModel: OuterOfferCreateModel = new OuterOfferCreateModel();
    const ctrls = formgroup.controls;
    outerModel.bankGuarantee = ctrls['bankGuarantee']?.value || null;
    outerModel.accountId = new Account(ctrls['payer'].value.id);
    outerModel.brandId = null;
    outerModel.code = null;
    outerModel.comment = ctrls['comment'].value;
    outerModel.companyDocumentId = ctrls['companyDocument'].value?.id;
    outerModel.delay = ctrls['delay'].value;
    outerModel.deliveryIncluded = ctrls['deliveryIncluded'].value;
    outerModel.documentId = fileId;
    outerModel.fillInClient = false;
    outerModel.orderItems = items;
    outerModel.filesForChat = [];
    outerModel.offerViewModel = null;
    outerModel.orderId = orderId;
    outerModel.orderItemIds = items.map(oi => oi.id);
    outerModel.orderItems = items
    outerModel.prepaidPercent = ctrls['prepaidPercent'].value;
    outerModel.validityPeriod = ctrls['validityPeriod'].value || 0;
    outerModel.transactCheckbox = false;
    outerModel.recognizedBik = null;
    outerModel.recognizedCurrentAccount = null;
    outerModel.withoutVAT = null;
    return outerModel;
  }
}
