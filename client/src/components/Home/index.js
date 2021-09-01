import React from 'react'
import BranchSelector from "../Members/utility/BranchSelector";
import {Form,Button} from 'react-bootstrap'
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
            <Form.Control type="text" placholder="Enter Username of Member"  />
              <Button  className="p-2 my-2"  variant="primary" type="submit">
                Submit
              </Button>
            </Form>
           
          </div>
          <div className="col-6 col-md-6 col-xs-12 ">
           <h3>Search Member</h3>
           <Form onSubmit={((e)=>{
              e.preventDefault();
                window.location.href="/member/"+e.target[0].value+'/FullView'
            })}>
           <Form.Label>Enter ID</Form.Label>
            <Form.Control type="text" placholder="Enter Id of Member"  />
            <Button className="p-2 my-2" variant="primary" type="submit">
                Submit
              </Button>
           </Form>
       
            </div>
        </div>
    )
}

export default Home
