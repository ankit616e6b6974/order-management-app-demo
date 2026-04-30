import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { CustomerRes, OrderRes, ProductRes } from "../core/dto";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { OrderFormComponent } from "../components/order-form.component";
import { OrderListComponent } from "../components/order-list.component";
import { CustomerListComponent } from "../components/customer-list.component";
import { CustomerDetailComponent } from "../components/customer-detail.component";
import { OrderService } from "../core/services/order.service";
import { CustomerService } from "../core/services/customer.service";
import { SpinnerComponent } from "../components/Common/spinner.component";
import { finalize } from "rxjs";

@Component({
  selector: 'app-customers-screen',
  standalone: true,
  imports: [CustomerListComponent, CustomerDetailComponent, SpinnerComponent],
  template: `
    <section>
      <app-spinner [visible]="loading()" message="Loading orders..." />
      
      @if (!loading()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: List -->
        <div class="lg:col-span-1">
          <app-customer-list
            [highValueCustomers]="customers()"
            [selectedId]="selectedCustomerId()"
            (select)="selectedCustomerId.set($event)">
          </app-customer-list>
        </div>

        <!-- Right: Detail -->
        <div class="lg:col-span-2">
          <app-customer-detail
            [customer]="selectedCustomer()"
            [orders]="selectedCustomerOrders()">
          </app-customer-detail>
        </div>
      </div>
      }
      
    </section>
  `
})
export class CustomersScreen implements OnInit {
  private customerService = inject(CustomerService);
  private orderService = inject(OrderService);

  customers = signal<CustomerRes[]>([]);
  orders = signal<OrderRes[]>([]);
  selectedCustomerId = signal<string | undefined>(undefined);
  loading   = signal(false);

  // Currently selected customer object
  selectedCustomer = computed(() =>
    this.customers().find(c => c.id.toString() === this.selectedCustomerId())
  );

  // Orders belonging to selected customer
  selectedCustomerOrders = computed(() =>
    this.orders().filter(o => o.customerId?.toString() === this.selectedCustomerId())
  );

  ngOnInit() {
    this.loadCustomers();
    this.loadOrders();
  }

  loadCustomers() {
    this.loading.set(true)
    this.customerService.getTopCustomers().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
      next: (c) => this.customers.set(c),
      error: (err) => console.error('Failed to load top customers', err)
    });
  }

  loadOrders() {
    this.loading.set(true)
    this.orderService.getAllOrders().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
      next: (o) => this.orders.set(o),
      error: (err) => console.error('Failed to load orders', err)
    });
  }
}