import { FormStorageDirective } from 'apps/my-barbershop/src/app/widget/directives/form-storage/form-storage.directive';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzSegmentedComponent } from 'ng-zorro-antd/segmented';

import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SubscriptionService } from '../../services/subscription.service';

enum eSubscrptionDetailSegmentedOptions {
  ADMIN = 'Admin',
  Company = 'Company',
}

@Component({
  selector: 'mb-subscription-detail',
  imports: [NzCardComponent, RouterOutlet, ReactiveFormsModule, FormStorageDirective, NzSegmentedComponent],
  templateUrl: './subscription-detail.page.html',
  styleUrl: './subscription-detail.page.scss',
})
export class SubscriptionDetailPage implements OnInit {
  selectedOption: eSubscrptionDetailSegmentedOptions = eSubscrptionDetailSegmentedOptions.ADMIN;
  segmentedOptions = [eSubscrptionDetailSegmentedOptions.ADMIN, eSubscrptionDetailSegmentedOptions.Company];

  eSubscrptionDetailSegmentedOptions = eSubscrptionDetailSegmentedOptions;

  protected subscriptionService = inject(SubscriptionService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.handleValueChange(eSubscrptionDetailSegmentedOptions.ADMIN);
  }

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eSubscrptionDetailSegmentedOptions;

    const segmentPath = this.getSegmentPath(this.selectedOption);

    this.router.navigate([segmentPath], {
      relativeTo: this.activatedRoute,
      replaceUrl: true,
      queryParams: { isUpdate: 'true' },
    });
  }

  private getSegmentPath(option: eSubscrptionDetailSegmentedOptions): string {
    return option.toLowerCase() === eSubscrptionDetailSegmentedOptions.ADMIN.toLowerCase() ? 'admin' : 'company';
  }
}
