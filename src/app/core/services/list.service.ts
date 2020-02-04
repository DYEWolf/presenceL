import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Student } from '../interfaces/students';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private firestore: AngularFirestore) { }

  getList() {
    return this.firestore.collection('students').snapshotChanges();
  }

  createListElement(element: any) {
    return this.firestore.collection('students').add(element);
  }

  updateListElement(element: Student, elementId: string) {
    delete element.id;
    this.firestore.doc('students/' + elementId).update(element);
  }

  deleteListElement(elementId: string): void {
    this.firestore.doc('students/' + elementId).delete();
  }
}
