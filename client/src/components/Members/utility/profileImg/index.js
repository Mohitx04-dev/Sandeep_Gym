import React, {useState} from 'react'
import styles from './styles.module.css';
import {Form} from 'react-bootstrap'
function ProfileImg() {
    const [file, setfile] = useState()
    const onChange = (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
        setfile(e.target.files[0])
    }
    return (
        <Form>
        <div className="profile-pic-wrapper">
        <div className={styles.picHolder}>
          <img id="profilePic" className={styles.pic} src={file ? file : "https://source.unsplash.com/random/150x150"}/>
          <label for="newProfilePhoto" className={styles.uploadFileBlock}>
            <div className="text-center">
              <div className="mb-2">
                <i className="fa fa-camera fa-2x"></i>
              </div>
              <div className="text-uppercase">
                Update <br /> Profile Photo
              </div>    
            </div>
          </label>
          <Form.Control type="file" className={styles.uploadProfileInput} onChange={(e)=>onChange(e)} type="file" name="profile_pic" id="newProfilePhoto" accept="image/PNG"  />
        </div>
      </div>
      </Form>
    )
}

export default ProfileImg
