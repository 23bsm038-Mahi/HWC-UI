import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'src/app/app-modules/core/services';
import { TelemedicineService } from 'src/app/app-modules/core/services/telemedicine.service';
import { ServicePointService } from './../service-point/service-point.service';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
})
export class ServiceComponent implements OnInit, DoCheck {
  servicesList: any;
  serviceIDs: any;
  fullName: any;
  currentLanguageSet: any;
  statesList: any = [];
  stateID: any;
  current_language_set: any;
  vanServicepointDetails: any;
  vansList = [];
  vanID!: string;
  currVanId: any;
  serviceDetails: any;
  stateName: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private telemedicineService: TelemedicineService,
    private servicePointService: ServicePointService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    readonly sessionstorage: SessionStorageService,
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.sessionstorage.removeItem('providerServiceID');
    const services: any = this.sessionstorage.getItem('services');
    this.servicesList = JSON.parse(services);
    if (this.servicesList.length === 1) {
      this.sessionstorage.setItem(
        'providerServiceID',
        this.servicesList[0].providerServiceID,
      );
      this.sessionstorage.setItem(
        'serviceName',
        this.servicesList[0].serviceName,
      );
      this.sessionstorage.setItem('serviceID', this.servicesList[0].serviceID);
      sessionStorage.setItem(
        'apimanClientKey',
        this.servicesList[0].apimanClientKey,
      );
    }
    this.fullName = this.sessionstorage.getItem('fullName');
  }

  getServicePoint() {
    const serviceProviderId: any =
      this.sessionstorage.getItem('providerServiceID');
    const userId: any = this.sessionstorage.getItem('userID');
    const data: any = this.sessionstorage.getItem('loginDataResponse');
    const jsonData = JSON.parse(data);
    const designation = jsonData.designation.designationName;
    this.servicePointService
      .getServicePoints(userId, serviceProviderId)
      .subscribe(
        (res: any) => {
          console.log('res under getServicePoints', res);
          if (res.statusCode === 200 && res.data !== null) {
            const data = res.data;

            if (data.UserVanSpDetails && data.UserVanSpDetails.length > 0) {
              this.vanServicepointDetails = data.UserVanSpDetails;
              this.currVanId = this.vanServicepointDetails[0].vanID;
              this.filterVanList(this.vanServicepointDetails);
              this.getDemographics();
              this.checkRoleAndDesingnationMappedForservice(
                this.loginDataResponse,
                this.serviceDetails,
              );
            } else if (designation === 'TC Specialist') {
              this.checkRoleAndDesingnationMappedForservice(
                this.loginDataResponse,
                this.serviceDetails,
              );
            }
          } else if (res.statusCode === 5002) {
            this.confirmationService.alert(res.errorMessage, 'error');
          } else {
            this.confirmationService.alert(res.errorMessage, 'error');
            this.router.navigate(['/service']);
          }
        },
        (err: any) => {
          this.confirmationService.alert(err, 'error');
        },
      );
  }
  filterVanList(vanServicepointDetails: any) {
    console.log('vanServicepointDetails', vanServicepointDetails);
    this.vansList = vanServicepointDetails.filter((van: any) => {
      if (van.vanSession === 3) {
        return van;
      }
    });
    this.vansList = vanServicepointDetails.filter(
      (thing: any, i: any, arr: any) =>
        arr.findIndex((t: any) => t.vanID === thing.vanID) === i,
    );
    console.log('vanList', this.vansList);
    this.getServiceLineDetails();
  }
  getServiceLineDetails() {
    const serviceLineDetails: any = this.vansList[0];
    console.log('serviceLineDetails', serviceLineDetails);
    this.sessionstorage.setItem(
      'serviceLineDetails',
      JSON.stringify(serviceLineDetails),
    );
    if (
      serviceLineDetails.facilityID &&
      serviceLineDetails.facilityID !== undefined &&
      serviceLineDetails.facilityID !== null
    )
      this.sessionstorage.setItem('facilityID', serviceLineDetails.facilityID);
    if (serviceLineDetails.servicePointID)
      this.sessionstorage.setItem(
        'servicePointID',
        serviceLineDetails.servicePointID,
      );
    if (serviceLineDetails.servicePointName)
      this.sessionstorage.setItem(
        'servicePointName',
        serviceLineDetails.servicePointName,
      );
    if (serviceLineDetails.vanSession)
      this.sessionstorage.setItem('sessionID', serviceLineDetails.vanSession);
  }

  loginDataResponse: any;
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  async selectService(service: any) {
    try {
      this.sessionstorage.setItem(
        'providerServiceID',
        service.providerServiceID,
      );
      this.sessionstorage.setItem('serviceName', service.serviceName);
      this.sessionstorage.setItem('serviceID', service.serviceID);
      sessionStorage.setItem('apimanClientKey', service.apimanClientKey);
      const loginDataResponse: any =
        this.sessionstorage.getItem('loginDataResponse');
      this.loginDataResponse = JSON.parse(loginDataResponse);
      this.serviceDetails = service;
      // Wait until this completes before proceeding
      await this.getServicePointAsync();
      this.getCdssAdminStatus();
    } catch (err) {
      this.confirmationService.alert(
        'An error occurred. Please try again.',
        'error',
      );
      console.error(err);
    }
  }
  getServicePointAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      const serviceProviderId: any =
        this.sessionstorage.getItem('providerServiceID');
      const userId: any = this.sessionstorage.getItem('userID');
      const loginData =
        this.sessionstorage.getItem('loginDataResponse') ?? '{}';
      const parsedLoginData = JSON.parse(loginData);
      const designation = parsedLoginData.designation?.designationName;
      this.servicePointService
        .getServicePoints(userId, serviceProviderId)
        .subscribe({
          next: async (res: any) => {
            if (res.statusCode === 200 && res.data) {
              const data = res.data;
              if (data.UserVanSpDetails?.length > 0) {
                this.vanServicepointDetails = data.UserVanSpDetails;
                this.currVanId = this.vanServicepointDetails[0].vanID;
                this.filterVanList(this.vanServicepointDetails);
                this.getDemographics();
                await this.handleRoleDesignationRouting(); // wait until navigation is done
                resolve();
              } else if (designation === 'TC Specialist') {
                await this.handleRoleDesignationRouting();
                resolve();
              } else {
                this.confirmationService.alert(
                  'Service points not found.',
                  'error',
                );
                this.router.navigate(['/service']);
                reject();
              }
            } else {
              this.confirmationService.alert(res.errorMessage, 'error');
              this.router.navigate(['/service']);
              reject();
            }
          },
          error: (err) => {
            this.confirmationService.alert(err, 'error');
            reject(err);
          },
        });
    });
  }

  async handleRoleDesignationRouting(): Promise<void> {
    const loginDataResponse = this.loginDataResponse;

    const service = this.serviceDetails;

    let serviceData: any;

    if (loginDataResponse.previlegeObj) {
      serviceData = loginDataResponse.previlegeObj.find(
        (item: any) => item.serviceName === service.serviceName,
      );

      if (serviceData?.roles?.length > 0) {
        this.roleArray = [];

        serviceData.roles.forEach((role: any) => {
          role.serviceRoleScreenMappings.forEach((serviceRole: any) => {
            this.roleArray.push(serviceRole.screen.screenName);
          });
        });

        this.sessionstorage.setItem('role', JSON.stringify(this.roleArray));

        const designation = loginDataResponse.designation?.designationName;

        if (designation && this.roleArray.includes(designation)) {
          this.sessionstorage.setItem('designation', designation);

          await this.routeToDesignation(designation);
        } else {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.rolesNotMatched,

            'error',
          );
        }
      } else {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.mapRoleFeature,

          'error',
        );
      }
    } else {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.mapRoleFeature,

        'error',
      );
    }
  }

  checkRoleAndDesingnationMappedForservice(
    loginDataResponse: any,
    service: any,
  ) {
    let serviceData: any;

    if (loginDataResponse.previlegeObj) {
      serviceData = loginDataResponse.previlegeObj.filter((item: any) => {
        return item.serviceName === service.serviceName;
      })[0];

      if (serviceData !== null) {
        this.checkMappedRoleForService(serviceData);
      }
    }
  }

  roleArray: any[] = [];
  checkMappedRoleForService(serviceData: any) {
    this.roleArray = [];
    let roleData;
    if (serviceData.roles) {
      roleData = serviceData.roles;
      if (roleData.length > 0) {
        roleData.forEach((role: any) => {
          role.serviceRoleScreenMappings.forEach((serviceRole: any) => {
            this.roleArray.push(serviceRole.screen.screenName);
          });
        });
        if (this.roleArray && this.roleArray.length > 0) {
          this.sessionstorage.setItem('role', JSON.stringify(this.roleArray));
          this.checkMappedDesignation(this.loginDataResponse);
        } else {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.mapRoleFeature,
            'error',
          );
        }
      } else {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.mapRoleFeature,
          'error',
        );
      }
    } else {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.mapRoleFeature,
        'error',
      );
    }
  }

  designation: any;
  checkMappedDesignation(loginDataResponse: any) {
    if (
      loginDataResponse.designation &&
      loginDataResponse.designation.designationName
    ) {
      this.designation = loginDataResponse.designation.designationName;
      if (this.designation !== null) {
        this.checkDesignationWithRole();
      } else {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.mapDesignation,
          'error',
        );
      }
    } else {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.mapDesignation,
        'error',
      );
    }
  }

  checkDesignationWithRole() {
    if (this.roleArray.includes(this.designation)) {
      this.sessionstorage.setItem('designation', this.designation);
      this.routeToDesignation(this.designation);
    } else {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.rolesNotMatched,
        'error',
      );
    }
  }
  getSwymedMailLogin() {
    this.servicePointService.getSwymedMailLogin().subscribe((res: any) => {
      if (res.statusCode === 200) window.location.href = res.data.response;
    });
  }

  getDemographics() {
    this.servicePointService
      .getMMUDemographics(this.currVanId)
      .subscribe((res: any) => {
        if (res && res.statusCode === 200) {
          this.saveDemographicsToStorage(res.data);
        } else {
          this.locationGathetingIssues();
        }
      });
  }

  saveDemographicsToStorage(data: any) {
    if (data) {
      if (data.stateMaster && data.stateMaster.length >= 1) {
        this.sessionstorage.setItem('location', JSON.stringify(data));
      } else {
        this.locationGathetingIssues();
      }
    } else {
      this.locationGathetingIssues();
    }

    console.log('statesList', this.statesList);
    this.stateID = data.stateMaster.stateID;
    this.saveLocationDataToStorage();
  }

  locationGathetingIssues() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    this.confirmationService.alert(
      this.current_language_set.coreComponents
        .issuesInGettingLocationTryToReLogin,
      'error',
    );
  }
  goToWorkList() {
    this.designation = this.sessionstorage.getItem('designation');
    this.routeToDesignationWorklist(this.designation);
  }

  routeToDesignationWorklist(designation: any): Promise<boolean> {
    switch (designation) {
      case 'Registrar':
        return this.router.navigate(['/registrar/registration']);
      case 'Nurse':
        return this.router.navigate(['/nurse-doctor/nurse-worklist']);
      case 'Doctor':
        return this.router.navigate(['/nurse-doctor/doctor-worklist']);
      case 'Lab Technician':
        return this.router.navigate(['/lab']);
      case 'Pharmacist':
        return this.router.navigate(['/pharmacist']);
      case 'Radiologist':
        return this.router.navigate(['/nurse-doctor/radiologist-worklist']);
      case 'Oncologist':
        return this.router.navigate(['/nurse-doctor/oncologist-worklist']);
      default:
        return Promise.resolve(false);
    }
  }

  routeToDesignation(designation: any): Promise<boolean> {
    switch (designation) {
      case 'TC Specialist':
        return this.router.navigate(['/nurse-doctor/tcspecialist-worklist']);
      case 'Supervisor':
        this.telemedicineService.routeToTeleMedecine(); // if this is a navigation, make it return a Promise too
        return Promise.resolve(true);
      default:
        return this.routeToDesignationWorklist(designation);
    }
  }

  async getCdssAdminStatus() {
    const psmid = this.sessionstorage.getItem('providerServiceID');
    // if(psmid){
    await this.servicePointService
      .getCdssAdminDetails(psmid)
      .subscribe((res: any) => {
        if (
          res.data !== null &&
          res.data !== undefined &&
          res.data.isCdss !== undefined &&
          res.data.isCdss !== null
        ) {
          this.sessionstorage.setItem('isCdss', res.data.isCdss);
        }
      });
    // }
  }

  saveLocationDataToStorage() {
    setTimeout(() => {
      const location: any = this.sessionstorage.getItem('location');
      const data = JSON.parse(location);
      this.stateName = data.stateMaster.find((item: any) => {
        if (item.stateID === data.otherLoc.stateID) return item.stateName;
      });
      const locationData = {
        stateID: data.otherLoc.stateID,
        stateName: this.stateName.stateName,
        districtID: data.otherLoc.districtList[0].districtID,
        districtName: data.otherLoc.districtList[0].districtName,
        blockName: data.otherLoc.districtList[0].blockName,
        blockID: data.otherLoc.districtList[0].blockId,
        subDistrictID: data.otherLoc.districtList[0].districtBranchID,
        villageName: data.otherLoc.districtList[0].villageName,
      };

      // Convert the object into a JSON string
      const locationDataJSON = JSON.stringify(locationData);

      // Store the JSON string in this.sessionstorage
      this.sessionstorage.setItem('locationData', locationDataJSON);
    }, 1000);
  }
}
