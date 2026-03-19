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
  DoCheck,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NurseService } from '../../shared/services';
import { CameraService } from '../../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';

@Component({
  selector: 'app-nurse-worklist',
  templateUrl: './nurse-worklist.component.html',
  styleUrls: ['./nurse-worklist.component.css'],
})
export class NurseWorklistComponent implements OnInit, DoCheck, OnDestroy {
  rowsPerPage = 5;
  activePage = 1;
  pagedList: any = [];
  rotate = true;

  cbacData: any = [];
  blankTable = [1, 2, 3, 4, 5];
  beneficiaryList: any;
  filteredBeneficiaryList: any = [];
  filterTerm: any;
  currentLanguageSet: any;
  currentPage!: number;

  displayedColumns: any = [
    'sno',
    'beneficiaryID',
    'beneficiaryName',
    'gender',
    'age',
    'status',
    'fatherName',
    'district',
    'phoneNo',
    'image',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<any>();

  constructor(
    private nurseService: NurseService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private cameraService: CameraService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    readonly sessionstorage: SessionStorageService,
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.sessionstorage.setItem('currentRole', 'Nurse');
    this.removeBeneficiaryDataForNurseVisit();
    this.getNurseWorklist();
    this.beneficiaryDetailsService.reset();
  }

  ngOnDestroy() {
    this.sessionstorage.removeItem('currentRole');
  }

  removeBeneficiaryDataForNurseVisit() {
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
  }

  getNurseWorklist() {
    this.nurseService.getNurseWorklist().subscribe(
      (res: any) => {
        if (res.statusCode === 200 && res.data !== null) {
          const benlist = this.loadDataToBenList(res.data);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.dataSource.data = benlist;
          this.dataSource.paginator = this.paginator;
          this.dataSource.data.forEach((sectionCount: any, index: number) => {
            sectionCount.sno = index + 1;
          });
          this.filterTerm = null;
        } else this.confirmationService.alert(res.errorMessage, 'error');
      },
      (err) => {
        if (err?.handled) {
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
      element.benVisitNo = element.benVisitNo || 'Not Available';
      element.districtName = element.districtName || 'Not Available';
      element.villageName = element.villageName || 'Not Available';
      element.fatherName = element.fatherName || 'Not Available';
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available';
    });
    return data;
  }

  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
  }

  patientImageView(benregID: any) {
    this.beneficiaryDetailsService
      .getBeneficiaryImage(benregID)
      .subscribe((data: any) => {
        if (data && data.benImage) this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.imageNotFound,
          );
      });
  }

