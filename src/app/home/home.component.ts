import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { BoatModel } from '../models/boatModel';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css'
  ]
})
export class HomeComponent implements OnInit {

  isAdmin:boolean = localStorage.getItem('role').toLowerCase() === "admin";

  froalaOptions: Object = {
    height: 500,
    placeholderText: 'Enter your boat description',
    tabSpaces: 4,
    imageUpload: false
  }

  boats: BoatModel[] = [];

  viewBoat: BoatModel;
  addBoat: BoatModel;
  editBoat: BoatModel;

  constructor(
    private restService: RestService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.addBoat = new BoatModel();
    this.editBoat = new BoatModel();
  }

  ngOnInit() {
    this.getBoats();
  }

  getBoats() {
    this.restService.getBoats().subscribe((data: []) => {
      this.boats = data;
    });
  }

  deleteBoat(id: number) {
    this.boats.splice(this.boats.indexOf(this.boats.find(b => b.boatId === id)), 1);
    this.restService.deleteBoat(id).subscribe();
  }

  setViewBoat(boat: BoatModel) {
    this.viewBoat = boat;
  }

  setEditBoat(boat: BoatModel) {
    this.editBoat = JSON.parse(JSON.stringify(boat));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addNewBoat() {
    delete this.addBoat.boatId;
    this.restService.addBoat(this.addBoat)
      .pipe(first())
      .subscribe((r: any) => {
        this.boats.push(r);
        this.addBoat = new BoatModel();
      });
  }

  saveBoat() {
    this.restService.updateBoat(this.editBoat.boatId, this.editBoat)
      .pipe(first())
      .subscribe((r: any) => {
        this.boats[this.boats.indexOf(this.boats.find(b => b.boatId === this.editBoat.boatId))] = this.editBoat;
        console.log(r);
      })
  }

  cancelAdd() {
    this.addBoat = new BoatModel();
  }

  cancelEdit() {
    this.editBoat = new BoatModel();
  }

  onFileChangedAdd(event) {
    this.onFileChanged(event, this.addBoat);
  }

  onFileChangedEdit(event) {
    this.onFileChanged(event, this.editBoat);
  }

  private onFileChanged(event, boat: BoatModel) {
    let image = event.target.files[0];
    this.toBase64(image)
      .then(
        (data: string) => {
          console.log(boat.picture);
          boat.picture = data;
          console.log(boat.picture)
        }
      );
  }

  private toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}