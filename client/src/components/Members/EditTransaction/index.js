import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import PayField from "../utility/PayUtil";
import SuccessModal from "../../util/success-modal";
import ErrorModal from "../../util/error-modal";
function EditTxn(props) {
  const [sucModalShow, setsucModalShow] = useState(false);
  const [errModalShow, seterrModalShow] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.branch,
  };
  var params = window.location.pathname.split("/");
  var mid = params[2];
  var txid = params[3];
  console.log(mid,txid)
  const [Userdt, setUserdt] = useState();
  const [Pay, setPay] = useState({})
  useEffect(() => {
    axios
      .get("/api/member/" + mid, { headers: headers })
      .then((response) => {
        setUserdt(response.data);
      })
      .catch((error) => {
        console.log("Error");
      });
      axios.get('/api/member-txn/'+mid+'/'+txid,{headers : headers})
      .then((data)=>{
          console.log(data.data)
          setPay(data.data)
      }).catch((error)=>{
          console.log('error')
      })
    }, []);
  const sub = (e) => {
    e.preventDefault();
    var Article = {
        Date: e.target[0].value,
        Total: e.target[1].value,
        Paid: e.target[2].value,
        Due: e.target[3].value,
        Comments: e.target[4].value,
        PayMethod: e.target[5].value,
        BranchName: Userdt.Branch,
        Customer_Name: Userdt.Name,
        Amount: e.target[2].value,
        Cust_Id: Userdt.Cust_Id,
        DueDate : e.target[6].value
    };
    console.log(Article)
    axios
      .put("/api/member-txn/"+mid+'/'+txid, Article, { headers: headers })
      .then(() => {
        setsucModalShow(true);
      })
      .catch((error) => {
        seterrModalShow(true);
      });
  };
  return (
    <div>
      <Form onSubmit={sub}>
        <Form.Group>
          <PayField Member={Userdt} txn={Pay} headers={headers}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <SuccessModal
        show={sucModalShow}
        redirect={() =>
          (window.location.href = "/member/extend/" + Userdt.Cust_Id)
        }
        onClose={() => {
          setsucModalShow(false);
        }}
      ></SuccessModal>
      <ErrorModal
        show={errModalShow}
        redirect={() => seterrModalShow(false)}
        onClose={() => {
          seterrModalShow(false);
        }}
      ></ErrorModal>
    </div>
  );
}

export default EditTxn;
