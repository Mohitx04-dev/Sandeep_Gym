import React, { useState, useEffect } from 'react';
import {Form, Table ,Button ,ButtonGroup} from 'react-bootstrap';
import axios from 'axios'
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import DeleteModal from '../../util/delete-modal';
import BranchSelector from '../utility/BranchSelector';
import dateFormat from 'dateformat';
export default function Reports(props) {
    
    const [Member, setMember] = useState([]);
    const [Branch, setBranch] = useState([])
    const [CurrentBranch, setCurrentBranch] = useState()
    const [modalShow, setModalShow] = useState(false);
    const [req, setreq] = useState(false);
    const [toDelete,settoDelete] = useState("");
    const [viewType, setviewType] = useState(0)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
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
        <div  className="text-center">
            <h3>
                View Reports
            </h3>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(viewType)
              }}
            >
        <ButtonGroup aria-label="Basic example">
        <Button variant="secondary" type="submit" onClick={()=>setviewType(0)}>Validity</Button>
        <Button variant="secondary"  type="submit" onClick={()=>setviewType(1)}>Due Payment</Button>
        </ButtonGroup>
        </Form>
        </div>
        {viewType==0 ? 
               <div>
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
                    return el.Branch == e.target[0].value;
                  });
                  setMember(newArray);
                 }}
               >
                 <BranchSelector User={props.User} />
                 <Button className="p-2 my-2" variant="primary" type="submit">
                 Filter
                 </Button>
               </Form>
         <Table striped bordered hover>
     <thead>
       <tr>
         <th>Id</th>
         <th>Name</th>
         <th>Valid Till</th>
       </tr>
     </thead>
     <tbody>
     {Member.map(mem=>{
         return(
           <tr key={mem.Cust_Id}>
           <td>{mem.Cust_Id}</td>
           <td>{mem.Name}</td>
           <td>{mem.Active ?<Timestamp date={mem.Valid_Till} />: <p className="text-danger font-weight-bold">Expired on <Timestamp date={mem.Valid_Till} /></p>} </td>
         </tr>
         
         )
   })
   }
     </tbody>
   </Table>
   </div>
 : <div>
     <Form
                 onSubmit={(e) => {
                   e.preventDefault();
                   console.log(e.target[0].value);
                   var newArray = Member.filter(function (el) {
                    return el.Branch == e.target[0].value;
                  });
                  setMember(newArray);
                 }}
               >
                 <BranchSelector User={props.User} />
                 <Button className="p-2 my-2" variant="primary" type="submit">
                 Filter
                 </Button>
               </Form>
 <Table striped bordered hover>
     <thead>
       <tr>
         <th>Id</th>
         <th>Name</th>
         <th>Total Due</th>
       </tr>
     </thead>
     <tbody>
     {Member.map(mem=>{
         var due=0;
         console.log(mem.Payment[0])
         for(var x=0; x<mem.Payment.length; x++) {
             var temp = mem.Payment[x].Due;
             due += parseFloat(temp)
         }
         if(due==0) {
            return null
         }
         else {
            return(
                <tr key={mem.Cust_Id}>
                <td>{mem.Cust_Id}</td>
                <td>{mem.Name}</td>
                <td>{due}</td>
              </tr>
              
              )
         }
        
   })
   }
   <DeleteModal show={modalShow}
           reqDelete={() => {
               axios
               .delete('http://localhost:3000/api/member/'+toDelete,{headers:headers})
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
 </div>   
        }
     
        </>
    )
}
