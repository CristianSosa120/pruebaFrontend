import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from "./../../services/upload.service";

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.scss']
})
export class FormComponentComponent implements OnInit {

  uploadForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string;
  isSeparator = false;
  separator = '';
  headers = [];
  isHeaders = false;
  error = false;
  fileFields = {};
  success = false;
  file;
  readFields = [];
  isFile = false;
  fileName;
  options = [];

  constructor(private formBuilder: FormBuilder, private _uploadService: UploadService, private cd:ChangeDetectorRef) { }

  ngOnInit() {
    this.readFields = [
      {
        "field": "firstName",
        "value": "Nombres"
      },
      {
        "field": "lastName",
        "value": "Apellidos"
      },
      {
        "field": "phones",
        "value": "Teléfonos"
      },
      {
        "field": "address",
        "value": "Direcciones"
      }
    ];

    this.uploadForm = this.formBuilder.group({
      separator: ['', [Validators.required]],
      uploadFile: ['', [Validators.required]],
      selectFields: ['']
    });
  }

  changeSeparator(event) {
    this.separator = event.target.value;
    this.separator != '' ? 
    this.isSeparator = true : ( 
      this.isSeparator = false, 
      this.headers = [],
      this.readFields = [],
      event.target.value = '',
      this.isFile = false,
      this.error = false,
      this.uploadForm.reset()
    );
  }

  changeFile(event) {
    this.isHeaders = false;
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.isFile = true;

    let reader = new FileReader();
    reader.readAsText(this.file, 'UTF-8');
    reader.onload = (e) => {
      let dataResult = reader.result;
      let firstLine = (<string>dataResult).split('\n').shift();
      this.headers = [...firstLine.split(this.separator)];
      
      this.options = this.headers.map((value, index) => {
        return {
          label: value,
          position: index
        }
      });

      this.headers.length > 1 ? (
        this.isHeaders = true,
        this.error = false
      ) : (
        this.isHeaders = false,
        this.error = true,
        this.success = false
      );
    }
    
  }

  changeSelect(event, field) {
    let value = event['position'];
    this.fileFields[field] = value;
  } 

  get controls(){
    return this.uploadForm.controls;
  }

  onSubmit(){
    this.submitted = true;

    if(this.uploadForm.invalid){
      return;
    } 

    this.loading = true;

    let formData = new FormData();
    formData.append('file', this.file);
    formData.append('separator', this.separator);
    formData.append('fileFields',JSON.stringify(this.fileFields));

    this._uploadService.uploadData(formData).subscribe(
      data => {
        if(data['success']){
          this.loading = false;
          this.success = true;    
          this.isFile = false;
          this.options = [];
          this.uploadForm.reset();
          this.submitted = false;
        } else {
          this.success = false;
        }
      }
    );

  }

}
