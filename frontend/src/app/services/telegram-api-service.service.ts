import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class TelegramApiServiceService {

  private window;
  private tg;
  constructor(@Inject(DOCUMENT) private _document) {

    this.window = this._document.defaultView;
    this.tg = this.window.Telegram.WebApp;
  }
}
