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
import { NzSpinComponent } from 'ng-zorro-antd/spin';

import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'mb-login',
  imports: [DynamicFormComponent, NzFlexModule, NzButtonComponent, NzFormModule, NzInputModule, ReactiveFormsModule, RouterModule, NzSpinComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly supabase = injectSupabase();
  private readonly notificationService = inject(NzNotificationService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  protected loadingService = inject(LoadingService);

  loginConfig: iDynamicFormConfig[] = [
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
    {
      label: 'Senha',
      name: 'password',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'password',
      },
      showForgotPassword: true,
      forgotPasswordLink: 'forgot-password',
      validations: [Validators.required],
      size: 24,
    },
  ];

  @ViewChild(DynamicFormComponent) dynamicForm?: DynamicFormComponent;

  async login() {
    try {
      this.loadingService.start();

      if (!this.dynamicForm?.form.valid) {
        this.notificationService.error('Erro', 'Preencha os campos corretamente');
        return;
      }

      const { email, password } = this.dynamicForm.form.value;
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) {
        this.notificationService.error('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
        return;
      }

      await this.authService.load();
      this.router.navigate(['/']);
    } finally {
      this.loadingService.stop();
    }
  }
}
