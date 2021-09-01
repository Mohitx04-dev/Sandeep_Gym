import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import axios from "axios";
import Timestamp from "react-timestamp";
import dateFormat from "dateformat";

function ShowSales(props) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.branch,
  };
  var Total = 0;
  var Bid = window.location.pathname.split("/");
  Bid = Bid[2];
  const [Branches, SetBranches] = useState([]);
  function getData() {
    axios
      .get("/api/branch/" + Bid, { headers: headers })
      .then((response) => {
        for (var i = 0; i < response.data.Payments.length; i++) {
          SetBranches((state) => [...state, response.data.Payments[i]]);
        }
      });
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="col">
        <div className="row">
          <div className="col-md-6">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                var newArray = Branches.filter(function (el) {
                  return el.Cust_Id == e.target[0].value;
                });
                SetBranches(newArray);
              }}
            >
              <Form.Label>Enter ID</Form.Label>
              <Form.Control type="text" placholder="Enter Id of Member" />
              <Button className="p-2 my-2" variant="primary" type="submit">
                Filter
              </Button>
            </Form>
          </div>
          <div className="col-md-6">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target[0].value);
                var newArray = Branches.filter(function (el) {
                  var current_date = dateFormat(el.Date, "isoDate");
                  return current_date == e.target[0].value;
                });
                SetBranches(newArray);
              }}
            >
              <Form.Label>Enter Date</Form.Label>
              <Form.Control type="date" placholder="Enter Date of Txn" />
              <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Recieved By</th>
          </tr>
        </thead>
        <tbody>
          {Branches.map((p) => {
            Total += parseInt(p.Amount);
            return (
              <tr key={p._id}>
                <td>{p.Cust_Id}</td>
                <td>{p.Customer_Name}</td>
                <td>
                  <Timestamp date={p.Date} />
                </td>
                <td>{p.Amount}</td>
                <td>{p.RecievedBy}</td>
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>{Total}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default ShowSales;
