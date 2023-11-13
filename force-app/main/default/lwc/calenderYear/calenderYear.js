import { LightningElement,api,wire } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import calendarYear from "@salesforce/schema/Prospect__c.Calendar_year__c";
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
export default class CalenderYear extends LightningElement {
    currentYear;
    currentMonth;
@api disableinput1;
@api disableinput2;
@api disableinpu3;
@api disableinpu4;
@api isErrorFromFlow;
@api apiFieldName;
@api q1;
@api q2;
@api q3;
@api q4;
@api selectedOption;
@api errorMessage;
@api errorMessageHtml=false;
@api greaterErrorMessageHtml=false;
@api calendarOptions;
@api calendarOptions1;
@api recordTypeId;
@api calOption;
@api q1required;
@api q2required;
@api q3required;
@api q4required;
@api q1value=false;
@api q2value=false;
@api q3value=false;
@api q4value=false;
@api salesexpected;
@api salesexpected1;
@api subscription;
@api forecastType;
@api manufacturing;
@api manufacturing1;
@api laboratory;
@api unitRate;
@api totalcy;
@api qty;
@api serviceType;
context = createMessageContext();
@wire(getObjectInfo, { objectApiName: 'Prospect__c' })
    getObjectData({ error, data }) {
        if (data) {
            //console.log('1---')
            //console.log('1---'+data.defaultRecordTypeId)
            if (this.recordTypeId == null) this.recordTypeId = data.defaultRecordTypeId;
            this.apiFieldName = this.objectName + '.' + this.apiFieldName;
            //console.log(this.apiFieldName);
            //console.log(this.recordTypeId);
        } else if (error) {
            //console.log('error===>', error);
        }
    }

@wire(getPicklistValues, {
    recordTypeId: '$recordTypeId',
    fieldApiName: calendarYear
})
getPicklistValues({ error, data }) {
    if (data) {
        //console.log('data')
        //console.log(data.values)
        this.calendarOptions1 = data.values.map((plValue) => {
            return {
                label: plValue.label,
                value: plValue.value
            };
        });
    } else if (error) {
        //console.log(error);
    }
}
renderedCallback() {
    
    //console.log('1---forecastType'+this.forecastType);
    //console.log('1---'+this.isErrorFromFlow);
    
    if (this.isErrorFromFlow) {
        var currentDate = new Date();
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth();
        let q1value=false;
        let q2value=false;
        let q3value=false;
        let q4value=false;
        if(typeof this.selectedOption!='undefined'){
            this.calOption=this.selectedOption.toString();
            if(this.calOption<this.currentYear){
             q1value=false;
             q2value=false;
             q3value=false;
             q4value=false;
            }
            else if(this.calOption==this.currentYear){
                
                  if(this.currentMonth>2 && this.currentMonth<6){
                    q1value=false;
             q2value=true;
             q3value=true;
             q4value=true;
             this.disableinput1 = true;
            this.disableinput2 = false;
            this.disableinput3 = false;
            this.disableinput4 = false;
                 }else if(this.currentMonth>5 && this.currentMonth<9){
                    
                    q1value=false;
             q2value=false;
             q3value=true;
             q4value=true;
             this.disableinput1 = true;
            this.disableinput2 = true;
            this.disableinput3 = false;
            this.disableinput4 = false;
                 }else if(this.currentMonth>8 && this.currentMonth<11){
                    q1value=false;
             q2value=false;
             q3value=false;
             q4value=true;
             this.disableinput1 = true;
            this.disableinput2 = true;
            this.disableinput3 = true;
            this.disableinput4 = false;
                 }
            }else{
                q1value=true;
                q2value=true;
                q3value=true;
                q4value=true;
            }
            }
        if(this.selectedOption==null || this.selectedOption=='' || typeof this.selectedOption=='undefined'){
            let genericCmp = this.template.querySelector('lightning-combobox');
            genericCmp.reportValidity();
         
        } 
        if(q1value==true && (this.q1==null || this.q1=='' || typeof this.q1=='undefined')){
            let genericCmp = this.template.querySelector('.q1');
            genericCmp.reportValidity();

        }
        if(q2value==true && (this.q2==null || this.q2=='' || typeof this.q2=='undefined')){
            let genericCmp = this.template.querySelector('.q2');
            genericCmp.reportValidity();

        }
        if(q3value==true && (this.q3==null || this.q3=='' || typeof this.q3=='undefined')){
            let genericCmp = this.template.querySelector('.q3');
            genericCmp.reportValidity();

        }
        if(q4value==true && (this.q4==null || this.q4=='' || typeof this.q4=='undefined')){
            let genericCmp = this.template.querySelector('.q4');
            genericCmp.reportValidity();

        }
        if(this.q1!=0 && this.q1!='' && this.q1!=null && typeof this.q1!='undefined'){
            this.disableinput1 = false;
            this.disableinput2 = true;
            this.disableinput3 = true;
            this.disableinput4 = true;
            this.q1required=true;
                this.q2required=false;
                    this.q3required=false;
                    this.q4required=false;
            }
            
            else if(this.q2!=0 && this.q2!='' && this.q2!=null && typeof this.q2!='undefined'){
                this.disableinput1 = true;
                this.disableinput2 = false;
                this.disableinput3 = true;
                this.disableinput4 = true;
                this.q1required=false;
                    this.q2required=true;
                        this.q3required=false;
                        this.q4required=false;
                        }
                            
                            else if(this.q3!=0 && this.q3!='' && this.q3!=null && typeof this.q3!='undefined'){
                this.disableinput1 = true;
                this.disableinput2 = true;
                this.disableinput3 = false;
                this.disableinput4 = true;
                this.q1required=false;
                    this.q2required=false;
                        this.q3required=true;
                        this.q4required=false;
                }
                 else if(this.q4!=0 && this.q4!='' && this.q4!=null && typeof this.q4!='undefined'){
                this.disableinput1 = true;
                this.disableinput2 = true;
                this.disableinput3 = true;
                this.disableinput4 = false;
                this.q1required=false;
                    this.q2required=false;
                        this.q3required=false;
                        this.q4required=true;
                }else{
                    this.enableFields();
                    }
            var q1;
            var q2;
            var q3;
            var q4;
            if(this.q1==null)
            q1=0
            else
            q1=parseInt(this.q1);
            if(this.q2==null)
            q2=0
            else
            q2=parseInt(this.q2);
            if(this.q3==null)
            q3=0
            else
            q3=parseInt(this.q3);
            if(this.q4==null)
            q4=0
            else 
            q4=parseInt(this.q4);
            var total=q1+q2+q3+q4;
            
            //console.log('total--'+total);
            //console.log('this.salesexpected--'+this.salesexpected);
            
            if(total>this.salesexpected){
                this.errorMessageHtml=true;
            }else{
                this.errorMessageHtml=false;
            }
            
            if(total<this.salesexpected){
                
                this.greaterErrorMessageHtml=true;
            }else{
                this.greaterErrorMessageHtml=false;
            }
            

         this.isErrorFromFlow=false;
         
         //this.template.querySelector('lightning-combobox').reportValidity();
        /*if (!this.isInputValid && this.hasValue) {
            errorMessage = this.messageIfInvalid;
        }*/
        //this.customValidityError(errorMessage);
        //this.template.querySelector('lightning-input').reportValidity();
    }
}
customValidityError(errorMessage) {
    let genericCmp = this.template.querySelector('lightning-combobox');
    genericCmp.setCustomValidity(errorMessage);
    genericCmp.reportValidity();
}
subscribeMC() {
    if (this.subscription) {
        return;
    }
    this.subscription = subscribe(this.context, SAMPLEMC, (message) => {
        this.displayMessage(message);
    });
 }
 displayMessage(message) {
    this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
    if(message.sourceSystem=='serviceType'){
        
            this.serviceType=message.messageToSend;
        
    }
    if(message.sourceSystem=='Unit Rate'){
        this.unitRate=message.messageToSend;
    }
    if(message.sourceSystem=='Qty (in Kgs)'){
        this.qty=message.messageToSend;
    }
    
    if(message.sourceSystem=="Total CY's Sales Expected"){
        this.totalcy=message.messageToSend;
    }
    //console.log('ms'+message.sourceSystem)
    //console.log('ms'+message.messageToSend)
    if(message.sourceSystem=='Manufacturing Component'){
        this.manufacturing=message.messageToSend;
        this.manufacturing1=this.manufacturing;
    }
    if(message.sourceSystem=='Laboratory Component'){
        this.laboratory=message.messageToSend;
    }
    
    if(this.forecastType=='manufacturing'){
        //console.log('man');
        //console.log('man'+this.totalcy);
        
        if(this.serviceType!='Manufacturing' && typeof this.totalcy!=='undefined' && this.totalcy!=='' && this.totalcy!==null){
            
            this.salesexpected=this.totalcy;
        }
        else if(typeof this.manufacturing==='undefined' || this.manufacturing==='' || this.manufacturing===null){
            
            //console.log('man1');
            this.salesexpected=this.unitRate*this.qty;
        }
        else if(typeof this.manufacturing!=='undefined'){
            //console.log('man2');
            this.salesexpected=this.manufacturing;
        }
    }
    if(this.forecastType=='laboratory'){
        if(typeof this.laboratory!=='undefined'){
            this.salesexpected=this.laboratory;
        }
    }
    /*if(typeof this.manufacturing==='undefined' && typeof this.laboratory==='undefined'){
        this.salesexpected=this.unitRate*this.qty;
    }else if(typeof this.manufacturing!=='undefined' && typeof this.laboratory!=='undefined'){
        this.salesexpected=parseInt(this.manufacturing)+parseInt(this.laboratory);
    }else if(typeof this.manufacturing!=='undefined'){
        this.salesexpected=this.manufacturing;
    }*/
    
}
    connectedCallback() {
        this.subscribeMC();
        // Create a new Date object to get the current year
        var currentDate = new Date();
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth();
        //console.log('12Came')
    //console.log('12Came'+this.manufacturing1)
    this.manufacturing=this.manufacturing1;
        this.q1=this.q1;
        this.q2=this.q2;
        this.q3=this.q3;
        this.q4=this.q4;
        if(typeof this.selectedOption!='undefined'){
        this.calOption=this.selectedOption.toString();
        if(this.calOption<this.currentYear){
            this.disableinput1 = true;
            this.disableinput2 = true;
            this.disableinput3 = true;
            this.disableinput4 = true;
        }
        else if(this.calOption==this.currentYear){
              if(this.currentMonth>2 && this.currentMonth<6){
                this.disableinput1 = true;
                this.q2required=true;
                this.q3required=true;
                this.q4required=true;
             }else if(this.currentMonth>5 && this.currentMonth<9){
                this.disableinput1 =true;
                this.disableinput2 = true;
                this.q3required=true;
                this.q4required=true;
             }else if(this.currentMonth>8 && this.currentMonth<11){
                this.disableinput1 = true;
                this.disableinput2 = true;
                this.disableinput3 = true;
                this.q4required=true;
             }
        }else{
            this.disableinput1 = false;
            this.disableinput2 = false;
            this.disableinput3 = false;
            this.disableinput4 = false;
            this.q1required=true;
            this.q2required=true;
                this.q3required=true;
                this.q4required=true;
        }
        }
        if(this.q1!=0 && this.q1!='' && this.q1!=null && typeof this.q1!='undefined'){
            this.disableinput1 = false;
            this.disableinput2 = true;
            this.disableinput3 = true;
            this.disableinput4 = true;
            this.q1required=true;
                this.q2required=false;
                    this.q3required=false;
                    this.q4required=false;
            }
            
            else if(this.q2!=0 && this.q2!='' && this.q2!=null && typeof this.q2!='undefined'){
                this.disableinput1 = true;
                this.disableinput2 = false;
                this.disableinput3 = true;
                this.disableinput4 = true;
                this.q1required=false;
                    this.q2required=true;
                        this.q3required=false;
                        this.q4required=false;
                        }
                            
                            else if(this.q3!=0 && this.q3!='' && this.q3!=null && typeof this.q3!='undefined'){
                this.disableinput1 = true;
                this.disableinput2 = true;
                this.disableinput3 = false;
                this.disableinput4 = true;
                this.q1required=false;
                    this.q2required=false;
                        this.q3required=true;
                        this.q4required=false;
                }
                 else if(this.q4!=0 && this.q4!='' && this.q4!=null && typeof this.q4!='undefined'){
                this.disableinput1 = true;
                this.disableinput2 = true;
                this.disableinput3 = true;
                this.disableinput4 = false;
                this.q1required=false;
                    this.q2required=false;
                        this.q3required=false;
                        this.q4required=true;
                }else{
                    this.enableFields();
                    }
    }
    enableFields(evenet){
        this.disableinput1 = false;
        this.disableinput2 = false;
        this.disableinput3 = false;
        this.disableinput4 = false;
        this.q1required=true;
            this.q2required=true;
                this.q3required=true;
                this.q4required=true;
    }
    q1Change(event){
        this.q1 = event.detail.value;
        if(this.q1!=0 && this.q1!=''){
        this.disableinput1 = false;
        this.disableinput2 = true;
        this.disableinput3 = true;
        this.disableinput4 = true;
        this.q1required=true;
            this.q2required=false;
                this.q3required=false;
                this.q4required=false;
        }else{
        this.enableFields();
        }
    }
    q2Change(event){
        this.q2 = event.detail.value;
        if(this.q2!=0 && this.q2!=''){
        this.disableinput1 = true;
        this.disableinput2 = false;
        this.disableinput3 = true;
        this.disableinput4 = true;
        this.q1required=false;
            this.q2required=true;
                this.q3required=false;
                this.q4required=false;
                }else{
                    this.enableFields();
                    }
    }
    q3Change(event){
        this.q3 = event.detail.value;
        if(this.q3!=0 && this.q3!=''){
        this.disableinput1 = true;
        this.disableinput2 = true;
        this.disableinput3 = false;
        this.disableinput4 = true;
        this.q1required=false;
            this.q2required=false;
                this.q3required=true;
                this.q4required=false;
        }else{
            this.enableFields();
            }
    }
    q4Change(event){
        this.q4 = event.detail.value;
        if(this.q4!=0 && this.q4!=''){
        this.disableinput1 = true;
        this.disableinput2 = true;
        this.disableinput3 = true;
        this.disableinput4 = false;
        this.q1required=false;
            this.q2required=false;
                this.q3required=false;
                this.q4required=true;
        }else{
            this.enableFields();
            }
    }
    handleChange(event) {
        this.selectedOption = event.detail.value;
        if(this.selectedOption<this.currentYear){
            this.disableinput1 = true;
            this.disableinput2 = true;
            this.disableinput3 = true;
            this.disableinput4 = true;
            this.q1=null;
            this.q2=null;
            this.q3=null;
            this.q4=null;
            this.q1required=false;
            this.q2required=false;
                this.q3required=false;
                this.q4required=false;
        }
        else if(this.selectedOption==this.currentYear){
              if(this.currentMonth>2 && this.currentMonth<6){
                this.disableinput1 = true;
                this.disableinput2 = false;
            this.disableinput3 = false;
            this.disableinput4 = false;
            this.q1required=false;
            this.q2required=true;
                this.q3required=true;
                this.q4required=true;
            
             }else if(this.currentMonth>5 && this.currentMonth<9){
                this.disableinput1 =true;
                this.disableinput2 = true;
                this.disableinput3 = false;
            this.disableinput4 = false;
            this.q1required=false;
            this.q2required=false;
                this.q3required=true;
                this.q4required=true;
            
             }else if(this.currentMonth>8 && this.currentMonth<11){
                this.disableinput1 = true;
                this.disableinput2 = true;
                this.disableinput3 = true;
                this.disableinput4 = false;
                this.q1required=false;
            this.q2required=false;
                this.q3required=false;
                this.q4required=true;
             }
        }else{
            this.disableinput1 = false;
            this.disableinput2 = false;
            this.disableinput3 = false;
            this.disableinput4 = false;
            this.q1required=true;
            this.q2required=true;
                this.q3required=true;
                this.q4required=true;
        }
    }
    @api
    validate() {
        let isValid = true;
        if (this.selectedOption === '' || this.selectedOption==null || typeof this.selectedOption=='undefined') {
            isValid=false;
        }
        let inputFields = this.template.querySelectorAll('lightning-input');
            inputFields.forEach((inputField) => {
                if (!inputField.checkValidity()) {
                    inputField.reportValidity();
                    isValid = false;
                }
            });
            var q1;
            var q2;
            var q3;
            var q4;
            if(this.q1==null)
            q1=0
            else
            q1=parseInt(this.q1);
            if(this.q2==null)
            q2=0
            else
            q2=parseInt(this.q2);
            if(this.q3==null)
            q3=0
            else
            q3=parseInt(this.q3);
            if(this.q4==null)
            q4=0
            else 
            q4=parseInt(this.q4);
            var total=q1+q2+q3+q4;
            //console.log('valid--'+total);
            //console.log('valid--'+this.salesexpected);
            
            //this.salesexpected=this.salesexpected1;
            console.log(total);
            console.log(this.salesexpected);
            if(total>this.salesexpected){
                isValid = false;
            }
            if(total<this.salesexpected){
                isValid = false;
            }
            
        if (isValid) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.isErrorFromFlow = false;
            return {
                isValid: true,
                errorMessage: ''
            };
        }
        this.isErrorFromFlow = true;
        return {
            isValid: false,
            errorMessage: ''
        };
    }
}
