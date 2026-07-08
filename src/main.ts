import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, gitNetworkOutline, statsChartOutline, bookOutline, logOutOutline,
  personCircleOutline, cloudUploadOutline, close, closeCircle, chevronForward, chevronBack,
  arrowForward, arrowBack, playCircleOutline, downloadOutline, eyeOutline, mailOutline,
  shieldCheckmarkOutline, peopleOutline, documentTextOutline, menuOutline, checkmarkCircle,
  ribbonOutline, alertCircleOutline, filterOutline,
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  'home-outline': homeOutline,
  'git-network-outline': gitNetworkOutline,
  'stats-chart-outline': statsChartOutline,
  'book-outline': bookOutline,
  'log-out-outline': logOutOutline,
  'person-circle-outline': personCircleOutline,
  'cloud-upload-outline': cloudUploadOutline,
  'close': close,
  'close-circle': closeCircle,
  'chevron-forward': chevronForward,
  'chevron-back': chevronBack,
  'arrow-forward': arrowForward,
  'arrow-back': arrowBack,
  'play-circle-outline': playCircleOutline,
  'download-outline': downloadOutline,
  'eye-outline': eyeOutline,
  'mail-outline': mailOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'people-outline': peopleOutline,
  'document-text-outline': documentTextOutline,
  'menu-outline': menuOutline,
  'checkmark-circle': checkmarkCircle,
  'ribbon-outline': ribbonOutline,
  'alert-circle-outline': alertCircleOutline,
  'filter-outline': filterOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
