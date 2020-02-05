import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

import { Student } from '../../../../core/interfaces/students';

import { ListService } from '../../../../core/services/list.service';


export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})


export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

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

  sName: string;

  students: any;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

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
      this.students = JSON.parse(JSON.stringify(this.splicedData));
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

  inputEmpty(){
    if (this.sName == '') {
      this.splicedData = this.students;
    }
  }

  search() {
    this.splicedData = this.searchFor(this.sName);
  }

  searchFor(toSearch) {
    var results = [];
    toSearch = this.trimString(toSearch); // trim it
    for(var i=0; i<this.students.length; i++) {
    for(var key in this.students[i]) {
      if(this.students[i][key].indexOf(toSearch)!=-1) {
        if(!this.itemExists(results, this.students[i])) results.push(this.students[i]);
      }
    }
  }
  return results;
  }

  trimString(s) {
    var l=0, r=s.length -1;
    while(l < s.length && s[l] == ' ') l++;
    while(r > l && s[r] == ' ') r-=1;
    return s.substring(l, r+1);
  }
  
  compareObjects(o1, o2) {
    var k = '';
    for(k in o1) if(o1[k] != o2[k]) return false;
    for(k in o2) if(o1[k] != o2[k]) return false;
    return true;
  }
  
  itemExists(haystack, needle) {
    for(var i=0; i<haystack.length; i++) if(this.compareObjects(haystack[i], needle)) return true;
    return false;
  }



  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '') {
      this.splicedData = this.students;
    } else {
      this.splicedData = [...this.students].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
