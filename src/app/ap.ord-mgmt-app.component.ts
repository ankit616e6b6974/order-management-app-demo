import { Component, Injectable, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { catchError, finalize, delay } from 'rxjs/operators';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'cancelled' | 'completed';
  createdAt: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  valueScore: number;
}

@Injectable({ providedIn: 'root' })
class DataService {
  private products: Product[] = [
    { id: 'p1', name: 'Laptop', price: 1200 },
    { id: 'p2', name: 'Mouse', price: 25 },
    { id: 'p3', name: 'Keyboard', price: 75 },
    { id: 'p4', name: 'Monitor', price: 300 }
  ];

  private customersList = signal<Customer[]>([
    { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', valueScore: 2500 },
    { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', valueScore: 1200 },
    { id: 'c3', name: 'Charlie Davis', email: 'charlie@example.com', valueScore: 600 },
    { id: 'c4', name: 'Diana Prince', email: 'diana@example.com', valueScore: 450 }
  ]);

  private ordersList = signal<Order[]>([]);

  getProducts() { return of(this.products).pipe(delay(200)); }
  getCustomers() { return of(this.customersList()).pipe(delay(200)); }
  getOrders() { return of(this.ordersList()).pipe(delay(200)); }

  addOrder(order: Order) {
    this.ordersList.update(orders => [order, ...orders]);
    this.updateValueScores();
    return of(order).pipe(delay(200));
  }

  cancelOrder(orderId: string) {
    this.ordersList.update(orders => 
      orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o)
    );
    this.updateValueScores();
    return of(true).pipe(delay(200));
  }

  private updateValueScores() {
    const orders = this.ordersList();
    this.customersList.update(customers => customers.map(cust => {
      const totalValue = orders
        .filter(o => o.customerId === cust.id && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { ...cust, valueScore: totalValue };
    }));
  }
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto font-sans text-gray-800">
      <header class="border-b pb-4 mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Customer Order Management Admin</h1>
        <nav class="flex gap-4">
          <button (click)="view.set('orders')" [class.font-bold]="view() === 'orders'" class="text-sm underline decoration-indigo-500">Orders</button>
          <button (click)="view.set('customers')" [class.font-bold]="view() === 'customers'" class="text-sm underline decoration-indigo-500">Customers</button>
        </nav>
      </header>

      @if (isLoading()) { <p class="text-center py-4">Loading data...</p> }

      <!-- ORDERS VIEW -->
      @if (view() === 'orders') {
        <div class="flex flex-col md:flex-row gap-8">
          <div class="grow">
            <h2 class="text-lg font-bold mb-4">Recent Orders</h2>
            <table class="w-full border-collapse text-left text-sm">
              <thead>
                <tr class="bg-gray-100 border-b">
                  <th class="p-2">ID</th>
                  <th class="p-2">Customer</th>
                  <th class="p-2">Total</th>
                  <th class="p-2">Status</th>
                  <th class="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (o of filteredOrders(); track o.id) {
                  <tr class="border-b hover:bg-gray-50">
                    <td class="p-2 text-gray-500">#{{ o.id }}</td>
                    <td class="p-2">{{ o.customerName }}</td>
                    <td class="p-2 font-semibold">{{ o.totalAmount | currency }}</td>
                    <td class="p-2"><span class="text-[10px] border px-2 py-0.5 rounded">{{ o.status }}</span></td>
                    <td class="p-2">
                      @if (o.status === 'pending') {
                        <button (click)="cancelOrder(o.id)" class="text-red-600 text-xs hover:underline">Cancel</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="p-4 text-center text-gray-400">No orders found.</td></tr>
                }
              </tbody>
            </table>
          </div>

          <div class="w-full md:w-80 border p-4 rounded bg-white">
            <h2 class="text-lg font-bold mb-4">New Order</h2>
            <form [formGroup]="orderForm" (ngSubmit)="submitOrder()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold mb-1">Customer</label>
                <select formControlName="customerId" class="w-full border p-2 text-sm">
                  <option value="">Select</option>
                  @for (c of customers(); track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>
              <div formArrayName="items" class="space-y-2">
                @for (item of items.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="flex gap-1 border-b pb-2">
                    <select formControlName="productId" class="flex-grow border text-xs p-1">
                      @for (p of products(); track p.id) {
                        <option [value]="p.id">{{ p.name }} ({{ p.price }})</option>
                      }
                    </select>
                    <input type="number" formControlName="quantity" class="w-12 border text-xs p-1" />
                    <button type="button" (click)="removeItem(i)" class="text-xs text-red-500">✕</button>
                  </div>
                }
              </div>
              <button type="button" (click)="addItem()" class="text-xs text-indigo-600 font-bold">+ Add Item</button>
              <div class="pt-2 border-t">
                <p class="text-right font-bold text-lg">{{ currentOrderTotal() | currency }}</p>
                <button type="submit" [disabled]="orderForm.invalid || items.length === 0" class="w-full bg-black text-white py-2 mt-2 text-sm disabled:bg-gray-300">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- CUSTOMERS VIEW -->
      @if (view() === 'customers') {
        <section>
          <div class="mb-8">
            <h2 class="text-lg font-bold mb-4">High Value Customers ($500+)</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
              @for (cust of highValueCustomers(); track cust.id) {
                <div 
                  (click)="selectedCustomerId.set(cust.id)"
                  [class.border-indigo-600]="selectedCustomerId() === cust.id"
                  class="border p-4 rounded cursor-pointer hover:bg-gray-50 flex flex-col justify-between">
                  <div>
                    <p class="font-bold text-sm">{{ cust.name }}</p>
                    <p class="text-xs text-gray-500">{{ cust.email }}</p>
                  </div>
                  <p class="mt-4 text-indigo-600 font-bold text-lg">{{ cust.valueScore | currency }}</p>
                </div>
              } @empty {
                <p class="col-span-full text-gray-400 border p-8 text-center italic">No customers meet the high value threshold yet.</p>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-6">
            <div class="lg:col-span-1 border-r pr-4">
              <h3 class="font-bold text-sm mb-3">Directory ({{ customers().length }})</h3>
              <div class="space-y-1">
                @for (c of customers(); track c.id) {
                  <button 
                    (click)="selectedCustomerId.set(c.id)"
                    [class.bg-gray-100]="selectedCustomerId() === c.id"
                    class="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                    {{ c.name }}
                  </button>
                }
              </div>
            </div>

            <div class="lg:col-span-2">
              @if (selectedCustomer(); as active) {
                <div class="p-4 border rounded">
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <h2 class="text-xl font-bold">{{ active.name }}</h2>
                      <p class="text-sm text-gray-500">{{ active.email }}</p>
                    </div>
                    <p class="text-2xl font-bold">{{ active.valueScore | currency }}</p>
                  </div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase mb-4">Orders</h4>
                  <div class="space-y-2">
                    @for (o of selectedCustomerOrders(); track o.id) {
                      <div class="text-sm p-3 bg-gray-50 rounded flex justify-between items-center border">
                        <div>
                          <span class="font-bold">#{{ o.id }}</span>
                          <span class="text-gray-400 ml-2">{{ o.createdAt | date:'shortDate' }}</span>
                        </div>
                        <span class="font-bold">{{ o.totalAmount | currency }}</span>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <p class="text-center py-20 text-gray-400 italic">Select a customer to view details</p>
              }
            </div>
          </div>
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdMgmtComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  view = signal<'orders' | 'customers'>('orders');
  isLoading = signal(false);
  products = signal<Product[]>([]);
  customers = signal<Customer[]>([]);
  orders = signal<Order[]>([]);
  selectedCustomerId = signal<string | null>(null);

  orderForm: FormGroup = this.fb.group({
    customerId: ['', Validators.required],
    items: this.fb.array([], Validators.minLength(1))
  });

  filteredOrders = computed(() => this.orders());
  
  highValueCustomers = computed(() => {
    return this.customers()
      .filter(c => c.valueScore >= 500)
      .sort((a, b) => b.valueScore - a.valueScore);
  });

  selectedCustomer = computed(() => {
    const id = this.selectedCustomerId();
    return this.customers().find(c => c.id === id) || null;
  });

  selectedCustomerOrders = computed(() => {
    const id = this.selectedCustomerId();
    return this.orders().filter(o => o.customerId === id);
  });

  currentOrderTotal = computed(() => {
    const items = this.orderForm.value.items as any[];
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => {
      const prod = this.products().find(p => p.id === item.productId);
      return sum + (prod ? prod.price * (item.quantity || 0) : 0);
    }, 0);
  });

  get items() { return this.orderForm.get('items') as FormArray; }

  ngOnInit() { this.loadInitialData(); }

  loadInitialData() {
    this.isLoading.set(true);
    this.dataService.getProducts().subscribe(p => this.products.set(p));
    this.dataService.getCustomers().subscribe(c => this.customers.set(c));
    this.dataService.getOrders().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe(o => this.orders.set(o));
  }

  addItem() {
    this.items.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeItem(index: number) { this.items.removeAt(index); }

  submitOrder() {
    if (this.orderForm.invalid) return;
    const formValue = this.orderForm.value;
    const customer = this.customers().find(c => c.id === formValue.customerId);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: formValue.customerId,
      customerName: customer?.name || 'Unknown',
      items: formValue.items.map((item: any) => {
        const p = this.products().find(prod => prod.id === item.productId);
        return { productId: item.productId, productName: p?.name || 'Unknown', quantity: item.quantity, price: p?.price || 0 };
      }),
      totalAmount: this.currentOrderTotal(),
      status: 'pending',
      createdAt: new Date()
    };

    this.dataService.addOrder(newOrder).subscribe(() => {
      this.orderForm.reset({ customerId: '' });
      while (this.items.length) this.items.removeAt(0);
      this.loadInitialData();
    });
  }

  cancelOrder(id: string) {
    this.dataService.cancelOrder(id).subscribe(() => this.loadInitialData());
  }
}