import React, { useState, useEffect } from 'react';
import {Form, Table ,Button } from 'react-bootstrap';
import axios from 'axios'
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import DeleteModal from '../../util/delete-modal';
import dateFormat from 'dateformat';
import toInputUppercase from '../../util/Caps';
import PaginationPage from '../utility/Pagination';

export default function ViewMembersPaginated(props) {

    const [Member, setMember] = useState([]);
    const [Branch, setBranch] = useState([])
    const [CurrentBranch, setCurrentBranch] = useState()
    const [modalShow, setModalShow] = useState(false);
    const [req, setreq] = useState(false);
    const [toDelete,settoDelete] = useState("");
    const [CurrentPage, setCurrentPage] = useState(1)
    const [MemberCount,setMemberCount] = useState(0)
    const [ValidityDate, setDate] = useState(0)
    const [Name, setName] = useState("")
    const [PhoneId, setPhoneId] = useState()
    const [Rerender,setRerender] = useState()
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
      })
  }
      useEffect(() => {
        getData()
        getUsersCount()
      }, []);


     const nextpage = (pageNumber) => {
        setCurrentPage(pageNumber);
            getUsers(pageNumber);
      }
     const tenChange = (pageNumber, isposOrneg) => {
        var finalPage;
        if (isposOrneg > 0) //+10 clicked
          finalPage = pageNumber + 10;
        else //-10 clicked
          finalPage = pageNumber - 10;
        
        setCurrentPage(finalPage);
        getUsers(finalPage);
      }
      const hundreadChange = (pageNumber, isposOrneg) => {
        var finalPage;
        if (isposOrneg > 0) //+100 clicked
          finalPage = pageNumber + 100
        else  //-100 Clicked
          finalPage = pageNumber - 100
        
        setCurrentPage(finalPage);
        getUsers(finalPage);
      }
      const getUsers = (currentPage) => {
        var queryParams = {};
        queryParams["page"] = currentPage; //Page Number
        queryParams["pagination"] = 10; //Number Of records on Page
        var query={};
        query["Valid_Till"] = ValidityDate;
        query["Name"] = Name;
        query["PhoneId"] = PhoneId;
        if(query) {
            queryParams =  {
                ...queryParams,
                ...query
            }
        }
        setMember([])
        axios.post('/api/memberByPage', queryParams, {headers:headers})
          .then(data => {
            console.log("Data FEtched ", data)  
            for (var i = 0; i < data.data.users.length; i++) {
                setMember(state => [...state, data.data.users[i]])
            }
          })
          .catch(err => {
            console.log("Error In Fetching Users ", err)
          })
      }
      const getUsersCount = () => {
        //Passing 1 as Argument needed to get count 
        var query={};
        query["Valid_Till"] = ValidityDate;
        query["Name"] = Name;
        query["PhoneId"] = PhoneId;
        axios.post('/api/MemberCount/1',query,{headers:headers})
          .then(data => {
              setMemberCount(data.data.cnt)
             //call is for first page records only
          }).then(() => getUsers(CurrentPage))
      }
      let numberOfPages = 0;
      console.log(Member)
      if (MemberCount % 10 === 0)
        numberOfPages = Math.floor(MemberCount / 10);
      else
        numberOfPages = Math.floor(MemberCount / 10) + 1;
      return (
        <>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                setDate(e.target[0].value)
                getUsersCount()
              }}
            >
              <Form.Label>Enter Date</Form.Label>
              <Form.Control value={ValidityDate} onChange={(e)=>setDate(e.target.value)} type="date" placholder="Enter Date of Txn" />
              <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
              </Button>
            </Form>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                getUsersCount()
                console.log(MemberCount)
              }}
            >
              <Form.Label>Enter Name</Form.Label>
              <Form.Control type="text" placholder="Enter Name" value={Name} onChange={(e)=>setName(e.target.value)} onInput={toInputUppercase}/>
              <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
              </Button>
            </Form>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                getUsersCount()

              }}
            >
              <Form.Label>Enter Phone Id</Form.Label>
              <Form.Control type="number" value={PhoneId} onChange={(e)=>setPhoneId(e.target.value)} onInput={toInputUppercase} placholder="Enter Phone" />
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
      {props.Status=='superadmin' ? <th>Valid Till</th> : null}
      <th>Extend Validity</th>
      <th>View</th>
      <th>Update</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
  {Member.length>0 ? Member.map(mem=>{
    if(getMembers(mem) || (CurrentBranch==null)) {
      return(
        <tr key={mem.Cust_Id}>
        <td>{mem.Cust_Id}</td>
        <td>{mem.Name}</td>
        <td><Timestamp date={mem.DOJ}/></td>
        <td>{mem.Branch}</td>
        <td>{mem.Active ?<Timestamp date={mem.Valid_Till} />: <p className="text-danger font-weight-bold">Expired on <Timestamp date={mem.Valid_Till} /></p>} </td>
        {props.Status=='superadmin' ? <td>
        <Link to={"/EditValidity/"+mem.Cust_Id} className="btn btn-info">Edit</Link>
        </td> : null}
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
:<>
No Members
</>
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

          <PaginationPage
            pages={numberOfPages}
            nextPage={nextpage}
            currentPage={CurrentPage}
            hundreadChange={hundreadChange}
            tenChange={tenChange}
            Rerender={Rerender}
          />

        </>
    )
}
