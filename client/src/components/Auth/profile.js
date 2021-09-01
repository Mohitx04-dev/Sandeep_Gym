import React,{useState,useEffect} from 'react'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import BranchSelector from '../Members/utility/BranchSelector';
import SuccessModal from '../util/success-modal';
import ErrorModal from '../util/error-modal';
function Profile(props) {
    const [sucModalShow, setsucModalShow] = useState(false)
    const [errModalShow, seterrModalShow] = useState(false)

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': props.User.token
      }
      var Uid = window.location.pathname.split("/");
      Uid = Uid[2];
      const [User, setUser] = useState()
      useEffect(() => {
          axios.get('/api/userprofile/'+Uid,{headers:headers})
            .then((data)=>{
                console.log(data)
                setUser(data.data)
            })
            .catch((e)=>{
                console.log(e)
            })
      }, [])
      const [permissions, setpermissions] = useState(
        {showBranches : true,
        createBranch : false,
        deleteBranches : false,
        showBranchTransaction : false,
        AllBranches : false,
        AddBranchPayment : true,
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
        createPT : false,
        showPT : true,
        deletePT : false,
        updatePT : false,
        createAccount : false})
        const Reg = async (e) => {   
            e.preventDefault()     
                const Article = {
                    email : e.target[0].value,
                    name : e.target[1].value,
                    username : e.target[2].value,
                    permissions : permissions,
                    branch : e.target[3].value
                }
                console.log(Article)
                var url = '/api/update-user/'+Uid
                    axios
                        .put(url,Article,{headers : headers})
                        .then((res)=>{
                            setsucModalShow(true)
                            console.log(res)
                        })
                        .catch((error) => {
                            seterrModalShow(true)
                            console.log(error)
                        })
        
            }
            function Sinput(props) {
                return (
                    <>
                    <Form.Label>{props.Title}</Form.Label>
                    <Form.Control type={props.Type} placeholder={props.PlaceHolder} defaultValue={User ? User[props.field] :null} />
                    </>
                )
            }
            const handleOnChange = (name) => {
              if(name=='payDue'||name=='extendMember'||name=='createMember') {
                setpermissions(
                    {...permissions,
                      [name] : !permissions[name],
                      AddBranchPayment:(permissions['AddBranchPayment'] ? true : !permissions[name])
                    }
                  );
              }
              else if(name=='updateMembers'||name=='deleteMember'||name=='extendMember'||name=='payDue') {
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
                        <Sinput Title="Email" Type="email" Placeholder="Enter Email" field="email"/>
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Sinput Title="Name" Type="text" Placeholder="Enter Name" field="name"/>
                    <Sinput Title="Username" Type="text" Placeholder="Enter Username" field="username"/>
                    <BranchSelector User = {props.User} user={User}/> 
                    <h6 className="my-2">Permissions</h6>
                    {Object.keys(permissions).map((name) => 
                        { return(
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
        
export default Profile




