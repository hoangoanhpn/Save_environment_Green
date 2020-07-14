import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownModule } from 'primeng/dropdown';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';

import { TableComponent }           from '../../pages/table/table.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { UserComponent }            from '../../pages/create/user.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from '../../pages/about/about.component';
import { EditComponent } from 'app/pages/edit/edit.component';
import { DialogComponent } from 'app/pages/dialog/dialog.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DropdownModule,

  ],
  entryComponents: [DialogComponent],
  declarations: [
    DashboardComponent,
    TableComponent,
    EditComponent,
    IconsComponent,
    UserComponent,
    DialogComponent,
    AboutComponent
  ]
})

export class AdminLayoutModule {}
