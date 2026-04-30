import { Component, Injectable, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { OrdMgmtComponent } from './ap.ord-mgmt-app.component';
import { OrdersScreen } from './screens/orders-screen';
import { CustomersScreen } from './screens/customers.screen';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrdersScreen, CustomersScreen],
  template: `
    <!-- Nav Bar -->
    <header class="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <h1 class="text-lg font-bold tracking-tight">Order Management</h1>
      <nav class="flex gap-2">
        <button
          (click)="view.set('orders')"
          [class.bg-black]="view() === 'orders'"
          [class.text-white]="view() === 'orders'"
          [class.text-gray-500]="view() !== 'orders'"
          class="px-4 py-1.5 text-sm rounded font-medium transition-colors">
          Orders
        </button>
        <button
          (click)="view.set('customers')"
          [class.bg-black]="view() === 'customers'"
          [class.text-white]="view() === 'customers'"
          [class.text-gray-500]="view() !== 'customers'"
          class="px-4 py-1.5 text-sm rounded font-medium transition-colors">
          Customers
        </button>
      </nav>
    </header>

    <!-- Screen Content -->
    <main class="p-6 bg-gray-50 min-h-screen">
      @if (view() === 'orders') {
        <app-orders-screen />
      } 
      @if (view() === 'customers') {
        <app-customers-screen />
      }
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  view = signal<'orders' | 'customers'>('orders');
}