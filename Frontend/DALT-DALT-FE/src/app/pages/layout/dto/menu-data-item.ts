export class ModuleDataItem {
    Code?: string;
    Name?: string;
    Link?: string;
    Actived?: boolean;
    Path?: string;
    LoadChildren?: any;
    ListMenu?: Array<MenuDataItem> //= [];
    Icon?: string
    OrderBy?: number
    ID?: number 
}


export class MenuDataItem {
    Code?: string;
    Name?: string;
    Link?: string;
    Actived?: boolean;
    Type?: string = '' //menu group hoặc function    
    Parent?: string
    ModuleID?: string
    LstChild?: Array<MenuDataItem> //= [];
    Icon?: string
    OrderBy?: number
    ID?: number 
}