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
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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
  timerRef: any;
  currentLanguageSet: any;
  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    readonly sessionstorage: SessionStorageService,
    public httpServiceService: HttpServiceService,
    private authService: AuthService,
  ) {}

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
          this.onSuccess(req.url, event.body);
          this.spinnerService.setLoading(false);
          return event.body;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.spinnerService.setLoading(false);
        if (this.isLoginRequest(req.url)) {
          return throwError(() => error.error || error);
        } else if (error.status === 401) {
          this.handleSessionExpiry(
            this.currentLanguageSet.sessionExpiredPleaseLogin ||
              'Session has expired, please login again.',
          );
        } else if (error.status === 403) {
          this.handleSessionExpiry(
            this.currentLanguageSet.accessDenied ||
              'Access Denied. You do not have permission to access this resource.',
          );
        } else if (error.status === 500) {
          this.handleSessionExpiry(
            this.currentLanguageSet.internaleServerError,
          );
        } else {
          this.handleSessionExpiry(
            error.message ||
              this.currentLanguageSet.somethingWentWrong ||
              'Something went wrong. Please try again later.',
          );
        }
        sessionStorage.clear();
        this.sessionstorage.clear();
        return throwError(() => error.error || error);
      }),
    );
  }

  private isLoginRequest(url: string): boolean {
    return url.indexOf('user/userAuthenticate') >= 0;
  }

  private onSuccess(url: string, response: any): void {
    if (this.timerRef) clearTimeout(this.timerRef);

    if (
      response.statusCode === 5002 &&
      url.indexOf('user/userAuthenticate') < 0
    ) {
      sessionStorage.clear();
      this.sessionstorage.clear();
      setTimeout(() => this.router.navigate(['/login']), 0);
      this.confirmationService.alert(response.errorMessage, 'error');
    } else if (
      response.statusCode === 5000 &&
      response.errorMessage ===
        'Unable to fetch session object from Redis server'
    ) {
      this.handleSessionExpiry(
        this.currentLanguageSet.sessionExpiredPleaseLogin ||
          'Session has expired, please login again.',
      );
    } else {
      this.startTimer();
    }
  }

  handleSessionExpiry(message: string): void {
    if (this.authService.sessionExpiredHandled) return;
    this.authService.sessionExpiredHandled = true;
    sessionStorage.clear();
    this.sessionstorage.clear();
    this.confirmationService.alert(message, 'error');
    setTimeout(() => this.router.navigate(['/login']), 0);
  }

  startTimer() {
    this.timerRef = setTimeout(
      () => {
        console.log('there', Date());

        if (
          sessionStorage.getItem('authenticationToken') &&
          sessionStorage.getItem('isAuthenticated')
        ) {
          this.confirmationService
            .alert(
              'Your session is about to Expire. Do you need more time ? ',
              'sessionTimeOut',
            )
            .afterClosed()
            .subscribe((result: any) => {
              if (result.action === 'continue') {
                this.http.post(environment.extendSessionUrl, {}).subscribe(
                  (res: any) => {},
                  (err: any) => {},
                );
              } else if (result.action === 'timeout') {
                clearTimeout(this.timerRef);
                sessionStorage.clear();
                this.sessionstorage.clear();
                this.confirmationService.alert(
                  this.currentLanguageSet.sessionExpired ||
                    'Session has expired, please login again.',
                  'error',
                );
                this.router.navigate(['/login']);
              } else if (result.action === 'cancel') {
                setTimeout(() => {
                  clearTimeout(this.timerRef);
                  sessionStorage.clear();
                  this.sessionstorage.clear();
                  this.confirmationService.alert(
                    this.currentLanguageSet.sessionExpired ||
                      'Session has expired, please login again.',
                    'error',
                  );
                  this.router.navigate(['/login']);
                }, result.remainingTime * 1000);
              }
            });
        }
      },
      27 * 60 * 1000,
    );
  }
}
