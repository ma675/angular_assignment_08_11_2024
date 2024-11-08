import { Component, OnInit } from '@angular/core';
import { HomeserviceService } from './homeservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { productDetailsModel } from '../productModal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  addProductForm !: FormGroup;
  updateProductForm !: FormGroup;

  deleteId: any;
  editId: any;
  productData: any;
  statuses: any;

  addProductDialog: boolean = false;
  editProductDialog: boolean = false;
  onDeleteDisplayBasic: boolean = false;

  fileName = 'Select Product Image';
  isShowImgError: boolean = false;
  showErrorImgMessage: string | any;
  currentFile?: File | any;
  imageData: any;
  imageUrl = "";
  selectedOptionValue: any;

  productDetailsModelObj: productDetailsModel = new productDetailsModel();
  productName: any;


  chartData: any[] = [];
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Product Name';
  showYAxisLabel = true;
  yAxisLabel = 'Quantity';



  constructor(private service: HomeserviceService,
    private ngxToastr: ToastrService,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.getProductDetails();
    this.productFormBuilder();

    this.statuses = [
      { label: 'Select Status', code: null },
      { label: 'INSTOCK', code: 'INSTOCK' },
      { label: 'LOWSTOCK', code: 'LOWSTOCK' },
      { label: 'OUTOFSTOCK', code: 'OUTOFSTOCK' },
    ];



  }




  public productFormBuilder() {
    this.addProductFormBuilder();
    this.updateProductFormBuilder();
  }

  public addProductFormBuilder() {
    this.addProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', [Validators.required]],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      inventoryStatus: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
    })
  }


  public updateProductFormBuilder() {
    this.updateProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', [Validators.required]],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      inventoryStatus: ['', Validators.required],
      description: ['', Validators.required],
      image: ["", Validators.required],
    })
  }


  // get all product details 
  public getProductDetails() {
    this.service.getProductDetailsList().subscribe(
      {
        next: (res: any) => {
          this.productData = res;
          console.log("this.productData", this.productData);
          this.updateChartData();
        },
        error: (error: any) => {
          this.ngxToastr.error(error.error.message);
        }
      })
  }

  updateChartData(): void {
    if (this.productData && this.productData.length > 0) {
      this.chartData = this.productData.map((product: any) => ({
        name: product.name,
        value: product.quantity
      }));
    } else {
      this.chartData = [];
    }
  }


  public openNew() {
    this.addProductDialog = true;
    this.currentFile = "";
    this.fileName = " ";
    this.addProductForm.reset();
    this.addProductForm.get('image')?.reset();
    this.imageUrl = "";
  }

  public selectFile(event: any): void {

    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {

        this.imageUrl = event.target.result;
        this.imageData = reader.result as string;
        console.log(this.imageData);
      }

      if (file.type == "image/png") {
        this.isShowImgError = false;
        this.currentFile = file;
        this.fileName = this.currentFile.name;

      } else if (file.type == "image/jpg") {
        this.isShowImgError = false;
        this.currentFile = file;
        this.fileName = this.currentFile.name;

      } else if (file.type == "image/jpeg") {
        this.isShowImgError = false;
        this.currentFile = file;
        this.fileName = this.currentFile.name;

      } else {
        this.isShowImgError = true;
        this.showErrorImgMessage = "You must select png/jpg/jpeg only";
        this.addProductForm.controls['image'].reset();
      }
    } else {
      this.fileName = 'Select Profile Image';
    }
  }


  public addProduct() {
    if (this.addProductForm.valid) {
      this.productDetailsModelObj.name = this.addProductForm.value.name;
      this.productDetailsModelObj.category = this.addProductForm.value.category;
      this.productDetailsModelObj.price = this.addProductForm.value.price;
      this.productDetailsModelObj.quantity = this.addProductForm.value.quantity;
      this.productDetailsModelObj.inventoryStatus = this.addProductForm.value.inventoryStatus;
      this.productDetailsModelObj.description = this.addProductForm.value.description;
      this.productDetailsModelObj.image = this.imageData;

      this.service.addProductDetails(this.productDetailsModelObj).subscribe
        ({
          next: (res: any) => {

            this.ngxToastr.success("Product Added Successfully", "",
              {
                closeButton: true
              })

            this.currentFile = "";
            this.fileName = " ";
            this.addProductForm.reset();
            this.addProductForm.get('image')?.reset();
            this.imageUrl = ""

            this.addProductDialog = false;

            this.getProductDetails();
            this.updateChartData();
          },
          error: (error: any) => {
            this.ngxToastr.error(error.error.message);
          }
        })
    }
  }


  public cancelDialog() {
    this.addProductDialog = false;
    this.currentFile = "";
    this.fileName = " ";
    this.addProductForm.reset();
    this.addProductForm.get('image')?.reset();
    this.imageUrl = "";
  }


  public editProduct(product: any) {
    console.log("on edit product", product);
    this.editId = product.id;
    this.updateProductForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      inventoryStatus: product.inventoryStatus,
      description: product.description,
      image: product.image
    })
    this.imageUrl = product.image;
    this.editProductDialog = true;
  }


  public onEditCancelDialog() {
    this.editProductDialog = false;
    this.currentFile = "";
    this.fileName = " ";
    this.updateProductForm.reset();
    this.updateProductForm.get('image')?.reset();
    this.imageUrl = "";
  }


  public updateProduct() {
    let uploadImg = "";
    if (this.updateProductForm.get('image')?.value == "" || this.updateProductForm.get('image')?.value == undefined ||
      this.updateProductForm.get('image')?.value == null) {
      uploadImg = this.imageUrl;
    }
    else {
      uploadImg = this.imageData;
    }
    this.productDetailsModelObj.id = this.editId;
    this.productDetailsModelObj.name = this.updateProductForm.value.name;
    this.productDetailsModelObj.category = this.updateProductForm.value.category;
    this.productDetailsModelObj.price = this.updateProductForm.value.price;
    this.productDetailsModelObj.quantity = this.updateProductForm.value.quantity;
    this.productDetailsModelObj.inventoryStatus = this.updateProductForm.value.inventoryStatus;
    this.productDetailsModelObj.description = this.updateProductForm.value.description;
    this.productDetailsModelObj.image = uploadImg;
    // this.productDetailsModelObj.image = this.updateProductForm.get('image')?.value;

    console.log("this.updateProductForm.get('image')?.value", this.updateProductForm.get('image')?.value);
    console.log("this.updatctDetailsModelObj", this.productDetailsModelObj);



    this.service.updateProductDetails(this.editId, this.productDetailsModelObj).subscribe
      ({
        next: (res: any) => {
          this.ngxToastr.success("Product Updated Successfully", "",
            {
              closeButton: true
            })
          this.currentFile = "";
          this.fileName = " ";
          this.updateProductForm.reset();
          this.updateProductForm.get('image')?.reset();
          this.imageUrl = ""

          this.editProductDialog = false;

          this.getProductDetails();
          this.updateChartData();
        },
        error: (error: any) => {
          this.ngxToastr.error(error.error.message);
        }
      })

  }


  public deleteProduct(product: any) {
    this.deleteId = product.id
    console.log("delete id", this.deleteId);
    this.onDeleteDisplayBasic = true;
    this.productName = product.name
  }

  public onCancelDeleteDialog() {
    this.onDeleteDisplayBasic = false;
  }

  public onDelete() {
    this.service.deleteProductDetails(this.deleteId).subscribe({
      next: (res: any) => {
        this.ngxToastr.success("Product Deleted Successfully", "",
          {
            closeButton: true
          })

        this.onDeleteDisplayBasic = false;
        this.getProductDetails();
        this.updateChartData();
      },
      error: (error: any) => {
        this.ngxToastr.error(error.error.message);
      }
    })

  }
}
