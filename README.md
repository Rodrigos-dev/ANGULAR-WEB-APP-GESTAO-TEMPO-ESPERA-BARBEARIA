# 📱 Dashboard Admin - Interface para barbearias ajustarem tempo

DEPLOY - https://angular-base-1-0-web-app-gestao-tem.vercel.app/

Sistema SaaS completo para barbearias gerenciarem tempo de espera em tempo real, com página pública para clientes e dashboard administrativo.

🎯 Funcionalidades
✨ Principais

⏰ Gestão de Tempo de Espera - Controle em tempo real do tempo médio de espera

🌐 Página Pública - Clientes visualizam tempo estimado sem login

📱 Dashboard Admin - Interface para barbearias ajustarem tempo

🔄 Atualizações em Tempo Real - Alterações refletem instantaneamente

💳 Sistema de Assinaturas

📦 Planos Flexíveis - Diferentes níveis de assinatura

🆓 Trial 14 Dias - Período gratuito para teste

💳 Pagamento com Stripe - Integração



👥 Gestão de Clientes

⏱️ Admin altera o tempo desejado para + ou - pelo Slider ou nos botões pré configurados


🔐 Autenticação & Segurança

👤 Cadastro Multi-etapas - Experiência guiada

🔐 Login Seguro - Autenticação com Supabase

📧 Confirmação de Email - Validação de usuários

🔒 Recuperação de Senha - Fluxo completo via email


🏪 Gestão da Barbearia

📝 Dados da Loja - Configuração completa

📊 Edição de Perfil - Admin e empresa

📤 Compartilhamento - QR Code e link copiável

🎨 Personalização - Branding da barbearia

🚀 Próximas Funcionalidades
💳 Página de Cartão - Gestão pós-trial de 14 dias

🔄 Alteração de Planos - Interface para mudanças

👥 Auto-gestão de Fila - Clientes se auto-adicionam/removem

📊 Ordenação de Filas - Sistema inteligente de prioridades

🏗️ Arquitetura
📁 Estrutura do Projeto (Domain-Driven Design)
text
apps/my-barbershop/
├── 🎯 domain/           # Domínios de negócio
│   ├── auth/           # Autenticação & usuários
│   ├── dashboard/      # Painel administrativo  
│   ├── storefront/     # Página pública
│   └── subscription/   # Assinaturas & pagamentos
├── 🔧 core/            # Núcleo da aplicação
│   ├── guards/         # Proteção de rotas
│   ├── layout/         # Layouts da aplicação
│   └── pages/          # Páginas globais
├── 📦 shared/          # Recursos compartilhados
│   ├── services/       # Serviços globais
│   ├── interfaces/     # Interfaces comuns
│   └── utils/          # Utilitários
└── 🧩 widget/          # Componentes reutilizáveis
    ├── components/     # Componentes UI
    ├── directives/     # Diretivas customizadas
    └── pipes/          # Pipes personalizados
🛠️ Stack Tecnológica
Frontend: Angular 19 + NX Monorepo + NG-Zorro

Backend: Supabase (Auth, DB, Storage, Edge Functions)

Payments: Stripe Integration

Styling: SCSS + Less Theming

State: RxJS Services

Real-time: Supabase Subscriptions

## 🖼️ Capturas de Tela

<p align="center" width="100%">
  <table align="center" width="100%">
    <tr>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/a0282121-ff64-4df5-95ac-d5738ca67123" alt="Captura de tela 1"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/631db485-29e3-48a0-9fba-53e5ca2ad66f" alt="Captura de tela 2"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/05067bd3-d4de-4f18-9071-2f07b1aa3bc1" alt="Captura de tela 3"/></td>
    </tr>
    <tr>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/66f79b42-334f-434c-aacb-e8fab83dd835" alt="Captura de tela 4"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/fe1591a4-8ef1-4b72-89ae-62392be2129d" alt="Captura de tela 5"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/d9322018-daed-425e-b5f4-7d6e4d91d5b5" alt="Captura de tela 6"/></td>
    </tr>
    <tr>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/860abec4-6531-4f7e-8ffa-847d005573b2" alt="Captura de tela 7"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/0f547301-91fd-4cf4-811a-e62175642ae2" alt="Captura de tela 8"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/a5744eeb-59d8-422d-a400-e832f11464cb" alt="Captura de tela 9"/></td>
    </tr>
    <tr>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/b34138bf-7472-4644-9226-06f39c2c5833" alt="Captura de tela 10"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/4fe2d1ab-7252-46c2-83de-db9702628bf5" alt="Captura de tela 11"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/1b763643-3f4b-488f-8fff-b7ec8f532796" alt="Captura de tela 12"/></td>
    </tr>
  </table>
</p>
