import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SpinnerService } from './spinner.service';
import { ConfirmationService } from './confirmation.service';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { AuthService } from 'src/app/app-modules/core/services';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  private sessionTimeoutRef: any;
  private pendingRequests = 0;
  private isHandlingSessionExpiry = false;
  private logoutMessageShown = false;

  currentLanguageSet: any;

  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    readonly sessionstorage: SessionStorageService,
    public httpServiceService: HttpServiceService,
    private authService: AuthService,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event.url === '/login') {
        this.resetSessionState();
      }
    });
  }

  assignSelectedLanguage() {
    if (!this.currentLanguageSet) {
      const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
      getLanguageJson.setLanguage();
      this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    this.assignSelectedLanguage();

    const isLoginRequest =
      req.url && req.url.toLowerCase().includes('user/userAuthenticate');

    this.pendingRequests++;
    const key: any = sessionStorage.getItem('key');
    let modifiedReq = null;

    const isPlatformFeedback =
      req.url && req.url.toLowerCase().includes('/platform-feedback');

    if (isPlatformFeedback) {
      const headers = req.headers
        .delete('Authorization')
        .set('Content-Type', 'application/json');
      modifiedReq = req.clone({ headers });
    } else {
      if (key !== undefined && key !== null) {
        modifiedReq = req.clone({
          headers: req.headers
            .set('Authorization', key)
            .set('Content-Type', 'application/json'),
        });
      } else {
        modifiedReq = req.clone({
          headers: req.headers.set('Authorization', ''),
        });
      }
    }

    return next.handle(modifiedReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (req.url !== undefined && !req.url.includes('cti/getAgentState'))
          this.spinnerService.setLoading(true);
        if (event instanceof HttpResponse) {
          console.log(event.body);

          if (isLoginRequest && event.status === 200) {
            this.resetSessionState();
          }

          this.onSuccess(req.url, event.body);
          return event.body;
        }
      }),

      catchError((error: HttpErrorResponse) => {
        console.error(error);

        let sessionExpired = false;

        if (!this.isHandlingSessionExpiry) {
          if (error.status === 401) {
            this.isHandlingSessionExpiry = true;
            sessionExpired = true;
            this.handleSessionExpiry(
              this.currentLanguageSet?.sessionExpiredPleaseLogin ||
                'Session has expired, please login again.',
            );
          } else if (error.status === 403) {
            this.isHandlingSessionExpiry = true;
            sessionExpired = true;
            this.handleSessionExpiry(
              this.currentLanguageSet?.accessDenied ||
                'Access Denied. You do not have permission to access this resource.',
            );
          }
        }

        if (sessionExpired) {
          return EMPTY;
        }

        return throwError(error);
      }),

      finalize(() => {
        this.pendingRequests--;
        if (this.pendingRequests === 0) {
          this.spinnerService.setLoading(false);
        }
      }),
    );
  }

  public isSessionExpiryInProgress(): boolean {
    return this.isHandlingSessionExpiry;
  }

  private getErrorMessage(error: any): string {
    try {
      if (typeof error === 'string') {
        return error && error.trim().length > 0
          ? error
          : this.currentLanguageSet?.sessionExpiredPleaseLogin ||
              'Your session has expired. Please login again.';
      }

      if (error && typeof error === 'object') {
        if (error.message && typeof error.message === 'string') {
          return error.message;
        }
        if (error.errorMessage && typeof error.errorMessage === 'string') {
          return error.errorMessage;
        }
        if (error.error && typeof error.error === 'string') {
          return error.error;
        }
      }

      return (
        this.currentLanguageSet?.sessionExpiredPleaseLogin ||
        'Your session has expired. Please login again.'
      );
    } catch (err) {
      console.error('Error extracting message:', err);
      return (
        this.currentLanguageSet?.sessionExpiredPleaseLogin ||
        'Your session has expired. Please login again.'
      );
    }
  }

  private handleSessionExpiry(errorMessage: string): void {
    if (this.isHandlingSessionExpiry && this.logoutMessageShown) {
      return;
    }

    this.isHandlingSessionExpiry = true;
    this.clearSessionTimeoutTimer();

    sessionStorage.clear();
    this.sessionstorage.clear();

    const displayMessage = this.getErrorMessage(errorMessage);

    try {
      this.router
        .navigate(['/login'])
        .then((navigated: boolean) => {
          if (!navigated) {
            console.error('Navigation to login failed');
          }

          if (!this.logoutMessageShown) {
            this.logoutMessageShown = true;
            setTimeout(() => {
              try {
                this.confirmationService
                  .alert(displayMessage, 'error')
                  .afterClosed()
                  .subscribe(
                    () => {
                      console.log('Session expiry dialog closed');
                    },
                    (dialogError: any) => {
                      console.error('Error in dialog:', dialogError);
                    },
                  );
              } catch (dialogErr) {
                console.error(
                  'Failed to show session expiry dialog:',
                  dialogErr,
                );
              }
            }, 300);
          }
        })
        .catch((navError: any) => {
          console.error('Navigation error:', navError);
        });
    } catch (err) {
      console.error('Error during session expiry handling:', err);
    }
  }

  private resetSessionState(): void {
    this.isHandlingSessionExpiry = false;
    this.logoutMessageShown = false;
    this.clearSessionTimeoutTimer();
  }

  private onSuccess(url: string, response: any): void {
    if (!this.isHandlingSessionExpiry) {
      if (
        response.statusCode === 5002 &&
        url.indexOf('user/userAuthenticate') < 0
      ) {
        this.isHandlingSessionExpiry = true;
        this.handleSessionExpiry(
          response.errorMessage ||
            this.currentLanguageSet?.sessionExpiredPleaseLogin ||
            'Session has expired, please login again.',
        );
        return;
      } else if (
        response.statusCode === 5000 &&
        response.errorMessage ===
          'Unable to fetch session object from Redis server'
      ) {
        this.isHandlingSessionExpiry = true;
        this.handleSessionExpiry(
          this.currentLanguageSet?.sessionExpiredPleaseLogin ||
            'Session has expired, please login again.',
        );
        return;
      }
    }

    if (this.isValidAuthenticatedResponse(response, url)) {
      this.resetSessionTimeoutTimer();
    }
  }

  private isValidAuthenticatedResponse(response: any, url: string): boolean {
    if (url && url.indexOf('user/userAuthenticate') >= 0) {
      return false;
    }

    if (url && url.toLowerCase().includes('/platform-feedback')) {
      return false;
    }

    return sessionStorage.getItem('authenticationToken') ? true : false;
  }

  private resetSessionTimeoutTimer(): void {
    this.clearSessionTimeoutTimer();
    this.startSessionTimeoutTimer();
  }

  private clearSessionTimeoutTimer(): void {
    if (this.sessionTimeoutRef) {
      clearTimeout(this.sessionTimeoutRef);
      this.sessionTimeoutRef = null;
    }
  }

  private startSessionTimeoutTimer(): void {
    this.sessionTimeoutRef = setTimeout(
      () => {
        this.showSessionExpiryWarning();
      },
      27 * 60 * 1000,
    );
  }

  private showSessionExpiryWarning(): void {
    if (
      !sessionStorage.getItem('authenticationToken') ||
      !sessionStorage.getItem('isAuthenticated') ||
      this.isHandlingSessionExpiry
    ) {
      return;
    }

    this.confirmationService
      .alert(
        'Your session is about to Expire. Do you need more time ? ',
        'sessionTimeOut',
      )
      .afterClosed()
      .subscribe((result: any) => {
        if (result?.action === 'continue') {
          this.extendSession();
        } else if (result?.action === 'timeout') {
          this.clearSessionTimeoutTimer();
          sessionStorage.clear();
          this.sessionstorage.clear();
          this.confirmationService.alert(
            this.currentLanguageSet?.sessionExpired ||
              'Session has expired, please login again.',
            'error',
          );
          this.router.navigate(['/login']);
        } else if (result?.action === 'cancel') {
          setTimeout(() => {
            this.clearSessionTimeoutTimer();
            sessionStorage.clear();
            this.sessionstorage.clear();
            this.confirmationService.alert(
              this.currentLanguageSet?.sessionExpired ||
                'Session has expired, please login again.',
              'error',
            );
            this.router.navigate(['/login']);
          }, result.remainingTime * 1000);
        }
      });
  }

  private extendSession(): void {
    this.http
      .post(environment.extendSessionUrl, {})
      .pipe(
        catchError((error: any) => {
          console.error('Failed to extend session:', error);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.resetSessionTimeoutTimer();
      });
  }
}
