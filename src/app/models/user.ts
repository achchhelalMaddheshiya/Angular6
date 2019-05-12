import { DateInput } from 'ngx-bootstrap/chronos/test/chain';

export class User {
  name?: String;
  email?: String;
  password?: String;
  confirm_password?: String;
  remember_me?: Boolean;
  old_password?: String;
  forgot_password_token?: String;
  user_unverified?: Boolean;
  image?: String;
  status?: Number;
  notification_count?: Number;
}

export interface FamilyModel {
  name: String;
  email: String;
  dob: DateInput;
  relation: (String | Number);
  location: String;
  lat: Number;
  lng: Number;
  family_id: Number;
}

export interface FamilyRelationShipsModel {
  id: Number;
  name: String;
}
export interface FamilyTypesModel {
  id: Number;
  name: String;
}
export interface PaymentModel {
  token: String;
  package_id: String;
}

export interface ChangePasswordModel {
  old_password: String;
  password: String;
  confirm_password: String;
}

export interface FolderDataModel {
  id: Number;
  name: String;
  slug: String;
}


export interface UnsubscribeModel {
  id: Number;
}

export interface UserPackageModel {
  id: Number;
  package_id: Number;
  user_id: Number;
  type: Number;
  status: Number;
  current_period_start: Number;
  current_period_end: Number;
  canceled_at: Number;
  cancel_at_period_end: Number;
  details: {
    id: Number;
    name: String,
    slug: String,
    audio_limit: Number;
    video_limit: Number;
    document_limit: Number;
    image_limit: Number;
    members_count_limit: Number;
    amount: Number;
    subscription_days: Number;
    status: Number;
  };
}

export interface ChangeEmailModel {
  email: String;
}
