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
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const commonIP = 'https://amritwprdev.piramalswasthya.org/';
const hwcIP = 'https://amritwprdev.piramalswasthya.org/';
const tmIP = 'https://amritwprdev.piramalswasthya.org/';
const mmuIP = 'https://amritwprdev.piramalswasthya.org/';
const schedulerIP = 'https://amritwprdev.piramalswasthya.org/';
const hwcUI_IP = 'https://amritwprdev.piramalswasthya.org/';
const schedulerUI_IP = 'https://amritwprdev.piramalswasthya.org/';
const inventoryUI_IP = 'https://amritwprdev.piramalswasthya.org/';
const SERVER_IP = 'dataSYNCIP';
const SWYMED_IP = '14.143.13.109';
const adminIP = 'https://amritwprdev.piramalswasthya.org/';
const FHIRIP = 'https://amritwprdev.piramalswasthya.org/';
const identityIP = 'https://amritwprdev.piramalswasthya.org/';
const IDENTITY_API = `${identityIP}identity-api/`;
const IP104 = 'https://amritwprdev.piramalswasthya.org/';

// With API MAN Configuration
// const COMMON_API_OPEN = `http://${IP}:8080/apiman-gateway/IEMR/Common/open/`;
//const HWC_API = `http://${IP}:8080/apiman-gateway/IEMR/TM/1.0/`;
// const COMMON_API = `http://${IP}:8080/apiman-gateway/IEMR/Common/open/`;
// const MMU_API = `http://${IP}:8080/apiman-gateway/IEMR/MMU/1.0/`;
//  const SCHEDULER_API = `http://${IP}:8080/apiman-gateway/IEMR/Scheduling/1.0/`;

// Without API MAN Configuration
const COMMON_API_OPEN = `${commonIP}common-api/`;
const COMMON_API = `${commonIP}common-api/`;
const HWC_API = `${hwcIP}hwc-api/`;
const TM_API = `${tmIP}tm-api/`;
const MMU_API = `${mmuIP}mmu-api/`;
const COMMON_API_OPEN_SYNC = `${SERVER_IP}common-api/`;
const SCHEDULER_API = `${schedulerIP}scheduler-api/`;
const ADMIN_API = `${adminIP}admin-api/`;
const API104 = `${IP104}104-api/`;
const biologicalScreeningDeviceAPI = `${ADMIN_API}diagnostics/biologicalScreeningDevice/`;
const FHIR_API = `${FHIRIP}fhir-api/`;
const mmuUICasesheet = `${hwcUI_IP}aam/`;
const sessionStorageEncKey = '';

const siteKey = '';
const captchaChallengeURL = '';
const enableCaptcha = false;
const enableCHOReportBtn = true;
const dhisURL = 'http://abc.xyz.org/dhis2-web-public/Reports.html?auth='; //sample

