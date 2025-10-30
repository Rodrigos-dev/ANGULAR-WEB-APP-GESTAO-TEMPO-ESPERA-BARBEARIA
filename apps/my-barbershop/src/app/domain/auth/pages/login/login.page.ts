import { ThemeService } from 'apps/my-barbershop/src/app/shared/services/theme/theme.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';

import { Component, inject } from '@angular/core';

@Component({
  selector: 'mb-login',
  imports: [NzFlexModule, NzButtonComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
