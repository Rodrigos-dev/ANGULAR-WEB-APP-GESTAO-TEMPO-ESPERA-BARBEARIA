import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { injectSupabase } from '../../../shared/functions/inject-supabase.function';
import { iCompany } from '../../../shared/interfaces/company.interface';
import { eUserStatus } from '../../auth/enums/user-status.enum';
import { iUserUpdate } from '../../auth/interfaces/user-update.interface';
import { AuthService } from '../../auth/services/auth/auth.service';
import { UserCompanyApi } from '../apis/user-company.api';
import { eSubscriptionStep } from '../enums/subscription-step.enum';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly authService = inject(AuthService);
  private readonly supabase = injectSupabase();
  private readonly userCompanyApi = inject(UserCompanyApi);

  currentStep = signal<eSubscriptionStep>(eSubscriptionStep.ADMIN);

  form = new FormGroup({
    admin: new FormGroup({
      name: new FormControl<string | null>(null),
      email: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
    }),
    company: new FormGroup({
      name: new FormControl<string | null>(null),
      cnpj: new FormControl<string | null>(null),
      zip_code: new FormControl<string | null>(null),
      street: new FormControl<string | null>(null),
      number: new FormControl<string | null>(null),
      complement: new FormControl<string | null>(null),
      neighborhood: new FormControl<string | null>(null),
      city: new FormControl<string | null>(null),
      state: new FormControl<string | null>(null),
      country: new FormControl<string | null>(null),
    }),
    plan: new FormGroup({
      price_id: new FormControl<string | null>(null),
    }),
  });

  getAdminForm() {
    return this.form.get('admin') as FormGroup;
  }

  getCompanyForm() {
    return this.form.get('company') as FormGroup;
  }

  getPlanForm() {
    return this.form.get('plan') as FormGroup;
  }

  async submit(): Promise<void> {
    await this.createAdminUser(this.getAdminForm());
    const createdCompany = await this.createCompany(this.getCompanyForm());
    await this.createSubscription(createdCompany.id);

    this.form.reset();
  }

  private async createAdminUser(adminForm: FormGroup) {
    const formValues = adminForm.getRawValue();
    const { name, email, phone, password } = formValues;

    const payload = {
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
          email_confirm: true,
        },
      },
    };

    const { data, error: signUpError } = await this.supabase.auth.signUp(payload);
    if (signUpError || !data.user) throw new Error(signUpError?.message === 'User already registered' ? 'Usuário já cadastrado' : 'Erro ao cadastrar usuário');

    const newUser = data.user;
    await this.authService.updateUser({ phone, status: eUserStatus.ACTIVE }, newUser.id);
    await this.authService.load();

    return newUser;
  }

  private async createCompany(companyForm: FormGroup) {
    const formValues = companyForm.getRawValue();
    const { name, cnpj, zip_code, street, number, complement, neighborhood, city, state, country } = formValues;

    const payload = {
      name,
      cnpj,
      address: {
        zip_code,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        country,
      },
    };

    const { data, error } = await this.supabase.from('company').insert(payload).select('*').returns<iCompany>().single();
    if (error) throw new Error('Erro ao cadastrar empresa');
    const company = data as iCompany;

    const user_id = this.authService.currentUser()?.id;
    if (!user_id) throw new Error('Usuário não encontrado');

    const userCompanyPayload = {
      company_id: company.id,
      user_id,
    };

    const { error: userCompanyError } = await this.userCompanyApi.insert(userCompanyPayload);
    if (userCompanyError) throw new Error('Erro ao vincular usuário a empresa');

    return company;
  }

  private async createSubscription(company_id: string) {
    const { price_id } = this.getPlanForm().getRawValue();
    if (!price_id) throw new Error('O plano é obrigatório.');

    const user = this.authService.currentUser();
    if (!user) throw new Error('Usuário não encontrado');

    const payload = {
      company_id,
      price_id,
      name: user.fullname,
      email: user.email,
      phone: user.phone,
    };
    const { data, error } = await this.supabase.functions.invoke('create-subscription', {
      body: JSON.stringify(payload),
    });

    if (error) {
      throw new Error('Erro ao criar assinatura');
    }

    return data;
  }

  async getUserById(userId: string): Promise<any> {
    const { data: user, error } = await this.supabase.from('users').select('*').eq('id', userId).single();

    if (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  async submitUpdateUser(userData: iUserUpdate, userId: string) {
    const updateData: Partial<iUserUpdate> = {};

    if (userData.name !== undefined) {
      updateData.full_name = userData.name;
    }
    if (userData.email !== undefined) {
      updateData.email = userData.email;
    }
    if (userData.phone !== undefined) {
      updateData.phone = userData.phone;
    }

    const cleanData = Object.fromEntries(Object.entries(updateData).filter(([_, value]) => value !== '' && value !== null && value !== undefined));

    if (Object.keys(cleanData).length === 0) {
      throw new Error('Nenhum dado válido para atualizar');
    }

    const { error } = await this.supabase.from('users').update(cleanData).eq('id', userId);

    if (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }

    await this.supabase.auth.updateUser({
      data: cleanData,
    });

    await this.authService.load();
  }

  async submitUpdateCompany(companyData: any, companyId: string): Promise<void> {
    const { name, zip_code, street, number, complement, neighborhood, city, state, country } = companyData;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;

    const addressFields = { zip_code, street, number, complement, neighborhood, city, state, country };
    const hasAddressChanges = Object.values(addressFields).some(value => value !== undefined);

    if (hasAddressChanges) {
      updateData.address = {};

      if (zip_code !== undefined) updateData.address.zip_code = zip_code;
      if (street !== undefined) updateData.address.street = street;
      if (number !== undefined) updateData.address.number = number;
      if (complement !== undefined) updateData.address.complement = complement;
      if (neighborhood !== undefined) updateData.address.neighborhood = neighborhood;
      if (city !== undefined) updateData.address.city = city;
      if (state !== undefined) updateData.address.state = state;
      if (country !== undefined) updateData.address.country = country;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('Nenhum dado válido para atualizar');
    }

    const { error } = await this.supabase.from('company').update(updateData).eq('id', companyId);

    if (error) {
      throw new Error(`Erro ao atualizar empresa: ${error.message}`);
    }
  }
}
