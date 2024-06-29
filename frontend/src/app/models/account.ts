import {Company} from "./company";
import {Currency} from "./currency";

class Account {
    public id: number;
    public company: Company;
    public name: string;
    public currency: Currency;
    public accountType: AccountType;

  constructor(id: number) {
    this.id = id;
  }
}
class AccountType {
  public id: number;
  public name: string;
}
class Supplier {
  companyId: number;
  companyInn: string;
  email: string;
}
export {Account,AccountType,Supplier};
