import React, { useState, useEffect } from "react";
import { Form, Table, Button } from "react-bootstrap";
import axios from "axios";
import Timestamp from "react-timestamp";
import { Link } from "react-router-dom";
import ErrorModal from "../util/error-modal";
import SuccessModal from "../util/success-modal";
import DeleteModal from "../util/delete-modal"
export default function ViewUsers(props) {
  const [User, setUser] = useState([]);
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
      .get("/api/showUsers/", { headers: headers })
      .then((response) => {
        setUser(response.data);
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
            <th>Created At</th>
            <th>Updated At</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {User.map((mem) => {
            return (
              <tr key={mem.username}>
                <td>{mem.username}</td>
                <td>{mem.name}</td>
                <td>{mem.branch}</td>
                <td>
                  <Timestamp date={mem.createdAt} />
                </td>
                <td>
                  <Timestamp date={mem.updatedAt} />
                </td>
                <td>
                  {" "}
                  <Link
                    to={"/profile/" + mem.username}
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
                      settoDelete(mem.username);
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
            .delete("/api/user/" + toDelete, {
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
        redirect={() => (window.location.href = "/viewUser")}
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
