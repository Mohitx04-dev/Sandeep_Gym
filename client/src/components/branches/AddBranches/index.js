import React, { useState, useEffect } from 'react';
import {Form,Button} from 'react-bootstrap'
import axios from 'axios'
import SuccessModal from '../../util/success-modal';
import ErrorModal from '../../util/error-modal';
import toInputUppercase from '../../util/Caps';

export default function AddBranches(props) {
    const [BranchId,setBranchId] = useState(0);
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.role=='user'? props.User.branch : null
      }
     const Sub =  async (e) => {
            e.preventDefault();
            const article = { 
            Name: e.target[0].value,
            Payments: [],
            Total: 0
             };
            console.log(article)
            await axios.post('/api/branch', article,{headers:headers})
             .then(async()=> await setsucModalShow(true))
            .catch((e)=>{
                seterrModalShow(true)
            })
    }
    console.log(sucModalShow)
    return (
        <>
        <Form onSubmit={Sub}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name of New Branch</Form.Label>
            <Form.Control type="text"  onInput={toInputUppercase}  placeholder="Enter Name " />
        </Form.Group>
        <SuccessModal show={sucModalShow} redirect={()=> window.location.href="/Branches/show"}
            onClose={()=>{
                setsucModalShow(false)
            }}
            ></SuccessModal>
            <ErrorModal show={errModalShow}  redirect={()=> seterrModalShow(false)}
            onClose={()=>{
                seterrModalShow(false)
            }}
            ></ErrorModal>
        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
        
        </>
    )
}