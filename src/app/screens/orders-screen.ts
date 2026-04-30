import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { CreateOrderReq, CustomerRes, OrderRes, ProductRes } from "../core/dto";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { OrderFormComponent } from "../components/order-form.component";
import { OrderListComponent } from "../components/order-list.component";
import { OrderService } from "../core/services/order.service";
import { CustomerService } from "../core/services/customer.service";
import { finalize, forkJoin } from "rxjs";
import { SpinnerComponent } from "../components/Common/spinner.component";

@Component({
  selector: 'app-orders-screen',
  standalone: true,
  imports: [OrderListComponent, OrderFormComponent, SpinnerComponent],
  template: `
    @if (view() === 'orders') {

    <app-spinner [visible]="loading()" message="Loading orders..." />

    @if (!loading()) {
      <div class="flex gap-4">
        <div class="flex-[7] bg-blue-100 p-4">
          <app-order-list
            [orders]="filteredOrders()"
            (cancel)="cancelOrder($event)">
          </app-order-list>
        </div>
    
        <div class="flex-[3] bg-red-100 p-4">
          <app-order-form
            [customers]="customers()"
            [products]="products()"
            (create)="submitOrder($event)">
          </app-order-form>
        </div>
      </div>
    }  
  }
  `
})
export class OrdersScreen implements OnInit {
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);

  view = signal<string>('orders');

  orders = signal<OrderRes[]>([]);
  customers = signal<CustomerRes[]>([]);
  products = signal<ProductRes[]>([]);
  loading   = signal(false);

  // Filter or sort orders as needed — extend this computed as required
  filteredOrders = computed(() => this.orders());

  ngOnInit() {
    this.loadOrders();
    this.loadCustomers();
    this.loadProducts();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getAllOrders().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
      next: (o) => this.orders.set(o),
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  loadCustomers() {
    this.loading.set(true);
    this.customerService.getAllCustomers().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (c) => this.customers.set(c),
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.orderService.getAllProduct().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (p) => this.products.set(p),
      error: (err) => console.error('Failed to load products', err)
    });
  }

  submitOrder(order: CreateOrderReq) {
    this.loading.set(true);
    this.orderService.createOrder(order).pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Failed to create order', err)
    });
  }

  cancelOrder(id: string) {
    console.log("cancel Order");
   
    this.loading.set(true);
    this.orderService.cancelOrder(id).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Failed to cancel order', err)
    });
  }
}