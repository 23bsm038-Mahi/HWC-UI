/*
 * AMRIT – Accessible Medical Records via Integrated Technology
 * Integrated EHR (Electronic Health Records) Solution
 *
 * Copyright (C) "Piramal Swasthya Management and Research Institute"
 *
 * This file is part of AMRIT.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { CameraService } from '../../core/services/camera.service';
import * as moment from 'moment';
import { HttpServiceService } from '../../core/services/http-service.service';
import { SetLanguageComponent } from '../../core/components/set-language.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DoctorService, MasterdataService } from '../shared/services';
import { SchedulerComponent } from '../scheduler/scheduler.component';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-doctor-worklist',
  templateUrl: './doctor-worklist.component.html',
  styleUrls: ['./doctor-worklist.component.css'],
})
export class DoctorWorklistComponent implements OnInit, DoCheck, OnDestroy {
  rowsPerPage = 5;
  activePage = 1;
  pagedList: any[] = [];
  rotate = true;
  beneficiaryList: any;
  filteredBeneficiaryList: any[] = [];
  blankTable = [1, 2, 3, 4, 5];
  filterTerm: any;
  currentLanguageSet: any;
  cbacData: any = [];
  beneficiaryMetaData: any;
  currentPage: number | undefined;
  teleConsultationFlag: any;
  enableCHOReportBtn = environment.enableCHOReportBtn;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: any = [];

  constructor(
    private dialog: MatDialog,
    private cameraService: CameraService,
    private router: Router,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private doctorService: DoctorService,
    readonly sessionstorage: SessionStorageService,
  ) {}

  ngOnInit() {
    this.sessionstorage.setItem('currentRole', 'Doctor');
    this.assignSelectedLanguage();
    this.loadWorklist();
    this.removeBeneficiaryDataForDoctorVisit();
    this.beneficiaryDetailsService.reset();
    this.masterdataService.reset();
    this.teleConsultationFlag =
      this.confirmationService.eSanjeevaniDoctorFlagArry;
    this.setDisplayedColumns();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
    if (
      this.currentLanguageSet !== undefined &&
      this.currentLanguageSet !== null &&
      this.beneficiaryMetaData !== undefined &&
      this.beneficiaryMetaData !== null
    ) {
      this.beneficiaryMetaData.map((item: any) => {
        const temp = this.getVisitStatus(item);
        item.statusMessage = temp.statusMessage;
        item.statusCode = temp.statusCode;
      });
    }
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  ngOnDestroy() {
    this.sessionstorage.removeItem('currentRole');
  }

  redirectToCHOReport() {
    const token = JSON.parse(
      this.sessionstorage.getItem('loginDataResponse'),
    )?.dhistoken;

    const url = `${environment.dhisURL}${token}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  setDisplayedColumns() {
    if (
      this.teleConsultationFlag === 'ESanjeevani' ||
      this.teleConsultationFlag === 'Swymed'
    ) {
      this.displayedColumns = [
        'sno',
        'beneficiaryID',
        'beneficiaryName',
        'gender',
        'age',
        'visitCategory',
        'visitDate',
        'beneficiaryArrived',
        'image',
        'action',
      ];
    } else {
      this.displayedColumns = [
        'sno',
        'beneficiaryID',
        'beneficiaryName',
        'gender',
        'age',
        'visitCategory',
        'visitDate',
        'image',
      ];
    }
  }

  removeBeneficiaryDataForDoctorVisit() {
    this.sessionstorage.removeItem('visitCode');
    this.sessionstorage.removeItem('beneficiaryGender');
    this.sessionstorage.removeItem('benFlowID');
    this.sessionstorage.removeItem('visitCategory');
    this.sessionstorage.removeItem('visitReason');
    this.sessionstorage.removeItem('beneficiaryRegID');
    this.sessionstorage.removeItem('visitID');
    this.sessionstorage.removeItem('beneficiaryID');
    this.sessionstorage.removeItem('doctorFlag');
    this.sessionstorage.removeItem('nurseFlag');
    this.sessionstorage.removeItem('pharmacist_flag');
    this.sessionstorage.removeItem('specialistFlag');
  }

  pageChanged(event: any): void {
    console.log('called', event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
    console.log('list', this.pagedList);
  }

  loadWorklist() {
    this.filterTerm = null;
    this.beneficiaryMetaData = [];
    this.doctorService.getDoctorWorklist().subscribe(
      (data: any) => {
        if (data && data.statusCode === 200 && data.data) {
          this.beneficiaryMetaData = data.data;
          data.data.map((item: any) => {
            const temp = this.getVisitStatus(item);
            item.statusMessage = temp.statusMessage;
            item.statusCode = temp.statusCode;
          });
          const benlist = this.loadDataToBenList(data.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.dataSource.data = benlist;
          this.dataSource.paginator = this.paginator;
          this.dataSource.data.forEach((sectionCount: any, index: number) => {
            sectionCount.sno = index + 1;
          });
          this.filterTerm = null;
        } else {
          console.log('Error in else part', data.errorMessage);

          this.confirmationService.alert(data.errorMessage, 'error');
        }
      },
      (err) => {
        if (err?.handled) {
          console.log('error handled');

          return;
        }
        this.confirmationService.alert(err, 'error');
      },
    );
  }

  loadDataToBenList(data: any) {
    data.forEach((element: any) => {
      element.genderName = element.genderName || 'Not Available';
      element.age = element.age || 'Not Available';
      element.statusMessage = element.statusMessage || 'Not Available';
      element.VisitCategory = element.VisitCategory || 'Not Available';
      element.benVisitNo = element.benVisitNo || 'Not Available';
      element.districtName = element.districtName || 'Not Available';
      element.villageName = element.villageName || 'Not Available';
      element.arrival = false;
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available';
      element.visitDate =
        moment(element.visitDate).format('DD-MM-YYYY HH:mm A') ||
        'Not Available';
      element.benVisitDate =
        moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') ||
        'Not Available';
    });
    return data;
  }

  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm) this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.dataSource.data = [];
      this.dataSource.paginator = this.paginator;
      this.beneficiaryList.forEach((item: any) => {
        console.log('item', JSON.stringify(item, null, 4));
        for (const key in item) {
          if (
            key !== 'agentId' &&
            (key === 'beneficiaryID' ||
              key === 'benName' ||
              key === 'genderName' ||
              key === 'age' ||
              key === 'statusMessage' ||
              key === 'VisitCategory' ||
              key === 'benVisitNo' ||
              key === 'districtName' ||
              key === 'preferredPhoneNum' ||
              key === 'villageName' ||
              key === 'beneficiaryRegID' ||
              key === 'visitDate')
          ) {
            const value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item);
              this.dataSource.data.push(item);
              this.dataSource.paginator = this.paginator;
              this.dataSource.data.forEach(
                (sectionCount: any, index: number) => {
                  sectionCount.sno = index + 1;
                },
              );
              break;
            }
          }
        }
      });
    }
  }

  patientImageView(benregID: any) {
    this.beneficiaryDetailsService
      .getBeneficiaryImage(benregID)
      .subscribe((data: any) => {
        if (data?.benImage) this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.imageNotFound,
          );
      });
  }

  loadDoctorExaminationPage(beneficiary: any) {
    console.log('beneficiary', JSON.stringify(beneficiary, null, 4));
    this.sessionstorage.setItem('visitCode', beneficiary.visitCode);
    if (beneficiary.statusCode === 1) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.statusCode === 2) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.statusCode === 3) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.statusCode === 4) {
      this.checkDoctorStatusAtTcCancelled(beneficiary);
    } else if (beneficiary.statusCode === 5) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.statusCode === 9) {
      this.viewAndPrintCaseSheet(beneficiary);
    } else if (beneficiary.statusCode === 10) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.statusCode === 11) {
      this.routeToWorkArea(beneficiary);
    }
  }

  viewAndPrintCaseSheet(beneficiary: any) {
    this.confirmationService
      .confirm('info', this.currentLanguageSet.alerts.info.consulation)
      .subscribe((res) => {
        if (res) {
          this.routeToCaseSheet(beneficiary);
        }
      });
  }

  routeToCaseSheet(beneficiary: any) {
    this.sessionstorage.setItem('caseSheetBenFlowID', beneficiary.benFlowID);
    this.sessionstorage.setItem(
      'caseSheetVisitCategory',
      beneficiary.VisitCategory,
    );
    this.sessionstorage.setItem(
      'caseSheetBeneficiaryRegID',
      beneficiary.beneficiaryRegID,
    );
    this.sessionstorage.setItem('caseSheetVisitID', beneficiary.benVisitID);
    this.router.navigate(['/nurse-doctor/print/' + 'TM' + '/' + 'current']);
  }

  routeToWorkArea(beneficiary: any) {
    this.cbacData = [];
    this.beneficiaryDetailsService.cbacData = this.cbacData;
    this.beneficiaryDetailsService
      .getCBACDetails(beneficiary.beneficiaryRegID)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 200 && res.data !== null) {
            if (
              res.data.benRegID !== undefined &&
              res.data.benRegID !== null &&
              ((res.data.suspectedTB !== undefined &&
                res.data.suspectedTB !== null) ||
                (res.data.suspectedNCD !== undefined &&
                  res.data.suspectedNCD !== null) ||
                (res.data.suspectedHRP !== undefined &&
                  res.data.suspectedHRP !== null) ||
                (res.data.suspectedNCDDiseases !== undefined &&
                  res.data.suspectedNCDDiseases !== null))
            ) {
              if (
                res.data.suspectedHRP !== undefined &&
                res.data.suspectedHRP !== null &&
                res.data.suspectedHRP.toLowerCase() === 'yes'
              )
                this.cbacData.push('High Risk Pregnancy');
              if (
                res.data.suspectedTB !== undefined &&
                res.data.suspectedTB !== null &&
                res.data.suspectedTB.toLowerCase() === 'yes'
              )
                this.cbacData.push('Tuberculosis');
              if (
                res.data.suspectedNCDDiseases !== undefined &&
                res.data.suspectedNCDDiseases !== null &&
                res.data.suspectedNCDDiseases.length > 0
              ) {
                const diseases = res.data.suspectedNCDDiseases.split(',');
                if (diseases.length > 0) {
                  diseases.forEach((element: any) => {
                    console.log(element.toLowerCase);
                    if (element.toLowerCase() === 'diabetes')
                      this.cbacData.push('Diabetes');
                    if (element.toLowerCase() === 'hypertension')
                      this.cbacData.push('Hypertension');
                    if (element.toLowerCase() === 'breast cancer')
                      this.cbacData.push('Breast cancer');
                    if (element.toLowerCase() === 'mental health disorder')
                      this.cbacData.push('Mental health disorder');
                    if (element.toLowerCase() === 'oral cancer')
                      this.cbacData.push('Oral cancer');
                  });
                }
              }
              this.beneficiaryDetailsService.cbacData = this.cbacData;
              if (
                this.cbacData !== undefined &&
                this.cbacData !== null &&
                this.cbacData.length > 0
              ) {
                this.confirmationService
                  .confirmCBAC(
                    `info`,
                    this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
                    this.cbacData,
                  )
                  .subscribe((result) => {
                    if (result) {
                      this.updateWorkArea(beneficiary);
                    }
                  });
              } else {
                this.cbacData = null;
                this.beneficiaryDetailsService.cbacData = this.cbacData;
                this.confirmationService
                  .confirm(
                    `info`,
                    this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
                  )
                  .subscribe((result) => {
                    if (result) {
                      this.updateWorkArea(beneficiary);
                    }
                  });
              }
            } else {
              this.cbacData = null;
              this.beneficiaryDetailsService.cbacData = this.cbacData;
              this.confirmationService
                .confirm(
                  `info`,
                  this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
                )
                .subscribe((result) => {
                  if (result) {
                    this.updateWorkArea(beneficiary);
                  }
                });
            }
          } else {
            this.cbacData = null;
            this.beneficiaryDetailsService.cbacData = this.cbacData;
            this.confirmationService.alert(res.errorMessage, 'error');
          }
        },
        (err) => {
          this.cbacData = null;
          this.beneficiaryDetailsService.cbacData = this.cbacData;
          this.confirmationService.alert(err, 'error');
        },
      );
  }
  updateWorkArea(beneficiary: any) {
    const dataSeted = this.setDataForWorkArea(beneficiary);
    if (dataSeted) {
      this.router.navigate([
        '/nurse-doctor/attendant/doctor/patient/',
        beneficiary.beneficiaryRegID,
      ]);
    }
  }

  setDataForWorkArea(beneficiary: any) {
    this.sessionstorage.setItem('beneficiaryGender', beneficiary.genderName);
    this.sessionstorage.setItem('benFlowID', beneficiary.benFlowID);
    this.sessionstorage.setItem('visitCategory', beneficiary.VisitCategory);
    this.sessionstorage.setItem('visitReason', beneficiary.VisitReason);
    this.sessionstorage.setItem(
      'beneficiaryRegID',
      beneficiary.beneficiaryRegID,
    );
    this.sessionstorage.setItem('visitID', beneficiary.benVisitID);
    this.sessionstorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
    this.sessionstorage.setItem('doctorFlag', beneficiary.doctorFlag);
    this.sessionstorage.setItem('nurseFlag', beneficiary.nurseFlag);
    this.sessionstorage.setItem('pharmacist_flag', beneficiary.pharmacist_flag);
    this.sessionstorage.setItem('visitCode', beneficiary.visitCode);

    return true;
  }

  checkDoctorStatusAtTcCancelled(beneficiary: any) {
    if (beneficiary.doctorFlag === 2 || beneficiary.nurseFlag === 2) {
      this.confirmationService.alert(beneficiary.statusMessage);
    } else if (beneficiary.doctorFlag === 1) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.doctorFlag === 3) {
      this.routeToWorkArea(beneficiary);
    } else if (beneficiary.doctorFlag === 9) {
      this.viewAndPrintCaseSheet(beneficiary);
    }
  }

  toggleArrivalStatus(evt: any, benFlowID: any) {
    let message: string;
    if (evt.checked) {
      message = this.currentLanguageSet.alerts.info.beneficiaryArrive;
    } else {
      message = this.currentLanguageSet.alerts.info.cancelStatus;
    }

    console.log(benFlowID, '', evt, '', this.beneficiaryList);

    let filteredBenIndex = -1;
    this.confirmationService
      .confirm('info', message, 'YES', 'NO')
      .subscribe((res) => {
        if (res) {
          this.beneficiaryList.forEach((benef: any, i: any) => {
            if (benef.benFlowID === benFlowID) {
              filteredBenIndex = i;
            }
          });
          if (filteredBenIndex >= 0) {
            this.beneficiaryList[filteredBenIndex].benArrivedFlag = evt.checked;
            this.filteredBeneficiaryList = this.beneficiaryList;
            this.dataSource.data = this.beneficiaryList;
            this.dataSource.paginator = this.paginator;
            if (
              this.filterTerm !== null &&
              this.filterTerm !== undefined &&
              this.filterTerm !== ''
            ) {
              this.filterBeneficiaryList(this.filterTerm);
            }
            const arrivedBeneficiary = this.beneficiaryList[filteredBenIndex];
            this.doctorService
              .updateBeneficiaryArrivalStatus({
                benflowID: arrivedBeneficiary.benFlowID,
                benRegID: arrivedBeneficiary.beneficiaryRegID,
                visitCode: arrivedBeneficiary.visitCode,
                status: evt.checked,
                userID: arrivedBeneficiary.tCSpecialistUserID,
                modifiedBy: this.sessionstorage.getItem('userName'),
              })
              .subscribe(
                (res: any) => {
                  if (res && res.statusCode && res.data) {
                    this.confirmationService.alert(
                      this.currentLanguageSet.alerts.info.confirmArrival,
                      'success',
                    );
                  } else {
                    this.beneficiaryList[filteredBenIndex].benArrivedFlag =
                      !evt.checked;
                    this.confirmationService.alert(res.errorMessage, 'error');
                  }
                },
                (error) => {
                  this.beneficiaryList[filteredBenIndex].benArrivedFlag =
                    !evt.checked;
                  this.confirmationService.alert(error, 'error');
                },
              );
          }
        } else {
          // this.pagedList[index].benArrivedFlag = !evt.checked;
        }
      });

    console.log(benFlowID, '', evt, '', this.beneficiaryList);
  }

  getVisitStatus(beneficiaryVisitDetials: any) {
    const status = {
      statusCode: 0,
      statusMessage: '',
    };

    if (beneficiaryVisitDetials.specialist_flag === 0) {
      if (beneficiaryVisitDetials.lab_technician_flag === 2) {
        status.statusCode = 10;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.fetosenseTest_pending;
      } else if (
        beneficiaryVisitDetials.nurseFlag === 2 ||
        beneficiaryVisitDetials.doctorFlag === 2
      ) {
        status.statusCode = 2;
        status.statusMessage = this.currentLanguageSet.alerts.info.pending;
      } else if (beneficiaryVisitDetials.doctorFlag === 1) {
        status.statusCode = 1;
        status.statusMessage =
          this.currentLanguageSet.common.pendingForConsultation;
      } else if (beneficiaryVisitDetials.lab_technician_flag === 3) {
        status.statusCode = 11;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.fetosenseTest_done;
      } else if (beneficiaryVisitDetials.doctorFlag === 3) {
        status.statusCode = 3;
        status.statusMessage = this.currentLanguageSet.alerts.info.labtestDone;
      } else if (beneficiaryVisitDetials.doctorFlag === 9) {
        status.statusCode = 9;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.consultation_done;
      }
    } else {
      if (beneficiaryVisitDetials.specialist_flag === 9) {
        status.statusCode = 9;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.consultation_done;
      } else if (beneficiaryVisitDetials.lab_technician_flag === 2) {
        status.statusCode = 10;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.fetosenseTest_pending;
      } else if (
        beneficiaryVisitDetials.doctorFlag === 2 ||
        beneficiaryVisitDetials.nurseFlag === 2
      ) {
        status.statusCode = 2;
        status.statusMessage = this.currentLanguageSet.alerts.info.pending;
      } else if (
        beneficiaryVisitDetials.specialist_flag === 1 ||
        beneficiaryVisitDetials.specialist_flag === 2 ||
        beneficiaryVisitDetials.specialist_flag === 3
      ) {
        status.statusCode = 5;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.pendingForConsultation;
      } else if (beneficiaryVisitDetials.specialist_flag === 4) {
        status.statusCode = 4; // MMUFloW
        status.statusMessage = this.currentLanguageSet.alerts.info.teleCancel;
      } else if (beneficiaryVisitDetials.lab_technician_flag === 3) {
        status.statusCode = 11;
        status.statusMessage =
          this.currentLanguageSet.alerts.info.fetosenseTest_done;
      } else if (beneficiaryVisitDetials.doctorFlag === 3) {
        status.statusCode = 3;
        status.statusMessage = this.currentLanguageSet.alerts.info.labtestDone;
      } else if (beneficiaryVisitDetials.doctorFlag === 1) {
        status.statusCode = 1;
        status.statusMessage =
          this.currentLanguageSet.common.pendingForConsultation;
      }
    }

    return status;
  }
  cancelTCRequest(beneficiary: any) {
    this.confirmationService
      .confirm(
        'info',
        this.currentLanguageSet.alerts.info.cancelReq,
        'Yes',
        'No',
      )
      .subscribe((res) => {
        if (res) {
          this.doctorService
            .cancelBeneficiaryTCRequest({
              benflowID: beneficiary.benFlowID,
              benRegID: beneficiary.beneficiaryRegID,
              visitCode: beneficiary.visitCode,
              userID: beneficiary.tCSpecialistUserID,
              modifiedBy: this.sessionstorage.getItem('userName'),
            })
            .subscribe(
              (res: any) => {
                if (res && res.statusCode && res.data) {
                  this.confirmationService.alert(res.data.response, 'success');
                  this.loadWorklist();
                } else {
                  this.confirmationService.alert(res.errorMessage, 'error');
                }
              },
              (error) => {
                this.confirmationService.alert(error, 'error');
              },
            );
        }
      });
  }
  openScheduler(beneficiary: any) {
    const matDialogRef: MatDialogRef<SchedulerComponent> = this.dialog.open(
      SchedulerComponent,
      {},
    );
    matDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.scheduleTC(beneficiary, result.tmSlot);
      }
      console.log(JSON.stringify(result, null, 4));
    });
  }
  scheduleTC(beneficiary: any, tcRequest: any) {
    const scedulerRequest = {
      benFlowID: beneficiary.benFlowID,
      beneficiaryRegID: beneficiary.beneficiaryRegID,
      benVisitID: beneficiary.benVisitID,
      visitCode: beneficiary.visitCode,
      vanID: beneficiary.vanID,
      providerServiceMapID: this.sessionstorage.getItem('providerServiceID'),
      createdBy: this.sessionstorage.getItem('userName'),
      tcRequest: tcRequest,
    };
    this.doctorService.scheduleTC(scedulerRequest).subscribe(
      (res: any) => {
        console.log('res', res);

        if (res.statusCode === 200) {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.beneficiaryDetails,
            'success',
          );
          this.loadWorklist();
        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      },
      (error) => {
        this.confirmationService.alert(error, 'error');
      },
    );
  }
  initiateTC(beneficiary: any) {
    console.log('ben', beneficiary);

    if (beneficiary.benArrivedFlag) {
      this.doctorService
        .invokeSwymedCall(beneficiary.tCSpecialistUserID)
        .subscribe(
          (res: any) => {
            if (res.statusCode === 200 && res.data) {
              window.location.href = res.data.response;
              this.updateTCStartTime(beneficiary);
            } else {
              this.confirmationService.alert(res.errorMessage, 'error');
            }
          },
          (error) => {
            this.confirmationService.alert(error, 'error');
          },
        );
    } else {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.benificiary,
      );
    }
  }
  updateTCStartTime(beneficiary: any) {
    const tCStartTimeObj = {
      benRegID: beneficiary.beneficiaryRegID,
      visitCode: beneficiary.visitCode,
    };
    this.doctorService.updateTCStartTime(tCStartTimeObj).subscribe((res) => {
      console.log(res);
    });
  }
}
