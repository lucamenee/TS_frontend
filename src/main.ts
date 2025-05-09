import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { UserHttpService } from './app/user-http.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), 
    provideRouter(routes),
    {provide: UserHttpService, useClass: UserHttpService}
  ]
})
  .catch((err) => console.error(err));
