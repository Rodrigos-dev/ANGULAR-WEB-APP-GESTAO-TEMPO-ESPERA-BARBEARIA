import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';

import { appRoutes } from './app.routes';
import { AuthService } from './domain/auth/services/auth/auth.service';
import { ThemeService } from './shared/services/theme/theme.service';
import { TranslocoHttpLoader } from './transloco-loader';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideNzI18n(pt_BR),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideTransloco({
      config: {
        availableLangs: ['pt-BR', 'en'],
        defaultLang: 'pt-BR',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideEnvironmentNgxMask(),
    provideAppInitializer(() => inject(ThemeService).loadTheme()),
    provideAppInitializer(() => inject(AuthService).load()),
  ],
};
