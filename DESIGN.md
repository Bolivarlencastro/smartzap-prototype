---
name: Keeps SmartZap
colors:
  # ── DYNAMIC COLORS ────────────────────────────────────────────────────────────
  # ALL brand colors below are CSS custom properties, not fixed hex values.
  # They are computed at runtime by ThemingService (libs/core/src/lib/services/theming/)
  # from a single client-supplied hex color using Material Color Utilities (HCT space).
  # The values shown are the DEFAULT fallback (#875DAB) for development only.
  # Never hardcode these in components — always reference the --mat-sys-* variable.

  primary: 'var(--mat-sys-primary)'
  on-primary: 'var(--mat-sys-on-primary)'
  primary-container: 'var(--mat-sys-primary-container)'
  on-primary-container: 'var(--mat-sys-on-primary-container)'
  primary-fixed: 'var(--mat-sys-primary-fixed)'
  primary-fixed-dim: 'var(--mat-sys-primary-fixed-dim)'
  inverse-primary: 'var(--mat-sys-inverse-primary)'

  secondary: 'var(--mat-sys-secondary)'
  on-secondary: 'var(--mat-sys-on-secondary)'
  secondary-container: 'var(--mat-sys-secondary-container)'
  on-secondary-container: 'var(--mat-sys-on-secondary-container)'

  tertiary: 'var(--mat-sys-tertiary)'
  on-tertiary: 'var(--mat-sys-on-tertiary)'
  tertiary-container: 'var(--mat-sys-tertiary-container)'
  on-tertiary-container: 'var(--mat-sys-on-tertiary-container)'

  surface: 'var(--mat-sys-surface)'
  surface-dim: 'var(--mat-sys-surface-dim)'
  surface-bright: 'var(--mat-sys-surface-bright)'
  surface-container-lowest: 'var(--mat-sys-surface-container-lowest)'
  surface-container-low: 'var(--mat-sys-surface-container-low)'
  surface-container: 'var(--mat-sys-surface-container)'
  surface-container-high: 'var(--mat-sys-surface-container-high)'
  surface-container-highest: 'var(--mat-sys-surface-container-highest)'
  on-surface: 'var(--mat-sys-on-surface)'
  on-surface-variant: 'var(--mat-sys-on-surface-variant)'
  inverse-surface: 'var(--mat-sys-inverse-surface)'
  inverse-on-surface: 'var(--mat-sys-inverse-on-surface)'

  outline: 'var(--mat-sys-outline)'
  outline-variant: 'var(--mat-sys-outline-variant)'

  error: 'var(--mat-sys-error)'
  on-error: 'var(--mat-sys-on-error)'
  error-container: 'var(--mat-sys-error-container)'
  on-error-container: 'var(--mat-sys-on-error-container)'

  # Navigation drawer (derived from primary-container, separate DynamicScheme variant)
  navigation-container: 'var(--kp-navigation-container)'
  on-navigation-container: 'var(--kp-on-navigation-container)'

  # ── FIXED COLORS ──────────────────────────────────────────────────────────────
  # These are semantic and NEVER change regardless of client branding.

  # Enrollment states
  status-started: '#002daa'
  status-waiting: '#f47c52'
  status-completed: '#4dc7ac'
  status-canceled: '#b5b5b5'
  status-refused: '#f25a4d'
  status-empty: '#7a7a7a'

  # Message delivery states (SmartZap schedule)
  status-delivered: '#5dc794'
  status-error: '#ff5959'
  status-failed: '#ce8d50'
  status-pending: '#ffb100'
  status-sent: '#5972ff'

  # WhatsApp brand — exclusively for WhatsApp redirect/support actions
  whatsapp: '#34af23'

