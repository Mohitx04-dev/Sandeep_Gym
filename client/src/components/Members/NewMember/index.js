import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MemberForm from "../utility/Member_form";
import axios from "axios";
import date from "date-and-time";
import SuccessModal from "../../util/success-modal";
import ErrorModal from "../../util/error-modal";
import ProfileImg from "../utility/profileImg";

function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}
function addDays(req, days) {
  var ms = new Date(req).getTime() + (days - 1) * 86400000;
  return new Date(ms);
}

export default function AddMember(props) {
  const [sucModalShow, setsucModalShow] = useState(false);
  const [errModalShow, seterrModalShow] = useState(false);
  const [MemberId, setMemberId] = useState(0);
  const [url,setUrl] = useState("")
  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.branch,
  };
  const Sub = (e)=> {
    e.preventDefault();
    var Arr = [];
    const Pay = {
      Date: e.target[24].value,
      Total: e.target[25].value,
      Paid: e.target[26].value,
      Due: e.target[27].value,
      Comments: e.target[28].value,
      PayMethod: e.target[29].value,
      DueDate : e.target[30].value
    };

    Arr.push(Pay);
    var Month = e.target[11].value;
    var Days = e.target[12].value;
    var Validity = new Date(e.target[14].value.valueOf());
    Validity = addMonths(Validity, Month);
    console.log(Validity);
    Validity = addDays(Validity, Days);
    console.log(Validity);
    const article = {
      Cust_Id: e.target[0].value,
      Name: e.target[1].value,
      Branch: e.target[2].value,
      Age: e.target[4].value,
      PRN: e.target[3].value,
      Gender: e.target[5].value,
      Weight: e.target[6].value,
      Height: e.target[7].value,
      DOB: e.target[8].value,
      DOR: e.target[9].value,
      Address: e.target[10].value,
      Valid_Till: Validity,
      Aadhar: e.target[13].value,
      DOJ : e.target[14].value,
      Contact_No: e.target[15].value,
      Injury: e.target[16].value,
      Occupation: e.target[17].value,
      Reference: e.target[18].value,
      Service: e.target[19].value,
      Workout_Choice: e.target[20].value,
      Payment: Arr,
      CounselledBy: e.target[21].value,
      JoinedBy: e.target[22].value,
      Time: e.target[23].value,
      BranchName: e.target[2].value,
      PayBr: {
        Date: e.target[24].value,
        Customer_Name: e.target[1].value,
        Amount: e.target[26].value,
        Cust_Id: e.target[0].value,
        PayMethod: e.target[29].value,
        DueDate : e.target[30].value
      },
      url : url
    };
    console.log(article)
    axios
      .post("/api/member", article, { headers: headers })
      .then((response) => setMemberId(response.data.id))
      .then(() => {
        setsucModalShow(true);
      })
      .catch((e) => {
        seterrModalShow(true);
      });
  }
  return (
    <>
    <ProfileImg setUrl = {setUrl}/>
      <Form
        onSubmit={Sub}
      >
        <MemberForm User={props.User} />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <SuccessModal
        show={sucModalShow}
        redirect={() => (window.location.href = "/member/view")}
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
    </>
  );
}
