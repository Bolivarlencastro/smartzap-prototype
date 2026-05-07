---
title: SmartZap Admin — Design Reference (Current State)
version: 1.0.0
date: 2026-04-24
purpose: Reference fiel do design atual do SmartZap Admin para reprodução e redesign assistido por IA (Stitch)
---

# SmartZap Admin — Design Reference

Documento de referência do estado atual da aplicação SmartZap Admin (`apps/smartzap-admin`).
Todas as screenshots estão em `screens/` nesta mesma pasta.

---

## 1. Shell / Layout

A shell é um thin layout da biblioteca Fuse com duas colunas em flex:

```
┌────────────┬──────────────────────────────────────────────────────┐
│  THIN NAV  │  HEADER — h-16 (64px), bg-card, sombra, z-49        │
│   80px     │  [☰]  [fullscreen] [zaps saldo] [notif] [apps] [user]│
│  altura    ├──────────────────────────────────────────────────────┤
│  total     │  CONTENT AREA (flex-auto, overflow-auto)              │
│            │  padding: pt-3 px-3                                  │
│ [LOGO 80px]│  Page header: ícone + h1 (mt-4 mb-6)                │
│ [school]   │  Conteúdo da rota, full width, scrollável            │
│ [people]   │                                                      │
│ [settings] │                                                      │
└────────────┴──────────────────────────────────────────────────────┘
```

**Medidas exatas:**

- Sidebar: `80px` — ícones centered, sem labels, itens `64px` altura
- Logo topo sidebar: `h-20` (80px)
- Header: `64px` (`h-16`)
- Sidebar bg: `var(--mat-sys-primary)` (roxo dinâmico do cliente)
- Ícones sidebar: brancos/semi-transparentes; ativo: branco sólido com fundo levemente claro
- Header bg: `var(--mat-sys-surface)` ou `bg-card`, com sombra
- Content bg: `var(--mat-sys-surface)` — tom lavanda muito claro

**Navegação (3 itens):**

- `school` → Cursos (`/courses`)
- `people` → Usuários (`/users`)
- `settings` → Painel de Gestão (`/settings`)

---

## 2. Tokens de Design

### Cores

A aplicação é **white-label**: todas as cores primárias são CSS custom properties geradas em runtime via `ThemingService` a partir da cor do cliente.

| Token                              | Uso                                                     |
| ---------------------------------- | ------------------------------------------------------- |
| `var(--mat-sys-primary)`           | Botões primários, sidebar bg, badges ativos, toggles on |
| `var(--mat-sys-on-primary)`        | Texto sobre primário                                    |
| `var(--mat-sys-surface)`           | Background do content area                              |
| `var(--mat-sys-on-surface)`        | Texto principal                                         |
| `var(--mat-sys-surface-container)` | Cards de stat, containers secundários                   |
| `var(--mat-sys-outline)`           | Bordas de inputs, linhas de tabela                      |

**Cores semânticas fixas (status de matrícula e curso):**

```
Em Criação  → #ff9800 (laranja) — dot + texto
Publicado   → #4dc7ac (verde)   — dot + texto
Completou   → #4dc7ac (verde)
Iniciou     → #5c6bc0 (azul)
Aguardando  → #ff9800 (laranja)
Recusou     → #ef5350 (vermelho)
Cancelada   → #9e9e9e (cinza)
```

**Sync warning icon:** `warning` (Material) em `#ff9800` — indica usuário não sincronizado com WhatsApp.

### Tipografia

- Família: Roboto Flex (variável)
- Escala: Angular Material M3

### Border radius

- Botões: `pill` (totalmente arredondado) para botões de ação primária
- Cards: `rounded-lg` (~8px)
- Inputs: `rounded-sm` (4px) — Material outline

---

## 3. Componentes Globais Recorrentes

### Tabela padrão (CDK Table)

```
[Checkbox] | Coluna 1 | Coluna 2 | ... | Menu
─────────────────────────────────────────────
[  ]       | dado     | dado     | ... |  ⋮
```

- Header: fundo branco/surface, `font-medium`, sortable com ícone
- Rows: `border-bottom`, hover sutil
- Row actions: ícones no final (edit/delete) ou botão de menu
- Footer: `Itens por página [select]` + `X - Y de Z` + `|< < > >|`

### Page header padrão

```html
<mat-icon>icon_name</mat-icon>
<h1>Título da Página</h1>
[botões de ação no canto direito]
```

