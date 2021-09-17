import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import toInputUppercase from "../../../util/Caps";

function getFormattedDate(date) {
  date = new Date(date);
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return year + "-" + month + "-" + day;
}
function getTime(date){
  if(date==null) {
    return null
  } 
  else {
    var date = new Date(date);
  
    var year = date.getFullYear();
    var month = (date.getMonth() +1);
    var day = date.getDate();
    
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    
    return formateTime(year, month, day, hour, minute, second);
  }
}

function formateTime(year, month, day, hour, minute, second){
  return makeDoubleDigit(year) + "-" + 
         makeDoubleDigit(month) + "-" + 
         makeDoubleDigit(day) + "T" + 
         makeDoubleDigit(hour) + ":" + 
         makeDoubleDigit(minute) + ":" + 
         makeDoubleDigit(second);
}

function makeDoubleDigit(x){
  return (x < 10) ? "0" + x : x;
}
function PayField(prop) {
  var Pay;
  if (prop.Member && prop.First) {
    Pay = prop.Member["Payment"][0];
  } else if (prop.Member && prop.txn) {
    Pay = prop.txn;
  } else {
    Pay = "Due"
  }
  console.log(prop.Member);
  console.log(Pay);
  function PaySelector(payprop) {
    var Field = payprop.field;
    console.log(payprop.Pay[payprop.field])
    return (
      <>
        <Form.Label>{payprop.Name}</Form.Label>
        <Form.Control
          type={payprop.Type}
          defaultValue={
            (prop.Member && payprop.Type == "datetime-local")
              ? getTime(payprop.Pay[payprop.field])
              : prop.Member
              ? payprop.Pay[payprop.field]
              : payprop.isDue
              ? payprop.isDue
              : (payprop.field == "Comments" && prop.Comment)
              ? prop.Comment.substr(18, 24)
              : null
          }
          placeholder={payprop.placeholder}
          disabled={
            (prop.Editable == false)
              ? true
              : payprop.isDue
              ? payprop.isDue
              : false
          }
          onInput={toInputUppercase}
        />
      </>
    );
  }
if(Pay) {
  return (
    <div>
      <PaySelector
        Name="Date"
        Type="datetime-local"
        placeholder="Enter Date"
        field="Date"
        Pay={Pay}
      />
      <PaySelector
        Name="Total"
        Type="number"
        placeholder="Enter Total"
        field="Total"
        isDue={prop.Due ? prop.Due : null}
        Pay={Pay}

      />
      <PaySelector
        Name="Paid"
        Type="number"
        placeholder="Enter Paid Amount"
        field="Paid"
        Pay={Pay}

      />
      <PaySelector
        Name="Due"
        Type="number"
        placeholder="Enter Due Amount"
        field="Due"
        Pay={Pay}

      />
      <PaySelector
        Name="Comments"
        Type="text"
        placeholder="Enter Comments"
        field="Comments"
        Pay={Pay}

      />
      <PaySelector
        Name="Payment Method"
        Type="text"
        placeholder="Enter Payment Method"
        field="PayMethod"
        Pay={Pay}

      />
      <PaySelector
        Name="Date for Due Payment"
        Type="datetime-local"
        placeholder="Enter Date"
        field="DueDate"
        Pay={Pay}

      />
    </div>
  );
}
else{ 
  return (
    <>
    Loading
    </>
  )
}
  
}

export default PayField;
