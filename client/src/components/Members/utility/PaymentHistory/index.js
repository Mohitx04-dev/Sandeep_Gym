import React from 'react'
import Timestamp from 'react-timestamp';
import { Table ,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PayHist(props) {
    return (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Txn Id</th>
            <th>Name</th>
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Pay Due</th>
            <th>Comments</th>
            <th>Payment Method</th>
            <th>Recieved By</th>
            <th>Due Payment By</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
        {props.Member ? props.Member.Payment.map(txn=>{
          return(
           <tr key={txn._id}>
           <td>{txn._id.substr(18,24)}</td>
           <td>{props.Member.Name}</td>
           <td><Timestamp date={txn.Date} /></td>
           <td>{txn.Total}</td>
           <td>{txn.Paid}</td>
           <td>{txn.Due}</td>
           <td>{(txn.Due>0) ? <Link to={"/PayDue/" + props.Member.Cust_Id+ "/"+txn._id} className="btn btn-success">Pay Due</Link> : null}</td>
           <td>{txn.Comments}</td>
           <td>{txn.PayMethod}</td>
           <td>{txn.RecievedBy}</td>
           <td>{txn.DueDate ? <Timestamp date={txn.DueDate}/> : null}</td>
           <td><Link to={"/edit/" + props.Member.Cust_Id+ "/"+txn._id} className="btn btn-warning">Edit</Link></td>
         </tr>)
      }) : null
      }
        </tbody>
      </Table>
    )
}

export default PayHist
