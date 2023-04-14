import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { Shop } from "./shop.model";

export class Product{
    public idProduct!:number;
    public productName!:string;
    public description!:string;
    public productPrice!:number;
    public reductionPrince!:number;
    public available!:boolean;
    public like!: boolean
    public unLike!: boolean
    public productQuantity!: number
    public shop!: Shop;
    public category!: Category;
    public brand!: Brand;
    constructor(){}
}