import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'kp-language-color-tag',
  templateUrl: './kp-language-color-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KpLanguageColorTagComponent {
  public languageColor: string[];

  @HostBinding('class') classes = 'flex items-center';

  static getLanguageColor(language: LanguageTypes): string[] {
    const languageColor: Record<LanguageTypes, string[]> = {
      'pt-BR': ['#00CBAB', '#FFB100'],
      en: ['#FF4D4D', '#364DFA'],
      es: ['#FFB100', '#FF4D4D'],
      'pt-PT': ['#006600', '#FF0000'],
    };
    return languageColor[language] ?? ['#00CBAB', '#FFB100'];
  }

  @Input() set language(lang: LanguageTypes) {
    this.languageColor = KpLanguageColorTagComponent.getLanguageColor(lang);
  }

  get backgroundImage() {
    if (this.languageColor) {
      return `linear-gradient(to right, ${this.languageColor[0]} 50%, ${this.languageColor[1]} 50%`;
    }

    return '';
  }
}
