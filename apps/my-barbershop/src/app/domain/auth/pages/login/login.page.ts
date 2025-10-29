import { Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'mb-login',
  imports: [TranslocoModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly translocoService = inject(TranslocoService);

  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }
}