typography:
  display-large:
    fontFamily: Roboto Flex
    fontSize: 3.562rem
    fontWeight: '400'
    lineHeight: 4rem
    letterSpacing: -0.016rem

  headline-1:
    fontFamily: Roboto Flex
    fontSize: 1.875rem
    fontWeight: '800'
    lineHeight: 2.25rem

  headline-2:
    fontFamily: Roboto Flex
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: 1.75rem

  headline-3:
    fontFamily: Roboto Flex
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.75rem

  headline-4:
    fontFamily: Roboto Flex
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem

  title-large:
    fontFamily: Roboto Flex
    fontSize: 1.375rem
    fontWeight: '400'
    lineHeight: 1.75rem

  title-medium:
    fontFamily: Roboto Flex
    fontSize: 1rem
    fontWeight: '500'
    lineHeight: 1.5rem
    letterSpacing: 0.009rem

  title-small:
    fontFamily: Roboto Flex
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.006rem

  body-large:
    fontFamily: Roboto Flex
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0.031rem

  body-medium:
    fontFamily: Roboto Flex
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.5rem

  body-small:
    fontFamily: Roboto Flex
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: 0.025rem

  label-large:
    fontFamily: Roboto Flex
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.006rem

  label-medium:
    fontFamily: Roboto Flex
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.031rem

  label-small:
    fontFamily: Roboto Flex
    fontSize: 0.688rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.031rem

  caption:
    fontFamily: Roboto Flex
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem

rounded:
  none: 0
  extra-small: 4px
  small: 8px
  DEFAULT: 12px
  large: 16px
  extra-large: 28px
  full: 9999px

spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 16px
  page-margin: 20px
  section-gap: 32px

components:
  button-filled:
    backgroundColor: 'var(--mat-sys-primary)'
    textColor: 'var(--mat-sys-on-primary)'
    typography: '{typography.label-large}'
    rounded: '{rounded.full}'
    padding: '0 20px'
    height: 40px

  button-outlined:
    backgroundColor: 'transparent'
    textColor: 'var(--mat-sys-primary)'
    borderColor: 'var(--mat-sys-outline)'
    typography: '{typography.label-large}'
    rounded: '{rounded.full}'
    padding: '0 20px'
    height: 40px

  button-text:
    backgroundColor: 'transparent'
    textColor: 'var(--mat-sys-primary)'
    typography: '{typography.label-large}'
    rounded: '{rounded.full}'
    padding: '0 20px'
    height: 40px

  card:
    backgroundColor: 'var(--mat-sys-surface-container-high)'
    rounded: '{rounded.large}'
    padding: '{spacing.lg}'

  dialog:
    backgroundColor: 'var(--mat-sys-surface)'
    rounded: '{rounded.large}'
    padding: '{spacing.lg}'

  form-field:
    backgroundColor: 'transparent'
    borderColor: 'var(--mat-sys-outline)'
    textColor: 'var(--mat-sys-on-surface)'
    typography: '{typography.body-large}'
    rounded: '{rounded.DEFAULT}'
    appearance: 'outline'

  chip:
    backgroundColor: 'var(--mat-sys-surface-container-high)'
    textColor: 'var(--mat-sys-on-surface-variant)'
    typography: '{typography.label-large}'
    rounded: '{rounded.small}'

  status-badge:
    textColor: '#ffffff'
    typography: '{typography.label-medium}'
    rounded: '{rounded.extra-large}'
    padding: '2px 18px'

  icon:
    size: 24px
    opticalSizing: 24
    weight: 400
    grade: -25

  navigation-drawer:
    backgroundColor: 'var(--kp-navigation-container)'
    textColor: 'var(--kp-on-navigation-container)'
    width: 280px
---

## Overview

SmartZap is Keeps' WhatsApp-based learning automation app — a B2B tool used by company administrators to manage course enrollments, user engagement, and automated message flows via WhatsApp.

**Keeps is a white-label platform.** The primary brand color is supplied per-client and changes at runtime. The entire color system is dynamically generated by `ThemingService` (`libs/core/src/lib/services/theming/theming.service.ts`) from a single client hex value using **Material Color Utilities** (HCT color space). This means there are no fixed brand colors in the codebase — only semantic CSS custom properties (`--mat-sys-*`).

