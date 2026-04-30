import { OrderItemRes } from "./orderitem-res.dto";

export interface OrderRes {
  id : number | any;
  customerId : number | null;
  customerName : string;
  createdAtUtc : Date;
  status : number | any;
  totalAmount : number;
  items : OrderItemRes[];
}