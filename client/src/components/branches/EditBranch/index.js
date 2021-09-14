import React, { useState, useEffect } from 'react';
import {Form,Button} from 'react-bootstrap'
import axios from 'axios'
import SuccessModal from '../../util/success-modal';
import ErrorModal from '../../util/error-modal';
import toInputUppercase from '../../util/Caps';
export default function EditBranchName(props) {
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)
    var params = window.location.pathname.split("/");
    var mid = params[3];
    mid = decodeURI(mid)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.role=='user'? props.User.branch : null
      }
     const Sub =  async (e) => {
            e.preventDefault();
            const article = {
                BranchName : e.target[0].value
            }
            await axios.put('/api/branch-edit/'+mid, article,{headers:headers})
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
            <Form.Label>Name of Branch</Form.Label>
            <Form.Control type="text"  onInput={toInputUppercase} placeholder="Enter Name" defaultValue={mid} />
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