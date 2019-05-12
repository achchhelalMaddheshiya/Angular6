import { DateInput } from 'ngx-bootstrap/chronos/test/chain';
export interface NomineeModel {
    id: Number;
    invited_by: Number;
    user_id: Number;
    family_id: Number;
    status: Number;
    name: String;
    email: String;
    dob: Number;
    family_type_detail: {
        id: Number;
        slug: String;
        name: String;
        status: Number;
    };
    sender_detail: {
        id: Number;
        slug: String;
        name: String;
        status: Number;
        temp_guarantee_declaration: Number;
        temp_primary_declaration: Number;
    };
    receiver_detail: {
        id: Number;
        slug: String;
        name: String;
        status: Number;
    };
}

export interface PinModel {
    row_id: Number;
    invited_by: Number;
    code: String;
    terms: Boolean;
}


export interface ForgotPinModel {
    row_id: Number;
    name: String;
    email: String;
    dob: DateInput;
}
