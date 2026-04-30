import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CustomerRes, OrderRes } from "../core/dto";
import { CurrencyPipe, DatePipe } from "@angular/common";

// @Component({
//   selector: 'app-customer-detail',
//   standalone: true,
//   template: `
//     @if (customer) {
//       <h2>{{ customer.name }}</h2>
//       <p>{{ customer.email }}</p>
//     }
//   `
// })
// export class CustomerDetailComponent {
//   @Input() customer!: CustomerRes | undefined;
//   @Input() orders: OrderRes[] = [];
// }



@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    @if (customer) {
  <div class="p-4 border rounded bg-white shadow-sm">
      <!-- Customer Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-xl font-bold">{{ customer.name }}</h2>
          <p class="text-sm text-gray-500">{{ customer.email }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-bold text-gray-400 uppercase">Value Score</p>
          <p class="text-2xl font-bold text-blue-600">{{ customer.valueScore | currency }}</p>
        </div>
      </div>

      <h4 class="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Orders History</h4>
      
      <!-- Orders List -->
      <div class="space-y-4">
        @for (o of orders; track o.id) {
          <div class="border rounded-lg p-4 bg-white shadow-sm">
            <div class="flex justify-between items-center mb-3">
              <div>
                <span class="font-bold">Order #{{ o.id }}</span>
                <span class="text-gray-400 ml-2 text-xs">{{ o.createdAtUtc | date:'shortDate' }}</span>
              </div>
              <span class="font-bold text-blue-600">{{ o.totalAmount | currency }}</span>
            </div>

            <div class="space-y-2">
              @for (c of o.items; track $index) {
                <div class="text-sm p-3 bg-gray-50 rounded flex justify-between items-center border">
                  <div class="flex gap-2">
                    <span class="text-gray-500 font-medium">{{ c.quantity }}x</span>
                    <span class="font-medium">{{ c.productName }}</span>
                  </div>
                  <span class="text-gray-600">{{ c.unitPrice | currency }}</span>
                </div>
              }
            </div>
          </div>
        } @empty {
          <p class="text-gray-400 italic text-sm text-center py-4 border border-dashed rounded">No orders found for this customer.</p>
        }
      </div>
    </div>
  } @else {
    <div class="flex flex-col items-center justify-center py-20 bg-gray-50 border-2 border-dashed rounded-xl">
      <p class="text-gray-400 italic">Select a customer from the list to view their details and order history</p>
    </div>
  }
  `
})
export class CustomerDetailComponent {
  @Input() customer: CustomerRes | undefined;
  @Input() orders: OrderRes[] = [];
}