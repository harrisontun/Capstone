import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

function EditProfile() {
    var user_id = window.sessionStorage.getItem("edit_id");
    //const [edit_id, setEdit_id] = useState('');
    //setEdit_id(user_id);
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

    const url = "http://54.234.98.88:8000/getUserInfo";
    const [userInfo, setUserInfo] = useState([]);

    useEffect( () => {
        const editUser = () =>{
            axios.post('http://54.234.98.88:8000/getUserInfo', {
                user_id: user_id,
            }).then(res => {
                console.log(res);
                setUserInfo(res.data[0]);
                //window.location.reload();
            //.catch(err => console.log(err));
        }
        )}
        editUser();
    }, []);

    const changeFirst = () => {
        axios.post('http://54.234.98.88:8000/changeFirst', {
            user_id: user_id,
            NewFirst: NewFirst
        }).then(res => {
            console.log(res);
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
        window.location.reload();
    //.catch(err => console.log(err));
})};

const changeBirthday = () => {
    axios.post('http://54.234.98.88:8000/changeBirthday', {
        user_id: user_id,
        NewBirthday: NewBirthday
    }).then(res => {
        console.log(res);
        window.location.reload();
    //.catch(err => console.log(err));
})};

const changeUser = () => {
    axios.post('http://54.234.98.88:8000/changeUsername', {
        user_id: user_id,
        NewUser: NewUser
    }).then(res => {
        console.log(res);
        window.location.reload();
    //.catch(err => console.log(err));
})};

    return (
        <div className='profile-container'>
            <div>
            <h1 class="centerHeader">{userInfo.username} Profile</h1>
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
                            <td>{userInfo.f_name}</td>
                            <td>
                            <input type="text" placeholder="Firstname" name="NewFirst"
                                onChange={e => setNewFirst(e.target.value)}/>
                                <button onClick = {changeFirst} type="submit">Change Firstname</button></td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td>{userInfo.l_name}</td>
                            <td>
                            <input type="text" placeholder="Lastname" name="NewLast"
                                onChange={e => setNewLast(e.target.value)}/>
                                <button onClick = {changeLast} type="submit">Change Lastname</button></td>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td>{userInfo.username}</td>
                            <td>
                            <input type="text" placeholder="Username" name="NewUser"
                                onChange={e => setNewUser(e.target.value)}/>
                                <button onClick = {changeUser} type="submit">Change Username</button></td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{userInfo.address}</td>
                            <td>
                            <input type="text" placeholder="Address" name="NewAddress"
                                onChange={e => setNewAddress(e.target.value)}/>
                                <button onClick = {changeAddress} type="submit">Change Address</button></td>
                        </tr>
                        <tr>
                            <td>City</td>
                            <td>{userInfo.city}</td>
                            <td>
                            <input type="text" placeholder="City" name="NewCity"
                                onChange={e => setNewCity(e.target.value)}/>
                                <button onClick = {changeCity} type="submit">Change City</button></td>
                        </tr>
                        <tr>
                            <td>State</td>
                            <td>{userInfo.state}</td>
                            <td>
                            <input type="text" placeholder="State" name="NewState"
                                onChange={e => setNewState(e.target.value)}/>
                                <button onClick = {changeState} type="submit">Change State</button></td>
                        </tr>
                        <tr>
                            <td>Zip Code</td>
                            <td>{userInfo.zip_code}</td>
                            <td>
                            <input type="text" placeholder="Zip Code" name="NewZip"
                                onChange={e => setNewZip(e.target.value)}/>
                                <button onClick = {changeZip} type="submit">Change Zip Code</button></td>
                        </tr>
                        <tr>
                            <td>Phone Number</td>
                            <td>{userInfo.phone_number}</td>
                            <td>
                            <input type="text" placeholder="Phone Number" name="NewPhoneNumber"
                                onChange={e => setNewPhoneNumber(e.target.value)}/>
                                <button onClick = {changePhoneNumber} type="submit">Change Phone Number</button></td>
                        </tr>
                        <tr>
                            <td>Birthday</td>
                            <td>{userInfo.birthday}</td>
                            <td>
                            <input type="date" placeholder="YYYY-MM-DD" name="NewBirthday"
                                onChange={e => setNewBirthday(e.target.value)}/>
                                <button onClick = {changeBirthday} type="submit">Change Birthday</button></td>
                        </tr>
                        <tr>
                            <td>User type</td>
                            <td>{userInfo.user_type}</td>
                        </tr>
                        <tr>
                            <td>User ID</td>
                            <td>{userInfo.user_id}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            
        </div>
        
    )
}

export default EditProfile;