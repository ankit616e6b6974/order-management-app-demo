import { OrderItemReq } from "./orderitem-req.dto";

export interface CreateOrderReq {
  customerId: number;
  items: OrderItemReq[];
  totalAmount: number;
}