Padding: `pt-3 px-3 mb-6`

### Search bar

Input outline full-width com ícone de busca. Às vezes acompanhado de botão de filtro (funil) e botão de export.

### Botões

- Primário: `mat-flat-button` pill roxo — ex: "Criar", "Matricular", "Aplicar"
- Secundário: `mat-stroked-button` pill — ex: "Cancelar", "Limpar", "Voltar"
- Ícone: `mat-icon-button` — ex: edit pencil, delete trash
- Split button: botão + `mat-icon-button` com chevron para dropdown de ações

### Status badge

```
● Em Criação   (dot colorido + texto)
● Publicado
```

### Dialog padrão

- Título no topo (texto simples, não toolbar)
- Form fields `appearance="outline"` dentro
- Footer: `Cancelar` (stroked) + `OK` (flat, pill)
- Largura: ~400–450px centralizado com backdrop semitransparente

---

## 4. Inventário de Telas

### 4.1 Lista de Cursos (`/courses`)

📸 `screens/courses.png`

**Layout:** Page header + toolbar de filtro + tabela CDK + paginação

**Page header:**

- Ícone: `school`
- Título: "Cursos"
- Ações direita: `[Criar]` (flat pill roxo) + ícone de estatísticas

**Toolbar:**

- Ícone funil (filtro)
- Ícone lupa
- Input: "Pesquisar por..."

**Tabela — colunas:**
| Col | Tipo | Observações |
|---|---|---|
| Thumbnail | 60×60px imagem | placeholder cinza com ilustração |
| Nome | texto + sortable | |
| Proprietário | texto + sortable | |
| Categoria | texto + sortable | |
| Criação | data + sortable | formato dd/MM/yyyy |
| Duração | texto + sortable | "--:--" se sem conteúdo |
| Inscritos | número | |
| Final. | número | finalizações |
| Status | badge colorido + sortable | "Em Criação" (laranja) / "Publicado" (verde) |
| Menu | icon-button | abre detail do curso |

---

### 4.2 Detalhe do Curso (`/courses/:id`)

📸 `screens/course-detail.png` | `screens/course-detail-menu.png`

**Layout:** Banner hero full-width + seção de info + descrição

**Hero banner:**

- Imagem de fundo full-width, ~200px altura
- Nome do curso (texto branco sobre banner)
- Data de criação (texto secundário)
- Canto direito: avatar do criador + "Curso criado por [nome]"
- Badge de status no canto inferior direito do banner

**Seção de info (abaixo do banner):**

- Ícones de tipo de conteúdo com badge numérico (imagem, quiz, vídeo)
- Stats: `Duração`, `Inscritos X pessoas`, `Finalizaram X pessoas`
- Botões: `↓ Gerar relatórios` (stroked split) + `Gerenciar matrículas` (flat) + `⌄` (split button dropdown)
  - Dropdown options: **Editar**, **Transferir**, **Excluir**

**Seção descrição:**

- Título "Descrição" com botão de edição inline (ícone lápis)
- Texto da descrição

---

### 4.3 Formulário de Curso — Step 1: Informações (`/courses/new/form` ou `/courses/:id/form`)

📸 `screens/course-create-step1.png` | `screens/course-create-step1-bottom.png`

**Layout:** Stepper horizontal (3 steps) + formulário vertical

**Stepper:**

```
[1] Informações ——————— [2] Conteúdos ——————— [3] Finalização
```

Steps: círculo numerado + label abaixo. Step ativo: roxo sólido. Inativo: outline.

**Conteúdo do step 1:**

- Tabs: "Imagem de Banner" | "Imagem de Card"
- Upload area com placeholder illustration + botão "Selecione ou arraste uma imagem"
- `Nome do Curso *` — input outline com contador `0/100`
- `Categoria *` — select outline
- `Linguagem *` — select outline
- `Descrição *` — textarea outline com contador `0/200`
- `Mensagem introdutória` — input outline
  - Hint: "Suporta markdown do WhatsApp" + link "Ver guia"
- **Cálculo de desempenho** (seção):
  - Título + descrição
  - `Conteúdo:` slider (0–10) com valor ao lado
  - `Questionário:` slider (0–10) com valor ao lado
- **Ajustes Extras** (seção):
  - `Curso ativo?` — mat-slide-toggle (on por padrão)
  - `Desativar envio do certificado?` — mat-slide-toggle (off por padrão)

