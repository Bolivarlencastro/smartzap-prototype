# smartzap-reproduce

Skill para reproduzir fielmente as telas do SmartZap Admin no Stitch, usando as screenshots e o DESIGN.md de referência do estado atual da aplicação.

## Quando usar

Invoque `/smartzap-reproduce` quando precisar:

- Reproduzir uma tela existente do SmartZap no Stitch para servir de base para redesign
- Gerar um prompt rico e preciso para o Stitch a partir de uma tela real
- Passar referência visual + descrição textual para outra sessão Claude com MCP do Stitch

## Localização dos arquivos de referência

```
.claude/smartzap-reference/
├── DESIGN.md          ← Design spec completo do estado atual
└── screens/           ← Screenshots reais da aplicação rodando
    ├── courses.png
    ├── users.png
    ├── settings-general.png
    ├── settings-enrollments.png
    ├── course-detail.png
    ├── course-detail-menu.png
    ├── course-enrollments.png
    ├── course-enrollments-menu.png
    ├── course-create-step1.png
    ├── course-create-step1-bottom.png
    ├── course-form-step2-contents.png
    ├── course-form-step3-finish.png
    ├── dialog-enrollment-individual.png
    ├── dialog-enrollment-batch.png
    ├── dialog-add-content.png
    └── dialog-user-edit.png
```

## Fluxo obrigatório

### 1. Identificar a tela alvo

Perguntar ao usuário (ou inferir do contexto) qual tela reproduzir. Telas disponíveis:

| ID                             | Rota                         | Screenshot                         |
| ------------------------------ | ---------------------------- | ---------------------------------- |
| `courses`                      | `/courses`                   | `courses.png`                      |
| `users`                        | `/users`                     | `users.png`                        |
| `settings-general`             | `/settings/general`          | `settings-general.png`             |
| `settings-enrollments`         | `/settings/enrollments`      | `settings-enrollments.png`         |
| `course-detail`                | `/courses/:id`               | `course-detail.png`                |
| `course-enrollments`           | `/courses/:id/enrollments`   | `course-enrollments.png`           |
| `course-form-step1`            | `/courses/:id/form`          | `course-create-step1.png`          |
| `course-form-step2`            | `/courses/:id/form/contents` | `course-form-step2-contents.png`   |
| `course-form-step3`            | `/courses/:id/form/finish`   | `course-form-step3-finish.png`     |
| `dialog-enrollment-individual` | —                            | `dialog-enrollment-individual.png` |
| `dialog-enrollment-batch`      | —                            | `dialog-enrollment-batch.png`      |
| `dialog-user-edit`             | —                            | `dialog-user-edit.png`             |
| `dialog-add-content`           | —                            | `dialog-add-content.png`           |

### 2. Ler o DESIGN.md de referência

Leia `.claude/smartzap-reference/DESIGN.md` para obter a descrição detalhada da tela alvo: componentes, colunas de tabela, campos de form, padrões de layout.

### 3. Ler o screenshot correspondente

Use a tool `Read` para carregar a imagem `screens/<nome>.png`. Isso dá visibilidade visual ao agente.

### 4. Montar o prompt para o Stitch

Com base no DESIGN.md (seção da tela alvo) + screenshot, montar um prompt estruturado:

```
SmartZap Admin Panel — [NOME DA TELA].

Shell context:
- Thin icon-only sidebar 80px wide, full height, solid primary purple background
- Header bar 64px height, white/surface background, subtle shadow
- Content area fills remaining space, very light lavender surface background
- 3 nav icons in sidebar: school (Courses), people (Users), settings (Management)

Visual reference: [descrever o que está no screenshot com precisão]

Components needed:
[listar componentes da tela]

Layout:
[descrever a estrutura da tela]

Design system:
- Angular Material M3, dynamic color via CSS custom properties (var(--mat-sys-*))
- Primary color = dynamic purple/violet (reference: #875DAB but use CSS vars)
- All brand colors MUST be CSS vars, never hardcoded hex
- Exception: status colors are semantic fixed values
- Buttons: pill-shaped (fully rounded)
- Form fields: outline appearance
- Icons: Material Symbols Outlined style
- Font: Roboto Flex
```

### 5. Usar o MCP do Stitch

Com o prompt montado, usar `mcp__stitch__*` para:

1. Listar projetos e identificar o SmartZap
2. Gerar a tela com o prompt
3. Extrair o HTML gerado

