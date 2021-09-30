import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import axios from "axios";
import Timestamp from "react-timestamp";
import dateFormat from "dateformat";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker} from 'react-dates';
import toInputUppercase from "../../util/Caps";
import PaginationPage from "../../Members/utility/Pagination";
function ShowSalesP(props) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.branch,
  };
  const [Cash, setCash] = useState(0)
  const [Online, setOnline] = useState(0)
  var Bid = window.location.pathname.split("/");
  Bid = Bid[2];
  const [Branches, SetBranches] = useState(Bid);
  Bid = decodeURI(Bid)
  const [Txn,setTxn] = useState([])
  const [MemberId,setMemberId] = useState()
  const [startDate, setstartDate] = useState()
  const [endDate, setendDate] = useState()
  const [focusedInput,setfocusedInput] = useState()
  const [CurrentPage, setCurrentPage] = useState(1)
  const [TxnCount,setTxnCount] = useState(0)
  const [Rerender,setRerender] = useState()
  useEffect(() => {
    getUsersCount()
  }, []);

  const nextpage = (pageNumber) => {
    setCurrentPage(pageNumber);
    getUsers(pageNumber);
  };
  const tenChange = (pageNumber, isposOrneg) => {
    var finalPage;
    if (isposOrneg > 0)
      //+10 clicked
      finalPage = pageNumber + 10;
    //-10 clicked
    else finalPage = pageNumber - 10;

    setCurrentPage(finalPage);
    getUsers(finalPage);
  };
  const hundreadChange = (pageNumber, isposOrneg) => {
    var finalPage;
    if (isposOrneg > 0)
      //+100 clicked
      finalPage = pageNumber + 100;
    //-100 Clicked
    else finalPage = pageNumber - 100;

    setCurrentPage(finalPage);
    getUsers(finalPage);
  };
  const getUsers = (currentPage) => {
    var queryParams = {};
    queryParams["page"] = currentPage; //Page Number
    queryParams["pagination"] = 80;
    queryParams["Name"] = Bid;
    //Number Of records on Page
    var query = {};
    if(startDate) {
        var dateFilter = [startDate._d,endDate._d]
        query["dateFilter"] = dateFilter;
    } 
    if(MemberId) {
        query["MemberId"] = MemberId;
    }
    if (query) {
      queryParams = {
        ...queryParams,
        ...query,
      };
    }
    setTxn([]);
    axios
      .post("/api/brtxnbypage", queryParams, { headers: headers })
      .then((data) => {
        for (var i = 0; i < data.data.users.length; i++) {
          setTxn((state) => [...state, data.data.users[i]]);
        }
        setCash(data.data.cash)
        setOnline(data.data.online)
      })
      .catch((err) => {
        console.log("Error In Fetching Users ", err);
      });
  };
  const getUsersCount = () => {
    //Passing 1 as Argument needed to get count
    var query = {
        "Name" :  Bid
    };
    if(startDate) {
        var dateFilter = [startDate._d,endDate._d]
        query["dateFilter"] = dateFilter;
    }
    if(MemberId) {
        query["MemberId"] = MemberId;
    }
    axios
      .post("/api/brtxcount/1", query, { headers: headers })
      .then((data) => {
        setTxnCount(data.data.cnt);
        //call is for first page records only
      })
      .then(() => getUsers(CurrentPage));
  };
  let numberOfPages = 0;
  if (TxnCount % 80 === 0) numberOfPages = Math.floor(TxnCount / 80);
  else numberOfPages = Math.floor(TxnCount / 80) + 1;

  return (
    <div>
      <div className="col">
        <div className="row">
          <div className="col-md-6">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                getUsersCount();
              }}
            >
              <Form.Label>Enter ID</Form.Label>
              <Form.Control type="text"  onInput={toInputUppercase} placholder="Enter Id of Txn" onChange={e=>setMemberId(e.target.value)}/>
              <Button className="p-2 my-2" variant="primary" type="submit">
                Filter
              </Button>
            </Form>
          </div>
          <div className="col-md-6">
          <Form
                 onSubmit={(e) => {
                   e.preventDefault();
                   getUsersCount();
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
        <tr>
            <td></td>
            <td></td>
            <td>Cash={Cash}</td>
            <td>Online={Online}</td>
            <td>Total={Cash+Online}</td>
          </tr>
          {Txn.map((p) => {
            // Total += parseInt(p.Amount);
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
        </tbody>
      </Table>
      <PaginationPage
            pages={numberOfPages}
            nextPage={nextpage}
            currentPage={CurrentPage}
            hundreadChange={hundreadChange}
            tenChange={tenChange}
            Rerender={Rerender}
          />
    </div>
  );
}

export default ShowSalesP;
