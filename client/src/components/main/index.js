import React, { useState , useEffect} from "react";
import { Switch, Route,Router } from "react-router-dom";
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

import AddBranches from "../branches/AddBranches";
import ShowBranches from "../branches/ShowBranches";
import AddMember from "../Members/NewMember";
import ViewMembers from "../Members/ViewMember";
import AddStaff from "../Staff/AddStaff";
import ViewStaff from "../Staff/ViewStaff";
import MemberPg from '../Members/utility/member_page'
import UpdateMember from "../Members/UpdateMember"
import Extend from "../Members/ExtendValidity";
import PayDue from "../Members/PayDue"
import ShowSales from "../branches/ShowSales";
import Home from "../Home";
import Signin from "../Auth/Signin";
import SignUp from "../Auth/Signup";
import axios from 'axios'
import Landing from './Landing'
import UserHome from "../Home/UserHome";
import AddPT from "../PT/AddPT";
import ViewPT from "../PT/ViewPT";
import UpdatePT from "../PT/UpdatePT";
import Profile from "../Auth/profile";
import Reports from "../Members/Reports";
import ProfileImg from "../Members/utility/profileImg";
import EditTxn from "../Members/EditTransaction";
import EditBranchName from "../branches/EditBranch";

function Main() {
  const [Status, setStatus] = useState(false)
  var Usr = localStorage.getItem('User')
  Usr = JSON.parse(Usr)
    function check() {
      if(Usr!=null) {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': Usr.token
        }
        var role = Usr.role
        axios
          .get('/api/'+role+'-protectd', {headers : headers})
          .then((res)=>{
            res.status==200 ? setStatus(role) : setStatus(false)
          })
          .catch((Err)=>{
            console.log(Err)
          })
      }
    }

    useEffect(() => {
      check()
    }, [])
    return (
      <div className="container my-2 p-2">
        {Usr ? 
         <Switch>
         <Route exact path="/" >
         {Status==='superadmin' ? <Home User={Usr}/>: ((Status=='admin')||(Status=='user') ?  <UserHome /> : <Landing />)} 
           </Route>
         <Route exact path="/login" component={Signin} />
         <Route exact path="/PT/add"><AddPT User={Usr}/></Route>
         <Route exact path="/PT/view"><ViewPT User={Usr} /> </Route>
         <Route exact path="/PT/update/:id"><UpdatePT User={Usr} /> </Route>
         <Route exact path="/register"><SignUp User={Usr} /></Route>
         <Route exact path="/profile/:username"><Profile User={Usr} /></Route>
         <Route exact path="/branches/show"> <ShowBranches User={Usr} /> </Route>
         <Route exact path="/branches/add" > <AddBranches User={Usr} /> </Route>
         <Route exact path="/branches/branch-edit/:id" > <EditBranchName User={Usr}/> </Route>
         <Route exact path="/staff/view"><ViewStaff User={Usr} /></Route>
         <Route exact path="/staff/add"><AddStaff User={Usr}/></Route>
         <Route exact path="/member/view"><ViewMembers  User={Usr}/></Route>
         <Route exact path="/member/reports"><Reports  User={Usr}/></Route>
         <Route exact path="/member/add"><AddMember  User={Usr}/></Route>
         <Route exact path="/member/:id"><MemberPg  User={Usr}/></Route>
         <Route exact path="/member/:id/FullView"><MemberPg  User={Usr}/></Route>
         <Route exact path="/sales/:name"><ShowSales  User={Usr}/></Route>
         <Route exact path="/member/update/:id"><UpdateMember  User={Usr}/></Route>
         <Route exact path="/member/extend/:id"><Extend  User={Usr}/></Route>
         <Route exact path="/test"><ProfileImg  User={Usr}/></Route>
         <Route exact path="/member/extend/:id/Renew">
         {
           <Extend Renew={true}  User={Usr}/>
         }
         </Route>
         <Route exact path="/PayDue/:id/:txid"><PayDue User={Usr} /></Route>
         <Route exact path="/Edit/:id/:txid"><EditTxn User={Usr} /></Route>
         </Switch>
       : <Signin />
      }
        

         
      </div>
    );
  }
export default Main;