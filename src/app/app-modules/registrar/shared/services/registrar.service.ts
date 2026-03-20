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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RegistrarService {
  consentGranted = '0';
  stateIdFamily: any = null;

  registrationMasterDetails = new BehaviorSubject<any>(null);
  registrationMasterDetails$ = this.registrationMasterDetails.asObservable();

  beneficiaryDetails = new BehaviorSubject<any>(null);
  beneficiaryDetails$ = this.beneficiaryDetails.asObservable();

  beneficiaryEditDetails = new BehaviorSubject<any>(null);
  beneficiaryEditDetails$ = this.beneficiaryEditDetails.asObservable();

  healthId: any = null;
  healthIdOtp = new BehaviorSubject(this.healthId);
  generateHealthIdOtp$ = this.healthIdOtp.asObservable();

  healthIdMobVerificationValue: any = null;
  healthIdMobVerification = new BehaviorSubject(
    this.healthIdMobVerificationValue,
  );
  healthIdMobVerificationCheck$ = this.healthIdMobVerification.asObservable();

  benFamilyDet: any = null;
  benfamilyData = new BehaviorSubject<any>(this.benFamilyDet);
  benFamilyDetails$ = this.benfamilyData.asObservable();

  enablingDispense = false;

  abhaGenerateData: any;
  aadharNumberNew: any;

  abhaDetail: any = null;
  abhaDetailData = new BehaviorSubject<any>(this.abhaDetail);
  abhaDetailDetails$ = this.abhaDetailData.asObservable();

  enableDispenseDetail = new BehaviorSubject<boolean>(this.enablingDispense);
  enablingDispense$ = this.enableDispenseDetail.asObservable();

  public dialogData = new BehaviorSubject<any>(null);
  dialogResult$ = this.dialogData.asObservable();

  changePersonalDetailsData(res: any) {
    this.dialogData.next(res);
  }

  enableDispenseOnFertility(enablingDispense: any) {
    this.enableDispenseDetail.next(enablingDispense);
  }

  getBenFamilyDetails(benFamilyDetails: any) {
    this.benFamilyDet = benFamilyDetails;
    this.benfamilyData.next(benFamilyDetails);
  }

  getabhaDetail(abhaDetailDetails: any) {
    this.abhaDetail = abhaDetailDetails;
    this.abhaDetailData.next(this.abhaDetail);
  }

  districtMainList = new BehaviorSubject<any[]>([]);
  districtList$ = this.districtMainList.asObservable();

  updateDistrictList(districtList: any[]) {
    this.districtMainList.next(districtList);
  }

  subDistrictMainList = new BehaviorSubject<any[]>([]);
  subDistrictList$ = this.subDistrictMainList.asObservable();
  updateSubDistrictList(subDistrictList: any) {
    this.subDistrictMainList.next(subDistrictList);
  }

  maritalStatus = false;
  isMarriageStatus = new BehaviorSubject<any>(null);
  maritalStatus$ = this.isMarriageStatus.asObservable();

  isMarriageEnable(maritalStatus: any) {
    this.isMarriageStatus.next(maritalStatus);
  }
  clearMaritalDetails() {
    this.isMarriageStatus.next(null);
  }

  constructor(private http: HttpClient) {}

  getRegistrationMaster(servicePointID: any) {
    const tmpSPID = { spID: servicePointID };
    return this.http
      .post(environment.registrarMasterDataUrl, tmpSPID)
      .subscribe((res: any) => {
        if (res.data) this.registrationMasterDetails.next(res.data);
      });
  }

  getResgistartionMasterData(servicePointID: any) {
    const tmpSPID = { spID: servicePointID };
    return this.http
      .post(environment.registrarMasterDataUrl, tmpSPID)
      .subscribe((res: any) => {
        console.log(JSON.stringify(res.data), 'json data');
        if (res.data) this.registrationMasterDetails.next(res.data);
      });
  }

  subject = new BehaviorSubject(this.consentGranted);
  consentStatus$ = this.subject.asObservable();

  sendConsentStatus(grantValue: string) {
    this.consentGranted = grantValue;
    this.subject.next(grantValue);
  }

  getPatientDataAsObservable(benRegID: any) {
    return this.http.post(environment.getCompleteBeneficiaryDetail, {
      beneficiaryRegID: benRegID,
    });
  }

  getPatientData(benRegID: any) {
    return this.http.post(environment.getCompleteBeneficiaryDetail, {
      beneficiaryRegID: benRegID,
    });
  }

  registerBeneficiary(beneficiary: any) {
    const benData = { benD: beneficiary };
    return this.http.post(environment.registerBeneficiaryUrl, benData);
  }

  quickSearch(searchTerm: any) {
    return this.http.post(environment.quickSearchUrl, searchTerm);
  }

  identityQuickSearch(searchTerm: any) {
    return this.http.post(environment.identityQuickSearchUrl, searchTerm);
  }

  clearBeneficiaryEditDetails() {
    this.beneficiaryEditDetails.next(null);
  }

  saveBeneficiaryEditDataASobservable(beneficiary: any) {
    this.beneficiaryEditDetails.next(beneficiary);
  }

  advanceSearch(searchTerms: any) {
    return this.http.post(environment.advanceSearchUrl, searchTerms);
  }

  advanceSearchIdentity(searchTerms: any) {
    return this.http.post(environment.advanceSearchIdentityUrl, searchTerms);
  }

  externalSearchIdentity(searchTerms: any) {
    return this.http.post(environment.externalSearchIdentityUrl, searchTerms);
  }

  migrateBenToAmrit(benDetails: any) {
    return this.http.post(environment.externalSearchIdentityUrl, benDetails);
  }

  loadMasterData(servicePointID: any) {
    const tmpSPID = { spID: servicePointID };
    return this.http.post(environment.registrarMasterDataUrl, tmpSPID);
  }

  patientRevisit(benRegID: any) {
    return this.http.post(environment.patientRevisitSubmitToNurse, benRegID);
  }

  identityPatientRevisit(ben: any) {
    return this.http.post(
      environment.identityPatientRevisitSubmitToNurseURL,
      ben,
    );
  }

  updatePatientData(beneficiary: any) {
    return this.http.post(environment.updateBeneficiaryUrl, beneficiary);
  }

  getDistrictBlocks(servicePointID: any) {
    return this.http.post(environment.servicePointVillages, {
      servicePointID: servicePointID,
    });
  }

  submitBeneficiary(iEMRForm: any) {
    return this.http.post(environment.submitBeneficiaryIdentityUrl, iEMRForm);
  }

  updateBeneficiary(iEMRForm: any) {
    return this.http.post(environment.updateBeneficiaryIdentityUrl, iEMRForm);
  }

  getVillageList(blockId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      `${environment.getVillageListUrl}${blockId}`,
      httpOptions,
    );
  }

  getSubDistrictList(districtId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      `${environment.getSubDistrictListUrl}${districtId}`,
      httpOptions,
    );
  }

  getDistrictList(stateId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(
      `${environment.getDistrictListUrl}${stateId}`,
      httpOptions,
    );
  }

  generateOTP(mobileNo: any, mode: any) {
    if (mode === 'MOBILE') {
      return this.http.post(environment.otpGenerationUrl, mobileNo);
    } else if (mode === 'AADHAR') {
      return this.http.post(environment.otpGenerationWithUIDUrl, mobileNo);
    } else {
      // Default return statement if mode is neither "MOBILE" nor "AADHAR"
      throw new Error('Invalid mode');
    }
  }

  generateHealthId(reqObj: any) {
    return this.http.post(environment.healthIdGenerationUrl, reqObj);
  }

  generateHealthIdWithUID(reqObj: any) {
    return this.http.post(environment.healthIdGenerationWithUIDUrl, reqObj);
  }
  verifyOTPForAadharHealthId(reqObj: any) {
    return this.http.post(environment.verifyOTPUrl, reqObj);
  }

  checkAndGenerateMobileOTPHealthId(reqObj: any) {
    return this.http.post(environment.checkAndGenerateMobileOTPUrl, reqObj);
  }

  verifyMobileOTPForAadhar(reqObj: any) {
    return this.http.post(environment.verifyMobileOTPUrl, reqObj);
  }

  mapHealthId(reqObj: any) {
    return this.http.post(environment.mapHealthIdUrl, reqObj);
  }

  getHealthIdDetails(reqObj: any) {
    return this.http.post(environment.gethealthIdDetailsUrl, reqObj);
  }

  getMappedFacility(workLocationId: any) {
    return this.http.get(
      `${environment.getAbdmMappedFacility}${workLocationId}`,
    );
  }

  saveAbdmFacilityForVisit(reqObj: any) {
    return this.http.post(environment.saveAbdmFacilityIdForVisit, reqObj);
  }

  generateOtpForMappingCareContext(reqObjForMapping: any) {
    return this.http.post(
      environment.careContextGenerateOtpUrl,
      reqObjForMapping,
    );
  }
  verifyOtpForMappingCarecontext(reqObjForVerifyOtp: any) {
    return this.http.post(
      environment.verifyOtpForMappingContextUrl,
      reqObjForVerifyOtp,
    );
  }
  generateOTPValidateHealthID(healthID: any) {
    return this.http.post(
      environment.generateOTPForHealthIDValidation,
      healthID,
    );
  }
  verifyOTPForHealthIDValidation(reqObjForValidateOTP: any) {
    return this.http.post(
      environment.verifyOTPForHealthIDValidation,
      reqObjForValidateOTP,
    );
  }

  generateHealthIDCard(healthID: any) {
    return this.http.post(environment.generateOTPForHealthIDCard, healthID);
  }
  verifyOTPForHealthIDCard(reqObjForValidateOTP: any) {
    return this.http.post(
      environment.verifyOTPAndGenerateHealthCard,
      reqObjForValidateOTP,
    );
  }

  passIDsToFetchOtp(id: any) {
    this.healthId = id;
    this.healthIdOtp.next(id);
  }

  setHealthIdMobVerification(obj: any) {
    this.healthIdMobVerificationValue = obj;
    this.healthIdMobVerification.next(this.healthIdMobVerificationValue);
  }

  clearHealthIdMobVerification() {
    this.healthIdMobVerificationValue = null;
    this.healthIdMobVerification.next(this.healthIdMobVerificationValue);
  }

  updateBenDetailsInMongo(amritID: any) {
    return this.http.post(environment.updateAmritIDInMongo, amritID);
  }
}