  loadNursePatientDetails(beneficiary: any) {
    console.log('beneficiary', beneficiary);

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
              this.loadNursePatientDetailsCBAC(beneficiary);
            } else {
              this.cbacData = null;
              this.beneficiaryDetailsService.cbacData = this.cbacData;
              this.sessionstorage.removeItem('visitCategory');
              if (beneficiary.nurseFlag === 100) {
                this.confirmationService
                  .confirm(
                    `info`,
                    this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
                  )
                  .subscribe((result) => {
                    if (result) {
                      this.sessionstorage.setItem(
                        'visitCode',
                        beneficiary.visitCode,
                      );
                      this.sessionstorage.setItem(
                        'beneficiaryGender',
                        beneficiary.genderName,
                      );
                      this.sessionstorage.setItem(
                        'visitCategory',
                        'NCD screening',
                      );
                      this.sessionstorage.setItem(
                        'visitID',
                        beneficiary.benVisitID,
                      );
                      this.sessionstorage.setItem(
                        'nurseFlag',
                        beneficiary.nurseFlag,
                      );
                      this.sessionstorage.setItem(
                        'beneficiaryRegID',
                        beneficiary.beneficiaryRegID,
                      );
                      this.sessionstorage.setItem(
                        'benFlowID',
                        beneficiary.benFlowID,
                      );
                      this.sessionstorage.setItem(
                        'beneficiaryID',
                        beneficiary.beneficiaryID,
                      );
                      this.sessionstorage.setItem(
                        'benVisitNo',
                        beneficiary.benVisitNo,
                      );
                      this.router.navigate([
                        '/nurse-doctor/attendant/nurse/patient/',
                        beneficiary.beneficiaryRegID,
                      ]);
                    }
                  });
              } else {
                this.confirmationService
                  .confirm(
                    `info`,
                    this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
                    this.currentLanguageSet.common.ok,
                    this.currentLanguageSet.common.cancel,
                  )
                  .subscribe((result) => {
                    if (result) {
                      this.sessionstorage.setItem(
                        'beneficiaryGender',
                        beneficiary.genderName,
                      );
                      this.sessionstorage.setItem(
                        'beneficiaryRegID',
                        beneficiary.beneficiaryRegID,
                      );
                      this.sessionstorage.setItem(
                        'benFlowID',
                        beneficiary.benFlowID,
                      );
                      this.sessionstorage.setItem(
                        'beneficiaryID',
                        beneficiary.beneficiaryID,
                      );
                      this.sessionstorage.setItem(
                        'benVisitNo',
                        beneficiary.benVisitNo,
                      );
                      this.router.navigate([
                        '/nurse-doctor/attendant/nurse/patient/',
                        beneficiary.beneficiaryRegID,
                      ]);
                    }
                  });
              }
            }
          } else {
            this.confirmationService.alert(res.errorMessage, 'error');
            this.cbacData = null;
            this.beneficiaryDetailsService.cbacData = this.cbacData;
          }
        },
        (err) => {
          this.cbacData = null;
          this.beneficiaryDetailsService.cbacData = this.cbacData;
          this.confirmationService.alert(err, 'error');
        },
      );
  }
  loadNursePatientDetailsCBAC(beneficiary: any) {
    if (
      this.cbacData !== undefined &&
      this.cbacData !== null &&
      this.cbacData.length > 0
    ) {
      this.sessionstorage.removeItem('visitCategory');
      if (beneficiary.nurseFlag === 100) {
        this.confirmationService
          .confirmCBAC(
            `info`,
            this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
            this.cbacData,
          )
          .subscribe((result) => {
            if (result) {
              this.sessionstorage.setItem('visitCode', beneficiary.visitCode);
              this.sessionstorage.setItem(
                'beneficiaryGender',
                beneficiary.genderName,
              );
              this.sessionstorage.setItem('visitCategory', 'NCD screening');
              this.sessionstorage.setItem('visitID', beneficiary.benVisitID);
              this.sessionstorage.setItem('nurseFlag', beneficiary.nurseFlag);
              this.sessionstorage.setItem(
                'beneficiaryRegID',
                beneficiary.beneficiaryRegID,
              );
              this.sessionstorage.setItem('benFlowID', beneficiary.benFlowID);
              this.sessionstorage.setItem(
                'beneficiaryID',
                beneficiary.beneficiaryID,
              );
              this.sessionstorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate([
                '/nurse-doctor/attendant/nurse/patient/',
                beneficiary.beneficiaryRegID,
              ]);
            }
          });
      } else {
        this.confirmationService
          .confirmCBAC(
            `info`,
            this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
            this.cbacData,
          )
          .subscribe((result) => {
            if (result) {
              this.sessionstorage.setItem(
                'beneficiaryGender',
                beneficiary.genderName,
              );
              this.sessionstorage.setItem(
                'beneficiaryRegID',
                beneficiary.beneficiaryRegID,
              );
              this.sessionstorage.setItem('benFlowID', beneficiary.benFlowID);
              this.sessionstorage.setItem(
                'beneficiaryID',
                beneficiary.beneficiaryID,
              );
              this.sessionstorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate([
                '/nurse-doctor/attendant/nurse/patient/',
                beneficiary.beneficiaryRegID,
              ]);
            }
          });
      }
    } else {
      this.cbacData = null;
      this.beneficiaryDetailsService.cbacData = this.cbacData;
      this.sessionstorage.removeItem('visitCategory');
      if (beneficiary.nurseFlag === 100) {
        this.confirmationService
          .confirm(
            `info`,
            this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
          )
          .subscribe((result) => {
            if (result) {
              this.sessionstorage.setItem('visitCode', beneficiary.visitCode);
              this.sessionstorage.setItem(
                'beneficiaryGender',
                beneficiary.genderName,
              );
              this.sessionstorage.setItem('visitCategory', 'NCD screening');
              this.sessionstorage.setItem('visitID', beneficiary.benVisitID);
              this.sessionstorage.setItem('nurseFlag', beneficiary.nurseFlag);
              this.sessionstorage.setItem(
                'beneficiaryRegID',
                beneficiary.beneficiaryRegID,
              );
              this.sessionstorage.setItem('benFlowID', beneficiary.benFlowID);
              this.sessionstorage.setItem(
                'beneficiaryID',
                beneficiary.beneficiaryID,
              );
              this.sessionstorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate([
                '/nurse-doctor/attendant/nurse/patient/',
                beneficiary.beneficiaryRegID,
              ]);
            }
          });
      } else {
        this.confirmationService
          .confirm(
            `info`,
            this.currentLanguageSet.alerts.info.confirmtoProceedFurther,
          )
          .subscribe((result) => {
            if (result) {
              this.sessionstorage.setItem(
                'beneficiaryGender',
                beneficiary.genderName,
              );
              this.sessionstorage.setItem(
                'beneficiaryRegID',
                beneficiary.beneficiaryRegID,
              );
              this.sessionstorage.setItem('benFlowID', beneficiary.benFlowID);
              this.sessionstorage.setItem(
                'beneficiaryID',
                beneficiary.beneficiaryID,
              );
              this.sessionstorage.setItem('benVisitNo', beneficiary.benVisitNo);
              this.router.navigate([
                '/nurse-doctor/attendant/nurse/patient/',
                beneficiary.beneficiaryRegID,
              ]);
            }
          });
      }
    }
  }

  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm) {
      this.filteredBeneficiaryList = this.beneficiaryList;
      this.dataSource.data = this.filteredBeneficiaryList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.data.forEach((sectionCount: any, index: number) => {
        sectionCount.sno = index + 1;
      });
    } else {
      this.filteredBeneficiaryList = [];
      this.dataSource.data = [];
      this.dataSource.paginator = this.paginator;
      this.beneficiaryList.forEach((item: any) => {
        console.log('item', JSON.stringify(item, null, 4));
        for (const key in item) {
          if (
            key === 'beneficiaryID' ||
            key === 'benName' ||
            key === 'genderName' ||
            key === 'fatherName' ||
            key === 'districtName' ||
            key === 'preferredPhoneNum' ||
            key === 'villageName'
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
          } else {
            if (key === 'benVisitNo') {
              const value: string = '' + item[key];
              if (value === '1') {
                const val = 'First visit';
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
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
              } else {
                const val = 'Revisit';
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
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
          }
        }
      });
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
