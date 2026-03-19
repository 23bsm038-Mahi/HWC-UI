import { Injectable, ViewContainerRef, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { CommonDialogComponent } from '../components/common-dialog/common-dialog.component';

@Injectable()
export class ConfirmationService {
  eSanjeevaniFlagArry: any;
  eSanjeevaniDoctorFlagArry: any;
  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any,
  ) {}

  public confirm(
    title: string,
    message: string,
    btnOkText = 'OK',
    btnCancelText = 'Cancel',
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '420px',
      disableClose: false,
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = true;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.disableClose = true;

    return dialogRef.afterClosed();
  }

  public confirmHealthId(
    title: string,
    message: string,
    btnOkText = 'OK',
  ): Observable<boolean> {
    const config = new MatDialogConfig();
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '420px',
      disableClose: false,
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.confirmHealthID = true;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.disableClose = true;

    return dialogRef.afterClosed();
  }

  public alert(
    message: string,
    status = 'info',
    btnOkText = 'OK',
  ): MatDialogRef<CommonDialogComponent> {
    const config = {
      width: '420px',
    };
    const dialogRef = this.dialog.open(CommonDialogComponent, config);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.status = status.toLowerCase();
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = true;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;

    return dialogRef;
  }

  public remarks(
    message: string,
    titleAlign = 'center',
    messageAlign = 'center',
    btnOkText = 'Submit',
    btnCancelText = 'Cancel',
  ): Observable<any> {
    const config = {
      width: '420px',
    };
    const dialogRef = this.dialog.open(CommonDialogComponent, config);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = true;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.componentInstance.btnCancelText = btnCancelText;

    return dialogRef.afterClosed();
  }

  public editRemarks(
    message: string,
    comments: string,
    titleAlign = 'center',
    messageAlign = 'center',
    btnOkText = 'Submit',
    btnCancelText = 'Cancel',
  ): Observable<any> {
    const dialogRef = this.dialog.open(CommonDialogComponent, { width: '60%' });
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = true;
    dialogRef.componentInstance.comments = comments;
    dialogRef.componentInstance.btnCancelText = btnCancelText;

    return dialogRef.afterClosed();
  }

  public notify(
    message: string,
    mandatories: any,
    titleAlign = 'center',
    messageAlign = 'center',
    btnOkText = 'OK',
  ): Observable<any> {
    const config = {
      width: '420px',
    };
    const dialogRef = this.dialog.open(CommonDialogComponent, config);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.componentInstance.notify = true;
    dialogRef.componentInstance.mandatories = mandatories;
    return dialogRef.afterClosed();
  }

  public choice(
    message: string,
    values: any,
    titleAlign = 'center',
    messageAlign = 'center',
    btnOkText = 'Confirm',
    btnCancelText = 'Cancel',
  ): Observable<any> {
    const config = {
      width: '420px',
    };
    const dialogRef = this.dialog.open(CommonDialogComponent, config);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.componentInstance.notify = false;
    dialogRef.componentInstance.choice = true;
    dialogRef.componentInstance.values = values;
    return dialogRef.afterClosed();
  }

  public startTimer(
    title: string,
    message: string,
    timer: number,
    btnOkText = 'Continue',
    btnCancelText = 'Cancel',
  ): Observable<any> {
    const config = new MatDialogConfig();
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '420px',
      disableClose: true,
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.componentInstance.sessionTimeout = true;
    dialogRef.componentInstance.updateTimer(timer);

    return dialogRef.afterClosed();
  }

  public choiceSelect(
    message: string,
    values: any,
    titleAlign = 'center',
    messageAlign = 'center',
    btnOkText = 'Proceed',
    btnCancelText = 'Cancel',
  ): Observable<any> {
    const config = {
      width: '420px',
    };
    const dialogRef = this.dialog.open(CommonDialogComponent, config);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.componentInstance.notify = false;
    dialogRef.componentInstance.choice = false;
    dialogRef.componentInstance.choiceSelect = true;
    dialogRef.componentInstance.values = values;
    return dialogRef.afterClosed();
  }

  /**
   * (C)
   * DE40034072
   *25-06-21
   */

  /*Visit Category - ANC
     Gender - Female
    For displaying fetosense test status
    */
  public alertFetsenseMessage(
    message: string,
    status = 'Fetosense Device',
    btnOkText = 'OK',
  ): void {
    const config = {
      width: '420px',
    };
    const dialogRef = this.dialog.open(CommonDialogComponent, config);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.status = status;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.alertFetsenseMessage = true;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
  }
  /*END*/
  public confirmCalibration(
    title: string,
    message: string,
    btnOkText = 'Yes',
    btnCancelText = 'No',
  ): Observable<boolean> {
    const config = new MatDialogConfig();
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '420px',
      disableClose: false,
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmcalibration = true;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;

    return dialogRef.afterClosed();
  }
  public confirmCBAC(
    title: string,
    message: string,
    data: any,
    btnOkText = 'OK',
    btnCancelText = 'Cancel',
  ): Observable<boolean> {
    const config = new MatDialogConfig();
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '420px',
      disableClose: false,
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmCBAC = true;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.componentInstance.cbacData = data;

    return dialogRef.afterClosed();
  }

  public confirmCareContext(
    title: string,
    message: string,
    btnOkText = 'Yes',
    btnCancelText = 'No',
  ): Observable<boolean> {
    const config = new MatDialogConfig();
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '420px',
      disableClose: false,
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.btnOkText = btnOkText;
    dialogRef.componentInstance.btnCancelText = btnCancelText;
    dialogRef.componentInstance.confirmAlert = false;
    dialogRef.componentInstance.confirmCareContext = true;
    dialogRef.componentInstance.confirmCBAC = false;
    dialogRef.componentInstance.confirmcalibration = false;
    dialogRef.componentInstance.alert = false;
    dialogRef.componentInstance.remarks = false;
    dialogRef.componentInstance.editRemarks = false;
    dialogRef.disableClose = true;

    return dialogRef.afterClosed();
  }
}
