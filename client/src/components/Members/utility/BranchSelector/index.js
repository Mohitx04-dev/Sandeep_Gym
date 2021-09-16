

import React , {useState, useEffect} from 'react'
import {Form} from 'react-bootstrap'
import axios from "axios";

function BranchSelector(prop) {
    const [Branches, setBranches] = useState([]);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': prop.User.token,
        'branch' : prop.User.role=='user'? prop.User.branch : null
    }
    function getData() {
    axios.get("/api/branch",{headers:headers}).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                setBranches((state) => [...state, response.data[i].Name]);
                } 
    });
}
    useEffect(() => {
    getData();
    }, []);
        return (
            <>
            <Form.Label className="Font">Name of Branch</Form.Label>
            <Form.Control as="select" defaultValue={prop.Member ? prop.Member.Branch : (prop.user ? prop.user.branch : null)} >
              {
              Branches.map((br) => {
                return <option key={br}  selected={(prop.Member && prop.Member.Branch==br)||(prop.user && prop.user.branch==br) ? true : false} value={br}>{br}</option>;
              })
              }
            </Form.Control>
            </>
        )
    }



export default BranchSelector
