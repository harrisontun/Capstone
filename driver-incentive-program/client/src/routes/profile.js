import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import Modal from 'react-modal';


function Profile() {
    var f_name = window.sessionStorage.getItem("f_name");
    var l_name = window.sessionStorage.getItem("l_name");
    var user = window.sessionStorage.getItem("username");
    var user_id = window.sessionStorage.getItem("user_id");
    var user_type = window.sessionStorage.getItem("user_type");
    var phone_number = window.sessionStorage.getItem("phone_number");
    var birthday = window.sessionStorage.getItem("birthday");
    birthday = birthday.substring(0, 10);
    var address = window.sessionStorage.getItem("address");
    var city = window.sessionStorage.getItem("city");
    var state = window.sessionStorage.getItem("state");
    var zip = window.sessionStorage.getItem("zip_code");

    const [NewAddress, setNewAddress] = useState('');
    const [NewPhoneNumber, setNewPhoneNumber] = useState('');
    const [NewBirthday, setNewBirthday] = useState('');
    const [NewUser, setNewUser] = useState('');
    const [open, setOpen] = useState(false);
    const [NewFirst, setNewFirst] = useState('');
    const [NewLast, setNewLast] = useState('');
    const [NewCity, setNewCity] = useState('');
    const [NewState, setNewState] = useState('');
    const [NewZip, setNewZip] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);


    const changeFirst = () => {
        axios.post('http://54.234.98.88:8000/changeFirst', {
            user_id: user_id,
            NewFirst: NewFirst
        }).then(res => {
            console.log(res);
            sessionStorage.setItem("f_name", res.data[0].f_name);
            window.location.reload();
        //.catch(err => console.log(err));
    }
    )
    };

    const changeLast = () => {
        axios.post('http://54.234.98.88:8000/changeLast', {
            user_id: user_id,
            NewLast: NewLast
        }).then(res => {
            console.log(res);
            sessionStorage.setItem("l_name", res.data[0].l_name);
            window.location.reload();
        //.catch(err => console.log(err));
    }
    )
    };

const changeAddress = () => {
    axios.post('http://54.234.98.88:8000/changeAddress', {
        user_id: user_id,
        NewAddress: NewAddress
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("address", res.data[0].address);
        window.location.reload();
    //.catch(err => console.log(err));
}
)
};

const changeCity = () => {
    axios.post('http://54.234.98.88:8000/changeCity', {
        user_id: user_id,
        NewCity: NewCity
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("city", res.data[0].city);
        window.location.reload();
    //.catch(err => console.log(err));
}
)
};

const changeState = () => {
    axios.post('http://54.234.98.88:8000/changeState', {
        user_id: user_id,
        NewState: NewState
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("state", res.data[0].state);
        window.location.reload();
    //.catch(err => console.log(err));
}
)
};

const changeZip = () => {
    axios.post('http://54.234.98.88:8000/changeZip', {
        user_id: user_id,
        NewZip: NewZip
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("zip_code", res.data[0].zip_code);
        window.location.reload();
    //.catch(err => console.log(err));
}
)
};

const changePhoneNumber = () => {
    axios.post('http://54.234.98.88:8000/changePhoneNumber', {
        user_id: user_id,
        NewPhoneNumber: NewPhoneNumber
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("phone_number", res.data[0].phone_number);
        window.location.reload();
    //.catch(err => console.log(err));
})};

const changeBirthday = () => {
    axios.post('http://54.234.98.88:8000/changeBirthday', {
        user_id: user_id,
        NewBirthday: NewBirthday
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("birthday", res.data[0].birthday);
        window.location.reload();
    //.catch(err => console.log(err));
})};

const changeUser = () => {
    axios.post('http://54.234.98.88:8000/changeUsername', {
        user_id: user_id,
        NewUser: NewUser
    }).then(res => {
        console.log(res);
        sessionStorage.setItem("username", res.data[0].username);
        window.location.reload();
    //.catch(err => console.log(err));
})};

