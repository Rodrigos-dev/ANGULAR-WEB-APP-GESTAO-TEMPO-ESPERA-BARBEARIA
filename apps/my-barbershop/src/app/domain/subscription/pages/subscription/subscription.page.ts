import { FormStorageDirective } from 'apps/my-barbershop/src/app/widget/directives/form-storage/form-storage.directive';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';

import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'mb-subscription',
  imports: [NzCardModule, NzStepsModule, RouterModule, ReactiveFormsModule, FormStorageDirective],
  templateUrl: './subscription.page.html',
  styleUrl: './subscription.page.scss',
})
export class SubscriptionPage {
  protected subscriptionService = inject(SubscriptionService);
}
