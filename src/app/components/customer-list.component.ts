import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CustomerRes, OrderRes } from "../core/dto";
import { CommonModule, CurrencyPipe } from "@angular/common";

// @Component({
//   selector: 'app-customer-list',
//   standalone: true,
//   template: `
//     @for (c of customers; track c.id) {
//       <button (click)="select.emit(c.id.toString())">
//         {{ c.name }}
//       </button>
//     }
//   `
// })
// export class CustomerListComponent {
//   @Input() customers: CustomerRes[] = [];
//   @Output() select = new EventEmitter<string>();
// }



@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CurrencyPipe, CommonModule], // Ensure CommonModule is here for class binding
  template: `
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold flex items-center gap-2">
          <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
          High Value Customers
        </h2>
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          Priority Support
        </span>
      </div>

      <div class="grid grid-cols sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        @for (cust of highValueCustomers; track cust.id) {
          <div
            (click)="select.emit(cust.id.toString())"
            [class.ring-2]="selectedId === cust.id.toString()"
            [class.ring-indigo-600]="selectedId === cust.id.toString()"
            [class.border-indigo-200]="selectedId === cust.id.toString()"
            [class.bg-indigo-50]="selectedId === cust.id.toString()"
            class="group border p-4 rounded-xl cursor-pointer transition-all hover:shadow-md hover:border-indigo-300 flex flex-col justify-between h-32 bg-white">
            
            <div>
              <p class="font-bold text-sm truncate group-hover:text-indigo-700">{{ cust.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ cust.email }}</p>
            </div>
            
            <div class="flex items-end justify-between">
              <p class="text-indigo-600 font-black text-xl">{{ cust.valueScore | currency }}</p>
              <span class="text-[10px] uppercase font-bold text-gray-400">Score</span>
            </div>
          </div>
        } @empty {
          <div class="col-span-full border-2 border-dashed rounded-xl p-8 text-center">
            <p class="text-gray-400 italic">No customers meet the high value threshold.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class CustomerListComponent {
  @Input() customers: CustomerRes[] = [];
  @Input() highValueCustomers: CustomerRes[] = [];
  @Input() selectedId: string | undefined;
  @Output() select = new EventEmitter<string>();
}