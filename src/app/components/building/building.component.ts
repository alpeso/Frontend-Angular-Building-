import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import PNotify from 'pnotify/dist/es/PNotify';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { BuildingModel } from '../../models/Building';
import { BuildingService } from '../../services/building.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css'],
  providers: [BuildingService]
})
export class BuildingComponent implements OnDestroy, OnInit {
  @ViewChild('name') name: ElementRef;
  modal: NgbModalRef;
  edit: boolean = false;

  buildingModel: BuildingModel = {
    id: 0,
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    phone: '',
    birth_date: null
}
  dtOptions: DataTables.Settings = {};
  public user;
  buildings: any = [];
  dtTrigger: any = new Subject();

  constructor(
    private buildingService: BuildingService,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.spinner();
    this.DataTablesSettings();
    this.getSubjects();
  }
  spinner(): void {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);
  }
  
  resetForm() {   
    this.buildingModel  = {
      id: 0,
      first_name: '',
      last_name: '',
      address: '',
      email: '',
      phone: '',
      birth_date: null
  }
  }

  alertSuccess(message: string){
    PNotify.success({
      title: 'Success Notice',
      text:  message,
      icon: 'brighttheme-icon-success',
      type: 'success',
      delay: 4000
    });
  }

  alertError(message: string){
    PNotify.error({
      title: 'Error notice',
      text: message,
      icon: 'icofont icofont-info-circle',
      delay: 4000
    });
  }

  onSubmit(form) {
    this.spinnerService.show();
    delete this.buildingModel.id;
    this.buildingService.saveBuildin(this.buildingModel)
    .subscribe(
      res => {
        if(res.success) {
          this.ngOnDestroy();
          this.DataTablesSettings();
          this.getSubjects();
          form.reset();
          this.cerrar();
          this.spinnerService.hide();
          this.alertSuccess(res.message);
        } else {
          if( res.code == 401) {
              this.spinnerService.hide();
              res.message.forEach( childObj => {
                this.alertError(childObj);
               });
          } else {
              this.spinnerService.hide();
              this.alertError(res.message);
          }
       
        }

      },
      err => {
        this.spinnerService.hide();
        this.alertError(err.message);
      }

    );
  }
  update(form) {
    this.spinnerService.show();
    this.buildingService.update(this.buildingModel.id, this.buildingModel).subscribe(
      res => {
        if(res['success']) {
          this.ngOnDestroy();
          this.DataTablesSettings();
          this.getSubjects();
          form.reset();
          this.cerrar();
          this.alertSuccess(res['message']);
        } else {
          if( res['code'] == 401) {
            this.spinnerService.hide();
            res['message'].forEach( childObj => {
              this.alertError(childObj);
             });
        } else {
            this.spinnerService.hide();
            this.alertError(res['message']);
        }
        }
        this.spinnerService.hide();
      },
      err => {
        this.spinnerService.hide();
        this.alertError(err.message);
      }

    );
  }

  LoadModalEdit(content, id) {
    if( id ) {
      this.buildingService.getSubject(id).subscribe(
        res => { 
          if(res['success']) {
            this.open(content);
            this.buildingModel = res['data'];
            this.edit = true;
          } else {
            this.alertError(res['message']);
          }
        },
        err => {
          this.spinnerService.hide();
          this.alertError(err.message);
        }
      );
     }
  }

  delete(id){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, elimínalo!'
    }).then((result) => {
      if (result.value) {
        this.spinnerService.show();
        this.buildingService.delete(id).subscribe(
          res => {
            if(res['success']) {
              this.ngOnDestroy();
              this.DataTablesSettings();
              this.getSubjects();
              Swal.fire(
                'Deleted!',
                res['message'],
                'success'
              );             
            } else {
              this.alertError(res['message']);
            }
            this.spinnerService.hide();
          },
          err => {
            this.spinnerService.hide();
            this.alertError(err.message);
          }
    
        );
        
      }
    })
  }
  open(content) {
    this.edit = false;
    this.resetForm();  
    this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
        // console.log('ok');
    });
  }
  cerrar() {
    this.modal.close();
  }
  DataTablesSettings() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      ordering: true
    };
  }
  getSubjects() {
    this.buildingService.getSubjects().subscribe(
      res => {
        this.buildings = res['data'];
        this.dtTrigger.next();
      },
      err => console.log(err)
    );
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
