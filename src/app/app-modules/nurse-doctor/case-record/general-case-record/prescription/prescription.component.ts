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
  Input,
  ViewChild,
  OnDestroy,
  ViewEncapsulation,
  DoCheck,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  NgForm,
  AbstractControl,
} from '@angular/forms';
import { MasterdataService, DoctorService } from '../../../shared/services';
import { GeneralUtils } from '../../../shared/utility/general-utility';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { PageEvent } from '@angular/material/paginator';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PreviousDetailsComponent } from 'src/app/app-modules/core/components/previous-details/previous-details.component';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';
import { AmritTrackingService } from 'Common-UI/src/tracking';

interface prescribe {
  id: any;
  drugID: any;
  drugName: any;
  drugStrength: any;
  drugUnit: any;
  quantity: any;
  route: any;
  formID: any;
  formName: any;
  qtyPrescribed: any;
  dose: any;
  frequency: any;
  duration: any;
  unit: any;
  instructions: any;
  isEDL: boolean;
  sctCode: any;
  sctTerm: any;
}
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PrescriptionComponent implements OnInit, DoCheck, OnDestroy {
  generalUtils = new GeneralUtils(this.fb, this.sessionstorage);
  @ViewChild('prescriptionForm')
  prescriptionForm!: NgForm;

  @Input()
  drugPrescriptionForm!: FormGroup;

  @Input()
  caseRecordMode!: string;

  @Input()
  prescriptionCounsellingForm!: FormGroup;

  createdBy: any;

  pageSize = 5;
  pageEvent!: PageEvent;
  pageLimits: any = [];
  currentPrescription: prescribe = {
    id: null,
    drugID: null,
    drugName: null,
    drugStrength: null,
    drugUnit: null,
    qtyPrescribed: null,
    quantity: null,
    formID: null,
    formName: null,
    route: null,
    dose: null,
    frequency: null,
    duration: null,
    unit: null,
    instructions: null,
    isEDL: false,
    sctCode: null,
    sctTerm: null,
  };

  tempDrugName: any;
  tempform: any;

  filteredDrugMaster: any = [];
  filteredDrugDoseMaster: any = [];
  subFilteredDrugMaster: any = [];
  drugMaster: any;
  drugFormMaster: any;
  drugDoseMaster: any;
  drugRouteMaster: any;
  drugFrequencyMaster: any;
  drugDurationMaster: any = [];
  drugDurationUnitMaster: any;
  edlMaster: any;
  patchedRouteId: any;

  beneficiaryRegID: any;
  visitID: any;
  visitCategory: any;
  current_language_set: any;
  isStockAvalable!: string;
  referredVisitCode: any;
  counsellingProvidedList: any = [];
  disableNoneOption = false;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private dialog: MatDialog,
    readonly sessionstorage: SessionStorageService,
    private trackingService: AmritTrackingService,
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitCategory = this.sessionstorage.getItem('visitCategory');
    this.createdBy = this.sessionstorage.getItem('userName');

    if (this.sessionstorage.getItem('referredVisitCode')) {
      this.referredVisitCode = this.sessionstorage.getItem('referredVisitCode');
    } else {
      this.referredVisitCode = 'undefined';
    }
    this.setLimits();
    this.makeDurationMaster();
    this.getDoctorMasterData();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  ngOnDestroy() {
    if (this.doctorMasterDataSubscription) {
      this.doctorMasterDataSubscription.unsubscribe();
    }
    if (this.prescriptionSubscription) {
      this.prescriptionSubscription.unsubscribe();
    }
  }

  getPrescribedDrugs(): AbstractControl[] | null {
    const prescribedDrugsControl =
      this.drugPrescriptionForm.get('prescribedDrugs');
    return prescribedDrugsControl instanceof FormArray
      ? prescribedDrugsControl.controls
      : null;
  }

  makeDurationMaster() {
    let i = 1;
    while (i <= 29) {
      this.drugDurationMaster.push(i);
      i++;
    }
  }

  displayFn(option: any) {
    return option
      ? `${option.itemName} ${option.strength}${
          option.unitOfMeasurement ? option.unitOfMeasurement : ''
        }${option.quantityInHand ? '(' + option.quantityInHand + ')' : ''}`
      : '';
  }

  getFormValueChanged() {
    this.clearCurrentDetails();
    this.getFormDetails();
  }

  patchRouteValues() {
    this.drugMaster.filter((item: any) => {
      if (item.itemID === this.currentPrescription.drugID)
        this.patchedRouteId = item.routeID;
    });
    this.drugRouteMaster.filter((item: any) => {
      if (item.routeID === this.patchedRouteId)
        this.currentPrescription.route = item.routeName;
    });
  }

  getFormDetails() {
    this.drugFormMaster.filter((item: any) => {
      if (item.itemFormName === this.currentPrescription.formName)
        this.currentPrescription.formID = item.itemFormID;
    });
    this.filterDrugMaster();
    this.filterDoseMaster();
  }

  filterDrugMaster() {
    const drugMasterCopy = Object.assign([], this.drugMaster);
    this.filteredDrugMaster = [];
    drugMasterCopy.forEach((element: any) => {
      if (this.currentPrescription.formID === element.itemFormID) {
        this.filteredDrugMaster.push(element);
      }
    });
    const drugMasterCopyEdl = Object.assign([], this.edlMaster);
    drugMasterCopyEdl.forEach((element: any) => {
      if (this.currentPrescription.formID === element.itemFormID) {
        element['quantityInHand'] = 0;
        this.filteredDrugMaster.push(element);
      }
    });
    this.subFilteredDrugMaster = this.filteredDrugMaster;
  }
  filterDoseMaster() {
    const drugDoseMasterCopy = Object.assign([], this.drugDoseMaster);
    this.filteredDrugDoseMaster = [];
    drugDoseMasterCopy.forEach((element: any) => {
      if (this.currentPrescription.formID === element.itemFormID) {
        this.filteredDrugDoseMaster.push(element);
      }
    });
  }

  filterMedicine(medicine: any) {
    console.log('here');

    if (medicine) {
      this.subFilteredDrugMaster = this.filteredDrugMaster.filter(
        (drug: any) => {
          return drug.itemName.toLowerCase().startsWith(medicine.toLowerCase());
        },
      );
    } else {
      this.subFilteredDrugMaster = this.filteredDrugMaster;
    }
  }
  reEnterMedicine() {
    if (this.tempDrugName && this.currentPrescription.drugID) {
      this.tempDrugName = {
        id: this.currentPrescription.id,
        itemName: this.currentPrescription.drugName,
        itemID: this.currentPrescription.drugID,
        quantityInHand: this.currentPrescription.quantity,
        sctCode: this.currentPrescription.sctCode,
        sctTerm: this.currentPrescription.sctTerm,
        strength: this.currentPrescription.drugStrength,
        unitOfMeasurement: this.currentPrescription.drugUnit,
      };
    } else if (this.tempDrugName && !this.currentPrescription.drugID) {
      this.tempDrugName = null;
    } else {
      this.clearCurrentDetails();
      this.getFormDetails();
    }
  }

  selectMedicineObject(event: any) {
    const option = event.source.value;
    console.log('here', event);
    if (event.isUserInput) {
      if (this.checkNotIssued(option.itemID)) {
        this.currentPrescription['id'] = option.id;
        this.currentPrescription['drugName'] = option.itemName;
        this.currentPrescription['drugID'] = option.itemID;
        this.currentPrescription['quantity'] = option.quantityInHand;
        this.currentPrescription['sctCode'] = option.sctCode;
        this.currentPrescription['sctTerm'] = option.sctTerm;
        this.currentPrescription['drugStrength'] = option.strength;
        this.currentPrescription['drugUnit'] = option.unitOfMeasurement;
        this.currentPrescription['isEDL'] = option.isEDL;
        const typeOfDrug = option.isEDL
          ? ''
          : this.current_language_set.nonEDLMedicine;
        if (option.quantityInHand === 0) {
          this.confirmationService
            .confirm(
              'info ' + typeOfDrug,
              this.current_language_set.stockNotAvailableWouldYouPrescribe +
                ' ' +
                option.itemName +
                ' ' +
                (option.strength ? option.strength : '') +
                (option.unitOfMeasurement ? option.unitOfMeasurement : ''),
            )
            .subscribe((res: any) => {
              if (!res) {
                this.tempDrugName = null;
                this.currentPrescription['id'] = '';
                this.currentPrescription['drugName'] = '';
                this.currentPrescription['drugID'] = '';
                this.currentPrescription['quantity'] = '';
                this.currentPrescription['sctCode'] = '';
                this.currentPrescription['sctTerm'] = '';
                this.currentPrescription['drugStrength'] = '';
                this.currentPrescription['drugUnit'] = '';
                this.isStockAvalable = '';
              } else {
                this.isStockAvalable = 'warn';
              }
            });
        } else {
          this.isStockAvalable = 'primary';
        }
      }
      this.patchRouteValues();
    }
  }

  checkNotIssued(itemID: any) {
    const medicineValue =
      this.drugPrescriptionForm.controls['prescribedDrugs'].value;
    const filteredExisting = medicineValue.filter(
      (meds: any) => meds.drugID === itemID,
    );
    if (filteredExisting.length > 0) {
      this.reEnterMedicine();
      this.confirmationService.alert(
        this.current_language_set.alerts.info.medicinePrescribe,
        'info',
      );
      return false;
    } else {
      return true;
    }
  }

  clearCurrentDetails() {
    this.tempDrugName = null;
    this.currentPrescription.dose = null;
    this.currentPrescription.frequency = null;
    this.currentPrescription.duration = null;
    this.currentPrescription.unit = null;
    this.currentPrescription.qtyPrescribed = null;
    this.currentPrescription.route = null;
    this.currentPrescription.instructions = null;
    this.prescriptionForm.form.markAsUntouched();
    this.isStockAvalable = '';
  }

  clearCurrentaddDetails() {
    this.tempDrugName = null;
    this.currentPrescription.dose = null;
    this.currentPrescription.frequency = null;
    this.currentPrescription.duration = null;
    this.currentPrescription.unit = null;
    this.currentPrescription.qtyPrescribed = null;
    this.currentPrescription.route = null;
    this.currentPrescription.instructions = null;
    this.currentPrescription.formName = null;

    this.prescriptionForm.form.markAsUntouched();
    this.isStockAvalable = '';
  }

  submitForUpload() {
    const validationErrors = this.validateCurrentPrescription();

    if (validationErrors.length > 0) {
      const errorMessage =
        'Please fill the following required fields:\n' +
        validationErrors.map((e, i) => `${i + 1}. ${e}`).join('\n');
      this.confirmationService.alert(errorMessage, 'error');
      return;
    }

    this.addMedicine();
    this.clearCurrentaddDetails();
  }

  validateCurrentPrescription(): string[] {
    const errors: string[] = [];

    if (!this.currentPrescription.formName) {
      errors.push('Medicine Form');
    }
    if (!this.currentPrescription.drugName || !this.tempDrugName) {
      errors.push('Medicine Name');
    }
    if (!this.currentPrescription.dose) {
      errors.push('Dosage');
    }
    if (!this.currentPrescription.frequency) {
      errors.push('Frequency');
    }

    // Conditional validations
    if (
      this.currentPrescription.frequency &&
      this.currentPrescription.frequency !== 'SOS'
    ) {
      if (!this.currentPrescription.duration) {
        errors.push('Duration');
      }
      if (!this.currentPrescription.unit) {
        errors.push('Unit');
      }
    }

    // Quantity required for non-liquid forms
    if (
      this.currentPrescription.formID &&
      this.currentPrescription.formID > 2 &&
      !this.currentPrescription.qtyPrescribed
    ) {
      errors.push('Quantity');
    }

    return errors;
  }

  addMedicine() {
    const medicine: FormArray = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    medicine.insert(
      0,
      this.generalUtils.initMedicineWithData({
        ...this.currentPrescription,
        createdBy: this.createdBy,
      }),
    );
    console.log(medicine.value, 'frrr');
  }

  setLimits(pageNo = 0) {
    this.pageLimits[0] = +pageNo * +this.pageSize;
    this.pageLimits[1] = (+pageNo + 1) * +this.pageSize;
  }

  editMedicine(i: any, id: any) {
    const prescribedDrugs = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    this.currentPrescription.formName =
      prescribedDrugs.controls[i].value.formName;
    this.getFormDetails();
    this.tempDrugName = prescribedDrugs.controls[i].value.drugName;
    this.currentPrescription.id = prescribedDrugs.controls[i].value.id;
    this.currentPrescription.drugName =
      prescribedDrugs.controls[i].value.drugName;
    this.currentPrescription.drugID = prescribedDrugs.controls[i].value.drugID;
    this.currentPrescription.quantity =
      prescribedDrugs.controls[i].value.quantity;
    this.currentPrescription.sctCode =
      prescribedDrugs.controls[i].value.sctCode;
    this.currentPrescription.sctTerm =
      prescribedDrugs.controls[i].value.sctTerm;
    this.currentPrescription.drugStrength =
      prescribedDrugs.controls[i].value.drugStrength;
    this.currentPrescription.drugUnit =
      prescribedDrugs.controls[i].value.drugUnit;
    this.reEnterMedicine();
    const itemMedicine = this.subFilteredDrugMaster.filter((drug: any) => {
      if (
        drug.itemName.toLowerCase() === this.tempDrugName.itemName.toLowerCase()
      ) {
        return drug;
      }
    });
    this.setMedicineObject(itemMedicine[0]);
    this.currentPrescription.dose = prescribedDrugs.controls[i].value.dose;
    this.currentPrescription.frequency =
      prescribedDrugs.controls[i].value.frequency;
    this.currentPrescription.duration =
      prescribedDrugs.controls[i].value.duration;
    this.currentPrescription.unit = prescribedDrugs.controls[i].value.unit;
    this.currentPrescription.qtyPrescribed =
      prescribedDrugs.controls[i].value.qtyPrescribed;
    this.currentPrescription.route = prescribedDrugs.controls[i].value.route;
    this.currentPrescription.instructions =
      prescribedDrugs.controls[i].value.instructions;
    if (id) {
      this.deleteMedicineBackend(i, id);
    } else if (!id) {
      this.deleteMedicineUI(i);
    }
  }
  setMedicineObject(option: any) {
    if (
      option?.id &&
      option?.itemName &&
      option?.itemID &&
      option?.quantityInHand &&
      option?.sctCode &&
      option?.strength &&
      option?.unitOfMeasurement &&
      option?.isEDL
    ) {
      this.currentPrescription['id'] = option.id;
      this.currentPrescription['drugName'] = option.itemName;
      this.currentPrescription['drugID'] = option.itemID;
      this.currentPrescription['quantity'] = option.quantityInHand;
      this.currentPrescription['sctCode'] = option.sctCode;
      this.currentPrescription['sctTerm'] = option.sctTerm;
      this.currentPrescription['drugStrength'] = option.strength;
      this.currentPrescription['drugUnit'] = option.unitOfMeasurement;
      this.currentPrescription['isEDL'] = option.isEDL;
    }

    option.isEDL ? '' : this.current_language_set.nonEDLMedicine;
    if (option.quantityInHand === 0) {
      this.isStockAvalable = 'warn';
    } else {
      this.isStockAvalable = 'primary';
    }
  }

  deleteMedicine(i: any, id?: null) {
    this.confirmationService
      .confirm('warn', this.current_language_set.alerts.info.confirmDelete)
      .subscribe((res) => {
        if (res && id) {
          this.deleteMedicineBackend(i, id);
        } else if (res && !id) {
          this.deleteMedicineUI(i);
        }
      });
  }

  deleteMedicineUI(i: any) {
    const prescribedDrugs = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    prescribedDrugs.removeAt(i);
  }
  deleteMedicineBackend(index: any, id: any) {
    this.doctorService.deleteMedicine(id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.deleteMedicineUI(index);
      }
    });
  }

  prescriptionSubscription!: Subscription;
  getPrescriptionDetails() {
    this.prescriptionSubscription =
      this.doctorService.populateCaserecordResponse$.subscribe((res) => {
        if (
          res &&
          res.statusCode === 200 &&
          res.data &&
          res.data.prescription
        ) {
          const prescription = res.data.prescription;
          this.patchPrescriptionDetails(prescription);
        }
        if (
          res &&
          res.statusCode === 200 &&
          res.data &&
          res.data.counsellingProvidedList
        ) {
          const counsellingProvidedList = res.data.counsellingProvidedList;
          this.patchCounsellingProvided(counsellingProvidedList);
        }
      });
  }
  patchPrescriptionDetails(prescription: any) {
    console.log(prescription, 'herrrrrrr');
    const medicine: FormArray = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    prescription.forEach((element: any) => {
      medicine.insert(
        0,
        this.generalUtils.initMedicineWithData(element, element.id),
      );
    });
  }

  counsellingProvidedoneOptionValidation(selectedOption: any) {
    if (
      selectedOption !== undefined &&
      selectedOption !== null &&
      selectedOption.length > 0
    ) {
      if (selectedOption.includes('None')) {
        this.disableNoneOption = true;
      } else {
        this.disableNoneOption = false;
      }
    } else {
      this.disableNoneOption = false;
    }
  }

  patchCounsellingProvided(counsellingProvidedList: any) {
    console.log(counsellingProvidedList, 'counsellingProvidedList');
    if (
      counsellingProvidedList !== undefined &&
      counsellingProvidedList !== null
    ) {
      this.prescriptionCounsellingForm.patchValue({
        counsellingProvidedList: counsellingProvidedList,
      });
    }
    this.counsellingProvidedoneOptionValidation(counsellingProvidedList);
  }

  doctorMasterDataSubscription: any;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription =
      this.masterdataService.doctorMasterData$.subscribe((masterData) => {
        if (masterData) {
          this.drugFormMaster = masterData.drugFormMaster;
          this.drugMaster = masterData.itemMaster;
          this.drugDoseMaster = masterData.drugDoseMaster;
          this.drugFrequencyMaster = masterData.drugFrequencyMaster;
          this.drugDurationUnitMaster = masterData.drugDurationUnitMaster;
          this.drugRouteMaster = masterData.routeOfAdmin;
          this.edlMaster = masterData.NonEdlMaster;
          this.counsellingProvidedList = masterData.counsellingProvided;

          if (String(this.caseRecordMode) === 'view') {
            this.beneficiaryRegID =
              this.sessionstorage.getItem('beneficiaryRegID');
            this.visitID = this.sessionstorage.getItem('visitID');
            this.visitCategory = this.sessionstorage.getItem('visitCategory');
            this.getPrescriptionDetails();
          }
        }
      });
  }
  loadMMUPrescription() {
    const reqObj = {
      benRegID:
        this.sessionstorage.getItem('beneficiaryRegID') &&
        this.sessionstorage.getItem('beneficiaryRegID') !== ''
          ? this.sessionstorage.getItem('beneficiaryRegID')
          : null,
      visitCode:
        this.sessionstorage.getItem('referredVisitCode') &&
        this.sessionstorage.getItem('referredVisitCode') !== ''
          ? this.sessionstorage.getItem('referredVisitCode')
          : null,
      benVisitID:
        this.sessionstorage.getItem('referredVisitID') &&
        this.sessionstorage.getItem('referredVisitID') !== ''
          ? this.sessionstorage.getItem('referredVisitID')
          : null,
      fetchMMUDataFor: 'Prescription',
    };
    if (
      this.sessionstorage.getItem('referredVisitCode') !== 'undefined' &&
      this.sessionstorage.getItem('referredVisitID') !== 'undefined'
    ) {
      this.doctorService.getMMUData(reqObj).subscribe(
        (prescriptionDataResponse: any) => {
          if (prescriptionDataResponse.statusCode === 200) {
            if (prescriptionDataResponse.data.data.length > 0) {
              this.viewMMUPrescriptionDetails(prescriptionDataResponse.data);
            } else {
              this.confirmationService.alert(
                this.current_language_set.mmuPrescriptionDetailsNotAvailable,
              );
            }
          } else {
            console.log('Error in fetching MMU Prescription details');
          }
        },
        (err) => {
          console.log(err.errorMessage);
        },
      );
    }
  }
  viewMMUPrescriptionDetails(prescriptionDataResponse: any) {
    this.dialog.open(PreviousDetailsComponent, {
      data: {
        dataList: prescriptionDataResponse,
        title: this.current_language_set.mmuPrescriptionDetails,
      },
    });
  }

  get prescriptionAndCounselling() {
    return this.prescriptionCounsellingForm.controls['counsellingProvidedList']
      .value;
  }

  trackFieldInteraction(fieldName: string) {
    this.trackingService.trackFieldInteraction(fieldName, 'Prescription');
  }
}
