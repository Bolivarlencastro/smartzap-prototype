import { computed, Injectable, signal } from '@angular/core';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { Language, LanguagesApi, LanguageTypes } from '../my-account-sdk';
import { UserProfileService } from '../services';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  readonly languages = signal<Language[]>([]);
  readonly languagesTypes = computed(() => this.languages().map((language) => language.name));

  constructor(
    private languagesApi: LanguagesApi,
    private userProfileService: UserProfileService,
  ) {
    this.loadLanguagesWhenUserIsSet();
  }

  private loadLanguagesWhenUserIsSet() {
    this.userProfileService.user$
      .pipe(
        filter((user) => !!user),
        take(1),
        switchMap(() => this.loadLanguages()),
      )
      .subscribe();
  }

  private loadLanguages() {
    return this.languagesApi.fetchLanguages().pipe(
      map((languages) => languages.map((language) => this.upperCaseLanguageSuffix(language))),
      tap({
        next: (languages) => this.languages.set(languages),
      }),
    );
  }

  private upperCaseLanguageSuffix(language: Language): Language {
    const splitName = language.name.split('-');
    if (splitName.length > 1) {
      const updatedName = `${splitName.at(0)}-${splitName.at(1).toUpperCase()}`;

      return { ...language, name: updatedName as LanguageTypes };
    }
    return language;
  }
}
