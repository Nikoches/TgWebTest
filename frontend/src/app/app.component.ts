import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, NonNullableFormBuilder, Validators} from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private infoId: string | undefined;

  private offerInfo = undefined;

  readonly flavors = ['vanilla', 'caramel', 'chocolate']
  readonly iceCreamForm = this.fb.group({
    customerName: 'Charlotte Smith',
    flavor: ['', Validators.required],
    toppings: this.fb.group({
      first: 'Whipped cream',
      second: 'Chocolate sauce'
    })
  })

  constructor(private route: ActivatedRoute, private fb:FormBuilder) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe({
        next:(value) => console.log(),
        complete:() => console.log()}
      );
  }
  title = 'webTitle';
}
