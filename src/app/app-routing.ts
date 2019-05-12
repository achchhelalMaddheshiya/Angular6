/*
##############################
 ALL TYPE OF COMPONENT WILL LOAD HERE AND ROUTING WILL BULID HERE
#############################
 */
import { Routes, RouterModule, CanActivate, CanActivateChild } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { CommonService } from './services/common.service';

/* ADMIN LAYOUT COMPONENTS */
import { AdminLoginComponent } from './layouts/admin-login/admin-login.component';
import { AdminDashboardComponent } from './layouts/admin-dashboard/admin-dashboard.component';

/* ADMIN ELEMENT COMPONENTS */
import { AdminHeaderComponent } from './elements/admin-header/admin-header.component';
import { AdminFooterComponent } from './elements/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from './elements/admin-sidebar/admin-sidebar.component';


import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProfileComponent } from './views/profile/profile.component';
import { ProfileImageComponent } from './views/profile-image/profile-image.component';

import { HomeComponent } from './views/home/home.component';
import { AboutusComponent } from './views/aboutus/aboutus.component';
import { HowItWorksComponent } from './views/how-it-works/how-it-works.component';
import { ContactUsComponent } from './views/contact-us/contact-us.component';

import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { VerificationComponent } from './views/verification/verification.component';
import { NotificationsComponent } from './views/notifications/notifications.component';

import { PackagesComponent } from './views/packages/packages.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { FamilyMembersComponent } from './views/family-members/family-members.component';

import { EditFamilyMembersComponent } from './views/edit-family-members/edit-family-members.component';
import { VaultDetailComponent } from './views/vault-detail/vault-detail.component';

import { LinkComponent } from './views/link/link.component';
import { LocationComponent } from './views/location/location.component';
import { AssignMemberComponent } from './views/assign-member/assign-member.component';
import { AddLocationComponent } from './views/add-location/add-location.component';

import { PasswordComponent } from './views/password/password.component';
import { FolderDetailComponent } from './views/folder-detail/folder-detail.component';
import { AssignedFolderComponent } from './views/assigned-folder/assigned-folder.component';

import { NomineeComponent } from './views/nominee/nominee.component';
import { ForgotPinComponent } from './views/forgot-pin/forgot-pin.component';
import { DeclareUserComponent } from './views/declare-user/declare-user.component';
import { DeleteMemberListingComponent } from './views/delete-member-listing/delete-member-listing.component';
import { SwapRoleComponent } from './views/swap-role/swap-role.component';
import { VerificationEmailComponent } from './views/verification-email/verification-email.component';
import { ChangeEmailComponent } from './views/change-email/change-email.component';
import { AdsComponentComponent } from './views/ads-component/ads-component.component';

const appRoutes: Routes = [
    {
        path: '',
        component: AdminLoginComponent, // Before Login Layout
        data: { class: '' },
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full', data: { public: false, title: 'Home', class: 'header-bg' } },
            {
                path: 'login', component: LoginComponent, pathMatch: 'full', data: {
                    public: false,
                    title: 'Login',
                    header_class: 'sticky'
                }
            },
            {
                path: 'contact-us', component: ContactUsComponent, data: {
                   title: 'Contact Us', header_class: 'sticky'
                }
            },
            { path: 'about', component: AboutusComponent, data: { title: 'About us', header_class: 'sticky' } },
            {
                path: 'how-it-works', component: HowItWorksComponent, data: {
                    title: 'How it works', header_class: 'sticky'
                }
            },
            {
                path: 'forgot-password', component: ForgotPasswordComponent, data: {
                    public: false,
                    title: 'Forgot Password',
                    header_class: 'sticky'
                }
            },
            { path: 'reset-password/:token', component: ResetPasswordComponent, data: { title: 'Reset Password', header_class: 'sticky' } },
            { path: 'verification/:token', component: VerificationComponent, data: { title: 'Verification', header_class: 'sticky' } }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'dashboard', component: DashboardComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'My Personal Vault',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'assigned-folder/:user_id', component: AssignedFolderComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'Assigned Folders',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'vault-detail/:parent_id', component: VaultDetailComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'Vault Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'links/:id', component: LinkComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'Links Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'locations/:id', component: LocationComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'Location Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'passwords/:id', component: PasswordComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'Passwords Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'folder-detail/:id', component: FolderDetailComponent, pathMatch: 'full', data: {
                    isMain: true,
                    title: 'Folder Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        data: { class: '' },
        component: AdminDashboardComponent, // After Login Layout
        children: [
            {
                path: 'profile', component: ProfileComponent, pathMatch: 'full', data: {
                    title: 'My Profile', header_class: 'sticky'
                }
            },
            {
                path: 'profile/:edit', component: ProfileComponent, pathMatch: 'full', data: {
                    title: 'Edit My Profile',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'notifications', component: NotificationsComponent, pathMatch: 'full', data: {
                    title: 'My notifications', header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'packages', component: PackagesComponent, pathMatch: 'full', data: {
                    title: 'My Subscriptions', header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'change-password', component: ChangePasswordComponent, pathMatch: 'full', data: {
                    title: 'Change Password', header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'nominee', component: NomineeComponent, pathMatch: 'full', data: {
                    title: 'Nominee Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'forgot-pin/:row_id', component: ForgotPinComponent, pathMatch: 'full', data: {
                    // isMain: true,
                    title: 'Forgot-pin Detail',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'change-email', component: ChangeEmailComponent, pathMatch: 'full', data: {
                    // isMain: true,
                    title: 'Change Email',
                    header_class: 'sticky'
                }
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent, // After Login Layout
        data: { class: '' },
        children: [
            {
                path: 'verification-email/:token', component: VerificationEmailComponent, pathMatch: 'full', data: {
                    // isMain: true,
                    title: 'Verification Change Email',
                    header_class: 'sticky'
                }
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
export const ROUTES = RouterModule.forRoot(appRoutes);
/*
######################
COMPONENTS WILL LOAD HERE
#####################
*/
export const COMPONENTS = [
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    AboutusComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    VerificationComponent,
    ProfileImageComponent,
    HowItWorksComponent,
    NotificationsComponent,
    PackagesComponent,
    ChangePasswordComponent,
    FamilyMembersComponent,
    EditFamilyMembersComponent,
    ContactUsComponent,
    VaultDetailComponent,
    LinkComponent,
    LocationComponent,
    PasswordComponent,
    FolderDetailComponent,
    AddLocationComponent,
    AssignMemberComponent,
    AssignedFolderComponent,
    NomineeComponent,
    ForgotPinComponent,
    DeclareUserComponent,
    DeleteMemberListingComponent,
    SwapRoleComponent,
    VerificationEmailComponent,
    ChangeEmailComponent,
    AdsComponentComponent
];

export const PROVIDERS = [
    CommonService
];



export const DIRECTIVES = [

];





