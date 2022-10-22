import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AllServiceService } from 'src/app/services/all-service.service';
import { UserViewDocumentComponent } from '../user-view-document/user-view-document.component';

export interface Applications {
  name: string;
  requiredDocuments: Object;
  userid: number;
  email: string;
  tpcStatus: string;
  tpoStatus: string;
}

const ELEMENT_DATA: Applications[] = [
  {
    userid: 8863,
    name: "Vanessa D'mello",
    email: 'crce.8863.ce@gmail.com',
    tpcStatus: 'Approved',
    tpoStatus: 'In Progress',
    requiredDocuments: {
      'Semester 1': 'Document',
      'Semester 2': 'Document2',
      'Semester 3': 'Document3',
      'Semester 4': 'Document4',
      'Semester 5': 'Document5',
      'Semester 6': 'Document6',
      'Semester 7': 'Document7',
      'Semester 8': 'Document8',
    },
  },
  {
    userid: 8865,
    name: 'Irfan',
    email: 'crce.8865.ce@gmail.com',
    tpcStatus: 'Approved',
    tpoStatus: 'Approved',
    requiredDocuments: { name: 'Document', sem2: 'Document2' },
  },
  {
    userid: 8900,
    name: 'Irfan',
    email: 'crce.8865.ce@gmail.com',
    tpcStatus: 'In Progress',
    tpoStatus: 'In Progress',
    requiredDocuments: { name: 'Document', sem2: 'Document2' },
  },
];

@Component({
  selector: 'app-admin-tpo',
  templateUrl: './admin-tpo.component.html',
  styleUrls: ['./admin-tpo.component.css'],
})
export class AdminTpoComponent implements OnInit {
  data = ELEMENT_DATA;
  dataSource: any;
  isLoadingResults = false;
  isLoggedIn = false; // true
  types = ['In Progress', 'Approved'];
  filterData: any;

  constructor(
    private ref: ChangeDetectorRef,
    private route: Router,
    private allservice: AllServiceService,
    public dialog: MatDialog // private userService: UserService
  ) {}
  ngOnInit(): void {
    if (this.allservice.isLoggedIn) {
      this.isLoggedIn = true;
    } else {
      this.route.navigate(['/']);
    }

    if (localStorage.getItem('TrasncriptPass') !== 'tpo') {
      this.route.navigate(['/unauthorized']);
    }

    this.getAllOrganizersforAdmin();
    this.data = this.data.filter((applicant) => {
      return applicant.tpcStatus === 'Approved';
    });
    this.dataSource = new MatTableDataSource(this.data);
  }

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'userid',
    'name',
    'email',
    'requiredDocuments',
    'tpcStatus',
    'tpoStatus',
  ];

  applyStatusFilter(event: any) {
    if (event.value == undefined) {
      console.log('called');
      this.dataSource = new MatTableDataSource(this.data);
      // this.dataSource = ELEMENT_DATA;
      this.ref.detectChanges();
      return;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (event.value) {
      this.filterData = this.data.filter((application) => {
        return application.tpoStatus === event.value;
      });
      this.dataSource = new MatTableDataSource(this.filterData);
    }
  }

  onDocumentViewClick(event: any) {
    window.open(event, '_blank');
    return false;
  }

  openDialog(data: Applications): void {
    const dialogRef = this.dialog.open(UserViewDocumentComponent, {
      width: '800px',
      height: '550px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result: Applications) => {
      // this.userService.verifyOrganizer(result._id).subscribe(
      //   (res) => {
      //     console.log(res);
      //     this.isLoadingResults = true;
      //     this.getAllOrganizersforAdmin();
      //   },
      //   (err: Error) => {
      //     console.log(err);
      //   }
      // );
      console.log('TPO Change');
      console.log(result);
    });
  }

  getAllOrganizersforAdmin() {
    // this.userService.getAllOrganizers().subscribe(
    //   (res: any) => {
    //     console.log(res.body);
    //     const returnValue = res.body ? res.body : '';
    //     this.data = JSON.parse(JSON.stringify(returnValue));
    //     this.dataSource = new MatTableDataSource(this.data);
    //     this.isLoadingResults = false;
    //   },
    //   (err: Error) => {
    //     console.log(err);
    //   }
    // );
  }
}
