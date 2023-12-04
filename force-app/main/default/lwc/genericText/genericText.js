import { LightningElement,api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
export default class GenericText extends LightningElement {
    @api relatedType;
    @api labelName;
    @api isRequiredField;
    @api valueEntered = '';
    @api isErrorFromFlow=false;
    @api isInputValid;
    @api messageIfEmpty;
    @api messageIfInvalid;
    @api validationExpression;
    @api placeholderText;
    @api disableInput;
    @api formatter;
    @api toolTipText;
    @api minValue;
    @api maxLength;
    @api valueEnteredNum;
    @api firstTimeRender;
    @api step;
    @api blockEdit;
    @api maxValue;
    @api subscription;
    @api unitRate;
    @api qty;
    @api laboratory;
    @api manufacturing;
    @api totalcy;
    @api serviceType;
    @api prospectType;
    @api displaytrue;
    valueCombine;
    context = createMessageContext();
    @api get hasValue() {
        return this.relatedType !== 'number' ? this.valueEntered?.trim().length > 0 : this.valueEnteredNum != null;
    }
    connectedCallback() {
        // if(this.prospectType=="Repeat Projects from Existing customer (RE)" && this.labelName=="Manufacturing Component"){
        //     this.disableInput=true;
        // }
        if(this.isErrorFromFlow && this.labelName=="Reasons"){
        this.isRequiredField=true;  
        }

        //this.isErrorFromFlow =false;
        if (this.relatedType === 'number' && this.valueEntered === '') {
            this.valueEntered = this.valueEnteredNum;
            if (!this.minValue) this.minValue = 0;
            if (!this.maxValue) this.maxValue = 2147483647;
        }
        if ((!this.relatedType || this.relatedType === 'text') && !this.maxLength) this.maxLength = 255;
        this.subscribeMC();
    }
    renderedCallback() {
        //alert(this.totalcy);
        console.log('this.labelName---'+this.labelName);
        console.log('this.labelName---'+this.isErrorFromFlow);
        this.publishMC();
        this.dispatchEvent(new FlowAttributeChangeEvent('hasValue', this.hasValue));
        if (this.isErrorFromFlow) {
            console.log('this.isInputValid---'+this.isInputValid);
            console.log('this.hasValue---'+this.hasValue);
            let errorMessage = '';
            if (!this.isInputValid && this.hasValue) {
                errorMessage = this.messageIfInvalid;
            }
            this.customValidityError(errorMessage);
            this.template.querySelector('lightning-input').reportValidity();
        }
    }
    customValidityError(errorMessage) {
        let genericCmp = this.template.querySelector('lightning-input');
        genericCmp.setCustomValidity(errorMessage);
        genericCmp.reportValidity();
    }

    handleKeyDown(e) {
        
        if (this.relatedType === 'number') {
            let kCode = e.keyCode || e.which;
            
            if (kCode === 189 || kCode === 188 || kCode === 69 || kCode === 84 || kCode === 75 || kCode === 77) {
                e.preventDefault();
            }
        }
    }
    publishMC() {
        const message = {
            messageToSend: this.valueEntered,
            sourceSystem: this.labelName
        };
        publish(this.context, SAMPLEMC, message);
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.context, SAMPLEMC, (message) => {
            if(message.sourceSystem=='serviceType'){
                //this.valueEntered='';
                this.serviceType=message.messageToSend;
                // if(this.prospectType=="Commercial Project From Existing Customer (CE)" && message.messageToSend=='Manufacturing'){
                //     if(this.labelName=='Unit Rate' || this.labelName=='Qty (in Kgs)'){
                //         this.isRequiredField=true;
                        
                //     } 
                if(message.messageToSend=='Manufacturing'|| this.prospectType=="Commercial Project From Existing Customer (CE)"){
                    console.log('+++++++++++++'+this.prospectType)
                    if(this.labelName=='Unit Rate' || this.labelName=='Qty (in Kgs)'){
                        this.isRequiredField=true;
                }
                    if(this.labelName=="Total CY's Sales Expected"){
                        this.disableInput=true;
                        this.isRequiredField=false;
                    }
                    if(this.labelName=="Manufacturing Component") {
                        this.disableInput=true;
                        this.isRequiredField=false;
                    }       
                    
                }else{
                    if(this.labelName=='Unit Rate' || this.labelName=='Qty (in Kgs)'){
                        this.isRequiredField=false;                        
                    }
                    if(this.labelName=="Total CY's Sales Expected"){
                        this.disableInput=false;
                        this.isRequiredField=true;
                    }        
                }
                //this.unitRate=message.messageToSend;
            }
            if(message.sourceSystem=='Unit Rate'){
                this.unitRate=message.messageToSend;
            }
            if(message.sourceSystem=='Qty (in Kgs)'){
                this.qty=message.messageToSend;
            }
            if(message.sourceSystem=='Manufacturing Component'){
                this.manufacturing=message.messageToSend;
            }
            if(message.sourceSystem=='Laboratory Component'){
                this.laboratory=message.messageToSend;
            }
            
            if(message.sourceSystem=='Probability%' && message.messageToSend<75){
                if(this.labelName=="Reasons"){
                    console.log('message.sourceSystem'+message.sourceSystem)
                    // this.valueEntered = message.messageToSend
                    this.isRequiredField=true;
                }
            }else if(message.sourceSystem=='Probability%' && message.messageToSend>=75){
                if(this.labelName=="Reasons"){
                    console.log('message.sourceSystem1')
                    this.isRequiredField=false;
                }
            }
            // console.log('1---')
            // console.log(this.unitRate);
            // console.log(this.qty);
            // console.log('1---'+message.sourceSystem)
            // console.log('1---'+this.labelName)
            if(message.sourceSystem=='Unit Rate' || message.sourceSystem=='Qty (in Kgs)'){
                if(this.labelName=='Manufacturing Component'){
                    this.valueEntered=this.unitRate*this.qty;
                }
            }
            if(message.sourceSystem=='Unit Rate' || message.sourceSystem=='Qty (in Kgs)'){
                if(this.labelName=='Manufacturing Component'){
                    this.disableInput=true;
                    this.manufacturing=this.unitRate*this.qty;
                }
            }
            if(message.sourceSystem=='Manufacturing Component' || message.sourceSystem=='Laboratory Component'){
            if(this.labelName=="Total CY's Sales Expected"){
                if(this.manufacturing!=null && typeof this.manufacturing!='undefined' && this.laboratory!=null && typeof this.laboratory!='undefined'){
                this.valueEntered=parseInt(this.manufacturing)+parseInt(this.laboratory)
                   this.valueEnteredNum =this.valueEntered;
                }
               else  if(this.manufacturing!=null && typeof this.manufacturing!='undefined'){
               this.valueEntered=parseInt(this.manufacturing)
               this.valueEnteredNum =this.valueEntered;
               }
               else  if(this.laboratory!=null && typeof this.laboratory!='undefined'){
               this.valueEntered=parseInt(this.laboratory)
               this.valueEnteredNum =this.valueEntered;
            }
            }
        }
            if(message.sourceSystem=='Unit Rate' || message.sourceSystem=='Qty (in Kgs)'){
            if(this.labelName=="Total CY's Sales Expected" && this.serviceType=='Manufacturing'){
                if((typeof this.manufacturing==='undefined' || this.manufacturing=='' || this.manufacturing==null  || this.manufacturing==null || this.manufacturing==0) && (typeof this.laboratory==='undefined' || this.laboratory=='' || this.laboratory==null  || this.laboratory==null || this.laboratory==0)){
                    this.valueEntered=this.unitRate*this.qty;
                    this.valueEnteredNum =this.valueEntered;
                }else if((typeof this.manufacturing!=='undefined' && this.manufacturing!='' && this.manufacturing!=null && this.manufacturing!=0) && typeof this.laboratory!=='undefined'){
                   // console.log('1c');
                    this.valueEntered=parseInt(this.manufacturing)+parseInt(this.laboratory);
                    this.valueEnteredNum =this.valueEntered;
                }else if((typeof this.manufacturing==='undefined' || this.manufacturing==''   || this.manufacturing==null || this.manufacturing==0) && (typeof this.laboratory!=='undefined' && this.laboratory!='' && this.laboratory!=null)){;
                    this.valueEntered=parseInt(this.laboratory)+(this.unitRate*this.qty);
                    this.valueEnteredNum =this.valueEntered;
                }
                else if(typeof this.manufacturing!=='undefined'){
                    this.valueEntered=this.manufacturing;
                    this.valueEnteredNum =this.valueEntered;
                }
                this.isErrorFromFlow=false;
            }
        }
        });
     }
 
     unsubscribeMC() {
         unsubscribe(this.subscription);
         this.subscription = null;
     }

    handleText(event) {
        this.valueEntered = event.target.value;
        if (this.relatedType === 'number' && event.target.value !== '') {
            this.valueEnteredNum = Number(event.target.value);
        } else if (this.relatedType === 'number') {
            this.valueEnteredNum = event.target.value;
        }
        if (this.valueEnteredNum === '') {
            this.valueEnteredNum = null;
        }
        if (this.relatedType === 'number') {
            this.valueCombine = this.valueEnteredNum;
        } else {
            this.valueCombine = this.valueEntered;
        }
        this.publishMC();
        this.dispatchEvent(new FlowAttributeChangeEvent('valueEntered', this.valueEntered));
        this.dispatchEvent(new FlowAttributeChangeEvent('valueEnteredNum', this.valueEntered));

        this.template.querySelector('lightning-input').reportValidity();
        this.dispatchEvent(new FlowAttributeChangeEvent('hasValue', this.hasValue));

        if (this.valueEntered.length > 0) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.isErrorFromFlow = false;
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.isInputValid = this.checkTextValidity();
        } else if (this.valueEntered.length === 0 && this.isInputValid === false) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.isInputValid = true;
        }
        const enteredEvent = new CustomEvent('valueentered', {
            detail: this.valueCombine
        });
        this.dispatchEvent(enteredEvent);
    }
    @api checkValidity() {
        var inputCmp = this.template.querySelector('lightning-input');
        var value = inputCmp.value;
        if (this.isRequiredField === true) {
            if (value === '' || typeof value == 'undefined') {
                return false;
            }
        }
        return true;
    }

    checkTextValidity() {
        let genericCmp = this.template.querySelector('lightning-input');
        genericCmp.setCustomValidity('');
        genericCmp.reportValidity();
        return genericCmp.checkValidity();
    }

    @api
    customMessageReporting(errorMessage) {
        let comp = this.template.querySelector('lightning-input');
        comp.setCustomValidity(errorMessage);
        comp.reportValidity();
        if (!errorMessage) {
            this.template.querySelector('lightning-input').reportValidity();
        }
    }

    @api
    updateValue(value) {
        this.valueEntered = value;
    }

    @api
    validate() {
        if (this.isInputValid === undefined) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.isInputValid = this.checkTextValidity();
        }
        console.log('Renderthis.labelName---'+this.labelName);
        console.log('this.valueEntered---'+this.valueEntered);
        console.log('this.isErrorFromFlow---'+this.isErrorFromFlow);
        console.log('this.isInputValid---'+this.isInputValid);
        console.log('this.isRequiredField---'+this.isRequiredField);
        //alert('text1--'+this.isInputValid);
        if (this.isErrorFromFlow === false && this.isInputValid === true) {
           // console.log('c1');
            if (
                this.disableInput === true ||
                (this.valueEntered !== '' && typeof this.valueEntered !== 'undefined') ||
                ((this.valueEntered === '' || typeof this.valueEntered === 'undefined') && this.isRequiredField === false)
            ) {
                //console.log('c2'+this.labelName);
                //console.log('c2');

                // eslint-disable-next-line @lwc/lwc/no-api-reassignments
                this.isErrorFromFlow = false;
                return { isValid: true };
            }
        }
        console.log('this.valueEntered---came');
        
        this.isErrorFromFlow = true;
        return {
            isValid: false,
            errorMessage: ''
        };
    }
}