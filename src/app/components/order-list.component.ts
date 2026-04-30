import { Component, EventEmitter, Input, Output } from "@angular/core";
import { OrderRes } from "../core/dto";
import { CurrencyPipe } from "@angular/common";
import { OrderStatus } from "../core/models/enum/order-status.enum";

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="flex-grow">
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
          @for (o of orders; track o.id) {
            <tr class="border-b hover:bg-gray-50">
              <td class="p-2 text-gray-500">#{{ o.id }}</td>
              <td class="p-2">{{ o.customerName }}</td>
              <td class="p-2 font-semibold">{{ o.totalAmount | currency }}</td>
              <td class="p-2">
                <span [class]="statusClass(o.status.toString())"
                  class="text-[10px] px-2 py-0.5 rounded border font-medium">
                  {{ OrderStatus[o.status] }}
                </span>
              </td>
              <td class="p-2">
                @if (o.status == OrderStatus.Ordered) {
                  <button
                    (click)="cancel.emit(o.id.toString())"
                    class="text-red-500 text-xs hover:underline">
                    Cancel
                  </button>
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="p-8 text-center text-gray-400 italic">
                No orders found.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class OrderListComponent {
  @Input() orders: OrderRes[] = [];
  @Output() cancel = new EventEmitter<string>();

  protected readonly OrderStatus = OrderStatus;

  statusClass(status: string): string {
    return ({
      0: 'border-red-400 text-red-700 bg-red-50',
      1: 'border-green-400 text-green-700 bg-green-50',
    } as any)[status] ?? '';
  }
}