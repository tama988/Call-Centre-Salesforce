import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getcases from '@salesforce/apex/CaseController.getCases';
import { updateRecord } from 'lightning/uiRecordApi';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import REASON_FIELD from '@salesforce/schema/Case.Reason';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';
import NAME_FIELD from '@salesforce/schema/Case.ContactId';
import ID_FIELD from '@salesforce/schema/Case.Id';

export default class CaseRows extends NavigationMixin(LightningElement) {
    @track data;
    @track error;
    @track buffer=[];
    @track selectedCases;
    @track page=1;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize=10;
    @track rid;
    @track isEdited = false;
    @track reason;
    @track status;
    @track origin;
    @track subject;
    @track check;
    @track newcontactId;
    @track checksave=true;
    @track checkcancel=true;
    @track disableEdit = false;
    @track toggleSaveLabel = 'Save';
    @track id; 
 updatedCases=[];

    get options() {
        return [
                 { label: '10', value: 10 },
                 { label: '15', value: 15 },
                 { label: '20', value: 20 },
                 { label: '30', value: 30 },
               ];
    }    

    @wire(getcases)
    cases({error, data}) {
        if(data){
            this.buffer = data;
            this.totalRecountCount = data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.data=this.buffer;
            this.buffer=this.data;
        this.data = this.buffer.slice(0,this.pageSize);
        this.endingRecord = this.pageSize;
        }
        else if(error){
            this.error = error;
        }
    }

    handlePageChange(event) {

        this.pageSize = event.detail.value;
        console.log(this.pageSize);
        this.data = this.buffer.slice(0,this.pageSize); 
        
    }

    gotoRecord(event){
        this.rid = event.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.rid,
                objectApiName: 'Case',
                actionName: 'view'
            },
        });

    }

    handleContact(event) {
        this.newcontactId = event.target.value;
        this.id = event.target.dataset.id;

        this.updatedCases.push({
            Id: this.id,
            Contactname: this.newcontactId
        })
        
        this.checksave=false;
        this.checkcancel=false;
        
    }

    handleSubject(event){
        
        this.subject = event.target.value;
        this.id = event.target.dataset.id;

        this.updatedCases.push({
            Id: this.id,
            Subject:this.subject,
            
        })
        this.checksave=false;
        this.checkcancel=false;
    }

    handleReason(event){
        
        this.reason = event.target.value;
        this.id = event.target.dataset.id;
      
        this.updatedCases.push({
            Id: this.id,
            Reason : this.reason,
            
        })
        console.log(this.reason+'  '+this.id+'  '+this.status+'  '+this.origin+'  '+this.subject);
        this.checksave=false;
        this.checkcancel=false;
    }

    handleStatus(event){
        
        this.status = event.target.value;
        this.id = event.target.dataset.id;
  
        this.updatedCases.push({
            Id: this.id,
            Status: this.status,
            
        })
        console.log(this.reason+'  '+this.id+'  '+this.status+'  '+this.origin+'  '+this.subject);
        this.checksave=false;
        this.checkcancel=false;
    }

    handleOrigin(event){
        
        this.origin = event.target.value;
        this.id = event.target.dataset.id;
 
        this.updatedCases.push({
            Id: this.id,
            Origin:this.origin
        })
        this.checksave=false;
        this.checkcancel=false;
    }

    handleSave(){
        
        console.log(this.reason+'  '+this.id+'  '+this.status+'  '+this.origin+'  '+this.subject+'  '+this.newcontactId);

        this.toggleSaveLabel = "Saving...";

        console.log(this.updatedCases.length);
        for(var i=0;i<this.updatedCases.length;i++){

            var fields = {};
           
            fields[ID_FIELD.fieldApiName] = this.updatedCases[i].Id;
            fields[NAME_FIELD.fieldApiName] = this.updatedCases[i].Contactname;
            fields[SUBJECT_FIELD.fieldApiName] = this.updatedCases[i].Subject;
            fields[STATUS_FIELD.fieldApiName] = this.updatedCases[i].Status;
            fields[ORIGIN_FIELD.fieldApiName] = this.updatedCases[i].Origin;
            fields[REASON_FIELD.fieldApiName] = this.updatedCases[i].Reason;
            
            var recordInput = { fields };

            updateRecord(recordInput)
            .then(() => {
                
                console.log('success');
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated',
                    variant: 'success'
                });
                this.dispatchEvent(event);
                this.toggleSaveLabel = 'Saved';
                this.checksave = true;
                window.location.reload();
            })
            .catch(() => {
                
                console.log('error');
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Closed Records Cannot be Updated',
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
        }
        
    }

    handleCancel() {
        this.checkcancel = true;
        this.isEdited = false;
        this.checksave = true;
        this.disableEdit = false;
    }

    editTable() {
        this.checkcancel = false;
        this.isEdited = true;
        this.disableEdit = true;
    }

    handlePrev(){
        if (this.page > 1) {
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
    }

    handleNext() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; 
            this.displayRecordPerPage(this.page);            
        }             
    }

    displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.buffer.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
}