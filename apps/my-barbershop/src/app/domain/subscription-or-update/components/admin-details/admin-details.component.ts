import { LoadingService } from 'apps/my-barbershop/src/app/shared/services/loading/loading.service';
import { eDynamicField } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';

import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '../../../auth/services/auth/auth.service';
import { eSubscriptionStep } from '../../enums/subscription-step.enum';
import { SubscriptionService } from '../../services/subscription.service';

@UntilDestroy()
@Component({
  selector: 'mb-admin-details',
  imports: [DynamicFormComponent, NzButtonModule, NzFlexModule, NzIconModule, NzTypographyModule, RouterModule, NzSpinComponent],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss',
})
export class AdminDetailsComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  protected loadingService = inject(LoadingService);

  isUpdate = false;
  private originalValues: any = {};
  currentUser: any;
  hasChanges = false;
  private readonly destroy$ = new Subject<void>();
  submitUpdate = signal<boolean>(false);

  formConfig: iDynamicFormConfig[] = [
    {
      label: 'Nome',
      name: 'name',
      type: {
        field: eDynamicField.INPUT,
      },
      validations: [Validators.required],
      size: 24,
    },
    {
      label: 'E-mail',
      name: 'email',
      type: {
        field: eDynamicField.INPUT,
      },
      validations: [Validators.required, Validators.email],
      size: 24,
    },
    {
      label: 'Telefone',
      name: 'phone',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'tel',
      },
      mask: '(00) 00000-0000||(00) 0000-0000',
      validations: [Validators.required],
      size: 24,
    },
    {
      label: 'Senha',
      name: 'password',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'password',
      },
      validations: [Validators.required],
      size: 24,
    },
  ];

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  ngOnInit(): void {
    this.subscriptionService.currentStep.set(eSubscriptionStep.ADMIN);

    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        map(params => params['isUpdate'] === 'true'),
      )
      .subscribe(value => {
        this.isUpdate = value;
      });
  }

  ngAfterViewInit(): void {
    localStorage.removeItem('subscription-form');
    this.updateFieldsToUpdate();

    this.dynamicForm?.form.valueChanges.pipe(untilDestroyed(this), debounceTime(300)).subscribe(value => {
      const form = this.subscriptionService.getAdminForm();
      form.patchValue(value);

      if (this.isUpdate) {
        this.hasChanges = this.hasFormChanges(value);
      }
    });

    this.dynamicForm.form.patchValue(this.subscriptionService.getAdminForm().value);
  }

  private async updateFieldsToUpdate() {
    this.currentUser = this.authService.currentUser();

    if (!this.currentUser) {
      return;
    }

    const user = await this.subscriptionService.getUserById(this.currentUser.id);

    const passwordField = this.formConfig.find(field => field.name === 'password');
    if (passwordField) {
      passwordField.hidden = true;
    }

    this.originalValues = {
      name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
    };

    // Preenche o formulário
    setTimeout(() => {
      if (this.dynamicForm?.form) {
        this.dynamicForm.form.patchValue(this.originalValues);
      }
    });
  }

  async submitChanges(): Promise<void> {
    try {
      this.submitUpdate.set(true);

      const currentValues = this.dynamicForm.form.getRawValue();
      const changedValues = this.getChangedValues(currentValues);

      if (Object.keys(changedValues).length > 0) {
        await this.subscriptionService.submitUpdateUser(changedValues, this.currentUser.id);

        this.originalValues = { ...this.originalValues, ...changedValues };
        this.hasChanges = false;
      }
    } finally {
      localStorage.removeItem('subscription-form');
      this.dynamicForm.form.reset();
      this.submitUpdate.set(false);
    }
  }

  private getChangedValues(currentValues: any): any {
    const changed: any = {};

    for (const key in currentValues) {
      if (key === 'password' && this.isUpdate) {
        continue;
      }

      if (currentValues[key] !== this.originalValues[key]) {
        changed[key] = currentValues[key];
      }
    }

    return changed;
  }

  private hasFormChanges(currentValues: any): boolean {
    for (const key in currentValues) {
      if (key === 'password' && this.isUpdate) continue; // Ignora password no update

      if (currentValues[key] !== this.originalValues[key]) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.isUpdate) {
      localStorage.removeItem('subscription-form');
      if (this.dynamicForm?.form) {
        this.dynamicForm.form.reset();
      }
    }
  }
}
