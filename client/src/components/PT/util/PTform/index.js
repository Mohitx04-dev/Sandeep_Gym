import React from 'react'
import {Form, Button} from 'react-bootstrap'
import BranchSelector from '../../../Members/utility/BranchSelector'
import toInputUppercase from '../../../util/Caps'

function PTform(prop) {
    function Sinput(props) {
        return (
            <>
            <Form.Label>{props.Title}</Form.Label>
            <Form.Control type={props.Type} defaultValue={props.Val ? props.Val : null} placeholder={props.PlaceHolder} disabled={props.EditF ? props.EditF : false}  onInput={toInputUppercase}/>
            </>
        )
    }
    return (
            <Form onSubmit={prop.onSubmit}>
            <Sinput Title="Name" Type="text" Val={prop.Member ? prop.Member.Name : null} Placeholder="Enter Name"/>
            <Sinput Title="Customer ID" Type="text" Val={prop.Member ? prop.Member.Cust_Id : null} Placeholder="Enter ID"/>
            {prop.Member ? <Sinput Title="Branch" Type="text" Val={prop.Member ? prop.Member.Branch : null} EditF = {true} Placeholder="Enter Branch"/> : <BranchSelector User={prop.User}/>}
            <Sinput Title="Trainer" Type="text" Val={prop.Member ? prop.Member.Trainer  :null} Placeholder="Enter Trainer Name"/>
            <Sinput Title="Start Date" Type="date" Val={prop.Member ?  prop.Member.StartDate : null} Placeholder="Enter Date"/>
            <Sinput Title="End Date" Type="date" Val={prop.Member ? prop.Member.EndDate:null} Placeholder="Enter Date"/>
            <Sinput Title="Fees" Type="number" Val={prop.Member ? prop.Member.Fees : null} Placeholder="Enter Fees"/>
            <Button variant="primary" className="my-3" type="submit">
                Submit
            </Button>
            </Form>
    )
}

export default PTform
