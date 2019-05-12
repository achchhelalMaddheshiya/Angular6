export interface FolderCreatedModel {
    name: String;
    parent_id: Number;
}

export interface FolderUpdateModel {
    name: String;
    parent_id: Number;
    id: Number;
}
export interface CreateLinkModel {
    folder_id: Number;
    meta_key?: String;
    meta_link?: String;
    attribute_types: String;
}

export interface CreatePasswordModel {
    folder_id: Number;
    meta_description: String;
    meta_key: String;
    meta_value: String;
    attribute_types: String;
}

export interface DeleteFolderDataModel {
    row_id: Number;
}

export interface AddLocationModel {
    folder_id: Number;
    meta_key: any;
    meta_value: any;
    meta_description: any;
    attribute_types: String;
    lat: any;
    lng: any;
    file: File;
}

export interface FolderPermissions {
    id: Number;
    name: String;
    slug: String;
}

export interface SearchFolder {
    search: Number;
}


export interface FolderDataModel {
    id: Number;
    name: String;
    slug: String;
    parent_id: Number;
    user_id: Number;
    creator: {
        guarantee_declaration: Number;
        primary_declaration: Number;
        id: Number;
        name: String;
        slug: String;
        status: Number;
    };
}
