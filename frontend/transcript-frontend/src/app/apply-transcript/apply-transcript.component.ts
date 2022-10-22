import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatTabGroup } from '@angular/material/tabs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloadAllModules, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AllServiceService } from '../services/all-service.service';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
class PdfFile {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-apply-transcript',
  templateUrl: './apply-transcript.component.html',
  styleUrls: ['./apply-transcript.component.css']
})
export class ApplyTranscriptComponent implements OnInit {
  name!:string;
  phoneNo!:string;
  cgpa!:string;
  yearOfAdmission!: string;
  email!:string;
  rollno!:number;
  branch!:string;
  isValidCGPA: boolean = false;
  isValidCopies: boolean = true;
  copies:number = 1;
 
  semNotUploaded1: boolean = true;
  semSource1: any;
  semPdf1: PdfFile | undefined;
  semFileName1: string = '';
  semFile1!: File;

  semNotUploaded2: boolean = true;
  semSource2: any;
  semPdf2: PdfFile | undefined;
  semFileName2: string = '';
  semFile2!: File;

  semNotUploaded3: boolean = true;
  semSource3: any;
  semPdf3: PdfFile | undefined;
  semFileName3: string = '';
  semFile3!: File;

  semNotUploaded4: boolean = true;
  semSource4: any;
  semPdf4: PdfFile | undefined;
  semFileName4: string = '';
  semFile4!: File;

  semNotUploaded5: boolean = true;
  semSource5: any;
  semPdf5: PdfFile | undefined;
  semFileName5: string = '';
  semFile5!: File;

  semNotUploaded6: boolean = true;
  semSource6: any;
  semPdf6: PdfFile | undefined;
  semFileName6: string = '';
  semFile6!: File;

  semNotUploaded7: boolean = true;
  semSource7: any;
  semPdf7: PdfFile | undefined;
  semFileName7: string = '';
  semFile7!: File;

  semNotUploaded8: boolean = true;
  semSource8: any;
  semPdf8: PdfFile | undefined;
  semFileName8: string = '';
  semFile8!: File;

  
  photo: ImageSnippet | undefined;
  photoSource: any;
  profilePic!: File;

  isLogIn: string | null = '';
  isLoggedIn: boolean = false;
  constructor(
    private location: Location,
    private route: Router,
    private snackBar: MatSnackBar,
    private allService: AllServiceService
  ) {}

