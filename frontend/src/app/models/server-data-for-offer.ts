import {FormGroup} from "@angular/forms";
import {IdNameEntity} from "./id-name-entity";
import {Account, Supplier} from "./account";
import {CompanyDocument} from "./company-document";
import {OrderItem} from "./order-item";

export class ServerDataForOffer {
  items: Supplier[];
  accounts: Account[];
  documents: CompanyDocument[];
  result: boolean;
}

export class OfferDataForServer {
  acceptanceOnReady: boolean
  email: string;
  file: IdNameEntity;
  sourceAccount: Account;
  outerOfferCreateModel: OuterOfferCreateModel;

  constructor(acceptanceOnReady: boolean, email: string, file: IdNameEntity, sourceAccount: Account, outerOfferCreateModel: OuterOfferCreateModel) {
    this.acceptanceOnReady = acceptanceOnReady;
    this.email = email;
    this.file = file;
    this.sourceAccount = sourceAccount;
    this.outerOfferCreateModel = outerOfferCreateModel;
  }
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
  operatorComment: string;
  comment: string;
  fromCyntekaMobile: boolean;
  orderId: number;
  orderItemIds: number[];
  prepaidPercent: number;
  recognizedBik: any;
  recognizedCurrentAccount: any;
  validityPeriod: number;
  withoutVAT: any;
  sourceAccount: Account;

  constructor() {
  }

  public static createFromForms(formgroup:FormGroup,
                                fileId: number,
                                items: OrderItem[],
                                orderId: number): OuterOfferCreateModel {
    const outerModel: OuterOfferCreateModel = new OuterOfferCreateModel();
    const ctrls = formgroup.controls;
    outerModel.bankGuarantee = ctrls['bankGuarantee'].value || null;
    outerModel.companyDocumentId = ctrls['companyDocument'].value?.id;
    outerModel.delay = ctrls['delay'].value;
    outerModel.deliveryIncluded = ctrls['deliveryIncluded'].value;
    outerModel.documentId = fileId;
    outerModel.orderItems = items;
    outerModel.filesForChat = [];
    outerModel.fillInClient = false;
    outerModel.operatorComment = ctrls['operatorComment'].value;
    outerModel.comment = ctrls['comment'].value;
    outerModel.fromCyntekaMobile = true;
    outerModel.orderId = orderId;
    outerModel.orderItemIds = items.map(oi => oi.id);
    outerModel.prepaidPercent = ctrls['prepaidPercent'].value;
    outerModel.validityPeriod = ctrls['validityPeriod'].value || 0;
    outerModel.sourceAccount = new Account(ctrls['payer'].value.id);
    outerModel.recognizedBik = null;
    outerModel.recognizedCurrentAccount = null;
    outerModel.withoutVAT = null;
    return outerModel;


  }
}
