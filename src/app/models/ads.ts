export interface AdsCreateModel {
    slug: String;
}

export interface AdsModel {
    id: Number;
    category_id: Number;
    link: String;
    file: String;
    category: {
        id: 1,
        name: String,
        width: Number;
        height: Number;
    };
}


export interface AdStatModel {
    id: String;
}
