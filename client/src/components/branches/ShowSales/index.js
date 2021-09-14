import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import axios from "axios";
import Timestamp from "react-timestamp";
import dateFormat from "dateformat";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import toInputUppercase from "../../util/Caps";

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
  const [Filter,setFilter] = useState([])
  const [startDate, setstartDate] = useState()
  const [endDate, setendDate] = useState()
  const [focusedInput,setfocusedInput] = useState()
  function getData() {
    axios
      .get("/api/branch/" + Bid, { headers: headers })
      .then((response) => {
        for (var i = 0; i < response.data.Payments.length; i++) {
          SetBranches((state) => [...state, response.data.Payments[i]]);
          setFilter((state) => [...state, response.data.Payments[i]]);
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
                setFilter(newArray);
              }}
            >
              <Form.Label>Enter ID</Form.Label>
              <Form.Control type="text"  onInput={toInputUppercase} placholder="Enter Id of Member" />
              <Button className="p-2 my-2" variant="primary" type="submit">
                Filter
              </Button>
            </Form>
          </div>
          <div className="col-md-6">
          <Form
                 onSubmit={(e) => {
                   e.preventDefault();
                   console.log(startDate._d,endDate._d)
                   var newArray = Branches.filter(function (el) {
                     var current_date = dateFormat(el.Date, "isoDate");
                     var sd = dateFormat(startDate._d, "isoDate");
                     var ed = dateFormat(endDate._d, "isoDate");
                     return( current_date <= ed && current_date >=sd);
                   });
                   setFilter(newArray);
                 }}
               >
                  <Form.Label>Enter Date Range</Form.Label> <br />
                 <DateRangePicker
                    startDate={startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => {
                      setstartDate(startDate)
                       setendDate(endDate)}} // PropTypes.func.isRequired,
                    focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => setfocusedInput(focusedInput)} // PropTypes.func.isRequired,
                    isOutsideRange={() => false}
                  />
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
          {Filter.map((p) => {
            Total += parseInt(p.Amount);
            return (
              <tr key={p._id}>
                <td>{p.Cust_Id}</td>
                <td>{p.Customer_Name}</td>
                <td>
                  {p.Date ?  <Timestamp date={p.Date} /> : null}
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
