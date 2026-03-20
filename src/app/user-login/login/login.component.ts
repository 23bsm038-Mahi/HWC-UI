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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {
  AuthService,
  ConfirmationService,
} from 'src/app/app-modules/core/services';
import { FormBuilder, Validators } from '@angular/forms';
import { DataSyncLoginComponent } from 'src/app/app-modules/data-sync/data-sync-login/data-sync-login.component';
import { MasterDownloadComponent } from 'src/app/app-modules/data-sync/master-download/master-download.component';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';
import { CaptchaComponent } from '../captcha/captcha.component';
import { environment } from 'src/environments/environment';
import { AmritTrackingService } from 'Common-UI/src/tracking';

@Component({
  selector: 'app-login-cmp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('captchaCmp') captchaCmp: CaptchaComponent | undefined;
  dynamictype = 'password';
  encryptedVar: any;
  key: any;
  iv: any;
  SALT = 'RandomInitVector';
  Key_IV = 'Piramal12Piramal';
  encPassword: any;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  eSanjeevaniArr: any = [];
  eSanjeevaniArrForDoctor: any = [];

  @ViewChild('focus') private elementRef!: ElementRef;
  captchaToken!: string;
  enableCaptcha = environment.enableCaptcha;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    readonly sessionstorage: SessionStorageService,
    private trackingService: AmritTrackingService,
  ) {
    this._keySize = 256;
    this._ivSize = 128;
    this._iterationCount = 1989;
  }

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
    if (sessionStorage.getItem('isAuthenticated')) {
      this.authService.validateSessionKey().subscribe((res: any) => {
        if (res && res.statusCode === 200 && res.data)
          this.router.navigate(['/service']);
      });
    } else {
      sessionStorage.clear();
    }
  }
  public AfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

  get keySize() {
    return this._keySize;
  }

  set keySize(value) {
    this._keySize = value;
  }

  get iterationCount() {
    return this._iterationCount;
  }

  set iterationCount(value: any) {
    this._iterationCount = value;
  }

  generateKey(salt: any, passPhrase: any) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA512,
      keySize: this.keySize / 32,
      iterations: this._iterationCount,
    });
  }

  encryptWithIvSalt(salt: any, iv: any, passPhrase: any, plainText: any) {
    const key = this.generateKey(salt, passPhrase);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  encrypt(passPhrase: any, plainText: any) {
    const iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(
      CryptoJS.enc.Hex,
    );
    const salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(
      CryptoJS.enc.Hex,
    );
    const ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + ciphertext;
  }

  login() {
    const encryptPassword = this.encrypt(
      this.Key_IV,
      this.loginForm.controls.password.value,
    );

    if (
      this.loginForm.controls.userName.value &&
      this.loginForm.controls.password.value
    ) {
      this.authService
        .login(
          this.loginForm.controls.userName.value.trim(),
          encryptPassword,
          false,
          this.enableCaptcha ? this.captchaToken : undefined,
        )
        .subscribe(
          (res: any) => {
            console.log('res in login', res);
            if (res.statusCode === 200) {
              if (res?.data?.previlegeObj[0]) {
                this.authService.sessionExpiredHandled = false;
                this.sessionstorage.setItem(
                  'loginDataResponse',
                  JSON.stringify(res.data),
                );
                this.getServicesAuthdetails(res.data);
                for (
                  let i = 0;
                  i < res.data.previlegeObj[0].roles.length;
                  i++
                ) {
                  if (
                    res.data.previlegeObj[0].roles[i].RoleName.toLowerCase() ===
                    'nurse'
                  ) {
                    this.eSanjeevaniArr =
                      res.data.previlegeObj[0].roles[i].teleConsultation;
                  }
                  if (
                    res.data.previlegeObj[0].roles[i].RoleName.toLowerCase() ===
                    'doctor'
                  ) {
                    this.eSanjeevaniArrForDoctor =
                      res.data.previlegeObj[0].roles[i].teleConsultation;
                  }
                }
                this.confirmationService.eSanjeevaniFlagArry =
                  this.eSanjeevaniArr;
                this.confirmationService.eSanjeevaniDoctorFlagArry =
                  this.eSanjeevaniArrForDoctor;
              } else {
                this.confirmationService.alert(
                  'Seems you are logged in from somewhere else, Logout from there & try back in.',
                  'error',
                );
              }
            } else if (res.statusCode === 5002) {
              if (
                res.errorMessage ===
                'You are already logged in,please confirm to logout from other device and login again'
              ) {
                this.confirmationService
                  .confirm('info', res.errorMessage)
                  .subscribe((confirmResponse) => {
                    if (confirmResponse) {
                      this.authService
                        .userLogoutPreviousSession(
                          this.loginForm.controls.userName.value,
                        )
                        .subscribe(
                          (userlogoutPreviousSession: any) => {
                            if (userlogoutPreviousSession.statusCode === 200) {
                              this.authService
                                .login(
                                  this.loginForm.controls.userName.value,
                                  encryptPassword,
                                  true,
                                  this.enableCaptcha
                                    ? this.captchaToken
                                    : undefined,
                                )
                                .subscribe(
                                  (userLoggedIn: any) => {
                                    if (userLoggedIn.statusCode === 200) {
                                      if (userLoggedIn?.data?.previlegeObj[0]) {
                                        this.sessionstorage.setItem(
                                          'loginDataResponse',
                                          JSON.stringify(userLoggedIn.data),
                                        );
                                        this.trackingService.setUserId(
                                          userLoggedIn.data.userID,
                                        );
                                        this.authService.sessionExpiredHandled =
                                          false;
                                        this.sessionstorage.setItem(
                                          'loginDataResponse',
                                          JSON.stringify(userLoggedIn.data),
                                        );
                                        this.getServicesAuthdetails(
                                          userLoggedIn.data,
                                        );
                                      } else {
                                        this.resetCaptcha();
                                        this.confirmationService.alert(
                                          'Seems you are logged in from somewhere else, Logout from there & try back in.',
                                          'error',
                                        );
                                      }
                                    } else {
                                      this.resetCaptcha();
                                      this.showLoginError(userLoggedIn);
                                    }
                                  },
                                  (error) => {
                                    this.showLoginError(error);
                                  },
                                );
                            } else {
                              this.showLoginError(userlogoutPreviousSession);
                            }
                          },
                          (error) => {
                            this.showLoginError(error);
                          },
                        );
                    } else {
                      this.resetCaptcha();
                      sessionStorage.clear();
                      this.router.navigate(['/login']);
                      this.showLoginError(res);
                    }
                  });
              } else {
                this.showLoginError(res);
              }
            }
          },
          (err) => {
            this.showLoginError(err);
          },
        );
    }
  }

  private showLoginError(error: any) {
    this.resetCaptcha();
    this.confirmationService.alert(this.getLoginErrorMessage(error), 'error');
  }

  private getLoginErrorMessage(error: any): string {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    if (error?.errorMessage && typeof error.errorMessage === 'string') {
      return error.errorMessage;
    }

    if (error?.message && typeof error.message === 'string') {
      return error.message;
    }

    if (
      error?.error?.errorMessage &&
      typeof error.error.errorMessage === 'string'
    ) {
      return error.error.errorMessage;
    }

    if (error?.error?.message && typeof error.error.message === 'string') {
      return error.error.message;
    }

    return 'Unable to login. Please try again.';
  }

  getServicesAuthdetails(loginDataResponse: any) {
    const userName: any = this.loginForm.controls.userName.value;
    sessionStorage.setItem('key', loginDataResponse.key);
    sessionStorage.setItem(
      'isAuthenticated',
      loginDataResponse.isAuthenticated,
    );
    this.sessionstorage.setItem('userID', loginDataResponse.userID);
    this.trackingService.setUserId(loginDataResponse.userID);
    this.sessionstorage.setItem('userName', loginDataResponse.userName);
    this.sessionstorage.setItem('username', userName);
    this.sessionstorage.setItem('fullName', loginDataResponse.fullName);
    this.sessionstorage.setItem(
      'roles',
      loginDataResponse.previlegeObj[0].roles[0].RoleName,
    );
    const services: any = [];
    loginDataResponse.previlegeObj.map((item: any) => {
      if (
        item.roles[0].serviceRoleScreenMappings[0].providerServiceMapping
          .serviceID === 9
      ) {
        const service = {
          providerServiceID: item.serviceID,
          serviceName: item.serviceName,
          apimanClientKey: item.apimanClientKey,
          serviceID:
            item.roles[0].serviceRoleScreenMappings[0].providerServiceMapping
              .serviceID,
          serviceProviderID:
            item.roles[0].serviceRoleScreenMappings[0].providerServiceMapping
              .serviceProviderID,
        };
        services.push(service);
      }
    });
    if (services.length > 0) {
      this.sessionstorage.setItem('services', JSON.stringify(services));
      if (loginDataResponse.Status.toLowerCase() === 'new') {
        this.router.navigate(['/set-security-questions']);
      } else {
        this.router.navigate(['/service']);
      }
    } else {
      this.confirmationService.alert(
        "User doesn't have previlege to access the application",
      );
    }
  }

  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }

  loginDialogRef!: MatDialogRef<DataSyncLoginComponent>;
  openDialog() {
    this.loginDialogRef = this.dialog.open(DataSyncLoginComponent, {
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'fit-screen',
      backdropClass: 'backdrop',
      position: { top: '20px' },
      data: {
        masterDowloadFirstTime: true,
      },
    });

    this.loginDialogRef.afterClosed().subscribe((flag) => {
      if (flag) {
        this.dialog
          .open(MasterDownloadComponent, {
            hasBackdrop: true,
            disableClose: true,
            panelClass: 'fit-screen',
            backdropClass: 'backdrop',
            position: { top: '20px' },
          })
          .afterClosed()
          .subscribe(() => {
            sessionStorage.clear();
            this.sessionstorage.clear();
          });
      }
    });
  }

  onCaptchaResolved(token: any) {
    this.captchaToken = token;
  }

  resetCaptcha() {
    if (
      this.enableCaptcha &&
      this.captchaCmp &&
      typeof this.captchaCmp.reset === 'function'
    ) {
      this.captchaCmp.reset();
      this.captchaToken = '';
    }
  }
}
