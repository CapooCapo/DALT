export class MenuItem {
    name?: string;
    linkQL?: string;
}

export const MENU:MenuItem[]= [
    {name: 'sản phẩm', linkQL: '/productQL'},
    {name: 'khách hàng',linkQL: '/customerQL'},
    {name: 'khuyến mãi',linkQL: '/promotionQL'},
];

export class DTOProduct {
    id?:any;
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

