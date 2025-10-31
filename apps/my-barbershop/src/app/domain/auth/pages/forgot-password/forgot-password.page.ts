import { injectSupabase } from 'apps/my-barbershop/src/app/shared/functions/inject-supabase.function';
import { LoadingService } from 'apps/my-barbershop/src/app/shared/services/loading/loading.service';
import { eDynamicField } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mb-forgot-password',
  imports: [DynamicFormComponent, NzFlexModule, NzButtonComponent, NzFormModule, NzInputModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
})
export class ForgotPasswordPage {
  private readonly supabase = injectSupabase();
  private readonly notificationService = inject(NzNotificationService);
  protected loadingService = inject(LoadingService);

  // email = signal('');

  // async submit() {
  //   this.loadingService.start();

  //   const data = await this.supabase.auth.resetPasswordForEmail(this.email());

  //   if (data.error) {
  //     this.notificationService.error('Erro ao enviar e-mail', 'Alguma coisa deu errado');
  //   } else {
  //     this.notificationService.success('E-mail enviado', 'Verifique sua caixa de entrada');
  //   }

  //   this.email.set('');

  //   this.loadingService.stop();
  // }

  formConfig: iDynamicFormConfig[] = [
    {
      label: 'Email',
      name: 'email',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'email',
      },
      validations: [Validators.required, Validators.email],
      size: 24,
    },
  ];

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  async submit() {
    this.loadingService.start();

    const { email } = this.dynamicForm.form.value;

    await this.supabase.auth.resetPasswordForEmail(email);
    this.notificationService.success('Email enviado', 'Verifique sua caixa de entrada');

    this.dynamicForm.form.reset();

    this.loadingService.stop();
  }
}
