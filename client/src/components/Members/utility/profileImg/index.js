import React, {useState} from 'react'
import styles from './styles.module.css';
import {Form,Button} from 'react-bootstrap'
function ProfileImg(props) {
    const [File, setFile] = useState("")
    const onChange = (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
        setFile(e.target.files[0])
        console.log(File)
    }
    const postDetails = (e)=>{
      e.preventDefault();
      const data = new FormData()
      data.append("file",File)
      data.append("upload_preset","SandeepGym")
      data.append("cloud_name","sandeepgym")
      fetch("https://api.cloudinary.com/v1_1/sandeepgym/image/upload",{
          method:"post",
          body:data
      })
      .then(res=>res.json())
      .then(data=>{
        alert('Done')
         props.setUrl(data.url)
      })
      .catch(err=>{
          console.log(err)
      })
      console.log(data)
  }
    return (
        <Form onSubmit={postDetails}>
        <div className="profile-pic-wrapper">
        <div className={styles.picHolder}>
          <img id="profilePic" className={styles.pic} src={File ?  URL.createObjectURL(File) : "https://source.unsplash.com/random/150x150"}/>
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
          <Form.File
          type="file"
           className="newProfilePhoto"
           id="newProfilePhoto"
           custom
           onChange={onChange}
      />
        </div>
      </div>
      <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    )
}
export default ProfileImg
