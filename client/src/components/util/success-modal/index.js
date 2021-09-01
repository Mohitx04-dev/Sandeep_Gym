import React from 'react'
import deleteIcon from '../icons/delete'
import {Modal, Button, CloseButton} from 'react-bootstrap'
function SuccessModal(props) {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
        <CloseButton onClick={props.onClose}/>
          <Modal.Title id="contained-modal-title-vcenter">
          <deleteIcon />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <h4 class="modal-title w-100">Success</h4>	
          <p>Action was successful.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={props.redirect}>Ok.</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default SuccessModal
