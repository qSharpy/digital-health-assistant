import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { hmrBootstrap } from './hmr';

if (environment.production) {
  enableProdMode();
}

console.log(`Running on ${window.location.hostname}`);
if (environment.firebase.functionsEmulator && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  Object.keys(environment.firebase).filter(x => x.startsWith('fct_')).forEach(k => {
    environment.firebase[k] = environment.firebase[k].replace('https://us-central1-digital-health-assistant.cloudfunctions.net/',
     'http://localhost:5000/digital-health-assistant/us-central1/');
  });
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (!environment.production) {
  // tslint:disable-next-line: no-string-literal
  if (module[ 'hot' ]) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap().catch(err => console.log(err));
}
