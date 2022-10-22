import {
  ApplicationInitStatus,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllServiceService } from '../services/all-service.service';
export interface uploadedDocs{
  name:string,
  link:string
}
export interface Applications {
  dateApplied:string;
  documentsUploaded: uploadedDocs[];
  tpcStatus: string;
  tpoStatus: string;
  issued:string;
  paid:string;
  _id:string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  dataSource: Applications[] = [];
  isLoadingResults = false; // true
  types = ['In Progress', 'Approved'];
  filterData: any;

  constructor(
    private ref: ChangeDetectorRef,
    public dialog: MatDialog, // private userService: UserService
    private allService: AllServiceService,
  ) {}
  async ngOnInit(): Promise<void> {
    (await this.allService.getUserApplications('8917')).subscribe((response) => {
      this.setDataSource(response);
      this.isLoadingResults = true;
    },(err)=>{});
  }

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  displayedColumns: string[] = [
    "dateApplied",
    "documentsUploaded",
    "tpcStatus",
    "tpoStatus",
    "issued",
    "paid",
  ];

  async setDataSource(dataReceived: any) {
    for(let dataReceive of dataReceived){
      let toShow:Applications={
        "_id":dataReceive._id,
        "dateApplied":dataReceive.dateOfApplication,
        "documentsUploaded":this.getDocuments(dataReceive.requiredDocments),
        "tpcStatus":dataReceive.tpcStatus,
        "tpoStatus":dataReceive.tpoStatus,
        "issued":dataReceive.issued,
        "paid":(dataReceive.feeProof==undefined && dataReceive.tpcStatus=="Approved" && dataReceive.tpoStatus)?"PAY NOW":"PAID",
      }
      this.dataSource.push(toShow);
    }
  }
  getDocuments(data: any):uploadedDocs[] {
    let docs:uploadedDocs[] = [];
    Object.keys(data).forEach(key => {
      docs.push({
        name: key,
        link: data[key]
      });
    });
    return docs;
  }

  onDocumentViewClick(event: any) {
    window.open(event, '_blank');
    return false;
  }

  payOnline(id:string){
    console.log(id);
  }
  payOffline(id:string){

  }
}
