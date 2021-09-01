import React from 'react'
import deleteIcon from '../icons/delete'
import {Modal, Button, CloseButton} from 'react-bootstrap'
function DeleteModal(props) {
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
           <h4 class="modal-title w-100">Are you sure?</h4>	
          <p>Do you really want to delete these records? This process cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={props.reqDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default DeleteModal
