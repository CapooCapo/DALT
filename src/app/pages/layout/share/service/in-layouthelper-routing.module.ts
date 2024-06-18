import { Injectable} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class InLayoutRoutingService {
  constructor(public router : Router, public route : ActivatedRoute) {}
}
