import { iDynamicFormConfig } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component } from '@angular/core';

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
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  selectedOption: eDashboardSegmentedOptions = eDashboardSegmentedOptions.TimeAndStatus;
  segmentedOptions = [eDashboardSegmentedOptions.TimeAndStatus, eDashboardSegmentedOptions.Settings];

  eDashboardSegmentedOptions = eDashboardSegmentedOptions;

  configForm: iDynamicFormConfig[] = STOREFRONT_FORM_CONFIG();

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eDashboardSegmentedOptions;
  }
}
