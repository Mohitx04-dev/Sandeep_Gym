import React, { useState, useEffect } from "react";
import { Form, Table, Button } from "react-bootstrap";
import axios from "axios";
import Timestamp from "react-timestamp";
import { Link } from "react-router-dom";
import DeleteModal from "../../util/delete-modal";
import SuccessModal from "../../util/success-modal";
import ErrorModal from "../../util/error-modal";
export default function ViewPT(props) {
  const [Member, setMember] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [sucModalShow, setsucModalShow] = useState(false);
  const [errModalShow, seterrModalShow] = useState(false);
  const [toDelete, settoDelete] = useState("");
  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.role == "user" ? props.User.branch : null,
  };
  useEffect(() => {
    axios
      .get("/api/PT/", { headers: headers })
      .then((response) => {
        setMember(response.data);
      });
  }, []);

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Trainer</th>
            <th>Fees</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Member.map((mem) => {
            return (
              <tr key={mem.Cust_Id}>
                <td>{mem.Cust_Id}</td>
                <td>{mem.Name}</td>
                <td>{mem.Branch}</td>
                <td>
                  <Timestamp date={mem.StartDate} />
                </td>
                <td>
                  <Timestamp date={mem.EndDate} />
                </td>
                <td>{mem.Trainer}</td>
                <td>{mem.Fees}</td>
                <td>
                  {" "}
                  <Link
                    to={"/PT/update/" + mem.Cust_Id}
                    className="btn btn-info"
                  >
                    Update
                  </Link>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setModalShow(true);
                      settoDelete(mem.Cust_Id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <DeleteModal
        show={modalShow}
        reqDelete={() => {
          axios
            .delete("/api/PT/" + toDelete, {
              headers: headers,
            })
            .then(() => {
              setsucModalShow(true);
            })
            .catch((e) => {
              console.log(e);
              seterrModalShow(true);
            });
        }}
        onClose={() => {
          setModalShow(false);
        }}
      ></DeleteModal>
      <SuccessModal
        show={sucModalShow}
        redirect={() => (window.location.href = "/PT/view")}
        onClose={() => {
          setsucModalShow(false);
        }}
      ></SuccessModal>
      <ErrorModal
        show={errModalShow}
        redirect={() => seterrModalShow(false)}
        onClose={() => {
          seterrModalShow(false);
        }}
      ></ErrorModal>
    </>
  );
}
