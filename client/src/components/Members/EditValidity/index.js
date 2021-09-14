import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import SuccessModal from "../../util/success-modal";
import ErrorModal from "../../util/error-modal";
import Timestamp from 'react-timestamp'
function EditValidity(props) {
  const [sucModalShow, setsucModalShow] = useState(false);
  const [errModalShow, seterrModalShow] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: props.User.token,
    branch: props.User.branch,
  };
  var params = window.location.pathname.split("/");
  var mid = params[2];
  const [Userdt, setUserdt] = useState();
  const [Validity, setValidity] = useState({})
  useEffect(() => {
    axios
      .get("/api/member/" + mid, { headers: headers })
      .then((response) => {
        setUserdt(response.data);
        setValidity(response.data.Valid_Till)
      })
      .catch((error) => {
        console.log("Error");
      });
    }, []);
  const sub = (e) => {
    e.preventDefault();
    var Article = {
        Valid_Till: e.target[0].value,
    };
    console.log(Article)
    axios
      .put("/api/member-validity/"+mid, Article, { headers: headers })
      .then(() => {
        setsucModalShow(true);
      })
      .catch((error) => {
        seterrModalShow(true);
      });
  };
  return (
    <div>
        <p>Current Validity : <Timestamp date={Validity ? Validity : null}/></p>
      <Form onSubmit={sub}>
        <Form.Group>
        <Form.Label>Date of New Validity</Form.Label>
        <Form.Control type="datetime-local" placeholder="Enter Date" defaultValue={Validity ? Validity : null} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <SuccessModal
        show={sucModalShow}
        redirect={() =>
          (window.location.href = "/EditValidity/" + Userdt.Cust_Id)
        }
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
    </div>
  );
}

export default EditValidity;