The system has two layers of color:

1. **Dynamic colors** — all `--mat-sys-*` variables, derived from the client's `sourceColor` via M3 Dynamic Color algorithm
2. **Fixed semantic colors** — status badges and the WhatsApp button, which never change regardless of client branding

When designing or generating UI for SmartZap, **always use CSS custom property references, never hardcoded hex values** for brand-related colors.

## Colors

### Dynamic Color System

The `ThemingService` receives a client hex color (e.g., `#875DAB` is the default for local development) and uses `@material/material-color-utilities` to generate two `DynamicScheme` instances (light + dark) plus a separate navigation scheme. These schemes produce all `--mat-sys-*` CSS variables, injected at runtime into `:root` via `document.adoptedStyleSheets`.

The algorithm follows M3's **content variant** scheme — it matches the given color exactly without the `DislikeAnalyzer` correction (equivalent to the "Color match" checkbox in Material Theme Builder). This means the generated primary color will be visually close to the client's brand hex even at low saturation.

Secondary and neutral palettes are derived algorithmically:

- Secondary chroma = `max(primary_chroma - 32, primary_chroma * 0.5)`
- Neutral chroma = `primary_chroma / 8`
- Neutral-variant chroma = `primary_chroma / 8 + 4`

The navigation drawer uses a separate DynamicScheme with `variant: 5` (neutral), producing `--kp-navigation-container` and `--kp-on-navigation-container` which are always tonal and never clash with the primary color.

### Fixed Semantic Colors

These colors are defined in the app stylesheets and are independent of client branding:

**Enrollment states** — appear as pill badges in user and enrollment tables:

- Started: `#002daa` (deep blue)
- Waiting: `#f47c52` (orange)
- Completed: `#4dc7ac` (teal)
- Canceled: `#b5b5b5` (neutral gray)
- Refused / Rejected: `#f25a4d` (red)
- Empty / Null: `#7a7a7a` (medium gray)

**Message delivery states** — appear in schedule and message history views:

- Delivered: `#5dc794` (green)
- Sent: `#5972ff` (blue-purple)
- Pending: `#ffb100` (amber)
- Failed: `#ce8d50` (orange-brown)
- Error: `#ff5959` (bright red)

**WhatsApp brand** — `#34af23` is reserved exclusively for the WhatsApp redirect/support button. Never use it for generic actions or states.

## Typography

The application uses **Roboto Flex** (variable font) as the sole typeface. All weights are achieved through the font's variable axes — no separate font files per weight.

**Heading hierarchy**: `headline-1` (1.875rem/800) for page-level titles — one per view. `headline-2` (1.25rem/700) for section titles inside cards or configuration panels. `headline-3` (1.125rem/600) for subsection labels and card headers.

**Body**: `body-medium` (0.875rem/400) is the default for table rows, descriptions, and metadata. `body-large` (1rem/400) is used in form inputs and paragraph content.

**Labels**: `label-large` (0.875rem/500) exclusively for button text. `label-medium` (0.75rem/500) for status badges, chips, and table column headers.

The M3 type scale (`title-*`, `body-*`, `label-*`) maps directly to Angular Material component slots and must not be overridden per-component.

## Layout

The SmartZap admin uses a **sidebar + content** layout. The navigation drawer is fixed at 280px on desktop and collapses on mobile with a backdrop overlay (`rgba(0,0,0,0.6)`).

Settings pages use a **3-column responsive grid** (`grid-cols-1 lg:grid-cols-3`) to group configuration sections. Data-heavy views (user lists, enrollment tables) use full available width. Form-heavy pages cap at 1100px (`page-layout-container`).

**Breakpoints**: `xxs` 432px, `sm` 600px, `md` 960px, `lg` 1280px, `xl` 1440px.

