import { StorefrontApi } from 'apps/my-barbershop/src/app/shared/apis/storefront.api';
import { iStorefront } from 'apps/my-barbershop/src/app/shared/interfaces/storefront.interface';
import { CompanyService } from 'apps/my-barbershop/src/app/shared/services/company/company.service';
import { iDynamicFormConfig } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { STOREFRONT_FORM_CONFIG } from '../../constants/storefront-form.constant';

enum eDashboardSegmentedOptions {
  TimeAndStatus = 'Tempo & Status',
  Settings = 'Configurações',
}

@Component({
  selector: 'mb-dashboard',
  imports: [
    NzTypographyModule,
    NzFlexModule,
    NzButtonModule,
    NzSegmentedModule,
    NzCardComponent,
    NzSliderModule,
    NzGridModule,
    NzDividerModule,
    NzSwitchModule,
    DynamicFormComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private readonly storefrontApi = inject(StorefrontApi);

  private readonly companyService = inject(CompanyService);
  private readonly notificationService = inject(NzNotificationService);
  storefrontData = signal<iStorefront | null>(null);

  selectedOption: eDashboardSegmentedOptions = eDashboardSegmentedOptions.TimeAndStatus;
  segmentedOptions = [eDashboardSegmentedOptions.TimeAndStatus, eDashboardSegmentedOptions.Settings];

  eDashboardSegmentedOptions = eDashboardSegmentedOptions;

  configForm: iDynamicFormConfig[] = STOREFRONT_FORM_CONFIG();
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    const storefront = await this.storefrontApi.getByCompanyId();
    this.storefrontData.set(storefront);

    this.configForm = STOREFRONT_FORM_CONFIG(storefront || undefined);

    // if (storefront) {
    //   this.isOpen.set(storefront.is_open || false);
    //   this.updateDeadline();
    // }
  }

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eDashboardSegmentedOptions;
  }

  async submit() {
    const formValues = this.dynamicForm?.form.value;

    const { error } = await this.storefrontApi.insertOrUpdate({
      id: this.storefrontData()?.id,
      ...formValues,
    });
    if (error) {
      this.notificationService.error('Erro', 'Ocorreu um erro ao salvar as configurações.');
      return;
    }

    this.notificationService.success('Sucesso', 'Configurações salvas com sucesso!');
  }
}