**Footer:** `[Cancelar]` (stroked) + `[Salvar]` (flat, disabled até validar)

---

### 4.4 Formulário de Curso — Step 2: Conteúdos (`/courses/:id/form/contents`)

📸 `screens/course-form-step2-contents.png`

**Layout:** Input de nova lição + acordeão de lições

**Input nova lição:**

- `Nome da Lição` input outline + botão `+` (disabled quando vazio)

**Acordeão de lições:**

- Header da lição: nome + chevron expand/collapse
- Dentro de cada lição (expanded):
  - Lista de conteúdos com: ícone de tipo + nome do arquivo + data de upload
  - Por conteúdo: select "Enviar em" + select "Período" + ícone editar + ícone excluir
  - Ao final da lista: radio "Novo Conteúdo" + radio "-"

**Popover "Subir Conteúdo"** (ao clicar "Novo Conteúdo"):
📸 `screens/dialog-add-content.png`

- 2 cards grandes com ícone + label: **Arquivo** | **Quiz**
- Fundo roxo/primário nos cards

**Footer:** `[Voltar]` + `[Revisar e Publicar]` (flat)

---

### 4.5 Formulário de Curso — Step 3: Finalização (`/courses/:id/form/finish`)

📸 `screens/course-form-step3-finish.png`

**Layout:** Timeline visual do curso

**Timeline:**

- Título "Timeline do Curso"
- Linha vertical central
- Itens alternando lados esquerdo/direito:
  - Nome da lição (subtítulo)
  - Nome do arquivo (título do item)
  - `Manhã - 1 dia após a matrícula` (ícone relógio + texto)
  - Ícone de tipo de conteúdo à direita

**Footer:** `[Voltar]` + `[Publicar o Curso]` (flat roxo)

---

### 4.6 Lista de Usuários (`/users`)

📸 `screens/users.png`

**Layout:** Page header + search + tabela CDK + paginação

**Page header:**

- Ícone: `people`
- Título: "Lista de usuários"
- Ações: `↓ Relatório dos usuários` (stroked pill com ícone download)

**Toolbar:**

- Search: input full-width "Pesquise por usuário, celular ou email" com ícone lupa
- Abaixo: chip/button "Remover selecionados" (disabled quando nada selecionado)

**Tabela — colunas:**
| Col | Tipo |
|---|---|
| Checkbox | select row |
| Avatar | imagem circular 40px + fallback placeholder cinza |
| Usuário (nome) | texto + sortable |
| E-mail | texto + sortable |
| Celular | texto + sortable |
| Tags | texto + sortable |
| Sync | ícone warning laranja (`#ff9800`) se não sincronizado |
| Menu | ícone edit (lápis) + ícone delete (lixeira) |

---

### 4.7 Matrículas do Curso (`/courses/:id/enrollments`)

📸 `screens/course-enrollments.png` | `screens/course-enrollments-menu.png`

**Layout:** Page header + filtros + tabela

**Page header:**

- Botão voltar `←`
- Título: "Matrículas - [nome do curso]"
- Ação: `⌄ Matricular` (flat roxo split button)
  - Dropdown: **+ Matrícula individual** | **+ Matrícula em lote** | **↓ Modelo planilha**

**Filtros ("O que você procura?"):**

- Status chips: `● Completou` `○ Iniciou` `● Aguardando` `● Recusou` `○ Cancelada`
- Date pickers: "Data de início" + "Data de conclusão"
- Performance range: `[0] % — [100] %`
- Search: "Pesquise por usuário ou celular" + `[Limpar]` + `[Aplicar]`

**Tabela — colunas:**
| Col |
|---|
| Usuário (nome) |
| Curso (na tela global) |
| Celular |
| Início |
| Fim |
| Perf. |
| Msg. |
| Status |
| Menu |

---

### 4.8 Painel de Gestão > Gestão de Matrículas (`/settings/enrollments`)

📸 `screens/settings-enrollments.png`

**Layout:** Page header + tabs + stat cards + filtros + tabela

**Page header:**

- Ícone: `settings`
- Título: "Painel de gestão"

**Tabs:** `Gestão de matrículas` (ativa) | `Geral`

**Stat cards (grid 4 colunas):**

1. Card destaque (roxo/primário): número grande + "Total de usuários"
2. Card neutro: número + "Total de mensagens enviadas"
3. Card multi-linha: "Matrículas em aberto `0`" + "Aguardando confirmação `0`"
4. Card multi-linha: "Previsão de mensagens a enviar `0`" + "Mensagens enviadas no mês `0`"

