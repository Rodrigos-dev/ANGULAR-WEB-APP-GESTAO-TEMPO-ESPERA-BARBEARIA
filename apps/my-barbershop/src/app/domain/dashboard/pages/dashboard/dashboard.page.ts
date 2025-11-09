import { StorageApi } from 'apps/my-barbershop/src/app/shared/apis/storage.api';
import { StorefrontApi } from 'apps/my-barbershop/src/app/shared/apis/storefront.api';
import { eBucketName } from 'apps/my-barbershop/src/app/shared/enums/bucket-name.enum';
import { iStorefront } from 'apps/my-barbershop/src/app/shared/interfaces/storefront.interface';
import { CompanyService } from 'apps/my-barbershop/src/app/shared/services/company/company.service';
import { iDynamicFormConfig } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from 'apps/my-barbershop/src/app/widget/components/dynamic-form/dynamic-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCountdownComponent } from 'ng-zorro-antd/statistic';
import { NzSwitchComponent, NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ShareModalComponent } from '../../components/share-modal/share-modal.component';
import { STOREFRONT_FORM_CONFIG } from '../../constants/storefront-form.constant';

enum eDashboardSegmentedOptions {
  TimeAndStatus = 'Tempo & Status',
  Settings = 'Configurações',
}

@Component({
  selector: 'mb-dashboard',
  imports: [
    NzTypographyModule,
    NzFlexModule,
    NzButtonModule,
    NzSegmentedModule,
    NzCardComponent,
    NzSliderModule,
    NzGridModule,
    NzDividerModule,
    NzSwitchModule,
    DynamicFormComponent,
    RouterModule,
    FormsModule,
    NzCountdownComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  private readonly storefrontApi = inject(StorefrontApi);
  private readonly companyService = inject(CompanyService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly modal = inject(NzModalService);
  private readonly storageApi = inject(StorageApi);

  storefrontData = signal<iStorefront | null>(null);
  isOpen = signal<boolean>(false);
  deadline = signal<number>(Date.now());
  sliderValue = signal<number>(0);
  previousSliderValue = signal<number>(0);

  saveTimeout: any = null;
  isSaving = false;
  sliderUpdateInterval: any = null;

  selectedOption: eDashboardSegmentedOptions = eDashboardSegmentedOptions.TimeAndStatus;
  segmentedOptions = [eDashboardSegmentedOptions.TimeAndStatus, eDashboardSegmentedOptions.Settings];

  eDashboardSegmentedOptions = eDashboardSegmentedOptions;

  configForm: iDynamicFormConfig[] = STOREFRONT_FORM_CONFIG();
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;
  @ViewChild(NzSwitchComponent) switchComponent!: NzSwitchComponent;

  hasWaitingTime = computed(() => {
    const storefront = this.storefrontData();
    return !!(storefront?.is_open && storefront?.estimated_finish_time && this.deadline() > Date.now());
  });

  ngOnInit(): void {
    this.loadData();
  }

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eDashboardSegmentedOptions;
  }

  toggleStoreStatus() {
    this.switchComponent.isChecked = this.isOpen();

    if (this.isOpen()) {
      // Fechando a loja - com confirmação
      this.modal.confirm({
        nzTitle: 'Fechar Loja',
        nzContent: 'Tem certeza que deseja fechar a loja ? O tempo será iniciado novamente quando reabrir.',
        nzOkText: 'Confirmar',
        nzCancelText: 'Cancelar',
        nzOkType: 'primary',
        nzOkDanger: false,
        nzOnOk: () => {
          this.isOpen.set(false);
          this.switchComponent.isChecked = this.isOpen();
          this.adjustWaitingTime(-100000);
        },
        nzOnCancel: () => {
          this.isOpen.set(true);
          this.switchComponent.isChecked = this.isOpen();
        },
      });
    } else {
      // Abrindo a loja - sem confirmação
      this.isOpen.set(true);
      this.switchComponent.isChecked = true;
      this.autoSaveTimeAndStatus();
    }
  }

  async loadData() {
    const storefront = await this.storefrontApi.getByCompanyId();
    this.storefrontData.set(storefront);

    this.configForm = STOREFRONT_FORM_CONFIG(storefront || undefined);

    if (storefront) {
      this.isOpen.set(storefront.is_open || false);
      this.updateDeadline();

      const currentWaitingTime = this.calculateCurrentWaitingTime(); // Você precisa implementar esta função
      this.previousSliderValue.set(currentWaitingTime);
      this.sliderValue.set(currentWaitingTime);
      this.updateSliderFromRealCurrentTime();
    }
  }

  clickButtonPreConfig(minutesToAdd: number) {
    if (!this.isOpen()) {
      return;
    }

    this.adjustWaitingTime(minutesToAdd);
  }

  adjustWaitingTime(minutesToAdd: number) {
    const storefront = this.storefrontData();
    if (!storefront) return;

    const now = new Date();
    let newEstimatedFinishTime: string | null = null;

    if (!storefront.estimated_finish_time && minutesToAdd > 0) {
      const newFinishTime = new Date(now.getTime() + minutesToAdd * 60000);
      newEstimatedFinishTime = newFinishTime.toISOString();
    } else if (storefront.estimated_finish_time) {
      const currentFinishTime = new Date(storefront.estimated_finish_time);
      const newFinishTime = new Date(currentFinishTime.getTime() + minutesToAdd * 60000);

      newEstimatedFinishTime = newFinishTime > now ? newFinishTime.toISOString() : null;
    }

    this.storefrontData.set({
      ...storefront,
      estimated_finish_time: newEstimatedFinishTime,
    });
    this.updateDeadline();
    this.updateSliderFromCurrentTime();
    this.autoSaveTimeAndStatus();
  }

  updateDeadline() {
    const storefront = this.storefrontData();
    if (storefront?.estimated_finish_time) {
      const finishTime = new Date(storefront.estimated_finish_time).getTime();
      this.deadline.set(finishTime);
    } else {
      this.deadline.set(Date.now());
    }
  }

  private async autoSaveTimeAndStatus() {
    const storefront = this.storefrontData();
    if (!storefront?.id) {
      this.notificationService.error('Erro', 'ID da loja não encontrado.');
      return;
    }

    const { error } = await this.storefrontApi.updateTimeAndStatus(storefront.id, storefront.estimated_finish_time, this.isOpen());
    if (error) {
      this.notificationService.error('Erro', 'Não foi possível salvar as alterações.');
    }
  }

  async submit() {
    const formValues = this.dynamicForm?.form.value;
    const storefront = this.storefrontData();

    const photo = formValues.photo !== storefront?.photo ? await this.storageApi.insert(eBucketName.AVATARS, formValues.photo, storefront?.photo) : storefront?.photo;

    const { error } = await this.storefrontApi.insertOrUpdate({
      id: this.storefrontData()?.id,
      ...formValues,
      ...storefront,
      ...formValues,
      photo: photo || '',
      is_open: this.isOpen(),
    });
    if (error) {
      this.notificationService.error('Erro', 'Ocorreu um erro ao salvar as configurações.');
      return;
    }

    this.notificationService.success('Sucesso', 'Configurações salvas com sucesso!');
  }

  //----

  // Quando o slider muda manualmente
  onSliderChange(): void {
    if (!this.isOpen()) {
      this.updateSliderFromCurrentTime();
      return;
    }

    this.applySliderValueToWaitingTime();
  }

  // Nova função específica para o slider
  adjustWaitingTimeFromSlider(differenceInMinutes: number): void {
    const storefront = this.storefrontData();
    if (!storefront) return;

    const currentTime = storefront.estimated_finish_time ? new Date(storefront.estimated_finish_time) : new Date();

    const newFinishTime = new Date(currentTime.getTime() + differenceInMinutes * 60 * 1000);

    this.storefrontData.set({
      ...storefront,
      estimated_finish_time: newFinishTime.toISOString(),
    });

    this.updateDeadline();
    this.scheduleAutoSave();
  }

  // Função com debounce
  scheduleAutoSave(): void {
    // Cancela o timeout anterior se existir
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Agenda novo save após 5 segundos
    this.saveTimeout = setTimeout(() => {
      this.executeAutoSave();
    }, 2000); // 5 segundos
  }

  // Função que realmente executa o save
  async executeAutoSave(): Promise<void> {
    if (this.isSaving) return; // Evita múltiplas chamadas simultâneas

    this.isSaving = true;

    try {
      await this.autoSaveTimeAndStatus();
    } catch (error) {
      console.error('Erro no autosave: - dashboard.page.ts:270', error);
    } finally {
      this.isSaving = false;
    }
  }

  // Modifique a função clearWaitingTime para usar debounce
  clearWaitingTime(): void {
    const storefront = this.storefrontData();
    if (!storefront) return;

    this.storefrontData.set({
      ...storefront,
      estimated_finish_time: null,
    });

    this.updateDeadline();
    this.scheduleAutoSave(); // ← Mude para scheduleAutoSave
  }

  // Modifique a função applySliderValueToWaitingTime
  applySliderValueToWaitingTime(): void {
    const currentValue = this.sliderValue();
    const previousValue = this.previousSliderValue();

    // Calcula a diferença
    const difference = currentValue - previousValue;

    console.log(`Slider: ${previousValue} > ${currentValue}, Diferença: ${difference} - dashboard.page.ts:298`);

    // ⭐ Só executa se houver mudança real no valor (diferença != 0)
    if (difference !== 0) {
      if (currentValue > 0) {
        this.adjustWaitingTimeFromSlider(difference); // ⭐ Passa a diferença
      } else {
        this.clearWaitingTime();
      }

      // Agenda o save após mudanças
      this.scheduleAutoSave();
    }

    // ⭐ Atualiza o valor anterior para o atual
    this.previousSliderValue.set(currentValue);
  }

  // Função para formatar o tooltip do slider
  formatSliderTip = (value: number): string => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    // Retorna no formato "02:30"
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  calculateCurrentWaitingTime(): number {
    const storefront = this.storefrontData();
    if (!storefront?.estimated_finish_time) return 0;

    const now = Date.now();
    const finishTime = new Date(storefront.estimated_finish_time).getTime();
    const differenceInMinutes = Math.max(0, Math.floor((finishTime - now) / (1000 * 60)));

    return differenceInMinutes;
  }

  updateSliderFromRealCurrentTime(): void {
    clearInterval(this.sliderUpdateInterval);

    this.sliderUpdateInterval = setInterval(() => {
      console.log('Atualizando slider pelo tempo real - dashboard.page.ts:340');
      this.updateSliderFromCurrentTime();
    }, 60000);
  }

  // Função para atualizar o slider baseado no tempo atual
  updateSliderFromCurrentTime(): void {
    const currentMinutes = this.calculateCurrentWaitingTime();
    this.sliderValue.set(currentMinutes);
    this.previousSliderValue.set(currentMinutes);
  }

  // No ngOnDestroy, limpe o timeout
  ngOnDestroy(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    if (this.sliderUpdateInterval) {
      clearInterval(this.sliderUpdateInterval);
      this.sliderUpdateInterval = null;
    }
  }

  //MODAL
  async showShareModal() {
    const storefront = this.storefrontData();
    if (!storefront?.id) {
      this.notificationService.error('Erro', 'ID da loja não encontrado.');
      return;
    }

    this.modal.create({
      nzTitle: 'Compartilhar Página da Barbearia',
      nzContent: ShareModalComponent,
      nzData: { storefrontId: storefront.id },
      nzFooter: null,
    });
  }
}
