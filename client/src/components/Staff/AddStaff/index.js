import React, { useState, useEffect } from 'react';
import {Form,Button} from 'react-bootstrap'
import axios from 'axios'
import BranchSelector from '../../Members/utility/BranchSelector';
import ErrorModal from '../../util/error-modal';
import SuccessModal from '../../util/success-modal';
import toInputUppercase from '../../util/Caps';

export default function AddStaff(props) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
      }
    const [StaffId,setStaffId] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [sucModalShow, setsucModalShow] = useState(false)
      const onSubmit = (e) => {
        e.preventDefault();
        const article = { 
        Name: e.target[0].value,
        Branch: e.target[1].value,
        Salary: e.target[2].value,
        DOJ: new Date(e.target[3].value.valueOf()),
        Aadhar_No: e.target[4].value,
        DOB : new Date(e.target[5].value.valueOf()),
         };
        axios.post('/api/staff', article,{headers:headers})
            .then(response => setStaffId(response.data.id)).then(()=>{
              setsucModalShow(true)
            })
            .catch((e)=>{
                setModalShow(true)
            })
            ;

        console.log(article)
}
return (
    <>
    <Form onSubmit={onSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Name of Employee</Form.Label>
        <Form.Control type="text" placeholder="Enter Name "onInput={toInputUppercase}/>
        <BranchSelector User={props.User} />
        <Form.Label>Salary</Form.Label>
        <Form.Control type="number" placeholder="Enter Salary "/>
        <Form.Label>Date of Joining</Form.Label>
        <Form.Control type="date" placeholder="Enter DOJ "/>
        <Form.Label>Aadhar</Form.Label>
        <Form.Control type="number" placeholder="Enter Aadhar "/>
        <Form.Label>DOB</Form.Label>
        <Form.Control type="date" placeholder="Enter DOB "/>
    </Form.Group>
    <Button variant="primary" type="submit">
        Submit
    </Button>
    </Form>
    <ErrorModal show={modalShow} redirect={()=>{window.location.href = '/staff/view'}}
         onClose={()=>{
           setModalShow(false)
         }}
         ></ErrorModal>
         

         <SuccessModal show={sucModalShow} redirect={()=> window.location.href="/staff/view"}
            onClose={()=>{
                setsucModalShow(false)
            }}
            ></SuccessModal>
    </>
)
}