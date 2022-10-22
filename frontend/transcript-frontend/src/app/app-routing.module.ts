import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTpoComponent } from './admin/admin-tpo/admin-tpo.component';
import { ApplyTranscriptComponent } from './apply-transcript/apply-transcript.component';
import { LoginComponent } from './login/login.component';
import { NotAuthorisedComponent } from './not-authorised/not-authorised.component';

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
    path: 'transcriptRegistration',
    component: ApplyTranscriptComponent,
  },
  {
    path: 'admin-tpo',
    component: AdminTpoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
