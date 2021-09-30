import React, { useState, useEffect } from "react";
import { Form, Table, Button, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import Timestamp from "react-timestamp";
import DeleteModal from "../../util/delete-modal";
import BranchSelector from "../utility/BranchSelector";
import dateFormat from "dateformat";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import PaginationPage from '../utility/Pagination'

export default function Report(props) {
  const [Member, setMember] = useState([]);
  const [Branch, setBranch] = useState([]);
  const [CurrentBranch, setCurrentBranch] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [req, setreq] = useState(false);
  const [toDelete, settoDelete] = useState("");
  const [viewType, setviewType] = useState(0);
  const [startDate, setstartDate] = useState();
  const [endDate, setendDate] = useState();
  const [focusedInput, setfocusedInput] = useState();
  const [CurrentPage, setCurrentPage] = useState(1)
  const [MemberCount,setMemberCount] = useState(0)
  const [Rerender,setRerender] = useState()

  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.branch,
  };

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
    queryParams["pagination"] = 80; //Number Of records on Page
    var query = {};
    if(startDate) {
        var ValidityFilter = [startDate._d,endDate._d]
        query["ValidityFilter"] = ValidityFilter;
    } else if(viewType==1) {
        query["DueFind"] = true;
    }
    if (query) {
      queryParams = {
        ...queryParams,
        ...query,
      };
    }
    setMember([]);
    axios
      .post("/api/memberByPage", queryParams, { headers: headers })
      .then((data) => {
        for (var i = 0; i < data.data.users.length; i++) {
          setMember((state) => [...state, data.data.users[i]]);
        }
      })
      .catch((err) => {
        console.log("Error In Fetching Users ", err);
      });
  };
  const getUsersCount = () => {
    //Passing 1 as Argument needed to get count
    var query = {};
    if(startDate && viewType==0) {
        var ValidityFilter = [startDate._d,endDate._d]
        query["ValidityFilter"] = ValidityFilter;
    }
    else if(viewType==1) {
        query["DueFind"] = true;
    }
    axios
      .post("/api/MemberCount/1", query, { headers: headers })
      .then((data) => {
        setMemberCount(data.data.cnt);
        //call is for first page records only
      })
      .then(() => getUsers(CurrentPage));
  };
  let numberOfPages = 0;
  if (MemberCount % 80 === 0) numberOfPages = Math.floor(MemberCount / 80);
  else numberOfPages = Math.floor(MemberCount / 80) + 1;
  return (
    <>
      <div className="text-center">
        <h3>View Reports</h3>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(viewType);
            getUsersCount()
          }}
        >
          <ButtonGroup aria-label="Basic example">
            <Button
              variant="secondary"
              type="submit"
              onClick={() => setviewType(0)}
            >
              Validity
            </Button>
            <Button
              variant="secondary"
              type="submit"
              onClick={() => setviewType(1)}
            >
              Due Payment
            </Button>
          </ButtonGroup>
        </Form>
      </div>
      {viewType == 0 ? (
        <div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              getUsersCount();
            }}
          >
            <DateRangePicker
              startDate={startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {
                setstartDate(startDate);
                setendDate(endDate);
              }} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={(focusedInput) => setfocusedInput(focusedInput)} // PropTypes.func.isRequired,
              isOutsideRange={() => false}
            />
            <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
            </Button>
          </Form>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              var newArray = Member.filter(function (el) {
               return el.Branch == e.target[0].value;
             });
             setMember(newArray);
             
            }}
          >
            <BranchSelector User={props.User} />

            <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
            </Button>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Valid Till</th>
              </tr>
            </thead>
            <tbody>
              {Member.map((mem) => {
                return (
                  <tr key={mem.Cust_Id}>
                    <td>{mem.Cust_Id}</td>
                    <td>{mem.Name}</td>
                    <td>
                      {mem.Active ? (
                        <Timestamp date={mem.Valid_Till} />
                      ) : (
                        <p className="text-danger font-weight-bold">
                          Expired on <Timestamp date={mem.Valid_Till} />
                        </p>
                      )}{" "}
                    </td>
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
      ) : (
        <div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              var newArray = Member.filter(function (el) {
                return el.Branch == e.target[0].value;
              });
              setMember(newArray);
            }}
          >
            <BranchSelector User={props.User} />
            <Button className="p-2 my-2" variant="primary" type="submit">
              Filter
            </Button>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Total Due</th>
              </tr>
            </thead>
            <tbody>
              {Member.map((mem) => {
                  return (
                    <tr key={mem.Cust_Id}>
                      <td>{mem.Cust_Id}</td>
                      <td>{mem.Name}</td>
                      <td>{mem.TotalDue}</td>
                    </tr>
                  );
                } )}
              <DeleteModal
                show={modalShow}
                reqDelete={() => {
                  axios
                    .delete("http://localhost:3000/api/member/" + toDelete, {
                      headers: headers,
                    })
                    .then(() => {
                      alert("Deleted Member");
                      window.location.href = "/member/view";
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
                onClose={() => {
                  setModalShow(false);
                }}
              ></DeleteModal>
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
      )}
    </>
  );
}
