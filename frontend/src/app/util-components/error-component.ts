import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-error-dlg',
  templateUrl: './error-dlg.component.html',
  styleUrls: ['./error-dlg.component.scss'],
  imports: [
    TranslateModule
  ],
  standalone: true
})
export class ErrorDlgComponent implements OnInit {

  title: string;
  messages: string[];
  closeButton: {
    label: string;
  };

  constructor(private dialogRef: MatDialogRef<ErrorDlgComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.build(data);
  }

  ngOnInit(): void {

  }

  build(data) {
    if (data) {
      if (data.title) {
        this.title = data.title;
      }
      if (data.messages) {
        this.messages = data.messages;
      }
      if (data.closeButton) {
        this.closeButton = data.closeButton;
      }
    }
  }

  cancelDlg() {
    this.dialogRef.close();
  }

}
