import { Component } from '@angular/core';
import {
  DefaultLangChangeEvent,
  LangChangeEvent,
  TranslateService,
  TranslationChangeEvent
} from '@ngx-translate/core';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})

export class SelectLanguageComponent {
  siteLanguage = 'English';

  languageList = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
  ];

  constructor(private translate: TranslateService) {
    this.translate.onLangChange
      .subscribe((event: LangChangeEvent) => {
        // console.log('onLangChange', event);
      });

    this.translate.onTranslationChange
      .subscribe((event: TranslationChangeEvent) => {
        // console.log('onTranslationChange', event);
      });

    this.translate.onDefaultLangChange
      .subscribe((event: DefaultLangChangeEvent) => {
        // console.log('onDefaultLangChange', event);
      });
  }

  changeSiteLanguage(localeCode: string): void {
    const selectedLanguage = this.languageList
      .find((language) => language.code === localeCode)
      ?.label.toString();

    if (selectedLanguage) {
      this.siteLanguage = selectedLanguage;
      this.translate.use(localeCode);
    }

    const currentLanguage = this.translate.currentLang;
    // console.log('currentLanguage', currentLanguage);
  }
}
