import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChangeUser() {

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [newType, setNewType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [curType, setCurType] = useState('');
    var user_type = sessionStorage.getItem("user_type");
    var user_id = window.sessionStorage.getItem("user_id");

    useEffect(() => {
        const getUsers = async() => {
            axios.post('http://54.234.98.88:8000/searchDrivers', {
                searchTerm: searchTerm
            }).then(res => {
                setUsers(res.data)})
            .catch(err => console.log(err));
        };
        getUsers();
    }, [])


    useEffect(() => {
        const updateUsers = async() => {
            axios.post('http://54.234.98.88:8000/user/viewAll', {
                searchTerm: searchTerm
            }).then(res => {
                setUsers(res.data)})
            .catch(err => console.log(err));
        };
        updateUsers();
    }, [searchTerm])


    useEffect(() => {
        let url = 'http://54.234.98.88:8000/user/type' + user
        const getType = async() => {
            axios.get(url).then(res => {
                console.log(res);
                setCurType(res.data[0].user_type)})
            .catch(err => console.log(err));
        };getType();
        console.log(curType)
    }, [user])

        
    const changeType = async() => {
        let url = 'http://54.234.98.88:8000/user/updateRole';
        axios.put(url, {
            user_id: user_id,
            newRole: newType,
            userToChange: user
        }).then(res => {
            console.log(res);})
        .catch(err => console.log(err));
    }

    return (
        <div className='userMgmtContainer'>
            {user_type==="A" &&
            <>
                <h1> Change User Type</h1>
                <input name="name" type="text" placeholder="Search Users" onChange={e => setSearchTerm(e.target.value)}></input>
                <select  name="users" placeholder='User'  required onChange={e => setUser(e.target.value)}>
                    <option value="">Select User</option>
                {users.map((info) => <option key= {info.user_id} value={info.user_id}>{info.f_name} {info.l_name} ({info.username}) ({info.user_type})</option>)}
                </select>

                    {(curType==="D") &&
                    <select  name="type" placeholder='Type'  required onChange={e => setNewType(e.target.value)}>
                    <option value=''> Select New Role</option>
                    <option value='S'> Sponsor </option>
                    <option value='A'> Admin </option>
                    </select>

                    }
                    {(curType==="S") &&
                    <select  name="type" placeholder='Type'  required onChange={e => setNewType(e.target.value)}>
                    <option value=''> Select New Role</option>
                    <option value='D'> Driver </option>
                    <option value='A'> Admin </option>
                    </select>

                    }
                    {(curType==="A") &&
                    <select  name="type" placeholder='Type'  required onChange={e => setNewType(e.target.value)}>
                    <option value=''> Select New Role</option>
                    <option value='D'> Driver </option>
                    <option value='S'> Sponsor </option>
                    </select>
                    }
                    {newType.length>0 &&
                    <>
                        <button className='viewApp' onClick={changeType}> Change User Role</button>
                    </>
                    }
            </>
            
            }
            
        </div>
    )
}

export default ChangeUser;