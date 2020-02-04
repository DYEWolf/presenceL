import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { AuthService } from 'src/app/core/services/auth.service';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import { ListService } from '../../../core/services/list.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  closeResult: string;

  speech = false;
  occupational = false;
  behavioral = false;

  studentForm = new FormGroup({
    name: new FormControl(''),
    lastName: new FormControl(''),
  });

  constructor(private authService: AuthService, private modalService: NgbModal, private listService: ListService) { }

  ngOnInit() {}

  logOut() {
    this.authService.logout();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.studentForm.setValue({
        name: '',
        lastName: ''
      });
      this.speech = false;
      this.occupational = false;
      this.behavioral = false;
    });
  }

  save() {
    let therapiesArray = [];
    if(this.speech === true) therapiesArray.push('speech');
    if(this.occupational === true) therapiesArray.push('occupational');
    if(this.behavioral === true) therapiesArray.push('behavioral');
    const student = {
      name: this.studentForm.get('name').value,
      lastName: this.studentForm.get('lastName').value,
      therapies: therapiesArray
    }
    this.listService.createListElement(student);
    this.studentForm.reset();
    this.modalService.dismissAll();
  }


}
