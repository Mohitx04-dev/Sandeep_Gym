import React, {useState} from 'react'
import axios from 'axios'
import PTform from '../util/PTform';
import SuccessModal from '../../util/success-modal';
import ErrorModal from '../../util/error-modal';
function AddPT(props) {
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
      }
    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default submission
        const Article = {
            Name : event.target[0].value,
            Cust_Id : event.target[1].value,
            Branch : event.target[2].value,
            Trainer : event.target[3].value,
            StartDate : new Date(event.target[4].value.valueOf()),
            EndDate: new Date(event.target[5].value.valueOf()),
            Fees : event.target[6].value
        }
        var url = '/api/PT'
        try {
           await axios
            .post(url,Article,{headers:headers})
            .then((response)=>{
                console.log(response)   
                setsucModalShow(true)
            })
            .catch((error) => {
                console.log(error)
                seterrModalShow(true)
            })
       
        } catch (e) {
          alert(`Entry failed! ${e.message}`);
        }
      }
 
    return (
        <div>
           <PTform User={props.User} onSubmit = {onSubmit}/>
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
        </div>
    )
}

export default AddPT