function deleteMyAcct() {
    let url = "http://54.234.98.88:8000/user/delete";
    axios.put(url, {user_id:user_id, userToDelete: user_id}).then(res=>console.log(res))
    .catch((err) => console.log(err));
  }
function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

    return (
        <div className='profile-container'>
            <div>
            <h1 class="centerHeader">Profile</h1>
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>Content</th>
                            <th>Edit Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>First Name</td>
                            <td>{f_name}</td>
                            <td>
                            <input type="text" placeholder="Firstname" name="NewFirst"
                                onChange={e => setNewFirst(e.target.value)}/>
                                <button onClick = {changeFirst} type="submit">Change Firstname</button></td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td>{l_name}</td>
                            <td>
                            <input type="text" placeholder="Lastname" name="NewLast"
                                onChange={e => setNewLast(e.target.value)}/>
                                <button onClick = {changeLast} type="submit">Change Lastname</button></td>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td>{user}</td>
                            <td>
                            <input type="text" placeholder="Username" name="NewUser"
                                onChange={e => setNewUser(e.target.value)}/>
                                <button onClick = {changeUser} type="submit">Change Username</button></td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{address}</td>
                            <td>
                            <input type="text" placeholder="Address" name="NewAddress"
                                onChange={e => setNewAddress(e.target.value)}/>
                                <button onClick = {changeAddress} type="submit">Change Address</button></td>
                        </tr>
                        <tr>
                            <td>City</td>
                            <td>{city}</td>
                            <td>
                            <input type="text" placeholder="City" name="NewCity"
                                onChange={e => setNewCity(e.target.value)}/>
                                <button onClick = {changeCity} type="submit">Change City</button></td>
                        </tr>
                        <tr>
                            <td>State</td>
                            <td>{state}</td>
                            <td>
                            <input type="text" placeholder="State" name="NewState"
                                onChange={e => setNewState(e.target.value)}/>
                                <button onClick = {changeState} type="submit">Change State</button></td>
                        </tr>
                        <tr>
                            <td>Zip Code</td>
                            <td>{zip}</td>
                            <td>
                            <input type="text" placeholder="Zip Code" name="NewZip"
                                onChange={e => setNewZip(e.target.value)}/>
                                <button onClick = {changeZip} type="submit">Change Zip Code</button></td>
                        </tr>
                        <tr>
                            <td>Phone Number</td>
                            <td>{phone_number}</td>
                            <td>
                            <input type="text" placeholder="Phone Number" name="NewPhoneNumber"
                                onChange={e => setNewPhoneNumber(e.target.value)}/>
                                <button onClick = {changePhoneNumber} type="submit">Change Phone Number</button></td>
                        </tr>
                        <tr>
                            <td>Birthday</td>
                            <td>{birthday}</td>
                            <td>
                            <input type="date" placeholder="YYYY-MM-DD" name="NewBirthday"
                                onChange={e => setNewBirthday(e.target.value)}/>
                                <button onClick = {changeBirthday} type="submit">Change Birthday</button></td>
                        </tr>
                        <tr>
                            <td>User type</td>
                            <td>{user_type}</td>
                        </tr>
                        <tr>
                            <td>User ID</td>
                            <td>{user_id}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            <div>
            {user_type=="D" && <Link to="/viewApps">
                    <button>View My Applications</button>
                </Link>}
            </div> 
            <div className='delete-my-acct-container'> 
                <button className='delete-my-acct' onClick={openModal}> Delete Account</button>    
                <Modal className='delete-my-acct-popup' isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Are you sure you want to delete user?">
    
                        <h3> Are you sure you want to delete your account? </h3>
                        <p> This action cannot be undone. </p>
                        <Link to="/">
                            <button className='delete-my-acct' onClick={()=> {deleteMyAcct(); closeModal();}} > Yes, delete account </button>
                        </Link>
                        <button className='gray-button' onClick={closeModal}> No, cancel. </button>
                    </Modal>  
            </div>  

            
        </div>
        
    )
}

export default Profile;