import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { DomSanitizer } from '@angular/platform-browser';
import { Contact, ContactField, ContactName, Contacts } from '@ionic-native/contacts';
//import * as nr from 'name-recognition'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  logo:string = '../../assets/logo/LogoFinal.png';
  contactDetails = null;
  croppedImage = null;
  contact: any = {};
  constructor(public navCtrl: NavController,
              public navParam: NavParams,
              private contacts: Contacts,
              public toastController: ToastController //, private sanitizer: DomSanitizer
              ) {
    this.contactDetails = this.navParam.get('contactDetails');
    this.croppedImage = this.contactDetails.croppedImage;
    if(this.contactDetails.names.length){
      this.contact.first = this.contactDetails.names[0].first ? this.contactDetails.names[0].first : " ";
      if(this.contactDetails.names.length>0) {
        this.contact.last = this.contactDetails.names[0].last ? this.contactDetails.names[0].last : " ";
      }
      else{
        this.contact.last = " "
      }
    }
    else {
      this.contact.first = " "
      this.contact.last = " "
    }
    this.contact.phone1 = this.contactDetails.phone1;
    this.contact.phone2 = this.contactDetails.phone2;
    this.contact.email = this.contactDetails.email;
    //this.addContact()
  }

  goBack() {
    this.navCtrl.push(HomePage);
  }

  addContact(): void {
    this.createToastMsg("Inside addContact method")
    let croppedImgB64String: string = this.croppedImage;
    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, this.contact.first, this.contact.last);
    let number = new ContactField('mobile', this.contact.phone1);
    contact.phoneNumbers = [number];
    let photo = new ContactField('photo', croppedImgB64String);
    contact.photos = [photo];
    let email = new ContactField('email', this.contact.email);
    contact.emails = [email];
    this.createToastMsg('After all fields are fetched')
    contact.save().then(
      () => {this.createToastMsg('Contact added successfully')},
      (error: any) => {this.createToastMsg('There is an error :' + error)}
    );
  }

  createToastMsg(msg) {
    const toast = this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}