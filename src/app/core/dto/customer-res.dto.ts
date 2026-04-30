import { OrderRes } from "./order-res.dto";

export interface CustomerRes {
  id: number;
  name : string;
  email : string;
  phone : string;
  orderCount : number;
  totalPurchase : number;
  valueScore : number;
  orderRes : OrderRes[];
}