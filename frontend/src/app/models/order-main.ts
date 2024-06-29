import {Account} from "./account";
import {OrderItem} from "./order-item";

export class OrderMain {
  public id: number;
  public sourceAccount: Account;
  public orderItems: OrderItem[];
}
