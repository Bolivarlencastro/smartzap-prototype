import { Component, computed, input, output } from '@angular/core';
import { CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'cx-side-section',
  standalone: true,
  template: `
    <img class="cvp-logo" alt="Logo Escola de Negócios Online CVP" src="assets/images/cvp-logo.png" />
    <div class="mobile-content">
      @if (isLoggedIn()) {
        <h1 class="font-bold mb-2">Bem-vindo(a), {{ currentUser()?.name }}!</h1>
      } @else {
        <h1 class="font-bold mb-2">Bem-vindo(a)!</h1>
      }
      <p class="text-sm">Explore o catálogo e inscreva-se nos cursos de seu interesse a qualquer momento.</p>
    </div>

    @if (!isLoggedIn()) {
      <button class="mobile-login" matButton="filled" (click)="onLogin()">Acessar</button>
    }

    <div class="content">
      <h1 class="font-bold mb-8">Bem-vindo à Escola de Negócios Online da Caixa Vida e Previdência!</h1>
      <p class="text-sm">
        Explore o catálogo e inscreva-se nos cursos de seu interesse a qualquer momento. Fique à vontade para voltar
        sempre que precisar de mais informações ou quiser acompanhar as novas oportunidades de aprendizado.
      </p>
      @if (!isLoggedIn()) {
        <button matButton="filled" class="mt-8" (click)="onLogin()">Acessar</button>
      }
    </div>

    <div class="side-section-footer">
      <img class="h-8 w-auto" src="assets/images/caixa-vida-previdencia.png" />
      <img class="h-8 w-auto" src="assets/images/caixa-seguridade.png" />

      <img src="assets/images/vector-cvp.png" class="h-56 w-auto absolute bottom-1" />
    </div>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 5rem 1fr;
      grid-template-rows: 1fr;
      gap: 1rem;
      color: white;
      align-items: center;
    }

    .mobile-login {
      grid-column: 1 / -1;
    }

    .content {
      text-align: center;
      padding: 0 2rem;
      display: none;
      z-index: 2;
    }

    .side-section-footer {
      @apply w-full;
      position: relative;
      justify-self: start;
      align-self: end;
      display: none;
      padding-bottom: 2rem;
      padding-left: 2rem;
      padding-right: 2rem;
      grid-template-columns: auto auto;
      justify-items: center;
      z-index: 1;
    }

    @media (min-width: 640px) {
      :host {
        grid-template-columns: 4rem 1fr min-content;
      }

      .mobile-login {
        grid-row: 1 / 2;
        grid-column: 3 / 4;
      }
    }

    @media (min-width: 960px) {
      :host {
        background-color: #0b2c65;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        justify-items: center;
      }

      .mobile-content,
      .mobile-login {
        display: none;
      }

      .content {
        display: block;
      }

      .side-section-footer {
        display: grid;
      }

      .cvp-logo {
        max-width: 8.75rem;
      }
    }
  `,
  imports: [MatButton],
})
export class SideSectionComponent {
  login = output<void>();
  currentUser = input<CaixaSmartZapUser>();
  readonly isLoggedIn = computed(() => !!this.currentUser()?.id);

  onLogin() {
    this.login.emit();
  }
}
