import React from 'react'
import {Form,Button} from 'react-bootstrap'

function Search() {
    return (
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
    )
}

export default Search
