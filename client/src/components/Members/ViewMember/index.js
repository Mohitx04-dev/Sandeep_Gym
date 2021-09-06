import React, { useState, useEffect } from 'react';
import {Form, Table ,Button } from 'react-bootstrap';
import axios from 'axios'
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import DeleteModal from '../../util/delete-modal';
import dateFormat from 'dateformat';



export default function ViewMembers(props) {

    const [Member, setMember] = useState([]);
    const [Branch, setBranch] = useState([])
    const [CurrentBranch, setCurrentBranch] = useState()
    const [modalShow, setModalShow] = useState(false);
    const [req, setreq] = useState(false);
    const [toDelete,settoDelete] = useState("");

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
    }
      function getMembers(member) {
          if(member.Branch==CurrentBranch) {
            return member
          }
          else {
            return null;
          }
      }
    function getData() {
      const CheckValidity = { 
        date : Date.now()
      }
      axios.put('/api/validateUp/',CheckValidity)
      .then(() => {
        console.log("Successfully Validated");
      }).then(()=>{
        axios.put('/api/validateDown/',CheckValidity).then(()=>{
          console.log('Done')
        })
        axios.get('/api/member/',{headers:headers})
        .then(response => 
            {
            for (var i = 0; i < response.data.length; i++) {
                setMember(state => [...state, response.data[i]])
            }
            });
      })
  }
      useEffect(() => {
          getData();
  
                
      }, []);
    return (
        <>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                var newArray = Member.filter(function (el) {
                  var current_date = dateFormat(el.Valid_Till, "isoDate");
                  return current_date <= e.target[0].value;
                });
                setMember(newArray);
              }}
            >
              <Form.Label>Enter Date</Form.Label>
              <Form.Control type="date" placholder="Enter Date of Txn" />
              <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
              </Button>
            </Form>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                var newArray = Member.filter(function (el) {
                  return el.Name.match(e.target[0].value);
                });
                setMember(newArray);
              }}
            >
              <Form.Label>Enter Name</Form.Label>
              <Form.Control type="text" placholder="Enter Name" />
              <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
              </Button>
            </Form>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                var newArray = Member.filter(function (el) {
                  return el.Contact_No ? String(el.Contact_No).match(e.target[0].value) :  null
                });
                setMember(newArray);
              }}
            >
              <Form.Label>Enter Phone Id</Form.Label>
              <Form.Control type="number" placholder="Enter Name" />
              <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
              </Button>
            </Form>
            
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>DOJ</th>
      <th>Branch</th>
      <th>Valid Till</th>
      <th>Extend Validity</th>
      <th>View</th>
      <th>Update</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
  {Member.map(mem=>{
    if(getMembers(mem) || (CurrentBranch==null)) {
      console.log(mem.Contact_No)
      return(
        <tr key={mem.Cust_Id}>
        <td>{mem.Cust_Id}</td>
        <td>{mem.Name}</td>
        <td><Timestamp date={mem.DOJ}/></td>
        <td>{mem.Branch}</td>
        <td>{mem.Active ?<Timestamp date={mem.Valid_Till} />: <p className="text-danger font-weight-bold">Expired on <Timestamp date={mem.Valid_Till} /></p>} </td>
        <td>
             <Link to={"/member/extend/"+mem.Cust_Id + "/" + (!mem.Active ? "Renew" : '')} className={" btn " + (mem.Active ?  " btn-success " : " btn-danger ")}>{mem.Active ? "Extend" : "Renew"}</Link></td>
             <td>
             <Link to={"/member/"+mem.Cust_Id} className="btn btn-primary">View</Link></td>
             <td>
             <Link to={"/member/update/"+mem.Cust_Id} className="btn btn-info">Update</Link></td>
             <td>
               <Button variant="danger" onClick={() => {setModalShow(true) 
                settoDelete(mem.Cust_Id)}}>
       Delete
      </Button>
          </td>
      
      </tr>
      
      )
    }

})
}
<DeleteModal show={modalShow}
        reqDelete={() => {
            axios
            .delete('/api/member/'+toDelete,{headers:headers})
            .then(()=>{
              alert('Deleted Member')
              window.location.href = '/member/view'
            })
            .catch((e)=>{console.log(e)})
          }} 
          onClose={()=>{
            setModalShow(false)
          }}
          ></DeleteModal>
  </tbody>
</Table>
        </>
    )
}
