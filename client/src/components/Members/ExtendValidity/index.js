import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Form,Button,Radio} from 'react-bootstrap'
import PayField from '../utility/PayUtil'
import PayHist from '../utility/PaymentHistory';
import SuccessModal from '../../util/success-modal';
import ErrorModal from '../../util/error-modal';
function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }
  function addDays(req, days) {
    var ms = new Date(req).getTime() + (days - 1) * 86400000;
    return new Date(ms);
  }
function Extend (props) {
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token,
        'branch' : props.User.branch
    }
    var mid = window.location.pathname.split("/");
    mid = mid[3];
    const [radio, setradio] = useState(0)
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
    const sub = (e) => {
        e.preventDefault();
        console.log(radio)
        var Month = e.target[2].value;
        if(radio==0) {
            var Validity = new Date(Userdt.Valid_Till.valueOf());
        }
        else {
            var Validity = new Date(e.target[3].value.valueOf());
        }
        var Days = e.target[3].value;
        console.log(Days)
        Validity = addMonths(Validity, Month);
        console.log(Validity)
        Validity = addDays(Validity, Days);
        console.log(Validity)
        var Article = {
            Pay : {Date : e.target[4].value,
                Total : e.target[5].value,
                Paid : e.target[6].value,
                Due : e.target[7].value,
                Comments  : e.target[8].value,
                PayMethod : e.target[9].value,
                DueDate : e.target[10].value
            },
            Valid_Till : Validity,
            BranchName : Userdt.Branch,
            PayBr : {
                Date:  e.target[4].value,
                Customer_Name : Userdt.Name,
                Amount : e.target[6].value,
                Cust_Id : Userdt.Cust_Id
            }
        }
                axios
                .put("/api/member-extend/"+mid,   Article,{headers:headers})
                .then(() => {
                    setsucModalShow(true)
                }).catch((error)=>{
                    seterrModalShow(true)
                })
    }   
    function Selecter(props) {
        return (
        <>
          <Form.Label>{props.Name}</Form.Label>
          <Form.Control type={props.Type} defaultValue={Userdt ? Userdt[props.field] : null} placeholder={props.placeholder}
            disabled={props.disabled ? props.disabled : false}
          />
        </> )
    }
    function Radio() {
       const onValChange = (event) => {
           event.preventDefault();
            setradio(event.target.value);
          }
        if(props.Renew) {
            return (
                <>
                <div className="mb-3">
                <Form.Check 
                    type='radio'
                    id="New_Cycle"
                    label="New Cycle"
                    name="cycle"    
                    value={1}
                    onChange={onValChange}
                    checked={radio==1}
                />
                <Form.Check
                    type='radio'
                    label='Old_Cycle'
                    id="Old Cycle"
                    name="cycle"
                    value={0}
                    onChange={onValChange}
                    checked={radio==0}
                />
                </div>
                </>
    )
        } 
        else{
            return null
        }
    }
            return (
            <div>
                
                <Form
        onSubmit={sub}
      >
    <Form.Group>
        
                <Selecter
                    Name="Member Id"
                    Type="string"
                    field="Cust_Id"
                    disabled={true}
                    placeholder="Enter CustId"
                    />
                    <Selecter
                    Name="Name"
                    Type="string"
                    field="Name"
                    disabled={true}
                    placeholder="Enter Name"
                    />
                    <Form.Label className="Font">Months</Form.Label>
                        <Form.Control as="select" >
                        {[...Array(12)].map((e, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                        </Form.Control>
                        <Selecter
                    Name="Days"
                    Type="number"
                    placeholder="Enter Days"
                    />
                <PayField />
                  <Radio />
                </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    
      <PayHist Member={Userdt ? Userdt : null}/>
      <SuccessModal show={sucModalShow} redirect={()=> window.location.href="/member/extend/"+Userdt.Cust_Id}
            onClose={()=>{
                setsucModalShow(false)
            }}
            ></SuccessModal>
            <ErrorModal show={errModalShow}  redirect={()=> seterrModalShow(false)}
            onClose={()=>{
                seterrModalShow(false)
            }}
            ></ErrorModal>
            </div>
            )
}

export default Extend
