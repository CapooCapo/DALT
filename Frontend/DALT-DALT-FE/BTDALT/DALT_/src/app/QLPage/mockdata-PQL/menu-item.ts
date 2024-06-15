export class MenuItem {
    name?: string;
}

export const MENU:MenuItem[]= [
    {name: 'sản phẩm'},
    {name: 'khách hàng'},
    {name: 'khuyến mãi'},
];

export class product {
    imgProduct?: any;
    name?: string;
    price?: number;
    describe?: string;
}

export const PRODUCTS:product[]= [
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },
    {
        imgProduct: '../../../../assets/product.jpg',
        name: 'Sản phẩm',
        price: 20,
        describe:'Mô tả'
    },


    
]
export interface DTOuser {
    password: string;
    username: string;
}