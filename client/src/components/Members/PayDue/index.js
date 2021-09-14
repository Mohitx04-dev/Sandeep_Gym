import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import PayField from "../utility/PayUtil";
import PayHist from "../utility/PaymentHistory";
import SuccessModal from "../../util/success-modal";
import ErrorModal from "../../util/error-modal";

function PayDue(props) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': props.User.token,
    'branch' : props.User.branch
}
  var params = window.location.pathname.split("/");
  var mid = params[2];
  var txid = params[3];
  const [Paymentdt, setPaymentdt] = useState(null);
  const [Userdt, setUserdt] = useState();
  const [Loading, setLoading] = useState(1);
  const [Response, setResponse] = useState({});
  const [sucModalShow, setsucModalShow] = useState(false)
  const [errModalShow, seterrModalShow] = useState(false)

  useEffect(() => {
    axios
      .get("/api/member/" + mid + "/" + txid,{headers:headers})
      .then((response) => {
        console.log(response.data.Payment);
        setPaymentdt(response.data.Payment);
        axios
          .get("/api/member/" + mid,{headers:headers})
          .then((response) => {
            setUserdt(response.data);
          })
          .then(() => {
            setLoading(0);
          })
          .catch((error) => {
            console.log("Error");
          });
      })
      .catch((error) => {});
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const pay = {
      Date: event.target[2].value,
      Total: event.target[3].value,
      Paid: event.target[4].value,
      Due: event.target[5].value,
      Comments: event.target[6].value,
      PayMethod : event.target[7].value,
      DueDate : event.target[8].value
    };
    const UpdateDue = {
      Due: 0,      
      pay : pay,
      BranchName : Userdt.Branch,
      PayBr : {
        Date: event.target[2].value,
        Customer_Name: Userdt.Name,
        Amount: event.target[4].value,
        Cust_Id: Userdt.Cust_Id,
        PayMethod : event.target[7].value,
        DueDate : event.target[8].value
      }
    };
    console.log("/api/member/" + mid + "/" + txid);

    
    try {
      axios.put(
        "/api/member/" + mid + "/" + txid,
        UpdateDue,{headers:headers}).then(()=>{
          setsucModalShow(true)
        }).catch((e)=>{
          seterrModalShow(true)
        })
    } catch (e) {
      alert(`Payment failed! ${e.message}`);
      seterrModalShow(false)
    }
  };
  function Selecter(props) {
    return (
      <>
        <Form.Label>{props.Name}</Form.Label>
        <Form.Control
          type={props.Type}
          defaultValue={Userdt ? Userdt[props.field] : null}
          placeholder={props.placeholder}
        />
      </>
    );
  }

  if (Loading) {
    return (
      <>
        <p>Loading</p>
      </>
    );
  } else {
    console.log(Paymentdt[0].Due);
    return (
      <div>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Selecter
              Name="Member Id"
              Type="string"
              field="Cust_Id"
              placeholder="Enter CustId"
            />
            <Selecter
              Name="Name"
              Type="string"
              field="Name"
              placeholder="Enter Name"
            />

            <PayField Due={Paymentdt[0].Due} Comment={Paymentdt[0]._id} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

            <SuccessModal show={sucModalShow} redirect={()=> window.location.href="/member/extend/"+Userdt.Cust_Id}
            onClose={()=>{
                setsucModalShow(false)
            }}
            ></SuccessModal>
            <ErrorModal show={errModalShow}  redirect={()=> seterrModalShow(false)}
            onClose={()=>{
                seterrModalShow(false)
            }}
            ></ErrorModal>
      </div>
    );
  }
}

export default PayDue;
