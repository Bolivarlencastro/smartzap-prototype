# stitch-screen

Skill para gerar telas do SmartZap a partir do Stitch e convertê-las em componentes Angular seguindo os padrões do workspace.

## Quando usar

Invoque `/stitch-screen` quando precisar:

- Gerar uma nova tela ou componente visual para o SmartZap via Stitch
- Converter um design existente do Stitch em código Angular
- Renovar/melhorar uma tela existente com base em um novo design

## Fluxo obrigatório

### 1. Entender o contexto antes de qualquer coisa

Antes de gerar qualquer coisa, leia:

- `DESIGN.md` na raiz do workspace — tokens, cores dinâmicas, tipografia, shell, componentes
- O template e estilos da tela atual (se existir) para entender o que será substituído

### 2. Acessar o Stitch via MCP

Use as ferramentas MCP do Stitch (`mcp__stitch__*`) para:

1. Listar projetos disponíveis e identificar o projeto SmartZap
2. Buscar a tela pelo nome/descrição ou gerar uma nova com prompt
3. Extrair o HTML gerado

Ao gerar um prompt para o Stitch, inclua sempre:

- O contexto do shell (thin sidebar de 72px + header de 64px = área útil disponível)
- Que é uma aplicação Angular Material M3 com cores dinâmicas via CSS custom properties
- A tela específica sendo gerada (page title, seções, componentes esperados)

Exemplo de prompt estruturado para o Stitch:

```
SmartZap admin panel screen - [NOME DA TELA].
Shell context: thin icon-only sidebar (72px) on the left, top header bar (64px height).
Content area starts after the header. Background: var(--mat-sys-surface).
Use Angular Material M3 components: outline form fields, filled/outlined buttons (pill shape),
slide toggles, data tables with CDK, Material icons (outlined style).
Primary color is dynamic (CSS var), use violet as reference.
[DESCRIÇÃO ESPECÍFICA DA TELA]
```

### 3. Converter para Angular

Ao receber o HTML do Stitch:

**Estrutura do componente:**

- Standalone component (sem `standalone: true` no decorator — é default no Angular v20+)
- `ChangeDetectionStrategy.OnPush`
- Estado local com `signal()` e `computed()`
- Template externo (`.html`) e estilos externos (`.scss`)
- Tailwind para layout, Angular Material para componentes interativos

**Regras de conversão:**

- Substituir cores hex fixas por `var(--mat-sys-*)` correspondente
- Substituir `class="rounded-*"` por valores do sistema de rounded do DESIGN.md
- Converter `<button>` para `mat-flat-button`, `mat-stroked-button` ou `mat-icon-button`
- Converter `<input>` para `mat-form-field` com `appearance="outline"`
- Converter `<select>` para `mat-select`
- Converter toggles/switches para `mat-slide-toggle`
- Usar `@if`, `@for`, `@switch` — nunca `*ngIf`, `*ngFor`
- Usar `class` binding — nunca `ngClass`
- Usar `style` binding — nunca `ngStyle`
- Ícones: `<mat-icon>nome_do_icone</mat-icon>` com Material Symbols Outlined

**Onde criar os arquivos:**

- Se for tela de feature existente: dentro da estrutura já existente em `apps/smartzap-admin/src/app/main/<feature>/`
- Componentes de apresentação: `components/`
- Containers (com store): `containers/`
- Novos componentes seguem o padrão `<nome>.component.ts|html|scss|spec.ts`

### 4. Verificar após geração

- Nenhum hex fixo de cor de marca nos arquivos gerados
- Status colors (`#002daa`, `#4dc7ac`, etc.) são permitidos pois são semânticos e fixos
- Template usa control flow nativo (`@if`, `@for`)
- Imports corretos para todos os Material components usados
- Sem `standalone: true` no `@Component`

## Referência rápida — Shell do SmartZap

```
┌────────────┬─────────────────────────────────────────┤
│  THIN NAV  │  HEADER (h-16 / 64px) — bg-card, shadow │
│   80px     │  [☰]    [fullscreen] [notif] [bal] [user]│
│  full      ├─────────────────────────────────────────┤
│  height    │  CONTENT AREA (flex-auto, overflow-auto) │
│            │                                         │
│ [LOGO h-20]│  pt-3 px-3 (page padding)               │
│            │  Page header: icon + h1 (mt-4 mb-6)    │
│  [school]  │  Content: full width, scrollable        │
│  [people]  │                                         │
│  [settings]│  cada item de nav: 64px de altura       │
│  [send]    │  labels ocultas (icon-only)             │
└────────────┴─────────────────────────────────────────┘
```

**Medidas exatas** (extraídas de `thin.scss` e `thin.component.html`):

- Sidebar: `80px` (`--fuse-vertical-navigation-thin-width`)
- Logo topo: `h-20` (80px)
- Cada item de nav: `64px` de altura, `padding: 0 16px`, ícone centrado, sem label
- Header: `64px` (`h-16`)

**Modo mobile** (< 960px / `md`): sidebar vira overlay sobre o conteúdo.

## Referência rápida — Telas existentes no SmartZap

| Rota                    | Tela                         | Componentes principais                                                              |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `/courses`              | Lista de cursos e matrículas | Tabela, filtros, status badges                                                      |
| `/users`                | Lista de usuários            | CDK Table (select, avatar, name, email, phone, tags, sync, actions), search, export |
| `/settings/general`     | Config geral SmartZap        | 3-col grid, slide toggles, outline form fields                                      |
| `/settings/enrollments` | Lista de matrículas          | Tabela + filtros + statistics                                                       |
| `/push-manager`         | Gerenciador de push          | (feature externa)                                                                   |
