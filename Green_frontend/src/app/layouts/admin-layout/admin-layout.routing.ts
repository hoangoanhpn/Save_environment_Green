import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { TableComponent } from '../../pages/table/table.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { AuthGuard } from '../../auth.guard';
import { UserComponent } from 'app/pages/create/user.component';
import { AboutComponent } from 'app/pages/about/about.component';
import { EditComponent } from 'app/pages/edit/edit.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: TableComponent,     canActivate: [AuthGuard] },
    { path: 'create',         component: UserComponent },
    { path: 'chart',          component: DashboardComponent},
    { path: 'icons',          component: IconsComponent },
    {
      path: 'viewdetail/:deviceID',
      component: EditComponent,
      canActivate: [AuthGuard]
    },
    { path: 'about',         component: AboutComponent },
];
