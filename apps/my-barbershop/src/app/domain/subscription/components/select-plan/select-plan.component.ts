import { LoadingService } from 'apps/my-barbershop/src/app/shared/services/loading/loading.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ProductsApi } from '../../apis/products.api';
import { eSubscriptionStep } from '../../enums/subscription-step.enum';
import { iPrice } from '../../interfaces/price.interface';
import { iProduct } from '../../interfaces/product.interface';
import { SubscriptionService } from '../../services/subscription.service';

interface iProductWithPrice extends iProduct {
  price: iPrice | null;
}

@Component({
  selector: 'mb-select-plan',
  imports: [CurrencyPipe, FormsModule, NzButtonModule, NzCardModule, NzFlexModule, NzIconModule, NzRadioModule, NzSpinModule, NzTagModule, NzTypographyModule, RouterModule],
  templateUrl: './select-plan.component.html',
  styleUrl: './select-plan.component.scss',
})
export class SelectPlanComponent implements OnInit, AfterViewInit {
  private readonly productsApi = inject(ProductsApi);
  private readonly subscriptionService = inject(SubscriptionService);
  protected loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly messageService = inject(NzMessageService);

  selectedPrice = '';
  products = signal<iProductWithPrice[]>([]);
  submitWaiting = signal<boolean>(false);

  ngOnInit(): void {
    this.subscriptionService.currentStep.set(eSubscriptionStep.PLAN);

    this.load();
  }

  ngAfterViewInit(): void {
    const planForm = this.subscriptionService.getPlanForm();
    const price_id = planForm.get('price_id')?.value;

    if (price_id) this.selectedPrice = price_id;
  }

  async load() {
    this.loadingService.start();

    const products = await this.productsApi.getAll();
    this.products.set(
      products.map(product => {
        const price = product.prices ? product.prices[0] : null;
        return { ...product, price };
      }),
    );

    if (products.length > 0 && !this.selectedPrice) this.selectedPrice = this.products()[0].price?.id || '';

    this.loadingService.stop();
  }

  changePlan(id?: string) {
    if (!id) return;

    this.selectedPrice = id;

    const planForm = this.subscriptionService.getPlanForm();
    planForm.get('price_id')?.setValue(id);
  }

  async submit() {
    try {
      this.submitWaiting.set(true);

      await this.subscriptionService.submit();

      localStorage.removeItem('subscription-form');

      this.router.navigate(['/']);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.messageService.error(error.message);
      } else {
        this.messageService.error('Erro ao criar assinatura');
      }
    } finally {
      this.submitWaiting.set(false);
    }
  }
}
