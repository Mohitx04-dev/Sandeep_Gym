import React,{useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import SuccessModal from '../util/success-modal'
import ErrorModal from '../util/error-modal'
import toLowerCase from '../util/Small'

function Signin() {
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)
    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default submission
        const Article = {
            username : event.target[0].value,
            password : event.target[1].value
        }
        var url = '/api/'+ (event.target[2].value=='user'  ? 'login-user' : (event.target[2].value=='admin' ? 'login-admin' : (event.target[2].value=='superadmin') ? 'login-super-admin' : null));
        try {
           await axios
            .post(url,Article)
            .then((response)=>{
                console.log(response)
                const obj =  { 
                    token : response.data.token,
                    role : response.data.role,
                    name : response.data.name,
                    branch : response.data.branch
                }
                localStorage.setItem('User',JSON.stringify(obj))
                setsucModalShow(true)
                console.log(obj)
               
            })
            .catch((error) => {
                console.log(error)
                alert('Wrong username or password')
                seterrModalShow(true)
            })

 
       
        } catch (e) {
          alert(`Registration failed! ${e.message}`);
        }
      }
    function Sinput(props) {
        return (
            <>
            <Form.Label>{props.Title}</Form.Label>
            <Form.Control type={props.Type} placeholder={props.PlaceHolder} onInput={toLowerCase?toLowerCase:null}  />
            </>
        )
    }
    return (
        <div>
           <Form onSubmit={onSubmit}>
            <Sinput Title="Username" Type="text" Placeholder="Enter Username" toLowerCase={true} />
            <Form.Group className="mb-3" controlId="formBasicPassword">
            <Sinput Title="Password" Type="password" Placeholder="Enter password"/>
            </Form.Group>
            <Form.Control as='select' >
            <option value="user">User</option>
            <option value="superadmin">Super Admin</option>
            </Form.Control> 
            <Button variant="primary" className="my-3" type="submit">
                Submit
            </Button>
            
 <SuccessModal show={sucModalShow} redirect={()=>  window.location.href="/"}
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
        </div>
    )
}

export default Signin
