import { injectSupabase } from 'apps/my-barbershop/src/app/shared/functions/inject-supabase.function';
import { LoadingService } from 'apps/my-barbershop/src/app/shared/services/loading/loading.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mb-forgot-password',
  imports: [NzFlexModule, NzButtonComponent, NzFormModule, NzInputModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
})
export class ForgotPasswordPage {
  private readonly supabase = injectSupabase();
  private readonly notificationService = inject(NzNotificationService);
  protected loadingService = inject(LoadingService);

  email = signal('');

  async submit() {
    this.loadingService.start();

    const data = await this.supabase.auth.resetPasswordForEmail(this.email());

    if (data.error) {
      this.notificationService.error('Erro ao enviar e-mail', 'Alguma coisa deu errado');
    } else {
      this.notificationService.success('E-mail enviado', 'Verifique sua caixa de entrada');
    }

    this.email.set('');

    this.loadingService.stop();
  }
}
