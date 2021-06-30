import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {UploadFilesService} from "./upload-file.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  pdfIsUploaded = false;
  FilesAreUplaoded = false;
  pdfFileName: string ='';
  imageName: string ='';
  registerForm: FormGroup = this.formBuilder.group({
    x: ['', Validators.required],
    y: ['', Validators.required],
    page: ['', Validators.required]
  });
  submitted = false;

  constructor(private uploadService: UploadFilesService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              if (this.pdfIsUploaded == false) {
                this.pdfFileName = this.currentFile? this.currentFile.name:'';
                this.pdfIsUploaded = true;
              } else {
                this.imageName = this.currentFile? this.currentFile.name:'';
                this.FilesAreUplaoded = true;
              }
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });
      }

      this.selectedFiles = undefined;
    }
  }

  get f() {
    if (this.registerForm)
    return this.registerForm.controls;
    return false;
  }

  register() {
    const page = this.registerForm.get(['page'])!.value;
    const x = this.registerForm.get(['x'])!.value;
    const y = this.registerForm.get(['y'])!.value;
    this.uploadService.insertImageToPdf(x,y,page,this.imageName,this.pdfFileName);
  }

  onReset() {
    this.submitted = false;
    if (this.registerForm)
    this.registerForm.reset();
  }
}
