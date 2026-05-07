import {
  computed,
  DOCUMENT,
  effect,
  EnvironmentProviders,
  inject,
  Injectable,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  Signal,
  signal,
} from '@angular/core';
import { argbFromHex, DynamicScheme, Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities';

const DEFAULT_PRIMARY_COLOR = '#875DAB';

export function provideTheming(): EnvironmentProviders {
  return makeEnvironmentProviders([
    ThemingService,
    provideEnvironmentInitializer(() => {
      inject(ThemingService);
    }),
  ]);
}

@Injectable()
export class ThemingService {
  private document = inject(DOCUMENT);
  private readonly themeColor = signal<string>(DEFAULT_PRIMARY_COLOR);
  private readonly darkMode = signal<boolean>(true);
  private readonly themeSchemes: Signal<DynamicScheme[]>;

  constructor() {
    this.themeSchemes = this.computeThemeSchemes();
    this.createThemeEffect();
    this.createDarkModeEffect();
  }

  setThemeColor(colorHex: string, darkMode: boolean) {
    this.themeColor.update(() => colorHex);
    this.darkMode.update(() => darkMode);
  }

  private computeThemeSchemes() {
    return computed(() => {
      const primaryColor = this.themeColor();
      if (!primaryColor) {
        return [];
      }
      const sourceColorHct = Hct.fromInt(argbFromHex(primaryColor));
      const primaryLightScheme = this.getDynamicScheme(sourceColorHct, false);
      const primaryDarkScheme = this.getDynamicScheme(sourceColorHct, true);
      const navLightScheme = this.getDynamicScheme(sourceColorHct, false, 5);
      const navDarkScheme = this.getDynamicScheme(sourceColorHct, true, 5);
      return [primaryLightScheme, primaryDarkScheme, navLightScheme, navDarkScheme];
    });
  }

  private createDarkModeEffect() {
    effect(() => {
      const darkMode = this.darkMode();
      this.document.documentElement.style.setProperty('color-scheme', darkMode ? 'dark' : 'light');
    });
  }

  private createThemeEffect() {
    effect(() => {
      const schemes = this.themeSchemes();
      if (!schemes?.length) {
        return;
      }
      const [lightScheme, darkScheme, navLightScheme, navDarkScheme] = this.themeSchemes();
      const properties = this.getThemeProperties(lightScheme, darkScheme);
      const navMenuProperties = this.getNavMenuProperties(navLightScheme, navDarkScheme);
      const sheet = new CSSStyleSheet();
      const cssRules: string[] = [];

      for (const [property, [lightArgb, darkArgb]] of Object.entries(properties)) {
        cssRules.push(`${property}: light-dark(${hexFromArgb(lightArgb)}, ${hexFromArgb(darkArgb)});`);
      }

      for (const [property, [lightArgb, darkArgb]] of Object.entries(navMenuProperties)) {
        cssRules.push(`${property}: light-dark(${hexFromArgb(lightArgb)}, ${hexFromArgb(darkArgb)});`);
      }

      const rules = cssRules.join(`\n`);
      const cssContent = `:root {\n${rules}\n}`;

      sheet.replaceSync(cssContent);
      this.document.adoptedStyleSheets = [...this.document.adoptedStyleSheets, sheet];
    });
  }

  private getDynamicScheme(sourceColorHct: Hct, isDark: boolean, contentVariant = 1) {
    // From https://github.com/material-foundation/material-color-utilities/blob/ca894db8b6aebb2833f1805ae61573c92e3f1660/typescript/scheme/scheme_content.ts
    // but without the DislikeAnalyzer to ensure the given colors are not changed.
    // This should be the same effect as checking the 'Color match' checkbox in
    // the material theme builder https://material-foundation.github.io/material-theme-builder
    // const CONTENT_VARIANT = 1; // Variant.NEUTRAL
    const CONTRAST_LEVEL = 0;
    const SECONDARY_CHROMA_REDUCTION = 32.0;
    const SECONDARY_CHROMA_MULTIPLIER = 0.5;
    const NEUTRAL_CHROMA_DIVIDER = 8.0;
    const NEUTRAL_VARIANT_ADDITION = 4.0;

    return new DynamicScheme({
      sourceColorArgb: sourceColorHct.toInt(),
      variant: contentVariant,
      contrastLevel: CONTRAST_LEVEL,
      isDark,
      primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma),
      secondaryPalette: TonalPalette.fromHueAndChroma(
        sourceColorHct.hue,
        Math.max(
          sourceColorHct.chroma - SECONDARY_CHROMA_REDUCTION,
          sourceColorHct.chroma * SECONDARY_CHROMA_MULTIPLIER,
        ),
      ),
      tertiaryPalette: TonalPalette.fromHct(sourceColorHct),
      neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / NEUTRAL_CHROMA_DIVIDER),
      neutralVariantPalette: TonalPalette.fromHueAndChroma(
        sourceColorHct.hue,
        sourceColorHct.chroma / NEUTRAL_CHROMA_DIVIDER + NEUTRAL_VARIANT_ADDITION,
      ),
    });
  }

  private getThemeProperties(light: DynamicScheme, dark: DynamicScheme) {
    return {
      '--mat-sys-surface-dim': [light.surfaceDim, dark.surfaceDim],
      '--mat-sys-surface-bright': [light.surfaceBright, dark.surfaceBright],
      '--mat-sys-surface-container-lowest': [light.surfaceContainerLowest, dark.surfaceContainerLowest],
      '--mat-sys-surface-container-low': [light.surfaceContainerLow, dark.surfaceContainerLow],
      '--mat-sys-surface-container': [light.surfaceContainer, dark.surfaceContainer],
      '--mat-sys-surface-container-high': [light.surfaceContainerHigh, dark.surfaceContainerHigh],
      '--mat-sys-surface-container-highest': [light.surfaceContainerHighest, dark.surfaceContainerHighest],
      '--mat-sys-primary': [light.primary, dark.primary],
      '--mat-sys-primary-fixed': [light.primaryFixed, dark.primaryFixed],
      '--mat-sys-primary-fixed-dim': [light.primaryFixedDim, dark.primaryFixedDim],
      '--mat-sys-on-primary': [light.onPrimary, dark.onPrimary],
      '--mat-sys-on-primary-fixed': [light.onPrimaryFixed, dark.onPrimaryFixed],
      '--mat-sys-on-primary-fixed-variant': [light.onPrimaryFixedVariant, dark.onPrimaryFixedVariant],
      '--mat-sys-primary-container': [light.primaryContainer, dark.primaryContainer],
      '--mat-sys-on-primary-container': [light.onPrimaryContainer, dark.onPrimaryContainer],
      '--mat-sys-secondary': [light.secondary, dark.secondary],
      '--mat-sys-on-secondary': [light.onSecondary, dark.onSecondary],
      '--mat-sys-secondary-container': [light.secondaryContainer, dark.secondaryContainer],
      '--mat-sys-secondary-fixed': [light.secondaryFixed, dark.secondaryFixed],
      '--mat-sys-on-secondary-fixed': [light.onSecondaryFixed, dark.onSecondaryFixed],
      '--mat-sys-secondary-fixed-dim': [light.secondaryFixedDim, dark.secondaryFixedDim],
      '--mat-sys-on-secondary-fixed-variant': [light.onSecondaryFixedVariant, dark.onSecondaryFixedVariant],
      '--mat-sys-on-secondary-container': [light.onSecondaryContainer, dark.onSecondaryContainer],
      '--mat-sys-tertiary': [light.tertiary, dark.tertiary],
      '--mat-sys-on-tertiary': [light.onTertiary, dark.onTertiary],
      '--mat-sys-tertiary-container': [light.tertiaryContainer, dark.tertiaryContainer],
      '--mat-sys-on-tertiary-container': [light.onTertiaryContainer, dark.onTertiaryContainer],
      '--mat-sys-on-tertiary-fixed': [light.onTertiaryFixed, dark.onTertiaryFixed],
      '--mat-sys-on-tertiary-fixed-variant': [light.onTertiaryFixedVariant, dark.onTertiaryFixedVariant],
      '--mat-sys-tertiary-fixed': [light.tertiaryFixed, dark.tertiaryFixed],
      '--mat-sys-tertiary-fixed-dim': [light.tertiaryFixedDim, dark.tertiaryFixedDim],
      '--mat-sys-neutral-variant20': [light.neutralVariantPalette.tone(20), dark.neutralVariantPalette.tone(20)],
      '--mat-sys-neutral10': [light.neutralVariantPalette.tone(10), dark.neutralVariantPalette.tone(10)],
      '--mat-sys-error': [light.error, dark.error],
      '--mat-sys-on-error': [light.onError, dark.onError],
      '--mat-sys-error-container': [light.errorContainer, dark.errorContainer],
      '--mat-sys-on-error-container': [light.onErrorContainer, dark.onErrorContainer],
      '--mat-sys-background': [light.background, dark.background],
      '--mat-sys-on-background': [light.onBackground, dark.onBackground],
      '--mat-sys-surface': [light.surface, dark.surface],
      '--mat-sys-on-surface': [light.onSurface, dark.onSurface],
      '--mat-sys-surface-tint': [light.surfaceTint, dark.surfaceTint],
      '--mat-sys-surface-variant': [light.surfaceVariant, dark.surfaceVariant],
      '--mat-sys-on-surface-variant': [light.onSurfaceVariant, dark.onSurfaceVariant],
      '--mat-sys-outline': [light.outline, dark.outline],
      '--mat-sys-outline-variant': [light.outlineVariant, dark.outlineVariant],
      '--mat-sys-shadow': [light.shadow, dark.shadow],
      '--mat-sys-scrim': [light.scrim, dark.scrim],
      '--mat-sys-inverse-surface': [light.inverseSurface, dark.inverseSurface],
      '--mat-sys-inverse-on-surface': [light.inverseOnSurface, dark.inverseOnSurface],
      '--mat-sys-inverse-primary': [light.inversePrimary, dark.inversePrimary],
      '--mat-table-row-item-outline-color': [light.outlineVariant, dark.outlineVariant],
    };
  }

  private getNavMenuProperties(light: DynamicScheme, dark: DynamicScheme) {
    return {
      '--kp-navigation-container': [light.primaryContainer, dark.primaryContainer],
      '--kp-on-navigation-container': [light.onPrimaryContainer, dark.onPrimaryContainer],
    };
  }
}
