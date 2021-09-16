import React from 'react'
import BranchSelector from "../Members/utility/BranchSelector";
import {Form,Button} from 'react-bootstrap'
import Search from './util/search';
import toLowerCase from '../util/Small';
function Home(props) {
    return (
        
        <div className="row">
          <div className="col-6 col-md-6 col-xs-12 ">
              <h3>View Sales</h3>
            <Form    onSubmit={((e)=>{
              e.preventDefault();
                window.location.href="/sales/"+e.target[0].value
            })}>
              <BranchSelector User={props.User}/>
              <Button  className="p-2 my-2"  variant="primary" type="submit">
                Submit
              </Button>
            </Form>
           
          </div>
          <div className="col-6 col-md-6 col-xs-12 ">
              <h3>Update Account</h3>
            <Form    onSubmit={((e)=>{
              e.preventDefault();
                window.location.href="/profile/"+e.target[0].value
            })}>
               <Form.Label>Enter Username</Form.Label>
            <Form.Control type="text" placholder="Enter Username of Member" onInput={toLowerCase}/>
              <Button  className="p-2 my-2"  variant="primary" type="submit">
                Submit
              </Button>
            </Form>
           
          </div>
          <div className="col-6 col-md-6 col-xs-12 ">
           <h3>Search Member</h3>
           <Search />
            
           </div>
        </div>
    )
}

export default Home
