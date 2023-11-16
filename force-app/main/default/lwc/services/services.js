import { LightningElement, track, wire,api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Prospect_OBJECT from '@salesforce/schema/Prospect__c';
import ServiceSubType_FIELD from '@salesforce/schema/Prospect__c.Service_Sub_Type__c';
import ServiceType_FIELD from '@salesforce/schema/Prospect__c.Service_Type__c';
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
export default class Services extends LightningElement {
    @api isRequiredField;
    @api isErrorFromFlow;
    @api isInputValid;
    @api messageIfEmpty;
    @api messageIfInvalid;
    @api relatedType;
    @api valueEntered ='';
    @api serviceSubTypevalueEntered ='';
    @track isfalse =false;
    context = createMessageContext();
    // setservicevalue= this.valueEntered
    @wire(getObjectInfo, {objectApiName: Prospect_OBJECT })
    ProspectInfo; 
    @track slaOptions;
    @track upsellOptions;
    @wire(getPicklistValues, {recordTypeId: '$ProspectInfo.data.defaultRecordTypeId', fieldApiName: ServiceSubType_FIELD })
    slaFieldInfo({ data, error }) {
        if (data) this.slaFieldData = data;
    }
    @wire(getPicklistValues, {recordTypeId:'$ProspectInfo.data.defaultRecordTypeId', fieldApiName: ServiceType_FIELD })
    upsellFieldInfo({ data, error }) {
        if (data) this.upsellOptions = data.values;
    }
    renderedCallback(event){
        if (this.isErrorFromFlow) {
            let errorMessage = '';
            if (!this.isInputValid && this.hasValue) {
                errorMessage = this.messageIfInvalid;
            }
            this.customValidityError(errorMessage);
            this.template.querySelector('lightning-combobox').reportValidity();
        }
        this.publishMC();   
    }
    customValidityError(errorMessage) {
        let genericCmp = this.template.querySelector('lightning-combobox');
        genericCmp.setCustomValidity(errorMessage);
        genericCmp.reportValidity();
    }
    handleUpsellChange(event) {
        let key = this.slaFieldData.controllerValues[event.target.value];
        this.slaOptions = this.slaFieldData.values.filter(opt => opt.validFor.includes(key));
        this.valueEntered=event.target.value;
        this.isErrorFromFlow=false;
    this.publishMC();   
    }
    handleservice(event){
        this.serviceSubTypevalueEntered = event.target.value;
        // this.valueEntered = this.serviceSubTypevalueEntered
        // this.isErrorFromFlow=false;
        // this.publishMC();   
    }
    publishMC() {
        
        const message = {
            messageToSend: this.valueEntered,
            sourceSystem: 'serviceType'
        };
        publish(this.context, SAMPLEMC, message);
    }
    @api
    validate() {
        if (this.isInputValid === undefined) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.isInputValid = this.checkTextValidity();
        }
        console.log(this.isErrorFromFlow);
        console.log(this.isInputValid);
        if (this.isErrorFromFlow === false && this.isInputValid === true) {
           // console.log('c1');
            if (
                this.disableInput === true ||
                (this.valueEntered !== '' && typeof this.valueEntered !== 'undefined') ||
                ((this.valueEntered === '' || typeof this.valueEntered === 'undefined') && this.isRequiredField === false)
            ) {
                console.log('1');
                this.isErrorFromFlow = false;
                return { isValid: true };
            }
        }
        this.isErrorFromFlow = true;
        return {
            isValid: false,
            errorMessage: ''
        };
    }
    }