  async ngOnInit() {
    this.isLogIn = localStorage.getItem('TranscriptLoggedIn')
      ? localStorage.getItem('TranscriptLoggedIn')
      : null;
    console.log(localStorage.getItem('TranscriptName')!);
    this.name = localStorage.getItem('TranscriptName')!;
    this.phoneNo = localStorage.getItem('TranscriptPhone')!;
    this.yearOfAdmission = localStorage.getItem('TranscriptJoin')!;
    this.rollno = Number(localStorage.getItem('TranscriptUsername')!);
    this.name = localStorage.getItem('TranscriptName')!;
    this.email = localStorage.getItem('TranscriptEmail')!;
    this.branch = localStorage.getItem('TranscriptBranch')!;
    console.log(this.isLogIn)
    if(!this.isLogIn || this.isLogIn == 'false' || this.isLogIn == null){
      this.route.navigate(['login']);
    }
  }
  processFile(imageInput: any) {
    this.profilePic = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.photo = new ImageSnippet(event.target.result, this.profilePic);
      this.photoSource = reader.result;
    });
    reader.readAsDataURL(this.profilePic);
  }
  
  applyTranscriptForm() {
    let docs:File[] = [];
    let documentNames:string[] = [];
    let docsName:string="";
    let profilePhoto: File = this.profilePic;
    if(!this.semNotUploaded1){
      docs.push(this.semFile1);
      docsName+="Semester 1,";
    }
    if(!this.semNotUploaded2){
      docs.push(this.semFile2);
      docsName+="Semester 2,";
    }
    if(!this.semNotUploaded3){
      docs.push(this.semFile3);
      docsName+="Semester 3,";
    }
    if(!this.semNotUploaded4){
      docs.push(this.semFile4);
      docsName+="Semester 4,";
    }
    if(!this.semNotUploaded5){
      docs.push(this.semFile5);
      docsName+="Semester 5,";
    }
    if(!this.semNotUploaded6){
      docs.push(this.semFile6);
      docsName+="Semester 6,";
    }
    if(!this.semNotUploaded8){
      docs.push(this.semFile7);
      docsName+="Semester 7,";
    }
    if(!this.semNotUploaded8){
      docs.push(this.semFile8);
      docsName+="Semester 8,";
    }
    docs.push(profilePhoto);
    docsName+="profilePhoto";
    documentNames.push(docsName);
    documentNames.push('');
    this.allService.applyForTranscript(docs,documentNames,"This is comment",this.copies,this.cgpa).subscribe((res:any)=>{
      console.log(res);
      if(res.status==200){
        this.showSnackBar('Application Submitted Successfully');
        this.route.navigate(['/dashboard',this.rollno]);
      }
    },(err:any)=>{
      console.log(err);
    });
  }
  cancelCDCForm() {
    this.route.navigate(['/']);
  }
  cancelApplication() {
    this.location.back();
  }
  uploadDocuments():boolean{
    return true;
  }
  checkFormEntries() {
    if(!this.isValidCGPA){
      this.showSnackBar('Invalid CGPA');
      return false;
    }
    if(!this.isValidCopies){
      this.showSnackBar('Invalid Copies');
      return false;
    }
    if(this.photoSource == null || this.photoSource == '')
    {
      this.showSnackBar('Please upload a passport size photo');
      return false;
    }
    return true;
  }
  submitPersonalDetailsForm(tabGroup: MatTabGroup) {
    if(this.checkFormEntries()){
      tabGroup.selectedIndex = 1;
    }
  }

  onCGPAChanged() {
    if (Number(this.cgpa) > 0 && Number(this.cgpa) <= 10) {
      this.isValidCGPA = true;
    } else {
      this.isValidCGPA = false;
    }
  }
  onCopiesChanged(){
    if(Number(this.copies)<0 || this.copies==null){
      this.isValidCopies = false;
    }
    else if(Number(this.copies)>10){
      this.isValidCopies = false;
    }
    else{
      this.isValidCopies = true;
    }

  }
  cancelTranscriptForm(tabGroup:MatTabGroup){
    tabGroup.selectedIndex = 0;
  }
  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: ['red-snackbar'],
    });
  }



  //Process All Files
  processSemFile1(semInput: any) {
    this.semFile1 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf1 = new PdfFile(event.target.result, this.semFile1);
      this.semSource1 = reader.result;
    });
    if (this.semFile1) {
      reader.readAsDataURL(this.semFile1);
      this.semNotUploaded1 = false;
      this.semFileName1 = this.semFile1.name;
    } else {
      this.semNotUploaded1 = true;
      this.semFileName1 = '';
    }
  }

  processSemFile2(semInput: any) {
    this.semFile2 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf2 = new PdfFile(event.target.result, this.semFile2);
      this.semSource2 = reader.result;
    });
    if (this.semFile2) {
      reader.readAsDataURL(this.semFile2);
      this.semNotUploaded2 = false;
      this.semFileName2 = this.semFile2.name;
    } else {
      this.semNotUploaded2 = true;
      this.semFileName2 = '';
    }
  }

  processSemFile3(semInput: any) {
    this.semFile3 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf3 = new PdfFile(event.target.result, this.semFile3);
      this.semSource3 = reader.result;
    });
    if (this.semFile3) {
      reader.readAsDataURL(this.semFile3);
      this.semNotUploaded3 = false;
      this.semFileName3 = this.semFile3.name;
    } else {
      this.semNotUploaded3 = true;
      this.semFileName3 = '';
    }
  }

  processSemFile4(semInput: any) {
    this.semFile4 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf4 = new PdfFile(event.target.result, this.semFile4);
      this.semSource4 = reader.result;
    });
    if (this.semFile4) {
      reader.readAsDataURL(this.semFile4);
      this.semNotUploaded4 = false;
      this.semFileName4 = this.semFile4.name;
    } else {
      this.semNotUploaded4 = true;
      this.semFileName4 = '';
    }
  }

  processSemFile5(semInput: any) {
    this.semFile5 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf5 = new PdfFile(event.target.result, this.semFile5);
      this.semSource5 = reader.result;
    });
    if (this.semFile5) {
      reader.readAsDataURL(this.semFile5);
      this.semNotUploaded5 = false;
      this.semFileName5 = this.semFile5.name;
    } else {
      this.semNotUploaded5 = true;
      this.semFileName5 = '';
    }
  }

  processSemFile6(semInput: any) {
    this.semFile6 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf6 = new PdfFile(event.target.result, this.semFile6);
      this.semSource6 = reader.result;
    });
    if (this.semFile6) {
      reader.readAsDataURL(this.semFile6);
      this.semNotUploaded6 = false;
      this.semFileName6 = this.semFile6.name;
    } else {
      this.semNotUploaded6 = true;
      this.semFileName6 = '';
    }
  }

  processSemFile7(semInput: any) {
    this.semFile7 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf7 = new PdfFile(event.target.result, this.semFile7);
      this.semSource7 = reader.result;
    });
    if (this.semFile7) {
      reader.readAsDataURL(this.semFile7);
      this.semNotUploaded7 = false;
      this.semFileName7 = this.semFile7.name;
    } else {
      this.semNotUploaded7 = true;
      this.semFileName7 = '';
    }
  }

  processSemFile8(semInput: any) {
    this.semFile8 = semInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.semPdf8 = new PdfFile(event.target.result, this.semFile8);
      this.semSource8 = reader.result;
    });
    if (this.semFile8) {
      reader.readAsDataURL(this.semFile8);
      this.semNotUploaded8 = false;
      this.semFileName8 = this.semFile8.name;
    } else {
      this.semNotUploaded8 = true;
      this.semFileName8 = '';
    }
  }


}
