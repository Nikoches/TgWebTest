import {Component, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AbstractControl, FormArray, FormBuilder, FormGroup, NonNullableFormBuilder, Validators} from '@angular/forms'
import {OrderItem} from "./models/order-item";
import {OrderMain} from "./models/order-main";
import {Account} from "./models/account";
import {CompanyDocument} from "./models/company-document";
import {IdNameEntity} from "./models/id-name-entity";
import {OuterOfferCreateModel, ServerDataForOffer} from "./models/server-data-for-offer";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatInput} from "@angular/material/input";
import {MatSelectChange} from "@angular/material/select";
import {PortalApiService} from "./services/portal-api.service";
import {ErrorService} from "./services/error.service";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {MatFormFieldModule} from '@angular/material/form-field';
import {Supplier} from "./models/supplier";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  private infoId: string | undefined;
  loadingOrderInfo:boolean = true;
  private offerInfo = undefined;
  globalsService: any;
  order: OrderMain;
  orderItems: OrderItem[];
  supplierList: Supplier[];
  file: IdNameEntity;
  payerList: Account[] = [];
  companyDocumentList: CompanyDocument[] = [];
  availableAnswers: string [] = ['yes', 'no', 'partially']
  form: FormGroup;
  flatNodeMap: Map<DocumentFlatNode, CompanyDocument> = new Map<DocumentFlatNode, CompanyDocument>();
  nestedNodeMap: Map<CompanyDocument, DocumentFlatNode> = new Map<CompanyDocument, DocumentFlatNode>();
  treeControl: FlatTreeControl<DocumentFlatNode>;
  treeFlattener: MatTreeFlattener<CompanyDocument, DocumentFlatNode>;
  treeDataSource: MatTreeFlatDataSource<CompanyDocument, DocumentFlatNode>;
  fileLoading: boolean = false;
  dataSource: MatTreeFlatDataSource<CompanyDocument, DocumentFlatNode>;

  @ViewChild('payerSearch')
  payerSearch: MatInput;
  @ViewChild('documentSearch')
  documentSearch: MatInput;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private portalService:PortalApiService, private errorService:ErrorService,
              private translate: TranslateService) {  }

 async ngOnInit() {
    this.route.queryParams
      .subscribe({
          next: (value) => console.log(),
          complete: () => setTimeout(()=> this.loadingOrderInfo = false,5000)
        }
      );
    // this.order = this.data.order;
    // this.orderItems = this.data.orderItems;
    this.portalService.getOfferData()
      .subscribe({
        next: (value) => console.log(),
        complete: () => console.log()
      });
    this.form = this.initForm(this.orderItems);
    // this.initSubscriptions();
    // this.disableCellsIfNeeded();
    // this.disablePercentAndDelay();
    // this.setAdditionalPropsIfNeeded();
    // this.portalService.getSuppliers().subscribe((data: Partial<ServerDataForOffer>) => this.supplierList = data.items);
    // this.portalService.getPayers().subscribe((data: Partial<ServerDataForOffer>) => this.payerList = data.accounts);
    // this.initTreeHelpers();
    // this.tryToSetPayer();
  }

  private initForm(orderItems: OrderItem[]): FormGroup {

    const createFormControl = (oi: OrderItem): FormGroup => {
      return this.fb.group({
        id:[oi.id],
        unit:[oi.unit],
        price: [oi.price],
        availableCount: [oi.availableCount, Validators.required],
        amount:[oi.amount],
        deliveryDays:[oi.deliveryDays],
        checked: [oi.checked],
        count:[oi.count - oi.skipCount],
        goodName: [oi.goodName]
      })
    }

    const array = orderItems.map(createFormControl);

    return this.fb.group({
      payer: ["", Validators.required],
      companyDocument: [""],
      deliveryIncluded: ["", Validators.required],
      prepaid: ["", Validators.required],
      prepaidPercent:[""],
      validityPeriod:[""],
      // checkAll:[this.orderItems.every(oi => oi.checked)],
      needDelay: ["", Validators.required],
      // items: this.fb.array(array),
      allAvailable: ["", Validators.required],
      delay:[""],
      // bankGuarantee:[""],
      comment:[""],
      fileControl: ["", Validators.required]
    })
  }

  get itemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemControlArray(): AbstractControl[] {
    return this.itemsFormArray.controls;
  }

  get checkedItemControlArray():AbstractControl[] {
    return this.itemControlArray.filter(ctrl => ctrl.get("checked").value)
  }

  private initTreeHelpers(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<DocumentFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.treeDataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  private initSubscriptions(): void {
    this.initDelaySubscription();
    this.initPrepaidSubscription();
    this.initPayerSubscription();
    this.initItemsSubscription();
  }

  private initDelaySubscription(): void {
    const delay = this.form.get("delay");
    this.form.get("needDelay").valueChanges
      .subscribe(value => {
        if (value) {
          if (this.form.get("prepaidPercent").value == 100) {
            this.form.get("prepaid").patchValue(false);
          }
          delay.enable();
          delay.setValidators([Validators.required, Validators.min(1)]);
        } else {
          delay.reset();
          delay.disable();
          delay.clearValidators();
        }
        delay.updateValueAndValidity();
      });
  }

  private initPrepaidSubscription(): void {
    const prepaidPercent = this.form.get("prepaidPercent");
    this.form.get("prepaid").valueChanges
      .subscribe(value => {
        if (value) {
          prepaidPercent.enable();
          prepaidPercent.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
        } else {
          prepaidPercent.reset();
          prepaidPercent.disable();
          prepaidPercent.clearValidators();
        }
        prepaidPercent.updateValueAndValidity();
      });
  }

  private initPayerSubscription(): void {
    this.form.get("payer").valueChanges
      .subscribe(() => {
        if (this.companyDocumentList) {
          this.treeDataSource.data = this.prepareDocuments(this.companyDocumentList);
        }
      });
  }

  private initItemsSubscription(): void {
    this.itemControlArray.forEach(control => {
      const availableCountControl = control.get("availableCount");
      availableCountControl.valueChanges.subscribe(() => {
        this.checkValuesAndUpdateAvailability();
        this.checkValuesAndUpdateDelivery();
      });
      control.get("checked").valueChanges.subscribe(val => {
        if (!val) {
          availableCountControl.disable();
          control.get("deliveryDays").disable();
        } else {
          availableCountControl.enable();
          control.get("deliveryDays").enable();
        }
        if (this.itemControlArray.every(control => control.get("checked").value === true)) {
          this.form.get("checkAll").patchValue(true);
        } else {
          this.form.get("checkAll").patchValue(false);
        }
      });
    })
  }

  private disablePercentAndDelay() {
    this.form.get("delay").disable();
    this.form.get("prepaidPercent").disable();
  }

  private setAdditionalPropsIfNeeded(): void {
    //todo
    if (false) {
      this.form.get("bankGuarantee").setValidators([Validators.required]);
      this.form.get("bankGuarantee").updateValueAndValidity();
    }
  }

  private disableCellsIfNeeded(): void {
    this.checkedItemControlArray.forEach(ctrl => {
      ctrl.get("deliveryDays").disable();
      ctrl.get("availableCount").disable();
    });
  }

  private checkValuesAndUpdateAvailability(): void {
    const checkedItems = this.checkedItemControlArray;
    const allPresent = checkedItems.every(ctrl => ctrl.get("availableCount").value >= ctrl.get("count").value);
    const allNulls = checkedItems.every(ctrl => ctrl.get("availableCount").value == 0);

    if (allPresent) {
      this.form.get("allAvailable").setValue("yes");
    } else if (allNulls) {
      this.form.get("allAvailable").setValue("no");
    } else {
      this.form.get("allAvailable").setValue("partially");
    }

  }

  private checkValuesAndUpdateDelivery(): void {
    this.checkedItemControlArray
      .filter(ctrl => ctrl.get("availableCount").value == 0)
      .forEach(ctrl => ctrl.patchValue({deliveryDays: 1}));
  }

  searchSuppler(target: any): void {
    this.portalService.getSuppliers(target.value).subscribe((data: Partial<ServerDataForOffer>) => this.supplierList = data.items)
  }

  startPayerSearch(): void {
    const filter = this.payerSearch.value.toLowerCase();
    this.payerList = this.payerList.filter(acc => acc?.company?.shortName?.toLowerCase().includes(filter));
  }

  loadCompanyDocuments(): void {
    this.portalService.getCompanyDocuments(this.form.get("supplier").value.companyInn)
      .subscribe((data: Partial<ServerDataForOffer>) => {
        this.companyDocumentList = data.documents;
        this.treeDataSource.data = this.prepareDocuments(this.companyDocumentList);
      });
  }

  startDocumentSearch(): void {
    const filter = this.documentSearch.value.toLowerCase();
    const data = this.companyDocumentList.filter(option => option.shortTitle.toLowerCase().includes(filter));
    this.treeDataSource.data = this.rearrangeDocumentsAsTree(data);
  }

  compareObjectsById(object1: { id: number }, object2: { id: number }): boolean {
    return object1?.id == object2?.id;
  }

  private tryToSetPayer(): void {
    if (this.order.sourceAccount) {
      this.form.get("payer").setValue(this.order.sourceAccount);
    }
  }

  updateCounts(event: MatSelectChange): void {
    const controls = this.checkedItemControlArray;
    if (event.value === "yes") {
      controls.forEach(ctrl => ctrl.patchValue({availableCount: ctrl.get("count").value}))
    } else if (event.value === "no") {
      controls.forEach(ctrl => ctrl.patchValue({availableCount: 0}))
    }
  }

  sendToProcess(): void {
    const data:OuterOfferCreateModel = this.getData();

    if (!data) {
      return;
    }
    this.portalService.sendToProcess(data).subscribe({
      next: () => {
        this.createDlg(this.translate.instant("options.success"),
          this.translate.instant("orders.orderReport.sendSuccess"));
        //@todo
        //this.processOffer._openedBottomSheetRef.dismiss();
      },
      error: error => {
        this.fileLoading = false;
        this.errorService.handleError(this.translate.instant("options.error"), [this.errorService.getError(error)]);
      }
    });
  }

  createDlg(title: string, message: string) {
    const config = {
      data: {
        title: title,
        message: message,
        closeButton:
          {
            label: "OK"
          },
      }
    }
    //@todo make gialog window
   // this.matDialog.open(OkDlgComponent, config);
  }

  private getData(): OuterOfferCreateModel {
    const items = this.processOrderItems();
    if (this.form.invalid) {
      this.createDlg(this.translate.instant("options.error"), this.translate.instant("orders.orderReport.formInvalid"));
      return null;
    }
    if (items.length == 0 || !this.validItems()) {
      this.createDlg(this.translate.instant("options.error"), this.translate.instant("orders.orderReport.formInvalid"));
      return null;
    }
    return OuterOfferCreateModel.createFromForms(this.form, this.file?.id, items, this.order.id);

  }

  private validItems(): boolean {
    return !this.checkedItemControlArray
      .some(ctrl => !ctrl.get("availableCount").value && !ctrl.get("deliveryDays").value);
  }

  private processOrderItems(): OrderItem[] {
    function buildOrderItem(ctrl:AbstractControl):OrderItem {
      const oi = new OrderItem();
      oi.id = ctrl.get("id").value;
      oi.goodName = ctrl.get("goodName").value;
      oi.count = ctrl.get("count").value;
      oi.unit = ctrl.get("unit").value;
      oi.availableCount = ctrl.get("availableCount").value;
      oi.deliveryDays = ctrl.get("deliveryDays").value;
      oi.price = ctrl.get("price").value;
      oi.isAvailable = ctrl.get("availableCount").value && !ctrl.get("deliveryDays").value;
      oi.amount = ctrl.get("amount").value;
      return oi;
    }

    return this.itemControlArray
      .filter(ctrl => ctrl.get("checked").value)
      .map(buildOrderItem);
  }

  addOfferFile(fileFromForm: File): void {
    const processFile = (file: IdNameEntity) => {
      this.portalService.sendRecognizeRequest(file.id)
        .subscribe((data: Partial<ServerDataForOffer>) => {
          if (data.result) {
            this.portalService.sendCheckDuplicatesRequest(file.id).subscribe({
              next: () => this.form.get("fileControl").patchValue(`${file.name}`),
              error: error => this.errorService.handleError(this.translate.instant("options.error"), [this.errorService.getError(error)])
            });
          }
        });
    };

    if (fileFromForm) {
      this.fileLoading = true;
      const formData = new FormData();
      formData.append('file', fileFromForm);
      this.portalService.uploadFile(formData).subscribe({
        next: (data: { id: number }) => {
          if (data.id) {
            this.file = new IdNameEntity(data.id, fileFromForm.name);
            processFile(this.file);
            this.fileLoading = false;
          }
        },
        error: error => {
          let errorMessage = error.error.error || error.error;
          this.fileLoading = false;
          this.errorService.handleError(this.translate.instant("options.error"), [this.errorService.getError(errorMessage)]);
        }
      });
    }
  }

  updateForm($event: MatSelectChange): void {
    if ($event.value) {
      return;
    }
    if ($event.source.id == "needDelay" && !this.form.get('prepaid').value) {
      this.form.get('prepaid').setValue(true);
    } else if ($event.source.id == "prepaidRequired" && !this.form.get('needDelay').value) {
      this.form.get('needDelay').setValue(true);
    }
  }

  prepareDocuments(documents: CompanyDocument[]): CompanyDocument[] {
    this.disableCompanyDocumentsByPayer(documents);
    return this.rearrangeDocumentsAsTree(documents);
  }

  disableCompanyDocumentsByPayer(documents: CompanyDocument[]) {
    const payerId = this.form.get("payer").value?.company?.id;

    if (!documents) {
      return;
    }

    documents.forEach(d => d.disabled = false);
    documents.forEach(doc => doc.disabled = !(payerId && doc.active && doc.payer?.id == payerId));
  }

  rearrangeDocumentsAsTree(objects: CompanyDocument[]): CompanyDocument[] {

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
    return objects.filter(o=>  !o.parent);
  }

  deleteFile(): void {
    this.form.get("fileControl").reset();
    this.file = null;
  }

  selectAll($event: any): void {
    this.form.get("checkAll").patchValue($event.checked);
    this.itemControlArray.forEach(ctrl => ctrl.get("checked").patchValue($event.checked));
  }

  getLevel = (node: DocumentFlatNode) => node.level;

  isExpandable = (node: DocumentFlatNode) => node.expandable;

  getChildren = (node: CompanyDocument): CompanyDocument[] => node.children;

  hasChild = (_: number, _nodeData: DocumentFlatNode) => _nodeData.expandable;

  transformer = (node: CompanyDocument, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node
        ? existingNode
        : new DocumentFlatNode();
    flatNode.item = node;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };


  checkPrepaidPercentValue() {
    if (this.form.get("prepaidPercent").value >= 100) {
      this.form.get("prepaidPercent").patchValue(100);
      this.form.get("needDelay").patchValue(false);
    }
  }

}

class DocumentFlatNode {
  item: CompanyDocument;
  level: number;
  expandable: boolean;
}

@Pipe({
  name: 'accountNameTransform',
  standalone: true,
  pure: false
})
export class AccountNameTransform implements PipeTransform {
  transform(account: Account): string {
    return `${account.company?.shortName} ${account.name} ${account.currency?.name} ${account.accountType?.name}`
  }
}
