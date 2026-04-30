import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CreateOrderReq, CustomerRes, ProductRes } from '../core/dto';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="w-full md:w-80 border p-4 rounded bg-white">
      <h2 class="text-lg font-bold mb-4">New Order</h2>

      <form [formGroup]="orderForm" (ngSubmit)="submitOrder()" class="space-y-4">

        <!-- Customer -->
        <div>
          <label class="block text-xs font-bold mb-1">Customer</label>
          <select formControlName="customerId" class="w-full border p-2 text-sm">
            <option value="">Select</option>
            @for (c of customers; track c.id) {
              <option [value]="c.id">{{ c.name }}</option>
            }
          </select>
        </div>

        <!-- Items -->
        <div formArrayName="items" class="space-y-2">
          @for (item of items.controls; track $index; let i = $index) {
            <div [formGroupName]="i" class="flex gap-1 border-b pb-2">
              <select formControlName="productId" class="grow border text-xs p-1">
                @for (p of products; track p.id) {
                  <option [value]="p.id">{{ p.name }} ({{ p.price }})</option>
                }
              </select>
              <input type="number" formControlName="quantity" class="w-12 border text-xs p-1" />
              <button type="button" (click)="removeItem(i)" class="text-xs text-red-500">✕</button>
            </div>
          }
        </div>

        <button type="button" (click)="addItem()" class="text-xs text-indigo-600 font-bold">
          + Add Item
        </button>

        <!-- Total -->
        <div class="pt-2 border-t">
          <p class="text-right font-bold text-lg">{{ total() | currency }}</p>
          <button
            type="submit"
            [disabled]="orderForm.invalid || items.length === 0"
            class="w-full bg-black text-white py-2 mt-2 text-sm disabled:bg-gray-300">
            Place Order
          </button>
        </div>

      </form>
    </div>
  `
})
export class OrderFormComponent {
  private fb = inject(FormBuilder);

  @Input() customers: CustomerRes[] = [];
  @Input() products: ProductRes[] = [];
  @Output() create = new EventEmitter<CreateOrderReq>();

  total = signal(0); // ← signal instead of computed

  orderForm: FormGroup = this.fb.group({
    customerId: ['', Validators.required],
    items: this.fb.array([], Validators.minLength(1))
  });

  get items() { return this.orderForm.get('items') as FormArray; }

  constructor() {
    // ← recalculate total every time form changes
    this.orderForm.valueChanges.subscribe(() => this.recalcTotal());
  }

  recalcTotal() {
    const items = this.orderForm.value.items as any[];
    if (!items?.length) { this.total.set(0); return; }

    const sum = items.reduce((acc, item) => {
      const product = this.products.find(p => p.id == item.productId); // == handles string/number mismatch
      return acc + (product ? product.price * (item.quantity || 0) : 0);
    }, 0);

    this.total.set(sum);
  }

  addItem() {
    this.items.push(this.fb.group({
      productId: ['', Validators.required],
      quantity:  [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeItem(i: number) { this.items.removeAt(i); }

  submitOrder() {
    if (this.orderForm.invalid || this.items.length === 0) return;

    const fv = this.orderForm.value;

    const newOrder: CreateOrderReq = {
      customerId: fv.customerId,
      items: fv.items.map((item: any) => {
        const p = this.products.find(p => p.id == item.productId);
        return {
          productId:   item.productId,
          productName: p?.name  || 'Unknown',
          quantity:    item.quantity,
          price:       p?.price || 0
        };
      }),
      totalAmount: this.total()
    };

    this.create.emit(newOrder);

    this.orderForm.reset({ customerId: '' });
    while (this.items.length) this.items.removeAt(0);
    this.total.set(0);
  }
}