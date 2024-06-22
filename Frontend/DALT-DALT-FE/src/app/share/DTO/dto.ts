export class DTOProduct {
    product_code?:any;
    Image?: string;
    Product_Name?: string;
    Price?: number;
    Description?: string;
    Product_Type?: string;
}


export class DTOAccount {
    password?: string;
    username?: string;
    email?: string;
    phone?: number;
}

export class MenuItem {
    name?: string;
    linkQL?: string;
}
  