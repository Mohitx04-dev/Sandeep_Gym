import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios'
import Timestamp from 'react-timestamp';
import ErrorModal from '../../util/error-modal';
import DeleteModal from '../../util/delete-modal';
import SuccessModal from '../../util/success-modal';
import Landing from '../../main/Landing';
export default function ViewStaff(props) {
  const [errmodalShow, seterrModalShow] = useState(false);
  const [sucmodalShow, setsucModalShow] = useState(false);
  const [DeleteModalShow, setDeleteModalShow] = useState(false);
  const [toDelete,settoDelete] = useState("")
  const [Err,setErr] = useState("")
  console.log(props)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': props.User.token,
      'branch' : props.User.branch
    }
    const [Staff, setStaff] = useState([]);
    function getData() {
    axios.get('/api/staff',{headers:headers})
        .then(response => 
            {
            for (var i = 0; i < response.data.length; i++) {
                setStaff(state => [...state, response.data[i]])
            }
            }).
            catch((err)=>{
              setErr('Error')
            }) 
          }
            console.log(Staff)
     useEffect(() => {
                getData();
    }, []);

    const reqDelete = () => {
      axios.delete('/api/staff/'+toDelete, {headers : headers})
      .then(res => {
          console.log(res.data);
          setsucModalShow(true);
      })
      .catch((err) => {
          console.log(err);
          seterrModalShow(true);
      })
    }

    if(Err!='Error')  {
    return (
        <>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Branch</th>
      <th>Salary</th>
      <th>DOJ</th>
      <th>Aadhar</th>
      <th>DOB</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
  {Staff.map(curStaff=>{
  
    return(
     <tr>
     <td>{curStaff.Name}</td>
     <td>{curStaff.Branch}</td>
     <td>{curStaff.Salary}</td>
     <td><Timestamp date={curStaff.DOJ} /></td>
     <td>{curStaff.Aadhar_No}</td>
     <td><Timestamp date={curStaff.DOB} /></td>
     <td><Button variant="danger" onClick={()=>{setDeleteModalShow(true)
     settoDelete(curStaff._id)
    }}>Delete</Button></td>
     <DeleteModal show={DeleteModalShow} reqDelete={reqDelete}
      onClose={()=>{
        setDeleteModalShow(false)
      }}
      ></DeleteModal>
   </tr>)
})
}
  </tbody>
</Table>

<ErrorModal show={errmodalShow} redirect={()=>{window.location.href = '/staff/view'}}
onClose={()=>{
  seterrModalShow(false)
}}
></ErrorModal>
<SuccessModal show={sucmodalShow} redirect={()=>{window.location.href = '/staff/view'}}
onClose={()=>{
  setsucModalShow(false)
}}
></SuccessModal>
        </>
    )
}
else {
  return (
    <Landing />
  )
}
}
