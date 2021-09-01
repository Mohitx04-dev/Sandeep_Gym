import React, { useState, useEffect } from "react";
import axios from "axios";
import date from "date-and-time";
import PTform from '../util/PTform';
import SuccessModal from '../../util/success-modal';
import ErrorModal from '../../util/error-modal';
export default function UpdatePT(props) {
  const [Memberid, setMemberId] = useState(0);
  const [sucModalShow, setsucModalShow] = useState(false)
  const [errModalShow, seterrModalShow] = useState(false)
    var mid = window.location.pathname.split("/");
    mid = mid[3];
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
      }
    const [Userdt, setUserdt] = useState();
    useEffect(() => {
        axios.get('/api/PT/'+mid,{headers:headers})
    .then(response => 
        {
            setUserdt(response.data);
        }).catch((error) => {
            console.log('Error')
        })
    },[])
    if(Userdt) {
        const onSubmit = async (event) => {
            event.preventDefault(); // Prevent default submission
            const Article = {
                Name : event.target[0].value,
                Cust_Id : event.target[1].value,
                Branch : event.target[2].value,
                Trainer : event.target[3].value,
                StartDate : event.target[4].value,
                EndDate: event.target[5].value,
                Fees : event.target[6].value
            }
            console.log(Article)
            try {   
                axios
                .put("/api/PT/"+mid, Article,{headers:headers})
                .then((response) => setMemberId(response.data.id))
                .then((response)=>{
                    console.log(response)   
                    setsucModalShow(true)
                })
                .catch((error) => {
                    console.log(error)
                    seterrModalShow(true)
                })
            }   
            catch (e) {
                alert(`Entry failed! ${e.message}`);
                seterrModalShow(true)
              }
  }
  return (  
    <>
           <PTform User={props.User} Member = {Userdt} onSubmit = {onSubmit}/>
           <SuccessModal show={sucModalShow} redirect={()=> window.location.href="/PT/view"}
            onClose={()=>{
                setsucModalShow(false)
            }}
            ></SuccessModal>
            <ErrorModal show={errModalShow}  redirect={()=> seterrModalShow(false)}
            onClose={()=>{
                seterrModalShow(false)
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
