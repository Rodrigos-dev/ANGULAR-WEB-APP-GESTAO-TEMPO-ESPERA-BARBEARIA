import { StorefrontApi } from 'apps/my-barbershop/src/app/shared/apis/storefront.api';
import { iStorefront } from 'apps/my-barbershop/src/app/shared/interfaces/storefront.interface';
import { DownloadStoragePipe } from 'apps/my-barbershop/src/app/widget/pipes/download-storage/download-storage.pipe';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';

@Component({
  selector: 'mb-storefront',
  imports: [
    CommonModule,
    NzAvatarModule,
    NzBadgeModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzGridModule,
    NzTagModule,
    NzFlexDirective,
    NzStatisticModule,
    NzTypographyModule,
    NzIconModule,
    DownloadStoragePipe,
  ],
  templateUrl: './storefront.page.html',
  styleUrl: './storefront.page.scss',
})
export class StorefrontPage implements OnInit, OnDestroy {
  private readonly storefrontApi = inject(StorefrontApi);
  private readonly route = inject(ActivatedRoute);
  private realtimeChannel: RealtimeChannel | null = null;

  @Input() id = '';

  storefrontData = signal<iStorefront | null>(null);
  deadline = signal<number>(Date.now());

  hasWaitingTime = computed(() => {
    const storefront = this.storefrontData();
    return !!(storefront?.is_open && storefront?.estimated_finish_time && this.deadline() > Date.now());
  });

  ngOnInit(): void {
    this.initializeStorefront();
  }

  async initializeStorefront() {
    const routeId = this.route.snapshot.paramMap.get('id');
    const storefrontId = this.id || routeId;

    let data: iStorefront | null = null;

    if (storefrontId) {
      const { data: storefrontData } = await this.storefrontApi.getById(storefrontId);
      data = storefrontData;
    } else {
      data = await this.storefrontApi.getByCompanyId();
    }

    if (data) {
      this.updateStorefrontData(data);

      this.realtimeChannel = this.storefrontApi.subscribeToStorefrontChanges(data.id, updatedData => {
        this.updateStorefrontData(updatedData);
      });
    }
  }

  private updateStorefrontData(data: iStorefront) {
    this.storefrontData.set(data);

    if (data.estimated_finish_time) {
      const finishTime = new Date(data.estimated_finish_time).getTime();
      this.deadline.set(finishTime > Date.now() ? finishTime : Date.now());
    } else {
      this.deadline.set(Date.now());
    }
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
  }
}