Spacing follows an **8px base unit**. Internal component gaps: 4–16px. Section separation: 24–32px. Page vertical rhythm: 40px+.

## Elevation & Depth

Elevation uses **surface tonal fills**, not shadows. Surface tokens step progressively:
`surface` → `surface-container-low` → `surface-container` → `surface-container-high` → `surface-container-highest`

Cards use `surface-container-high`. Dialogs use `surface` with the M3 level-2 shadow. Menus and tooltips use level-3. All surface values are dynamic and generated per-client.

Scrollbars use `color-mix(in srgb, var(--mat-sys-outline) 38%, transparent)` — unobtrusive and color-scheme aware.

## Shapes

- **Buttons** (all variants): `border-radius: 9999px`, 40px height, `padding: 0 20px`. Never use squared corners.
- **Dialogs & bottom sheets**: 16px (`rounded.large`)
- **Cards**: 16px (`rounded.large`)
- **FABs**: 16px standard, 12px mini
- **Form fields**: 12px (`rounded.DEFAULT`), outline appearance
- **Chips**: 8px (`rounded.small`)
- **Status badges**: pill-shaped, `padding: 2px 18px`

Never use 0px radius on interactive surfaces. Use `rounded.extra-small` (4px) only for micro elements such as dividers or progress indicators.

## Components

### Buttons

All variants use pill radius (`9999px`) and `label-large` typography. One `button-filled` per screen as the primary CTA — it inherits `--mat-sys-primary` and `--mat-sys-on-primary` automatically from the client theme. Use `button-outlined` for secondary actions, `button-text` for inline or low-priority actions.

### Status Badges

Pill-shaped badges with white text and a fixed semantic background color. The color must match the specific status exactly — never substitute with a dynamic brand color. Enrollment and schedule badges use different color sets.

### Form Fields

Angular Material `outline` appearance. Use `floatLabel="always"` on pre-filled fields. Width: `w-80` (20rem) in settings grids. All boolean settings use `mat-slide-toggle` — not checkboxes.

### Tables

Header rows: `label-large` weight. Body rows: `body-medium`. Hover: `surface-container-high` background. Paginator at bottom, 40px height, `padding: 8px 16px`. Numeric and status columns: center or right-aligned.

### Icons

`Material Symbols Outlined` with `FILL: 0` (default), `wght: 400`, `GRAD: -25`, `opsz: 24`. Switch to `FILL: 1` (`.filled` class) only for active/selected states. Always 24×24px.

### Navigation Drawer

280px width. Background: `--kp-navigation-container`. Text: `--kp-on-navigation-container`. Active item: `primary-container` background, `on-primary-container` text. Both navigation variables are dynamic and client-specific.

## Application Shell

SmartZap Admin usa o **Thin Layout** (`thin-layout`) — um layout vertical com sidebar de ícones e header fixo.

### Estrutura visual

