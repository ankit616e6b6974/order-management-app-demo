export interface OrderItemRes {
  productId  : number;
  productName  : string | null;
  quantity : number | null;
  unitPrice : number | null;
  subTotal : number | null;
}