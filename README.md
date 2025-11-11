# 📱 Dashboard Admin - Interface para barbearias ajustarem tempo

https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular
https://img.shields.io/badge/NX-Monorepo-143157?style=for-the-badge&logo=nx
https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase
https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe

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

⏱️ Admin altera o tempo desejado para + oi - pelo Slider ou nos botões pré configurados


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
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/969a99dc-8d63-4c65-811e-381835f25a6c" alt="Dashboard Público"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/19810a4a-d789-4cbb-bcd4-9b97730f2c78" alt="Dashboard Superior"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/a98db251-1940-4508-8139-57eb7e44daf6" alt="Página Dashboard"/></td>
    </tr>
    <tr>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/9859a7c0-9861-4b8b-91b5-7ca9c1016d0b" alt="Contador Estatística"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/2eaaeed0-0cb1-40fb-b87a-fe0c026aa8a8" alt="Botões Tempo Pré-configurado"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/e306b789-8e73-45be-9f18-951efac9d0bc" alt="Botões e Log"/></td>
    </tr>
    <tr>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/07cc7858-c481-4365-88a3-1345dc19cceb" alt="Dashboard com Cards"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/f0c666e5-bd0f-4085-9fe7-f1cf55dbc6b0" alt="Modal QR Code"/></td>
      <td align="center"><img width="300" src="https://github.com/user-attachments/assets/d069043b-1db6-4e08-94df-4014659aa0ee" alt="Header com Logo"/></td>
    </tr>
  </table>
</p>
