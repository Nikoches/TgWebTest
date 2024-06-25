import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private route: ActivatedRoute) { }

  private infoId: string | undefined;

  private offerInfo = undefined;

  ngOnInit() {
    this.route.queryParams
      .subscribe({
        next:(value) => console.log(),
        complete:() => console.log()}
      );
  }
  title = 'webTitle';
}
