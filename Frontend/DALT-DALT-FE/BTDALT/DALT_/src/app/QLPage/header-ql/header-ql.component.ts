import { Component } from '@angular/core';
import { MENU, MenuItem } from '../mockdata-PQL/menu-item';

@Component({
  selector: 'app-header-ql',
  templateUrl: './header-ql.component.html',
  styleUrls: ['./header-ql.component.scss']
})
export class HeaderQLComponent {
  menuItems = MENU;
  selectedItem?: MenuItem;
  onselecItem(mItem: MenuItem): void {
    this.selectedItem = mItem;
  };

}
