import { CompanyService } from 'apps/my-barbershop/src/app/shared/services/company/company.service';
import { LoadingService } from 'apps/my-barbershop/src/app/shared/services/loading/loading.service';
import { iDynamicFormConfig } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';

import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '../../../auth/services/auth/auth.service';
import { COMPANY_FORM_CONFIG } from '../../constants/company-form-config.constant';
import { eSubscriptionStep } from '../../enums/subscription-step.enum';
import { SubscriptionService } from '../../services/subscription.service';

@UntilDestroy()
@Component({
  selector: 'mb-company-details',
  imports: [DynamicFormComponent, NzButtonModule, NzFlexModule, NzIconModule, NzTypographyModule, RouterModule, NzSpinComponent],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss',
})
export class CompanyDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subscriptionService = inject(SubscriptionService);

  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly companyService = inject(CompanyService);
  private readonly messageService = inject(NzMessageService);
  protected loadingService = inject(LoadingService);

  isUpdate = false;
  originalValues: any = {};
  currentUser: any;
  company: any;
  hasChanges = false;
  destroy$ = new Subject<void>();
  submitUpdate = signal<boolean>(false);

  formConfig: iDynamicFormConfig[] = COMPANY_FORM_CONFIG();

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  ngOnInit(): void {
    this.subscriptionService.currentStep.set(eSubscriptionStep.COMPANY);

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
      const form = this.subscriptionService.getCompanyForm();
      form.patchValue(value);

      if (this.isUpdate) {
        this.hasChanges = this.hasFormChanges(value);
      }
    });

    this.dynamicForm.form.patchValue(this.subscriptionService.getCompanyForm().getRawValue());
  }

  private async updateFieldsToUpdate() {
    this.currentUser = this.authService.currentUser();
    this.company = this.companyService.company();

    if (!this.currentUser || !this.company) {
      return;
    }

    this.originalValues = {
      name: this.company.name || '',
      cnpj: this.company.cnpj || '',
      zip_code: this.company.address?.zip_code || '',
      street: this.company.address?.street || '',
      number: this.company.address?.number || '',
      complement: this.company.address?.complement || '',
      neighborhood: this.company.address?.neighborhood || '',
      city: this.company.address?.city || '',
      state: this.company.address?.state || '',
      country: this.company.address?.country || '',
    };

    // Preenche o formulário
    setTimeout(() => {
      if (this.dynamicForm?.form) {
        this.dynamicForm.form.patchValue(this.originalValues);
      }

      const cnpjControl = this.dynamicForm.form.get('cnpj');
      if (cnpjControl) {
        cnpjControl.disable();
      }
    });
  }

  private hasFormChanges(currentValues: any): boolean {
    for (const key in currentValues) {
      if (currentValues[key] !== this.originalValues[key]) {
        return true;
      }
    }
    return false;
  }

  private getChangedValues(currentValues: any): any {
    const changed: any = {};

    for (const key in currentValues) {
      if (currentValues[key] !== this.originalValues[key]) {
        changed[key] = currentValues[key];
      }
    }

    return changed;
  }

  async submit(): Promise<void> {
    try {
      this.submitUpdate.set(true);

      const currentValues = this.dynamicForm.form.getRawValue();
      const changedValues = this.getChangedValues(currentValues);

      if (Object.keys(changedValues).length > 0) {
        await this.subscriptionService.submitUpdateCompany(changedValues, this.company.id);

        this.originalValues = { ...this.originalValues, ...changedValues };
        this.hasChanges = false;
        this.messageService.success('Empresa atualizada com sucesso!');
      } else {
        this.messageService.info('Nenhuma alteração foi feita');
      }
    } catch (error: any) {
      this.messageService.error('Erro ao Atuaçizar Compania');
      console.log(`Exception while doing something: ${error} - company-details.component.ts:152`);
    } finally {
      this.submitUpdate.set(false);
      this.companyService.load(this.currentUser);
    }
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
