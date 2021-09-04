import React, { useState, useEffect } from 'react';
import {Form, Table ,Button ,ButtonGroup} from 'react-bootstrap';
import axios from 'axios'
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import DeleteModal from '../../util/delete-modal';
import BranchSelector from '../utility/BranchSelector';
import dateFormat from 'dateformat';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';



export default function Reports(props) {
    
    const [Member, setMember] = useState([]);
    const [MemberFilter,setMemberFilter] = useState([])
    const [Branch, setBranch] = useState([])
    const [CurrentBranch, setCurrentBranch] = useState()
    const [modalShow, setModalShow] = useState(false);
    const [req, setreq] = useState(false);
    const [toDelete,settoDelete] = useState("");
    const [viewType, setviewType] = useState(0)
    const [startDate, setstartDate] = useState()
    const [endDate, setendDate] = useState()
    const [focusedInput,setfocusedInput] = useState()

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
                setMemberFilter(state => [...state, response.data[i]])
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
                   console.log(startDate._d,endDate._d)
                   var newArray = Member.filter(function (el) {
                     var current_date = dateFormat(el.Valid_Till, "isoDate");
                     var sd = dateFormat(startDate._d, "isoDate");
                     var ed = dateFormat(endDate._d, "isoDate");
                     return( current_date <= ed && current_date >=sd);
                   });
                   setMemberFilter(newArray);
                 }}
               >
                 <DateRangePicker
                    startDate={startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => {
                      setMemberFilter(Member)
                      setstartDate(startDate)
                       setendDate(endDate)}} // PropTypes.func.isRequired,
                    focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => setfocusedInput(focusedInput)} // PropTypes.func.isRequired,
                    isOutsideRange={() => false}
                  />
                 <Button className="p-2 my-2" variant="primary" type="submit">
                 Filter
                 </Button>
               </Form>
               <Form
                 onSubmit={(e) => {
                   e.preventDefault();
                   console.log(e.target[0].value);
                   var newArray = MemberFilter.filter(function (el) {
                    return el.Branch == e.target[0].value;
                  });
                  setMemberFilter(newArray);
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
     {
      MemberFilter.map(mem=>{
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
                   console.log(startDate._d,endDate._d)
                   var newArray = Member.filter(function (el) {
                     var current_date = dateFormat(el.Payment[el.Payment.length-1]['DueDate'], "isoDate");
                     console.log(current_date)
                     var sd = dateFormat(startDate._d, "isoDate");
                     var ed = dateFormat(endDate._d, "isoDate");
                     return( current_date <= ed && current_date >=sd);
                   });
                   setMemberFilter(newArray);
                 }}
               >
                 <DateRangePicker
                    startDate={startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => {
                      setMemberFilter(Member)
                      setstartDate(startDate)
                       setendDate(endDate)}} // PropTypes.func.isRequired,
                    focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => setfocusedInput(focusedInput)} // PropTypes.func.isRequired,
                    isOutsideRange={() => false}
                    />
                 <Button className="p-2 my-2" variant="primary" type="submit">
                 Filter
                 </Button>
               </Form>
              <Form
                 onSubmit={(e) => {
                   e.preventDefault();
                   console.log(e.target[0].value);
                   var newArray = MemberFilter.filter(function (el) {
                    return el.Branch == e.target[0].value;
                  });
                  setMemberFilter(newArray);
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
         <th>Pay Due By</th>
       </tr>
     </thead>
     <tbody>
     {
     MemberFilter.map(mem=>{
      var due=0;
      var dueDate;
      if(mem.Payment[mem.Payment.length-1]['DueDate']) {
        dueDate = mem.Payment[mem.Payment.length-1]['DueDate'];
      }
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
             <td>{dueDate ? <Timestamp date={dueDate} />: null}</td>
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