### 6. Converter para Angular

Seguir as regras da skill `stitch-screen` para converter o HTML em componente Angular standalone.

---

## Prompts prontos por tela

### courses (Lista de Cursos)

```
SmartZap Admin Panel — Courses list page.

Shell: thin 80px purple sidebar (school icon active) + 64px white header with hamburger, fullscreen toggle, ZAPS balance chip, notification bell, grid menu, user avatar.

Page content:
- Page header: school icon + h1 "Cursos" + right side: filled pill button "Criar" (primary) + icon button for stats
- Filter toolbar: funnel icon button + search icon button + outline search input "Pesquisar por..."
- CDK data table with columns: [thumbnail 60px] [Nome sortable] [Proprietário sortable] [Categoria sortable] [Criação sortable] [Duração sortable] [Inscritos] [Final.] [Status sortable] [Menu icon-btn]
- 3 rows of data with course thumbnails (gray placeholder illustration), status badges (orange dot "Em Criação", green dot "Publicado")
- Footer: "Itens por página" select + "1 - 3 de 3" + pagination prev/next buttons (disabled)

Status badge style: colored circle dot + text, inline in table cell.
Table rows: border-bottom separator, no outer border.
Background: very light lavender surface.

Angular Material M3, dynamic primary purple (var(--mat-sys-primary)), pill buttons, outline inputs.
```

### users (Lista de Usuários)

```
SmartZap Admin Panel — Users list page.

Shell: thin 80px purple sidebar (people icon active) + 64px white header.

Page content:
- Page header: people icon + h1 "Lista de usuários" + left: stroked pill button with download icon "Relatório dos usuários"
- Search bar: full-width outline input "Pesquise por usuário, celular ou email" with search icon on right
- Action row: "Remover selecionados" button (disabled, with trash icon)
- CDK data table with columns: [checkbox] [avatar 40px circle + name] [E-mail sortable] [Celular sortable] [Tags sortable] [Sync sortable] [Menu: edit icon + delete icon]
- 10 rows with real-looking user data, avatar photos or gray placeholder circles
- Sync column: warning triangle icon in orange (#ff9800) for most users
- Footer pagination: "Itens por página" select [10] + "1 - 10 de 13" + nav buttons

Table rows: border-bottom only, no outer border. Subtle hover state.
Background: very light lavender surface.

Angular Material M3, dynamic primary purple, pill buttons.
```

### settings-general (Configurações Gerais)

```
SmartZap Admin Panel — Management panel General settings tab.

Shell: thin 80px purple sidebar (settings icon active) + 64px white header.

Page content:
- Page header: settings icon + h1 "Painel de gestão"
- Tabs below header: "Gestão de matrículas" | "Geral" (active, with underline indicator)
- Content: 3-column equal-width grid

Column 1 "Comunicação":
  - h3 title + subtitle description text
  - 4 slide toggles with labels (on/off states):
    - "Envio de conteúdo no WhatsApp" (disabled/off)
    - "Recomendação de cursos" (on)
    - "Reengajamento" (on)
    - "Respostas ao bot" (on)

Column 2 "Matrícula e Acesso":
  - h3 title + subtitle description
  - Outline input field: "Cancelamento por inatividade (dias)" (empty)
  - Outline input field: "Expiração de links (dias) *" (value: 7)

Column 3 "Portal de Cursos":
  - h3 title + subtitle description
  - Outline input field: "URL do portal de cursos" (empty)

Angular Material M3, slide toggles use primary purple when on, outline form fields.
```

### dialog-enrollment-individual

```
SmartZap Admin Panel — Enrollment individual dialog, centered modal over dimmed page background.

Dialog (approx 440px wide):
- Title: "Matrículas | Cadastro e Matrícula do Usuário" (plain text, no toolbar)
- Fields stacked vertically:
  1. "Telefone" — country flag picker button "+55 ▾" (filled input style) + phone number text input, combined in one row
  2. "Nome *" — outline input
  3. "E-mail" — outline input
  4. "Tags" — outline input with character counter "0/30"
  5. "Fuso Horário *" — outline autocomplete select
- Footer: "Cancelar" (text/stroked button) + "OK" (filled pill primary, disabled state)

Dialog has subtle elevation shadow, white background, rounded corners.
Background page is dimmed with semi-transparent overlay.
Angular Material M3 dialog, outline form fields, primary purple pill button.
```
