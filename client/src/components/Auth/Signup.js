import React,{useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import BranchSelector from '../Members/utility/BranchSelector';
import SuccessModal from '../util/success-modal';
import ErrorModal from '../util/error-modal';
import toLowerCase from '../util/Small';

function SignUp(props) {
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token
      }
      const [permissions, setpermissions] = useState(
        {showBranches : true,
        createBranch : false,
        deleteBranches : false,
        editBranch : false,
        showBranchTransaction : false,
        AllBranches : false,
        showEmployees : false,
        createEmployee : false,
        deleteEmployees : false,
        updateEmployees:false,
        createMember : false,
        showMembers : true,
        updateMembers : false,
        deleteMember : false,
        extendMember : false,
        payDue : false,
        editTxn : false,
        editValidity : false,
        createPT : false,
        showPT : true,
        deletePT : false,
        updatePT : false,
        createAccount : false})
const Reg = async (e) => {   
    e.preventDefault()     
   
        const Article = {
            email : e.target[0].value,
            password : e.target[1].value,
            name : e.target[2].value,
            username : e.target[3].value,
            role : e.target[4].value,
            permissions : permissions,
            branch : e.target[5].value
        }
        console.log(Article)
        var url = '/api/'+ (e.target[4].value=='user'  ? 'register-user' :(e.target[4].value=='superadmin') ? 'register-super-admin' : null);
            axios
                .post(url,Article,{headers : headers})
                .then((res)=>{
                    setsucModalShow(true)
                })
                .catch((error) => {
                    console.log(error)
                    seterrModalShow(true)
                })

    }
    function Sinput(props) {
        return (
            <>
            <Form.Label>{props.Title}</Form.Label>
            <Form.Control type={props.Type} placeholder={props.PlaceHolder} onInput={toLowerCase?toLowerCase:null} />
            </>
        )
    }
    const handleOnChange = (name) => {
  
    if(name=='updateMembers'||name=='deleteMember'||name=='extendMember'||name=='payDue') {
        setpermissions(
            {...permissions,
              [name] : !permissions[name],
              showMembers:(permissions['showMembers'] ? true : !permissions[name])
            }
          );
      }
      else {
        setpermissions(
            {...permissions,
                [name] : !permissions[name]}
          );
          }
      }
    
    const keys = Object.entries(permissions);
    return (
            <Form onSubmit={Reg}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Sinput Title="Email" Type="email" Placeholder="Enter Email"/>
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
            <Sinput Title="Password" Type="password" Placeholder="Enter password"/>
            </Form.Group>
            <Sinput Title="Name" Type="text" Placeholder="Enter Name"/>
            <Sinput Title="Username" Type="text" Placeholder="Enter Username"  toLowerCase={true} />
            <Form.Label>Role</Form.Label>
            <Form.Control as='select' >
            <option value="user">User</option>
            <option value="superadmin">Super Admin</option>
            </Form.Control> 
            <BranchSelector User = {props.User}/> <h6 className="my-2">Permissions</h6>
            {Object.keys(permissions).map((name) => 
                {                    return(
                        <div key={name} className="">
                        <div className="container">
                        <Form.Check
                        inline
                        label={name}
                        name="group1"
                        type='checkbox'
                        value={name}
                        checked={permissions[name]}
                        onChange={() => handleOnChange(name)}
                    />
                        </div>
                    </div>
                    )
                }
           
        )}
            <Button variant="primary" className="my-3" type="submit">
                Submit
            </Button>
            <SuccessModal show={sucModalShow} redirect={()=> window.location.href="/"}
            onClose={()=>{
                setsucModalShow(false)
            }}
            ></SuccessModal>
            <ErrorModal show={errModalShow}  redirect={()=> seterrModalShow(false)}
            onClose={()=>{
                seterrModalShow(false)
            }}
            ></ErrorModal>
            </Form>
    )
}

export default SignUp
