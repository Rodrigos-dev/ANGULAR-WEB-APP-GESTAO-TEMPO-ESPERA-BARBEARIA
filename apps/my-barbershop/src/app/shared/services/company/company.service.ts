import { Injectable, signal } from '@angular/core';

import { iUser } from '../../../domain/auth/interfaces/user.interface';
import { injectSupabase } from '../../functions/inject-supabase.function';
import { iCompany } from '../../interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly supabase = injectSupabase();

  company = signal<iCompany | null>(null);
  companies = signal<iCompany[]>([]);

  async load(currentUser: iUser) {
    if (!currentUser?.id) {
      this.company.set(null);
      this.companies.set([]);
      return;
    }

    const { data } = await this.supabase.from('user_company').select(`company(*)`).match({ user_id: currentUser.id, active: true }).order('created_at', { ascending: false });

    const userCompanies = data as unknown as { company: iCompany }[];
    const allCompanies = userCompanies.filter(uc => uc.company).map(uc => uc.company);

    this.companies.set(allCompanies);
    this.company.set(allCompanies[0] || null);
  }
}
