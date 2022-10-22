import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyTranscriptComponent } from './apply-transcript/apply-transcript.component';
import { LoginComponent } from './login/login.component';
import { NotAuthorisedComponent } from './not-authorised/not-authorised.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'unauthorized',
    component: NotAuthorisedComponent,
  },
  {
    path:'dashboard/:id',
    component:UserDashboardComponent,
  },
  {
    path: 'transcriptRegistration',
    component: ApplyTranscriptComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