export const environment = {
  production: false,
  encKey: sessionStorageEncKey,
  isEnableES: true,
  tracking: {
    platform: 'matomo',
    siteId: 1,
    trackerUrl: '//127.0.0.1/',
    trackingPlatform: 'local',
    enabled: true,
  },

  app: `MMU`,
  RBSTest: `RBS Test`,
  visualAcuityTest: `Visual Acuity Test`,
  haemoglobinTest: `Hemoglobin Test`,
  abhaExtension: `@sbx`,
  diabetes: `Diabetes Mellitus`,
  hypertension: `Hypertension`,
  oral: `Oral cancer`,
  breast: `Breast cancer`,
  cervical: `Cervical cancer`,
  IdrsOrCbac: ['IDRS', 'CBAC'],
  parentAPI: `${HWC_API}`,

  INVENTORY_URL: `${inventoryUI_IP}aam-inventory/#/redirin?`,
  fallbackUrl: `/pharmacist/redirfallback`,
  redirInUrl: `/pharmacist/redirin`,

  TELEMEDICINE_URL: `${schedulerUI_IP}aam-scheduler/#/?`,
  fallbackMMUUrl: `/logout-tm`,
  redirInMMUUrl: `/common/tcspecialist-worklist`,

  getSessionExistsURL: `${COMMON_API_OPEN}user/getLoginResponse`,
  extendSessionUrl: `${HWC_API}common/extend/redisSession`,

  /**
   * comman API for fetching state and cities
   */

  getStateName: `${COMMON_API}location/states/`,
  getDistrictName: `${COMMON_API}location/districts/`,
  getSubDistrictName: `${COMMON_API}location/taluks/`,
  getCountryName: `${HWC_API}location/get/countryMaster`,
  getCityName: `${HWC_API}location/get/countryCityMaster/`,
  getNCDScreeningIDRSDetails: `${HWC_API}NCD/getBenIdrsDetailsFrmNurse`,
  updateNCDScreeningIDRSDetailsUrl: `${HWC_API}NCD/update/idrsScreen`,
  saveDoctorNCDScreeningDetails: `${HWC_API}NCD/save/doctorData`,
  /**
   * Login and Logout Urls
   */
  syncLoginUrl: `${COMMON_API_OPEN_SYNC}user/userAuthenticate`,
  loginUrl: `${COMMON_API_OPEN}user/userAuthenticate`,
  logoutUrl: `${COMMON_API_OPEN}user/userLogout`,
  userLogoutPreviousSessionUrl: `${COMMON_API_OPEN}user/logOutUserFromConcurrentSession`,

  /**
   * Security Question and Forgot password Url
   */
  getUserSecurityQuestionsAnswerUrl: `${COMMON_API_OPEN}user/forgetPassword`,
  getUserId: `${COMMON_API}user/userName/`,
  getSecurityQuestionUrl: `${COMMON_API_OPEN}user/getsecurityquetions`,
  saveUserSecurityQuestionsAnswerUrl: `${COMMON_API_OPEN}user/saveUserSecurityQuesAns`,
  setNewPasswordUrl: `${COMMON_API_OPEN}user/setForgetPassword`,

  servicePointUrl: `${HWC_API}user/getUserVanSpDetails`,
  servicePointVillages: `${HWC_API}user/getServicepointVillages`,

  registerBeneficiaryUrl: `${HWC_API}registrar/registrarBeneficaryRegistration/`,
  updateBeneficiaryUrl: `${HWC_API}registrar/update/BeneficiaryDetails`,
  submitBeneficiaryIdentityUrl: `${HWC_API}registrar/registrarBeneficaryRegistrationNew`,
  updateBeneficiaryIdentityUrl: `${HWC_API}registrar/update/BeneficiaryUpdate`,

  registrarMasterDataUrl: `${HWC_API}registrar/registrarMasterData`,
  quickSearchUrl: `${HWC_API}registrar/quickSearch`,
  identityQuickSearchUrl: `${HWC_API}registrar/quickSearchNew`,
  advanceSearchUrl: `${HWC_API}registrar/advanceSearch`,
  advanceSearchIdentityUrl: `${HWC_API}registrar/advanceSearchNew`,
  externalSearchIdentityUrl: `${FHIR_API}patient/data/profile/search/demographic`,
  patientRevisitSubmitToNurse: `${HWC_API}common/update/benDetailsAndSubmitToNurse`,
  identityPatientRevisitSubmitToNurseURL: `${HWC_API}registrar/create/BenReVisitToNurse`,
  /**
   * Master Data Urls
   */

  getDistrictListUrl: `${HWC_API}location/get/districtMaster/`,
  getSubDistrictListUrl: `${HWC_API}location/get/districtBlockMaster/`,
  getVillageListUrl: `${HWC_API}location/get/villageMasterFromBlockID/`,
  demographicsCurrentMasterUrl: `${HWC_API}location/getLocDetailsBasedOnSpIDAndPsmID`,
  visitDetailMasterDataUrl: `${HWC_API}master/get/visitReasonAndCategories`,
  nurseMasterDataUrl: `${HWC_API}master/nurse/masterData/`,
  doctorMasterDataUrl: `${HWC_API}master/doctor/masterData/`,
  snomedCTRecordURL: `${HWC_API}snomed/getSnomedCTRecord`,
  getCalibrationStrips: `${ADMIN_API}fetchCalibrationStrips`,
  getDistrictTalukUrl: `${MMU_API}location/get/DistrictTalukMaster/`,

  /**
   * Lab Data Urls
   */

  getprescribedTestDataUrl: `${HWC_API}labTechnician/get/prescribedProceduresList`,
  labSaveWork: `${HWC_API}labTechnician/save/LabTestResult`,

  /**
   * Worklist Urls
   */

  nurseWorklist: `${HWC_API}common/getNurseWorklistNew/`,
  getNurseTMWorklistUrl: `${HWC_API}common/getNurseWorkListTcCurrentDate/`,
  getNurseTMFutureWorklistUrl: `${HWC_API}common/getNurseWorkListTcFutureDate/`,
  labWorklist: `${HWC_API}common/getLabWorklistNew/`,
  doctorWorkList: `${HWC_API}common/getDocWorklistNew/`,
  doctorFutureWorkList: `${HWC_API}common/getDocWorkListNewFutureScheduledForTM/`,
  specialistWorkListURL: `${HWC_API}common/getTCSpecialistWorklist/`,
  specialistFutureWorkListURL: `${HWC_API}common/getTCSpecialistWorklistFutureScheduled/`,
  radiologistWorklist: `${HWC_API}common/getRadiologist-worklist-New/`,
  oncologistWorklist: `${HWC_API}common/getOncologist-worklist-New/`,
  pharmacistWorklist: `${HWC_API}common/getPharma-worklist-New/`,
  mmuNurseWorklist: `${HWC_API}common/getMmuNurseWorklistNew/`,

  // New API
  getBeneficiaryDetail: `${HWC_API}registrar/get/benDetailsByRegIDForLeftPanelNew`,

  getCompleteBeneficiaryDetail: `${HWC_API}registrar/get/beneficiaryDetails`,

  // getBeneficiaryImage: `${HWC_API}registrar/get/beneficiaryImage`,
  // New API
  getBeneficiaryImage: `${HWC_API}registrar/getBenImage`,
  getPreviousVisitDetailsUrl: `${HWC_API}casesheet/getBeneficiaryCaseSheetHistory`,
  updateVisitStatus: `${HWC_API}doctor/updateBeneficiaryStatus`,

  // printCancerCase_sheet_url: `${mmuUICasesheet}`,
  // updateOncologistRemarksCancelUrl: `${HWC_API}oncologist/update/examinationScreen/diagnosis`,
  updateOncologistRemarksCancelUrl: `${HWC_API}CS-cancerScreening/update/examinationScreen/diagnosis`,
  //commented by NEERAJ on 06-03-2018, because modified the url
  //getStatesURL: `${COMMON_API}location/states/`,
  //getDistrictsURL: `${COMMON_API}location/districts/`,

  getStatesURL: `${HWC_API}location/get/stateMaster`,
  getDistrictsURL: `${HWC_API}location/get/districtMaster/`,
  countryId: 1,

  /**
   * NCD SCREENING API URLs
   */
  postNCDScreeningDetails: `${HWC_API}NCD/save/nurseData`,
  // getNCDScreeningVisitDetails: `${HWC_API}CS-cancerScreening/getBenDataFrmNurseToDocVisitDetailsScreen`,
  updateNCDVitalsDetailsUrl: `${HWC_API}NCD/update/vitalScreen`,
  getNCDScreeningVisitDetails: `${HWC_API}NCD/getBenVisitDetailsFrmNurseNCDScreening`,
  getNCDScreeningDetails: `${HWC_API}NCD/get/nurseData`,
  updateNCDScreeningDetails: `${HWC_API}NCD/update/nurseData`,
  updateNCDScreeningHistoryDetailsUrl: `${HWC_API}NCD/update/historyScreen`,

  /**
   * GENERAL OPD QUICK CONSULT API URLs
   */
  saveNurseGeneralQuickConsult: `${HWC_API}genOPD-QC-quickConsult/save/nurseData`,
  saveDoctorGeneralQuickConsult: `${HWC_API}genOPD-QC-quickConsult/save/doctorData`,

  getGeneralOPDQuickConsultVisitDetails: `${HWC_API}genOPD-QC-quickConsult/getBenDataFrmNurseToDocVisitDetailsScreen`,
  getGeneralOPDQuickConsultVitalDetails: `${HWC_API}genOPD-QC-quickConsult/getBenVitalDetailsFrmNurse`,

  /**
   * ANC API URLs
   */
  saveNurseANCDetails: `${HWC_API}ANC/save/nurseData`,
  saveDoctorANCDetails: `${HWC_API}ANC/save/doctorData`,

  getANCVisitDetailsUrl: `${HWC_API}ANC/getBenVisitDetailsFrmNurseANC`,
  getANCDetailsUrl: `${HWC_API}ANC/getBenANCDetailsFrmNurseANC`,
  getANCVitalsDetailsUrl: `${HWC_API}ANC/getBenANCVitalDetailsFrmNurseANC`,
  getANCHistoryDetailsUrl: `${HWC_API}ANC/getBenANCHistoryDetails`,
  getANCExaminationDataUrl: `${HWC_API}ANC/getBenExaminationDetailsANC`,

  updateANCVisitDetailsUrl: `${HWC_API}ANC/update/visitDetailsScreen`,
  updateANCDetailsUrl: `${HWC_API}ANC/update/ANCScreen`,
  updateANCVitalsDetailsUrl: `${HWC_API}ANC/update/vitalScreen`,
  updateANCHistoryDetailsUrl: `${HWC_API}ANC/update/historyScreen`,
  updateANCExaminationDetailsUrl: `${HWC_API}ANC/update/examinationScreen`,

  /**ANC foetalMonitor API URLs */
  savefetosenseTestDetailsUrl: `${HWC_API}foetalMonitor/sendMotherTestDetailsToFoetalMonitor`,
  getPrescribedFetosenseTests: `${HWC_API}foetalMonitor/fetch/foetalMonitorDetails/`,
  getESanjeevaniDetailsUrl: `${COMMON_API}esanjeevani/getESanjeevaniUrl/`,

  /**
   * GENERAL OPD API URLs
   */
  saveNurseGeneralOPDDetails: `${HWC_API}generalOPD/save/nurseData`,

  updateGeneralOPDHistoryDetailsUrl: `${HWC_API}generalOPD/update/historyScreen`,
  updateGeneralOPDVitalsDetailsUrl: `${HWC_API}generalOPD/update/vitalScreen`,
  updateGeneralOPDExaminationDetailsUrl: `${HWC_API}generalOPD/update/examinationScreen`,

  saveDoctorGeneralOPDDetails: `${HWC_API}generalOPD/save/doctorData`,

  getGeneralOPDVisitDetailsUrl: `${HWC_API}generalOPD/getBenVisitDetailsFrmNurseGOPD`,
  getGeneralOPDHistoryDetailsUrl: `${HWC_API}generalOPD/getBenHistoryDetails`,
  getGeneralOPDVitalDetailsUrl: `${HWC_API}generalOPD/getBenVitalDetailsFrmNurse`,
  getGeneralOPDExaminationDetailsUrl: `${HWC_API}generalOPD/getBenExaminationDetails`,

  /**
   * NCD Care API Urls
   */
  saveNurseNCDCareDetails: `${HWC_API}NCDCare/save/nurseData`,

  saveDoctorNCDCareDetails: `${HWC_API}NCDCare/save/doctorData`,

  updateNCDCareHistoryDetailsUrl: `${HWC_API}NCDCare/update/historyScreen`,
  updateNCDCareVitalsDetailsUrl: `${HWC_API}NCDCare/update/vitalScreen`,

  getNCDCareVisitDetailsUrl: `${HWC_API}NCDCare/getBenVisitDetailsFrmNurseNCDCare`,
  getNCDCareHistoryDetailsUrl: `${HWC_API}NCDCare/getBenNCDCareHistoryDetails`,
  getNCDCareVitalDetailsUrl: `${HWC_API}NCDCare/getBenVitalDetailsFrmNurseNCDCare`,

  /**
   * Covid-19 API Urls
   */
  saveNurseCovidDetails: `${HWC_API}pandemic/covid/save/nurseData`,
  getCovidVisitDetails: `${HWC_API}pandemic/covid/getBenVisitDetailsFrmNurseCovid`,
  saveDoctorCovidDetails: `${HWC_API}pandemic/covid/save/doctorData`,
  updateCovidHistoryDetailsUrl: `${HWC_API}pandemic/covid/update/historyScreen`,
  updateCovidVitalsDetailsUrl: `${HWC_API}pandemic/covid/update/vitalScreen`,
  getCovidHistoryDetailsUrl: `${HWC_API}pandemic/covid/getBenCovid19HistoryDetails`,
  getCovidVitalDetailsUrl: `${HWC_API}pandemic/covid/getBenVitalDetailsFrmNurseCovid`,
  getCovidDoctorDetails: `${HWC_API}pandemic/covid/getBenCaseRecordFromDoctorCovid`,
  updateCovidDoctorDetails: `${HWC_API}pandemic/covid/update/doctorData`,

  /**
   * PNC Urls
   */
  savePNCNurseDetailsUrl: `${HWC_API}PNC/save/nurseData`,
  savePNCDoctorDetailsUrl: `${HWC_API}PNC/save/doctorData`,

  getPNCVisitDetailsUrl: `${HWC_API}PNC/getBenVisitDetailsFrmNursePNC`,
  getPNCDetailsUrl: `${HWC_API}PNC/getBenPNCDetailsFrmNursePNC`,
  getPNCVitalsDetailsUrl: `${HWC_API}PNC/getBenVitalDetailsFrmNurse`,
  getPNCHistoryDetailsUrl: `${HWC_API}PNC/getBenHistoryDetails`,
  getPNCExaminationDataUrl: `${HWC_API}PNC/getBenExaminationDetailsPNC`,

  updatePNCDetailsUrl: `${HWC_API}PNC/update/PNCScreen`,
  updatePNCHistoryDetailsUrl: `${HWC_API}PNC/update/historyScreen`,
  updatePNCVitalsDetailsUrl: `${HWC_API}PNC/update/vitalScreen`,
  updatePNCExaminationDetailsUrl: `${HWC_API}PNC/update/examinationScreen`,

  /*
   */
  getPreviousSignificiantFindingUrl: `${HWC_API}common/getDoctorPreviousSignificantFindings`,
  previousVisitDataUrl: `${HWC_API}common/getBenSymptomaticQuestionnaireDetails`,
  getNCDScreeningDoctorDetails: `${HWC_API}NCD/getBenCaseRecordFromDoctorNCDScreening`,
  getGeneralOPDQuickConsultDoctorDetails: `${HWC_API}genOPD-QC-quickConsult/getBenCaseRecordFromDoctorQuickConsult`,
  getANCDoctorDetails: `${HWC_API}ANC/getBenCaseRecordFromDoctorANC`,
  getGeneralOPDDoctorDetails: `${HWC_API}generalOPD/getBenCaseRecordFromDoctorGeneralOPD`,
  getNCDCareDoctorDetails: `${HWC_API}NCDCare/getBenCaseRecordFromDoctorNCDCare`,
  getPNCDoctorDetails: `${HWC_API}PNC/getBenCaseRecordFromDoctorPNC`,
  getNCDSceeriningVitalDetails: `${HWC_API}NCD/getBenVitalDetailsFrmNurse`,
  updateCancerScreeningDoctorDetails: `${HWC_API}CS-cancerScreening/update/doctorData`,
  updateNCDScreeningDoctorDetails: `${HWC_API}NCD/update/doctorData`,
  updateGeneralOPDQuickConsultDoctorDetails: `${HWC_API}genOPD-QC-quickConsult/update/doctorData`,
  updateANCDoctorDetails: `${HWC_API}ANC/update/doctorData`,
  updateGeneralOPDDoctorDetails: `${HWC_API}generalOPD/update/doctorData`,
  updateNCDCareDoctorDetails: `${HWC_API}NCDCare/update/doctorData`,
  updatePNCDoctorDetails: `${HWC_API}PNC/update/doctorData`,
  getNCDScreeningHistoryDetails: `${HWC_API}NCD/getBenHistoryDetails`,
  getTMCasesheetDataUrl: `${HWC_API}common/get/Case-sheet/printData`,
  getMMUCasesheetDataUrl: `${MMU_API}common/get/Case-sheet/printData`,

  previousPastHistoryUrl: `${HWC_API}common/getBenPastHistory`,
  previousMedicationHistoryUrl: `${HWC_API}common/getBenMedicationHistory`,
  previousTobaccoHistoryUrl: `${HWC_API}common/getBenTobaccoHistory`,
  previousAlcoholHistoryUrl: `${HWC_API}common/getBenAlcoholHistory`,
  previousAllergyHistoryUrl: `${HWC_API}common/getBenAllergyHistory`,
  previousFamilyHistoryUrl: `${HWC_API}common/getBenFamilyHistory`,
  previousPastObstetricHistoryUrl: `${HWC_API}common/getBenPastObstetricHistory`,
  previousMestrualHistoryUrl: `${HWC_API}common/getBenMenstrualHistory`,
  previousComorbidityHistoryUrl: `${HWC_API}common/getBenComorbidityConditionHistory`,
  previousImmunizationHistoryUrl: `${HWC_API}common/getBenChildVaccineHistory`,
  previousOtherVaccineHistoryUrl: `${HWC_API}common/getBenOptionalVaccineHistory`,
  previousPerinatalHistory: `${HWC_API}common/getBenPerinatalHistory`,
  previousDevelopmentHistory: `${HWC_API}common/getBenDevelopmentHistory`,
  previousFeedingHistory: `${HWC_API}common/getBenFeedingHistory`,
  /* */
  archivedReportsUrl: `${HWC_API}labTechnician/get/labResultForVisitcode`,
  ReportsBase64Url: `${HWC_API}foetalMonitor/fetch/reportGraphBase64`,
  previousMMUHistoryUrl: `${MMU_API}common/getBeneficiaryCaseSheetHistory`,
  previousTMHistoryUrl: `${HWC_API}common/getBeneficiaryCaseSheetHistory`,
  previousMCTSHistoryUrl: `${COMMON_API}mctsOutboundHistoryController/getMctsCallHistory`,
  previous104HistoryUrl: `${COMMON_API}beneficiary/get104BenMedHistory`,
  patientMCTSCallHistoryUrl: `${COMMON_API}mctsOutboundHistoryController/getMctsCallResponse`,
  drugDeleteUrl: `${HWC_API}common/doctor/delete/prescribedMedicine`,
  previousPhyscialactivityHistoryUrl: `${HWC_API}common/getBenPhysicalHistory`,
  previousDiabetesHistoryUrl: `${HWC_API}common/getBenPreviousDiabetesHistoryDetails`,
  previousReferredHistoryUrl: `${HWC_API}common/getBenPreviousReferralHistoryDetails`,
  newTaburl: `${mmuUICasesheet}`,
  previousImmunizationServiceDataUrl: `${HWC_API}common/getBenImmunizationServiceHistory`,

  getDataSYNCGroupUrl: `${HWC_API}dataSyncActivity/getSyncGroupDetails`,
  syncDataUploadUrl: `${HWC_API}dataSyncActivity/van-to-server`,
  syncDataDownloadUrl: `${HWC_API}dataSyncActivity/startMasterDownload`,
  syncDownloadProgressUrl: `${HWC_API}dataSyncActivity/checkMastersDownloadProgress`,
  getNcdScreeningVisitCountUrl: `${HWC_API}NCD/getNcdScreeningVisitCount/`,
  getVanDetailsForMasterDownloadUrl: `${HWC_API}dataSyncActivity/getVanDetailsForMasterDownload`,

  getMasterSpecializationUrl: `${SCHEDULER_API}specialist/masterspecialization`,
  getSpecialistUrl: `${SCHEDULER_API}specialist/getSpecialist`,
  getAvailableSlotUrl: `${SCHEDULER_API}schedule/getavailableSlot`,
  getSwymedMailUrl: `${SCHEDULER_API}van/getvan`,

  updateBeneficiaryArrivalStatusUrl: `${HWC_API}tc/update/benArrivalStatus`,
  cancelBeneficiaryTCRequestUrl: `${HWC_API}tc/cancel/benTCRequest`,
  scheduleTCUrl: `${HWC_API}tc/create/benTCRequestWithVisitCode`,
  beneficiaryTCRequestStatusUrl: `${HWC_API}tc/check/benTCRequestStatus`,
  swymedUrl: `swymed://${SWYMED_IP}`,
  saveSpecialistCancerObservationUrl: `${HWC_API}CS-cancerScreening/update/doctorData`,
  getSwymedMailLoginUrl: `${HWC_API}videoConsultation/login/`,
  invokeSwymedCallUrl: `${HWC_API}videoConsultation/call/`,
  invokeSwymedCallSpecialistUrl: `${HWC_API}videoConsultation/callvan/`,
  getSwymedLogoutUrl: `${HWC_API}videoConsultation/logout`,
  updateTCStartTimeUrl: `${HWC_API}tc/startconsultation`,
  snomedCTRecordListURL: `${HWC_API}snomed/getSnomedCTRecordList`,
  getServiceOnStateUrl: `${COMMON_API}service/serviceList`,
  licenseUrl: `${COMMON_API}license.html`,
  apiVersionUrl: `${HWC_API}version`,
  snomedCTRecordListURL1: `${COMMON_API}snomed/getSnomedCTRecordList`,

  ioturl: `${biologicalScreeningDeviceAPI}`,
  deviceStatusurl: `${biologicalScreeningDeviceAPI}api/v1/bluetooth/hub/connection_status`,
  deviceDisconnectUrl: `${biologicalScreeningDeviceAPI}api/v1/bluetooth/hub/disconnect`,
  deviceBluetoothurl: `${biologicalScreeningDeviceAPI}api/v1/bluetooth/service_discovery`,
  connectdeviceBluetoothurl: `${biologicalScreeningDeviceAPI}api/v1/bluetooth/hub_connection`,

  startWeighturl: '/api/v1/physical_tests/weight',
  startTempurl: '/api/v1/physical_tests/temperature',
  startPulseurl: '/api/v1/physical_tests/pulse_oxymetry',
  startBPurl: '/api/v1/physical_tests/blood_pressure',
  startHemoglobinurl: '/api/v1/wbpoct_tests/hemoglobin',
  startBloodGlucoseurl: '/api/v1/wbpoct_tests/blood_glucose',
  startRBSurl: '/api/v1/wbpoct_tests/blood_glucose',
  //file upload
  saveFile: `${COMMON_API}kmfilemanager/addFile`,
  viewFileData: `${HWC_API}common/getKMFile`,

  /*Doctor signature download */
  downloadSignUrl: `${COMMON_API}signature1/`,
  getLanguageList: `${COMMON_API}beneficiary/getLanguageList`,

  /*Load MMU Provider Specific Data */
  loadMMUDataUrl: `${HWC_API}common/getProviderSpecificData`,

  /*Load HRP Details */
  loadHRPUrl: `${HWC_API}ANC/getHRPStatus`,
  healthIdGenerationUrl: `${FHIR_API}healthID/verifyOTPAndGenerateHealthID`,
  healthIdGenerationWithUIDUrl: `${FHIR_API}healthIDWithUID/createHealthIDWithUID`,
  verifyOTPUrl: `${FHIR_API}healthIDWithUID/verifyOTP`,
  checkAndGenerateMobileOTPUrl: `${FHIR_API}healthIDWithUID/checkAndGenerateMobileOTP`,
  verifyMobileOTPUrl: `${FHIR_API}healthIDWithUID/verifyMobileOTP`,
  gethealthIdDetailsUrl: `${FHIR_API}healthID/getBenhealthID`,
  mapHealthIdUrl: `${FHIR_API}healthIDRecord/mapHealthIDToBeneficiary`,
  otpGenerationUrl: `${FHIR_API}healthID/generateOTP`,
  otpGenerationWithUIDUrl: `${FHIR_API}healthIDWithUID/generateOTP`,

  /*Health ID - care context Mapping*/
  careContextGenerateOtpUrl: `${FHIR_API}careContext/generateOTPForCareContext`,
  verifyOtpForMappingContextUrl: `${FHIR_API}careContext/validateOTPAndCreateCareContext`,
  /*Health ID Validation URL*/
  generateOTPForHealthIDValidation: `${FHIR_API}validate/generateOTPForHealthIDValidation`,
  verifyOTPForHealthIDValidation: `${FHIR_API}validate/verifyOTPForHealthIDValidation`,

  /* Health ID Card Generation*/
  generateOTPForHealthIDCard: `${FHIR_API}healthIDCard/generateOTP`,
  verifyOTPAndGenerateHealthCard: `${FHIR_API}healthIDCard/verifyOTPAndGenerateHealthCard`,

  /*Get Patient CBAC details*/
  getBenCBACDetails: `${COMMON_API}doortodoorapp/getSuspectedData_HRP_TB_NCD`,

  updateAmritIDInMongo: `${FHIR_API}higher/health/facility/update/bengenid`,
  /*Get patient higher health facility previous clinical records */
  higherHealthFacilityPreviousVisitDeatilsUrl: `${FHIR_API}higher/health/facility/get/clinical/data`,
  /*Calculate BMI for minors */
  calculateBmiStatus: `${HWC_API}common/calculateBMIStatus`,
  /* Validate users based on security questions */
  validateSecurityQuestions: `${COMMON_API}user/validateSecurityQuestionAndAnswer`,

  /* TransactionID for changing password */
  getTransacIDForPasswordChange: `${COMMON_API}user/getTransactionIdForChangePassword`,

  /*Covid vaccination Urls */
  vaccinationTypeAndDoseMasterUrl: `${COMMON_API}covid/master/VaccinationTypeAndDoseTaken`,
  saveCovidVaccinationDetailsUrl: `${COMMON_API}covid/saveCovidVaccinationDetails`,
  previousCovidVaccinationUrl: `${COMMON_API}covid/getCovidVaccinationDetails`,
  getCbacDetailsUrl: `${HWC_API}NCD/getCbacDetails`,

  /**Screening URL's */
  getNcdScreeningDetailsForCbac: `${HWC_API}NCD/get/ncd/screening/data`,
  updateNCDScreeningDetailsUrl: `${HWC_API}NCD/update/ncd/screening/data`,

  /*Family Tagging Urls */
  relationShipUrl: `${HWC_API}registrar/registrarMasterData`,
  saveFamilyTaggingUrl: `${IDENTITY_API}family/addTag`,
  editFamilyTaggingUrl: `${IDENTITY_API}family/editFamilyTagging`,
  untagFamilyUrl: `${IDENTITY_API}family/untag`,
  familySearchUrl: `${IDENTITY_API}family/searchFamily`,
  createFamilyUrl: `${IDENTITY_API}family/createFamily`,
  getFamilyMemberUrl: `${IDENTITY_API}family/getFamilyDetails`,
  /*Hypertension Screening Url */
  bloodPressureStatusUrl: `${HWC_API}screeningOutcome/hypertension`,

  /* Diabetes screening outcome Url */
  diabetesStatusUrl: `${HWC_API}screeningOutcome/diabetes`,

  confirmedDiseaseUrl: `${HWC_API}NCD/get/ncd/screening/data`,
  getHrpStatusURL: `${HWC_API}ANC/getHRPStatus`,
  previousVisitConfirmedUrl: `${HWC_API}NCD/fetchConfirmedScreeningDisease`,
  getHrpFollowUpURL: `${HWC_API}ANC/getHrpInformation`,

  /* Family Planning Urls*/
  getFamilyPlanningVisitDetails: `${HWC_API}family-planning/getBenVisitDetails-Nurse-FamilyPlanning`,
  saveNurseFamilyPlanningDetails: `${HWC_API}family-planning/save-family-planning-nurse-data`,
  getFamilyPlanningVitalDetailsUrl: `${HWC_API}family-planning/getBenVitalDetailsFrmNurseFamilyPlanning`,
  updateFamilyPlanningVitalsDetailsUrl: `${HWC_API}family-planning/update/vitalScreen`,
  updateFamilyPlanningScreenDetailsUrl: `${HWC_API}family-planning/update/FamilyPlanningScreen`,
  getFamilyPlanningDetailsUrl: `${HWC_API}family-planning/getBenFPDetailsFrmNurseFamilyPlanning`,
  saveDoctorFamilyPlanningDetails: `${HWC_API}family-planning/save-family-planning-doctor-data`,
  getFamilyPlanningDoctorDetails: `${HWC_API}family-planning/getBenCaseRecordFromDoctor`,
  updateFamilyPlanningDoctorDetails: `${HWC_API}family-planning/update/doctorData`,

  /* Neonatal And Infant Services Urls*/
  saveNurseNeonatalAndInfantDetails: `${HWC_API}neonatal-infant-services/save/nurseData`,
  getBirthImmunizationHistoryDetailsUrl: `${HWC_API}neonatal-infant-services/getBenHistoryDetails`,
  updateBirthImmunizationHistoryDetailsUrl: `${HWC_API}neonatal-infant-services/update/BirthAndImmunizationHistoryScreen`,
  getNeonatalVitalsDetailsUrl: `${HWC_API}neonatal-infant-services/getBenVitalDetailsFrmNurse`,
  updateNeonatalVitalsDetailsUrl: `${HWC_API}neonatal-infant-services/update/vitalScreen`,
  getPreviousBirthImmunizationDetailsUrl: `${HWC_API}neonatal-infant-services/getBenHistoryDetails`,
  saveDoctorNeonatalAndInfantService: `${HWC_API}neonatal-infant-services/save-neo-natal-doctor-data`,
  updateNeonatalAndInfantService: `${HWC_API}neonatal-infant-services/update/doctorData`,
  getNeonatalAndInfantDetails: `${HWC_API}neonatal-infant-services/getBenCaseRecordFromDoctor`,
  vaccineListUrl: `${HWC_API}master/common/masterData/getVaccine/`,
  fetchNeonatalImmunizationService: `${HWC_API}neonatal-infant-services/getBenImmunizationServiceDetails`,
  updateNeonatalImmunizationService: `${HWC_API}neonatal-infant-services/update/ImmunizationServicesScreen`,
  getNeonatalVisitDetails: `${HWC_API}neonatal-infant-services/getBenVisitDetailsFrmNurseNNI`,

  /* Child And Adolescent Urls */
  saveNurseChildAndAdloescentDetails: `${HWC_API}child-adolescent-care/save/nurseData`,
  getChildAndAdolescentVisitDetails: `${HWC_API}child-adolescent-care/getBenVisitDetailsFrmNurseCAC`,
  getChildAndAdolescentVitalsDetailsUrl: `${HWC_API}child-adolescent-care/getBenVitalDetailsFrmNurse`,
  getPreviousBirthImmunizationDataForChildAndAdolascentUrl: `${HWC_API}child-adolescent-care/getBenHistoryDetails`,
  updateChildAndAdolescentVitalsDetailsUrl: `${HWC_API}child-adolescent-care/update/vitalScreen`,
  getChildAndAdolescentDetails: `${HWC_API}child-adolescent-care/getBenCaseRecordFromDoctor`,
  saveDoctorChildAndAdolescentService: `${HWC_API}child-adolescent-care/save/doctorData`,
  updateChildAndAdolescentServiceDoctor: `${HWC_API}child-adolescent-care/update/doctorData`,
  updateChildAndAdolescentService: `${HWC_API}child-adolescent-care/update/ImmunizationServicesScreen`,
  fetchChildAndAdolescentService: `${HWC_API}child-adolescent-care/getBenImmunizationServiceDetails`,
  updateBirthAndImmunizationHistoryDataUrl: `${HWC_API}child-adolescent-care/update/BirthAndImmunizationHistoryScreen`,
  getBirthImmunizationHistoryDataUrl: `${HWC_API}child-adolescent-care/getBenHistoryDetails`,

  /* SWAASA Urls*/
  getResultStatusURL: `${COMMON_API}lungAssessment/startAssesment`,
  getAssessmentUrl: `${COMMON_API}lungAssessment/getAssesment`,
  getAssessmentIdUrl: `${COMMON_API}lungAssessment/getAssesmentDetails`,
  getnurse104referredworklisturls: `${HWC_API}uptsu/getWorklistByVanID`,

  /* CDSS Urls */
  getCdssQuestionsUrl: `${API104}CDSS/getQuestions`,
  getCdssAnswersUrl: `${API104}CDSS/getResult`,
  getSnomedCtRecordUrl: `${API104}snomed/getSnomedCTRecord`,
  getCheifComplaintsSymptomsUrl: `${API104}CDSS/Symptoms`,
  getActionMasterUrl: `${HWC_API}uptsu/get/action-master`,
  closeVisitSaveComplaintsUrl: `${HWC_API}uptsu/submit/closevisit`,
  getDiseaseDataUrls: `${API104}diseaseController/getDiseasesByID`,
  getDiseaseNamesUrls: `${API104}diseaseController/getAvailableDiseases`,
  getAdminCdssStatus: `${ADMIN_API}uptsu/getCdssData`,

  /** Previous Anthropometry  Urls */
  getPreviousAnthropometryUrl: `${TM_API}anthropometryVitals/getBenHeightDetailsFrmNurse`,
  /* Customization APIs*/
  getAllRegistrationData: `${COMMON_API}customization/fetchAllData`,

  /*Biometric with Health ID*/
  getdeviceRDServiceUrl: `${COMMON_API}biometric/getBiometricData/`,
  confirmAadharBio: `${FHIR_API}healthIDWithBio/confirmWithAadhaarBio`,

  generateABHAForBio: `${FHIR_API}healthIDWithBio/verifyBio`,
  generateABHAForBioMobileOTP: `${FHIR_API}healthIDWithBio/generateMobileOTP`,

  /* ABDM Mapped Facility */
  getAbdmMappedFacility: `${COMMON_API}facility/getWorklocationMappedAbdmFacility/`,
  saveAbdmFacilityIdForVisit: `${FHIR_API}facility/saveAbdmFacilityId`,

  /* Abha V3 APIs */
  requestOtpForAbhaEnroll: `${FHIR_API}abhaCreation/requestOtpForAbhaEnrollment`,
  abhaEnrollmentByAadhaar: `${FHIR_API}abhaCreation/abhaEnrollmentByAadhaar`,
  verifyMobileForAbhaAuth: `${FHIR_API}abhaCreation/verifyAuthByAbdm`,
  requestOtpForLogin: `${FHIR_API}abhaLogin/abhaLoginRequestOtp`,
  verifyOtpForLogin: `${FHIR_API}abhaLogin/verifyAbhaLogin`,
  printPngCard: `${FHIR_API}abhaCreation/printAbhaCard`,
  printWebLoginPhrCard: `${FHIR_API}abhaLogin/printWebLoginPhrCard`,

  /* Abha M2 V3 APIs */
  generateLinkTokenForCareContext: `${FHIR_API}careContext/generateCareContextToken`,
  linkCareContext: `${FHIR_API}careContext/linkCareContext`,

  getBenIdForhealthID: `${FHIR_API}healthID/getBenIdForhealthID`,
  siteKey: siteKey,
  captchaChallengeURL: captchaChallengeURL,
  enableCaptcha: enableCaptcha,
  enableCHOReportBtn: enableCHOReportBtn,
  dhisURL: dhisURL,
  elasticSearchUrl: `${HWC_API}registrar/quickSearchES`,
  advanceElasticSearchUrl: `${HWC_API}registrar/advancedSearchES`,
  checkUsersignExistUrl: `${ADMIN_API}signature1/signexist/`,
};
