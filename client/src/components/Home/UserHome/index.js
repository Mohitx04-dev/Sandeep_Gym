import React from 'react'
import {Form,Button} from 'react-bootstrap'
import Search from '../util/search'
function UserHome() {
    var User = localStorage.getItem('User')
    User = JSON.parse(User)
    return (
        <div>
            Welcome {User ? User.name : null}
            <h3>Search Member</h3>
         <Search />
            
        </div>
    )
}

export default UserHome
