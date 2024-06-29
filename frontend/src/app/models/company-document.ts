import {Company} from "./company";

export class CompanyDocument {
    public id: number;
    public company: Company;
    public shortTitle: string;
    public active: boolean;
    public parent: CompanyDocument;
    public children: CompanyDocument[];
    public payer: Company;
    public disabled: boolean;
}
