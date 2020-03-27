import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { Contacts } from '@ionic-native/contacts';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { OcrProvider } from '../providers/ocr';
import { Camera } from '@ionic-native/camera';
import { AngularCropperjsModule } from 'angular-cropperjs';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularCropperjsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OcrProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    Contacts
  ]
})
export class AppModule {}
