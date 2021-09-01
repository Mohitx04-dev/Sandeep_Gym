import React from 'react'
import { Form, Button } from "react-bootstrap";


 function getFormattedDate(date) {
    date = new Date(date);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }

function PayField(prop) {
    function PaySelector(payprop) {
        if(prop.Member){ 
         var Field = payprop.field;
         var Pay = prop.Member['Payment'][0];
         if(Field=='Date') {
             Field = Pay.Date;
             Field=getFormattedDate(Field);
         } else if(Field=='Total') {
             Field=Pay.Total;
         } else if(Field=='Paid') {
             Field=Pay.Paid;
         }else if(Field=='Due'){
             Field=Pay.Due;
         }else if(Field=='Comments'){
           Field=Pay.Comments;
         }else if(Field=='PayMethod'){
           Field=Pay.PayMethod
         }
     }
         return (
             <>
               <Form.Label>{payprop.Name}</Form.Label>
               <Form.Control type={payprop.Type} defaultValue={prop.Member?Field: (payprop.isDue? payprop.isDue : ((payprop.field=="Comments"&&prop.Comment) ? (prop.Comment).substr(18,24) : null))} placeholder={payprop.placeholder} disabled={prop.Editable==false?true:((payprop.isDue? payprop.isDue : false))} />
             </>
           );
     }
    
    return (
        <div>   
                <PaySelector
                Name="Date"
                Type="date"
                placeholder="Enter Date of Birth"
                field="Date"
                />
                <PaySelector
                Name="Total"
                Type="number"
                placeholder="Enter Total"
                field="Total"
                isDue={prop.Due ? prop.Due : null}

                />
                <PaySelector
                Name="Paid"
                Type="number"
                placeholder="Enter Paid Amount"
                field="Paid"

                />
                <PaySelector
                Name="Due"
                Type="number"
                placeholder="Enter Due Amount"
                field="Due"
                />
                  <PaySelector
                Name="Comments"
                Type="text"
                placeholder="Enter Comments"
                field="Comments"
                />
                  <PaySelector
                Name="Payment Method"
                Type="text"
                placeholder="Enter Payment Method"
                field="PayMethod"
                />
        </div>
    )
}

export default PayField
