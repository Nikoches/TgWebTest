import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ErrorDlgComponent} from "../util-components/error-component";

@Injectable()
export class ErrorService {
  constructor(private dialog : MatDialog) { }

  public handleError(title, messages){
    let errorDlgConfig = new MatDialogConfig();
    errorDlgConfig.data = {
      title: title,
      messages: messages,
      closeButton:
        {
          label: "OK"
        }
    }
    this.dialog.open(ErrorDlgComponent, errorDlgConfig);
  }

  public getError(err){
    let error;
    if(err.error?.errorMessage){
      error = err.error.errorMessage;
    } else if(err.message){
      error = err.message;
    } else {
      error = err;
    }
    return error;
  }
}

