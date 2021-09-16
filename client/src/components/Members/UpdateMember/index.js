import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MemberForm from "../utility/Member_form"
import axios from "axios";
import date from "date-and-time";
import ProfileImg from "../utility/profileImg";
import SuccessModal from "../../util/success-modal";
import ErrorModal from "../../util/error-modal";
function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}
export default function UpdateMember(props) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
    }
    const [sucModalShow, setsucModalShow] = useState(false);
    const [errModalShow, seterrModalShow] = useState(false);
  const [Memberid, setMemberId] = useState(0);
  const [url,setUrl] = useState("")
    var mid = window.location.pathname.split("/");
    mid = mid[3];
    const [Userdt, setUserdt] = useState();
    useEffect(() => {
        axios.get('/api/member/'+mid,{headers:headers})
    .then(response => 
        {
            setUserdt(response.data);
        }).catch((error) => {
            console.log('Error')
        })
    },[])
    if(Userdt) {
  const Sub = (e) => {
    e.preventDefault()
    const article = {
      Cust_Id: e.target[0].value,
      Name: e.target[1].value,
      Branch: e.target[2].value,
      PRN: e.target[3].value,
      Age: e.target[4].value,
      Gender: e.target[5].value,
      Weight: e.target[6].value,
      Height: e.target[7].value,
      DOB: e.target[8].value,
      DOR: new Date(e.target[9].value.valueOf()),
      Address: e.target[10].value,
      Aadhar: e.target[11].value,
      DOJ: new Date(e.target[12].value.valueOf()),
      Contact_No: e.target[13].value,
      Injury: e.target[14].value,
      Occupation: e.target[15].value,
      Reference: e.target[16].value,
      Service: e.target[17].value,
      Workout_Choice: e.target[18].value,
      CounselledBy : e.target[19].value,
      JoinedBy : e.target[20].value,
      Time : e.target[21].value,
      url : url
    };
    axios
      .put("/api/member/"+mid, article,{headers:headers})
      .then((response) => setMemberId(response.data.id))
      .then(() => {
        setsucModalShow(true);
      }).catch((e) => {
        seterrModalShow(true);
      });
  }
  return (  
    <>
    <ProfileImg setUrl = {setUrl} />
      <Form
        onSubmit={Sub}
      >
      <MemberForm Member={Userdt} User={props.User} EditPay={false} Editable={true} />
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
  ); }
  else {
      return (
          <p>Not Found</p>
      )
  }
}
