import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular'; //HideWhen
import { OcrProvider } from '../../providers/ocr'
import { LoadingController } from 'ionic-angular'
import * as nr from 'name-recognition'
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ContactPage } from '../contact/contact'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  splash = true;
  tabBarElement: any;
  logo:string = '../../assets/logo/LogoFinal.png';
  cropperOptions: any;
  croppedImage = null;
  contactDetails:any = {};
  options: CameraOptions;

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;

  constructor(public navCtrl: NavController, 
              private camera: Camera,
              private ocrProvider: OcrProvider,
              private loadingController: LoadingController) {
    this.cropperOptions = {
      dragMode: 'crop',
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };

    this.options = {
      quality: 100,
      saveToPhotoAlbum: true,      
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.tabBarElement = document.querySelector('.tabbar');
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

  captureImage() {
    this.options.sourceType = this.camera.PictureSourceType.CAMERA
    this.camera.getPicture(this.options).then((imageData) => {
        this.myImage = 'data:image/jpeg;base64,' + imageData;
      }, (err) => { console.log(err) });
  }

  chooseFromGallery() {
    this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
    this.camera.getPicture(this.options).then((imageData) => {
        this.myImage = 'data:image/jpeg;base64,' + imageData;
      }, (err) => { console.log(err) });
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  clear() {
    this.angularCropper.cropper.clear();
  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }

  save() {
    //this.addContact();
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.recognize()
  }

  public async recognize(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner:'hide',
      content: `<div class="ocrloader"></div>`
    });

    await loading.present();

    try {
      const value = await this.ocrProvider.text(this.croppedImage, (progress) => { //this.croppedImage
        const percentage = Math.round(progress * 100)
        loading.setContent(`<div class="ocrloader">
          <em></em>
          <div>
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            <i></i><i></i><i></i>
          </div>
          <span></span>
        </div>
        <div class="percent">${percentage}%</div>`
        );
      });
      
      let namesFound;
      namesFound = nr.find(value);
      this.contactDetails.croppedImage = this.croppedImage;//this.croppedImage;
      this.contactDetails.names = namesFound;
      let phoneNumbersFound = this.validatePhone(value);
      if(phoneNumbersFound){
        if(phoneNumbersFound.length>0) {
          this.contactDetails.phone1 = phoneNumbersFound[0];
          if(phoneNumbersFound.length>1) {
            this.contactDetails.phone2 = phoneNumbersFound[1];
          } 
        } 
      }
      this.contactDetails.email = this.validateEmail(value);       
      this.navCtrl.push(ContactPage, {
        contactDetails: this.contactDetails
      })      
    } finally {
      await loading.dismiss();
    }
  }

  cropperTouchStart(event){
    event.stopPropagation();
    event.preventDefault(); //Most important
  }

  validateEmail = (email) => {
    let re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return email.match(re);
  }

  validatePhone = (phone) => {
    let re = /(?:\+ *)?\d[\d\- ]{7,}/g;
    return phone.match(re);
  }     

  homescreen() {
    this.myImage = null
  }
}