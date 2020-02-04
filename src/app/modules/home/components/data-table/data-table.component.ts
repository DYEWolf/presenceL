import { Component, OnInit } from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

import { Student } from '../../../../core/interfaces/students';


import { ListService } from '../../../../core/services/list.service';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  students: Student[];

  id: string;

  speech = false;
  occupational = false;
  behavioral = false;

  studentForm = new FormGroup({
    name: new FormControl(''),
    lastName: new FormControl(''),
  });

  page = 1;
  pageSize = 5;
  collectionSize: number;
  splicedData: any;
  pageItem = 5;

  constructor(private listService: ListService, private modalService: NgbModal) {
    this.listService.getList().subscribe(data => {
      this.splicedData = data.map(e => {
        // tslint:disable-next-line:no-shadowed-variable
        const data = e.payload.doc.data() as Student;
        const id = e.payload.doc.id;
        data.id = id;
        return {...data};
      });
      this.collectionSize = this.splicedData.length;
    });
   }

  ngOnInit() {
    
  }

  get items() {
    return this.splicedData.map((item) => ({...item}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openModal(content, data: any) {
    this.id = data.id;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
     
    });
  }

  delete() {
    this.listService.deleteListElement(this.id);
    this.modalService.dismissAll();
  }

  openEditModal(content, data: any) {
    this.speech = false;
    this.occupational = false;
    this.behavioral = false;
    this.id = data.id;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
     
    });
    this.studentForm.setValue({
      name: data.name,
      lastName: data.lastName
    });
    for(let i = 0; i<3; i++) {
      if(data.therapies[i] === 'speech') this.speech = true;
      if(data.therapies[i] === 'occupational') this.occupational = true;
      if(data.therapies[i] === 'behavioral') this.behavioral = true;
    }
  }

  saveEdit() {
    let therapiesArray = [];
    if(this.speech === true) therapiesArray.push('speech');
    if(this.occupational === true) therapiesArray.push('occupational');
    if(this.behavioral === true) therapiesArray.push('behavioral');
    const student = {
      name: this.studentForm.get('name').value,
      lastName: this.studentForm.get('lastName').value,
      therapies: therapiesArray,
      id: this.id
    }
    this.listService.updateListElement(student, student.id);
    this.modalService.dismissAll();
  }

  onPageChange(page: number): void {
    switch (page) {
      case 1:
        this.pageItem = 10;
        break;
      case 2:
        this.pageItem = 20;
        break;
      case 3:
        this.pageItem = 30;
        break;
    }

  }

}
