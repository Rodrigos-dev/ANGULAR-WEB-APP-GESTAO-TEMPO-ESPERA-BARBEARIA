import { ThemeService } from 'apps/my-barbershop/src/app/shared/services/theme/theme.service';

import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'mb-login',
  imports: [TranslocoModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly themeService = inject(ThemeService);

  changeLang() {
    this.themeService.toggleTheme();
  }
}