```
┌────────────┬─────────────────────────────────────────────────┐
│  THIN NAV  │  HEADER — h-16 (64px), bg-card, shadow, z-49   │
│   80px     │  [☰ toggle]  [fullscreen] [notif] [bal] [user]  │
│  full      ├─────────────────────────────────────────────────┤
│  height    │  CONTENT AREA                                   │
│            │  flex-auto, overflow-auto, fuseScrollbar        │
│ ┌────────┐ │                                                 │
│ │  LOGO  │ │  pt-3 px-3 (page padding)                       │
│ │  h-20  │ │  Page header: icon + h1 (mt-4 mb-6 px-3)       │
│ │ (80px) │ │  Content: full width, scrollable                │
│ └────────┘ │                                                 │
│            │                                                 │
│ [school]   │                                                 │
│  64px tall │                                                 │
│ [people]   │                                                 │
│  64px tall │                                                 │
│ [settings] │                                                 │
│ [send]     │                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

### Medidas do shell

| Elemento                    | Valor                                                          | Fonte                 |
| --------------------------- | -------------------------------------------------------------- | --------------------- |
| Sidebar (desktop)           | **80px** — `--fuse-vertical-navigation-thin-width`             | `thin.scss`           |
| Logo no topo do sidebar     | 80px (`h-20`)                                                  | `thin.component.html` |
| Cada item de nav            | 64px de altura, `padding: 0 16px`, ícone centrado              | `thin.scss`           |
| Labels dos itens de nav     | **ocultas** — `display: none` no thin mode                     | `thin.scss`           |
| Border-radius do item ativo | 4px                                                            | `thin.scss`           |
| Header                      | 64px (`h-16`), `px-4 md:px-6`                                  | `thin.component.html` |
| Área útil de conteúdo       | `calc(100vw - 80px)` × `calc(100vh - 64px)`                    | calculado             |
| Padding de página           | `pt-3 px-3` (dentro do conteúdo)                               | templates das telas   |
| Page header (icon + título) | `mt-4 mb-6 px-3`                                               | templates das telas   |
| Modo mobile                 | < 960px (`md`): sidebar vira overlay, largura total disponível | `thin.component.ts`   |

### Comportamento responsivo

- **Desktop (≥ 960px)**: sidebar fixo de 72px, modo `side`
- **Mobile (< 960px)**: sidebar fecha automaticamente, modo `over` com backdrop `rgba(0,0,0,0.6)`
- O header sempre permanece visível em ambos os modos

### Navegação (itens do menu)

| Ícone      | Label i18n              | Rota            |
| ---------- | ----------------------- | --------------- |
| `school`   | NAVIGATION.COURSES      | `/courses`      |
| `people`   | NAVIGATION.USERS        | `/users`        |
| `settings` | NAVIGATION.SETTINGS     | `/settings`     |
| `send`     | NAVIGATION.PUSH_MANAGER | `/push-manager` |

### Slots do header (direita para esquerda)

- `kp-user-menu` — avatar e menu do usuário logado
- `kp-menu` — apps switcher (lista de apps disponíveis)
- `kp-notification` — central de notificações
- `kp-toolbar-balance` — saldo de mensagens disponíveis
- `fuse-fullscreen` — botão fullscreen (oculto em mobile)

### Regras para geração de telas no Stitch

Ao gerar uma tela nova no Stitch, o prompt deve considerar que:

- A tela **não inclui** sidebar nem header — eles são fixos no shell
- A área disponível começa **após** o header (64px) e **à direita** do sidebar (72px)
- O background da área de conteúdo é `var(--mat-sys-surface)`
- Toda tela começa com `pt-3` e usa `px-3` como padding lateral mínimo
- Telas com título de página usam: ícone Material (24px) + `h1` com `font-bold` ou `font-semibold`, `mt-4 mb-6 px-3`
- Telas com abas (Settings) usam `mat-tab-nav-bar` abaixo do título

## Do's and Don'ts

**Do:**

- Reference `--mat-sys-*` variables for all brand-related colors in components
- Use `var(--mat-sys-primary)` / `var(--mat-sys-on-primary)` for CTAs
- Keep status colors exactly as defined — they are fixed and must not adapt to the client theme
- Apply `body-medium` as the default text size in tables and descriptions
- Use `mat-slide-toggle` for all boolean on/off settings
- Use `Material Symbols Outlined` with `GRAD: -25, wght: 400, FILL: 0` as the baseline icon config

**Don't:**

- Hardcode any hex value for primary, secondary, or surface colors in components
- Use `ngClass` or `ngStyle` — use `class` and `style` bindings instead
- Use `::ng-deep` for style overrides
- Use BEM naming — Angular's scoped SCSS handles encapsulation
- Use WhatsApp green (`#34af23`) for any action unrelated to WhatsApp redirect
- Mix fixed status colors with dynamic brand colors in the same visual element
- Deviate from the 8px spacing base unit in new components
- Set `standalone: true` on Angular components — it is the default in Angular v20+
