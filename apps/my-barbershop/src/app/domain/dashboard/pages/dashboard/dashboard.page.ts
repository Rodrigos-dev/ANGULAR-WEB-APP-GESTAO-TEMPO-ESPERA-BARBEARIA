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
import { NzCountdownComponent } from 'ng-zorro-antd/statistic';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    NzCountdownComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private readonly storefrontApi = inject(StorefrontApi);
  private readonly companyService = inject(CompanyService);
  private readonly notificationService = inject(NzNotificationService);

  storefrontData = signal<iStorefront | null>(null);
  isOpen = signal<boolean>(false);
  deadline = signal<number>(Date.now());

  selectedOption: eDashboardSegmentedOptions = eDashboardSegmentedOptions.TimeAndStatus;
  segmentedOptions = [eDashboardSegmentedOptions.TimeAndStatus, eDashboardSegmentedOptions.Settings];

  eDashboardSegmentedOptions = eDashboardSegmentedOptions;

  configForm: iDynamicFormConfig[] = STOREFRONT_FORM_CONFIG();
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  hasWaitingTime = computed(() => {
    const storefront = this.storefrontData();
    return !!(storefront?.is_open && storefront?.estimated_finish_time && this.deadline() > Date.now());
  });

  ngOnInit(): void {
    this.loadData();
  }

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eDashboardSegmentedOptions;
  }

  toggleStoreStatus() {
    this.isOpen.set(!this.isOpen());
    this.autoSaveTimeAndStatus();
  }

  async loadData() {
    const storefront = await this.storefrontApi.getByCompanyId();
    this.storefrontData.set(storefront);

    this.configForm = STOREFRONT_FORM_CONFIG(storefront || undefined);

    if (storefront) {
      this.isOpen.set(storefront.is_open || false);
      this.updateDeadline();
    }
  }

  adjustWaitingTime(minutesToAdd: number) {
    const storefront = this.storefrontData();
    if (!storefront) return;

    const now = new Date();
    let newEstimatedFinishTime: string | null = null;

    if (!storefront.estimated_finish_time && minutesToAdd > 0) {
      const newFinishTime = new Date(now.getTime() + minutesToAdd * 60000);
      newEstimatedFinishTime = newFinishTime.toISOString();
    } else if (storefront.estimated_finish_time) {
      const currentFinishTime = new Date(storefront.estimated_finish_time);
      const newFinishTime = new Date(currentFinishTime.getTime() + minutesToAdd * 60000);

      newEstimatedFinishTime = newFinishTime > now ? newFinishTime.toISOString() : null;
    }

    this.storefrontData.set({
      ...storefront,
      estimated_finish_time: newEstimatedFinishTime,
    });
    this.updateDeadline();
    this.autoSaveTimeAndStatus();
  }

  updateDeadline() {
    const storefront = this.storefrontData();
    if (storefront?.estimated_finish_time) {
      const finishTime = new Date(storefront.estimated_finish_time).getTime();
      this.deadline.set(finishTime);
    } else {
      this.deadline.set(Date.now());
    }
  }

  private async autoSaveTimeAndStatus() {
    const storefront = this.storefrontData();
    if (!storefront?.id) {
      this.notificationService.error('Erro', 'ID da loja não encontrado.');
      return;
    }

    const { error } = await this.storefrontApi.updateTimeAndStatus(storefront.id, storefront.estimated_finish_time, this.isOpen());
    if (error) {
      this.notificationService.error('Erro', 'Não foi possível salvar as alterações.');
    }
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
