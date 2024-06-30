import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DOCUMENT} from "@angular/common";
@Component({
  selector: 'app-error-dlg',
  templateUrl: './ok-dlg.component.html',
  standalone: true,
  styleUrls: ['./ok-dlg.component.scss']
})
export class OkDlgComponent implements OnInit {

  title: string;
  message: string;
  closeButton: {
    label: string;
  };

  constructor(private dialogRef: MatDialogRef<OkDlgComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              @Inject(DOCUMENT) document: Document) {
    this.build(data);
  }

  ngOnInit(): void {
  }


  build(data) {
    if (data) {
      if (data.title) {
        this.title = data.title;
      }
      if (data.message) {
        this.message = data.message;
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
