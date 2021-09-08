import React, { useState, useEffect } from 'react';
import { Table,Button } from 'react-bootstrap';
import axios from 'axios'
import Landing from '../../main/Landing';
import ErrorModal from '../../util/error-modal';
import SuccessModal from '../../util/success-modal';
import DeleteModal from '../../util/delete-modal';
import { useHistory } from 'react-router-dom';

export default function ShowBranches(props) {
    const [Branches, SetBranches] = useState([]);
    const [errmodalShow, seterrModalShow] = useState(false);
    const [sucmodalShow, setsucModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [toDelete,settoDelete] = useState("");
    const [req, setreq] = useState(false);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': props.User.token,
      'branch' : props.User.branch
    }
    function getData() {
    axios.get('/api/branch',{headers : headers})
        .then(response => 
         { 
            for (var i = 0; i < response.data.length; i++) {
              SetBranches((state) => [...state, response.data[i]]);
        } 
      })
    } 
     useEffect(() => {
                getData();
    }, []);
    let history = useHistory();

function ShowBranchData(prop) {
  const redirect = () => {
    history.push('/branches/branch-edit/'+prop.mem.Name)
  }
  return (
    <tr>
    <td>{prop.mem.Name}</td>
    <td> <Button variant="warning" onClick={redirect}>
      Edit
     </Button>
     </td>
    <td> <Button variant="danger" onClick={() => {setDeleteModalShow(true) 
      settoDelete(prop.mem.Name)}}>
      Delete
     </Button>
     </td>
  </tr>
  )
}
    if(Branches)
    return (
        <>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Edit</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
  {Branches.map(mem=> <ShowBranchData mem={mem}/>)}
  </tbody>
</Table>
<DeleteModal show={DeleteModalShow}
       reqDelete={() => {
           axios
           .delete('/api/branch/'+toDelete,{headers:headers})
           .then(()=>{
             setsucModalShow(true)
           })
           .catch((e)=>{
            seterrModalShow(true)
            console.log(e)})
         }} 
         onClose={()=>{
          setDeleteModalShow(false)
         }}
         ></DeleteModal>
<ErrorModal show={errmodalShow} redirect={()=>{window.location.href = '/branches/show'
}}
onClose={()=>{
  seterrModalShow(false)
}}
></ErrorModal>
<SuccessModal show={sucmodalShow} redirect={()=>{window.location.href = '/branches/show'
}}
onClose={()=>{
  setsucModalShow(false)
}}
></SuccessModal>
        </>
    )
    else return(
      <Landing />
    )
}
