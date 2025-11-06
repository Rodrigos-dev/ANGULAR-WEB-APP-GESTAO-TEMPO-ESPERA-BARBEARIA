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
import { Component, Input, OnInit } from '@angular/core';

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
  ],
  templateUrl: './storefront.page.html',
  styleUrl: './storefront.page.scss',
})
export class StorefrontPage implements OnInit {
  @Input() id = '';

  deadline = Date.now() + 150 * 60 * 1000;

  ngOnInit() {
    console.log('StorefrontPage initialized with id: - storefront.page.ts:41', this.id);
  }
}
