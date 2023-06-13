import { ItemProduct } from "./itemproduct.model";
import { Payment } from "./payment.model";

export class Order{
    public idOrde!:number;
    public orderDate!:string;
    public limitDate!:string;
    public orderPrice!:string;
    public status!:string;
    public name	!:string;
    public email!:string;
    public address!:string;
    public phoneNumber!:string;
    public payement!: Payment
    public checked!: boolean;
    public itemProducts!:ItemProduct[]
    constructor(){}
}