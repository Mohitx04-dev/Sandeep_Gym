import react, {useState, useEffect} from 'react'
import { Form, Button, Alert} from "react-bootstrap";
import { BrowserRouter, Route } from "react-router-dom";
import axios from 'axios'
import MemberForm from "../Member_form"
import PayHist from '../PaymentHistory';

export default function MemberPg(props) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
    }
    var url = window.location.pathname.split("/");
    var mid = url[2];
    var View = url[3];
    
    const [Userdt, setUserdt] = useState();
    useEffect(() => {
        axios.get('/api/member/'+mid,{headers:headers})
    .then(response => 
        {
             setUserdt(response.data);
        }).catch((error) => {
            console.log('Error')
        })
    },[])
    if(Userdt) {
    return (
        <div>
        <Form>
        <MemberForm Member={Userdt} Editable={false} EditPay={false}/>
        </Form>
        {View=='FullView' ? <PayHist  Member={Userdt ? Userdt : null}/> : null}
        </div>
    ) }
    else {
        return (
            <>
              <Alert variant='danger'>
               Member Not Found
            </Alert>
            </>
           )
        }
}