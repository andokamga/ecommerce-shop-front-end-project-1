import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private keyLanguage = 'userLanguage';
  private _userLanguage = '';
  private supportedLanguage = ['en','fr'];
  constructor(private translate:TranslateService) {
    this.initLanguage();
    this.translate.use(this._userLanguage);
  }

  public initLanguage(){
    const value = localStorage.getItem(this.keyLanguage);
    if(value!=null){
      console.log(value)
      this._userLanguage= value
    }else{
      const browserLanguage = navigator.language.split('-')[0];
      this._userLanguage = 'en';
      if(this.supportedLanguage.includes(browserLanguage)){
        this._userLanguage = browserLanguage;
        localStorage.setItem(this.keyLanguage,this._userLanguage);
      }
    }
  }

  public setLanguage(language:string){
    this._userLanguage = language;
    localStorage.setItem(this.keyLanguage,this._userLanguage);
    this.translate.use(this._userLanguage);
  }

  public get userLanguage(){
    return this._userLanguage;
  }

  public getAllSupportedLanguage(){
    return this.supportedLanguage;
  }
}
