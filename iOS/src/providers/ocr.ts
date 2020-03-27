import { Injectable } from '@angular/core';
import Tesseract from 'tesseract.js';
//import { Platform } from 'ionic-angular';
//import { Cordova } from '@ionic-native/core';

export type ProgressFn = (progress: number) => void;

//declare let cordova: any;

@Injectable()
export class OcrProvider {

  protected readonly tesseract;

  constructor() { //private platform: Platform
    // The Tesseract path is very sensitive to environments.
    //const path = this.path();
    this.tesseract = Tesseract.create();
  }

  /**
   * Analyze image.
   */
  public text(image: any, progressCallback: ProgressFn): Promise<string> {
    // Wrap the Tesseract process inside a native Promise,

    // as the PromiseLike returned by Tesseract caused problems.
    return new Promise<string>((resolve, reject) => {
      const tesseractConfig = {
        lang: 'eng'
      }
      
      this.tesseract.recognize(image, tesseractConfig)
        .progress((status) => {
          if (progressCallback != null) {
            const progress = status.status == 'recognizing text'
              ? status.progress
              : 0

            progressCallback(progress)
          }
        })
        .catch((err) => {
          alert('inside catch' + err)
          console.error('OcrProvider.text: Failed to analyze text.', err)
          reject(err)
        })
        .then(
          (result) => resolve(result.text),
          (err) => {alert('inside then err' + err)}
        ).finally(resultOrError => {
          console.log(`\r\n FINALLY =>`, resultOrError, `\r\n`);
        });
    });
  }

  /*private path(): string {
    if (this.platform.is('cordova')) {
      const href = window.location.href;

      const index1 = href.indexOf('#');

      const index2 = href.substr(0, index1).lastIndexOf('/');

      // This path works on iOS/Android native.
      //alert(href.substr(0, index2 + 1))
      return href.substr(0, index2 + 1);
    }

    // This path works in browser.
    return window.location.protocol + '//' + window.location.hostname
      + (window.location.port ? ':' + window.location.port : '')
      + '/';

    // This path works in simulator.
    
  }*/
}
