export interface FamilyMembersModel {
    search: String;
}

export interface AssignMembersModel {
    id: Number;
    invited_by: Number;
    user_id: Number;
    name: String;
    email: String;
    family_id: Number;
    relation: Number;
    status: Number;
    created_at: Number;
    receiver_detail: {
        id: Number;
        name: String;
        image: String;
        slug: String;
        folder_permissions: Array<Permission>;
    };
    family_type_detail: {
        id: Number
        name: String;
        slug: String
    };
    relation_data: {
        id: Number;
        name: String;
        slug: String
    };
    permission_id: any;
    selected_user_id: any;
    is_error: Boolean;
    selectedEntry?: any;
}

export interface Permission {
    row_id: Number;
    id: Number;
    name: String;
    slug: String;
    status: Number;
}


export interface FolderPermissionModel {
    user_id: Number;
    permission_id: Number;
    folder_id: Number;
    status: Number;
    created_at: Number;
}

export interface DeletePermissionModel {
    id: Number;
}
export interface DeleteFamilyMember {
    id: Number;
}

export interface SwapFamilyMember {
    from: Number;
    to: Number;
}