**Filtros + tabela:** igual à tela de Matrículas do Curso (sem coluna Curso)

---

### 4.9 Painel de Gestão > Geral (`/settings/general`)

📸 `screens/settings-general.png`

**Layout:** Page header + tabs + grid 3 colunas

**Grid 3 colunas (igual largura):**

**Col 1 — Comunicação:**

- Título `h3` + descrição
- `mat-slide-toggle` + label para cada opção:
  - Envio de conteúdo no WhatsApp (disabled)
  - Recomendação de cursos
  - Reengajamento
  - Respostas ao bot

**Col 2 — Matrícula e Acesso:**

- Título `h3` + descrição
- Input outline: "Cancelamento por inatividade (dias)"
- Input outline: "Expiração de links (dias) \*" (valor padrão: 7)

**Col 3 — Portal de Cursos:**

- Título `h3` + descrição
- Input outline: "URL do portal de cursos"

---

## 5. Dialogs

### Dialog: Matrícula Individual

📸 `screens/dialog-enrollment-individual.png`

**Título:** "Matrículas | Cadastro e Matrícula do Usuário"

**Campos:**

- `Telefone` — country picker `+55 ▾` + input número
- `Nome *` — input outline
- `E-mail` — input outline
- `Tags` — input outline com contador `0/30`
- `Fuso Horário *` — autocomplete select

**Footer:** `[Cancelar]` + `[OK]` (disabled enquanto inválido)

---

### Dialog: Matrícula em Lote

📸 `screens/dialog-enrollment-batch.png`

**Título:** "Matrículas | Importar Usuários"

**Subtítulo:** "Cadastro e Matrícula"

**Conteúdo:**

- Alerta: "IMPORTANTE: Os telefones devem estar preenchidos de forma completa, com DDI e DDD (ex.: 55 48 999990000)."
- Botão grande: `📎 Selecione o Arquivo` (flat roxo, full-width)
- `Fuso Horário` — autocomplete select

**Footer:** `[Cancelar]` + `[OK]` (disabled)

---

### Dialog: Editar Usuário

📸 `screens/dialog-user-edit.png`

**Título:** "Editar Usuário"

**Campos:**

- `Telefone` — country picker + input (preenchido)
- `Nome *` — input outline (preenchido)
- `E-mail` — input outline (preenchido)
- `Tags` — input outline

**Footer:** `[Cancelar]` + `[OK]`

---

## 6. Padrões de UX Recorrentes

| Padrão                | Implementação                                                   |
| --------------------- | --------------------------------------------------------------- |
| Split button          | `mat-flat-button` + `mat-icon-button` com `[matMenuTriggerFor]` |
| Confirm action        | Dialog simples com título + mensagem + Cancelar/Confirmar       |
| Empty state           | Texto centralizado "Nenhum resultado encontrado."               |
| Loading state         | Skeleton rows (progress bars) na tabela                         |
| Form validation       | Erro inline abaixo do campo, botão submit disabled              |
| Page back             | Botão `←` (mat-icon-button) no page header                      |
| Accordion             | `mat-expansion-panel` sem modo multi                            |
| Status chips (filtro) | Legenda colorida clicável, não usa mat-chip                     |

---

## 7. Instruções para Reprodução no Stitch

Ao gerar telas no Stitch para reprodução fiel do SmartZap:

1. **Leia este arquivo** e o `DESIGN.md` raiz do workspace antes de qualquer geração
2. **Consulte o screenshot** correspondente à tela em `screens/`
3. **Use o prompt estruturado** abaixo como base:

```
SmartZap Admin Panel — [NOME DA TELA].
Shell: thin icon-only sidebar (80px, solid primary purple) on the left + header bar (64px, white/surface, shadow) on the right.
Content starts after header. Background: very light lavender surface.
Framework: Angular Material M3 with dynamic color (CSS custom properties var(--mat-sys-*)).
All colors are CSS vars, NOT hardcoded hex. Use violet/purple as visual reference for primary.
Components: outline form fields, pill-shaped filled/stroked buttons, CDK data tables, slide toggles, mat-expansion-panel accordions.
Icons: Material Symbols Outlined.
[DESCRIÇÃO ESPECÍFICA DA TELA baseada nas seções acima]
```

4. **Após geração**: converter para Angular seguindo as regras da skill `stitch-screen`
