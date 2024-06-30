import {RolePermission} from "./role-permission";
import {Company} from "./company";


export class Person {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  permissions:RolePermission[];
  company: Company;

}
