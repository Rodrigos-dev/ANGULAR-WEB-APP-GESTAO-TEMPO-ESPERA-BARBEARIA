import { environment } from 'apps/my-barbershop/src/environments/environment.development';

import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = new SupabaseClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
  }
}
