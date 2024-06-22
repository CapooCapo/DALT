import { ModuleDataItem } from "../../dto/menu-data-item";


//@dynamic
export class In_LayOutHelper {
   
    public static GetRoutes(data: Array<ModuleDataItem>): Array<any> {
        let routes: Array<any> = [];
        
        data.forEach(item => {
            
            if (item.Path != undefined && item.Path != null) {
                routes.push({
                    path: item.Path,
                    loadChildren: item.LoadChildren
                });
            }
        });

        return routes;
    }
}