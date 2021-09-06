import { Form } from "react-bootstrap";
import React from "react";
import PayField from "../PayUtil";
import BranchSelector from "../BranchSelector";


function getFormattedDate(date) {
    date = new Date(date);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }
const MemberForm = (prop) => {
    function Selecter(props) {
     if(prop.Member) {  
        var Field = props.field;
        if(props.Type=='date') {
            Field = getFormattedDate(prop.Member[Field]);
        }
        else {
            Field = prop.Member[Field];
        } 
    }
          return (
          <>
            <Form.Label>{props.Name}</Form.Label>
            <Form.Control type={props.Type} defaultValue={prop.Member?Field : (props.def==0 ? props.def : null)} placeholder={props.placeholder} disabled={prop.Editable==false? true:false} />
          </>
        );
      }
    return (
        
              <Form.Group className="mb-3" controlId="formBasicEmail">
        <h2>Member Details</h2>
          <div className="row">
            <div className="col-md-6 col-sm-12 col-6">
              <Selecter Name="Member Id" Type="string" field="Cust_Id" placeholder="Enter Id" />
              <Selecter
                Name="Member Name"
                Type="string"
                field="Name"
                placeholder="Enter Name"
              />
            </div>
            <div className="col-md-6 col-sm-12 col-6">
             {prop.Editable==false ? 
                   <Selecter
                   Name="Branch"
                   Type="string"
                   field="Branch"
                   placeholder="Enter Branch"
                 />
             : 
                <BranchSelector Editable={prop.Editable} Member={prop.Member} User={prop.User}/>
             }
              <Selecter Name="PRN" Type="number" placeholder="Enter PRN" field="PRN"/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12 col-3">
              <Selecter Name="Age" Type="number" placeholder="Enter Age" field="Age" />
              <Selecter
                Name="Gender"
                Type="string"
                field="Gender"
                placeholder="Enter M or F"
              />
            </div>
            <div className="col-md-3 col-sm-12 col-3">
              <Selecter
                Name="Weight"
                Type="number"
                field="Weight"
                placeholder="Enter Weight"
              />
              <Selecter
                Name="Height"
                Type="number"
                field="Height"
                placeholder="Enter Height"
              />
            </div>
            <div className="col-md-3 col-sm-12 col-3">
              <Selecter
                Name="DOB"
                Type="date"
                field="DOB"
                placeholder="Enter Date of Birth"
              />
               <Selecter
              Name="DOR"
              Type="date"
              field="DOR"
              placeholder="Enter Date of Registration"
            />
            </div>
            <div className="col-md-3 col-sm-12 col-3">
              <Form.Label className="Font">Address</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
                disabled={prop.Editable==false? true:false}
                defaultValue={prop.Member? prop.Member.Address : null}
              />
            </div>
          </div>
          <div className="row">
            {!prop.Member ?  <div className="col-6">
                        <Form.Label className="Font">Months</Form.Label>
                        <Form.Control as="select" >
                        {[...Array(12)].map((e, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                        </Form.Control>
                        <Selecter
                            Name="Days"
                            Type="number"
                            field="Days"
                            placeholder="Enter Days"
                            def = {0}
                        />
            </div> : null}
           
            <div className="col-6">
              <Selecter
                Name="Aadhar"
                Type="number"
                field="Aadhar"
                placeholder="Enter Aadhar Number"
              />
                <Selecter
                Name="DOJ"
                Type="date"
                field="DOJ"
                placeholder="Enter Date of Joining"
              />
            </div>
            <div className="col-6">
              <Selecter
                Name="Contact No"
                Type="number"
                field="Contact_No"
                placeholder="Enter Contact Number"
              />
            </div>
            <div className="col-6">
              <Selecter
                Name="Injury"
                Type="text"
                field="Injury"
                placeholder="Enter Injury if Any"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <Selecter
                Name="Occupation"
                Type="text"
                field="Occupation"
                placeholder="Enter Occupation "
              />
              <Selecter
                Name="Reference"
                Type="text"
                field="Reference"
                placeholder="Enter Reference if Any"
              />
            </div>
            <div className="col-6">
              <Selecter
                Name="Service"
                Type="text"
                field="Service"
                placeholder="Enter Service"
              />
              <Selecter
                Name="Workout Choice"
                Type="text"
                field="Workout_Choice"
                placeholder="Enter Workout Choice"
              />
        
            </div>
          </div>
          <div className="row">
            <div className="col-6">
            <Selecter
                Name="Counselled By"
                Type="text"
                field="CounselledBy"
                placeholder="Enter Counselled By"
              />    
                </div>
                <div className="col-6">
                <Selecter
                Name="Joined By"
                Type="text"
                field="JoinedBy"
                placeholder="Enter Joined By"
              />
                </div>
                </div>
                <Form.Label className="Font" >Time Slot</Form.Label>
                        <Form.Control as="select" field="Time" defaultValue={prop.Member ? prop.Member.Time : null} disabled={prop.Editable==false ? true : false}>
                       <option value="morning">Morning</option>
                       <option value="evening">Evening</option>
                        </Form.Control>
          <hr />
          <h2>Payment</h2>
            <PayField Member={prop.Member} Editable={prop.EditPay} First={true}/>  
        </Form.Group>
    )
}

export default MemberForm
