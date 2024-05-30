import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

function DeleteUser() {
    var user_id = window.sessionStorage.getItem("user_id");
    var user_type = sessionStorage.getItem("user_type");

    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // search term for user
    const [user, setUser] = useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);

    let ADDR = "http://54.234.98.88:8000";

    useEffect(() => {
        let url = ADDR + "/user/viewAll";
        let params= {searchTerm:searchTerm}
        let qParams = new URLSearchParams(params)
        const userList = async() => {
            axios.get(url, {params:qParams})
            .then(res=>setUserList(res.data))
            .catch((err) => console.log(err));
        };
        userList();
    }, [searchTerm, ADDR])

    function openModal() {
        setIsOpen(true);
      }

      function closeModal() {
        setIsOpen(false);
      }

      function deleteUser() {
        let url = ADDR + "/user/delete";
        console.log(user);
        axios.put(url, {user_id:user_id, userToDelete: user}).then(res=>console.log(res))
        .catch((err) => console.log(err));
        setUser('');
      }
    // REMOVE S
    return (
        <div className='deleteUsers'> 

            {(user_type==='A') && 
                    <>
                    <h1> Delete Users </h1>
                    <input name="name" type="text" placeholder="Search Username" onChange={e => setSearchTerm(e.target.value)}></input>
                    <select name="user" placeholder='User' required  onChange={e => setUser(e.target.value)}>
                    <option value=""> Select User to Delete </option>
                    {userList.map((info) => <option key= {info.user_id} value={info.user_id}>{info.f_name} {info.l_name} ({info.username})</option>)}
                    </select>
                   <br></br>
                   {(user.length > 0) &&
                     <button className='delete-my-acct' onClick={openModal}> Delete Account</button> 
                   }
                   
                    <div className='delete-my-acct-container'>

                    <Modal className='delete-my-acct-popup' isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Are you sure you want to delete user?">
    
                        <h3> Are you sure you want to delete user? </h3>
                        <p> This action cannot be undone. </p>
                        <button className='delete-my-acct' onClick={()=> {deleteUser(); closeModal();}} > Yes, delete account </button>
                        <button className='gray-button' onClick={closeModal}> No, cancel. </button>
                    </Modal>  
                    </div>

                    </>
                }
        </div>
        
    )

}

export default DeleteUser;