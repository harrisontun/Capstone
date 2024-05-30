//import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";


function UserMgmt() {
    var user_type = sessionStorage.getItem("user_type");
    var user_id = window.sessionStorage.getItem("user_id");

    return (
        <div className='userMgmtContainer'>
            <h1> User Management</h1>
            <Link to='/addUser'>
                    <button className='viewApp'> Create New User
                    </button>
                </Link>
                <Link to='/addToSponsor'>
                    <button className='viewApp'> Add User To Sponsor</button>
                </Link>
            <Link to="/removeUser">
                <button className='viewApp'> Remove User From Sponsor</button>
            </Link>
            {(user_type==='A') &&
                <>
                <Link to='/deleteUser'>
                    <button className='viewApp'> Delete Users </button>
                </Link>

                <Link to='/changeUser'>
                    <button className='viewApp'> Change User Type </button>
                </Link>
                
                </>
            }
        </div>
    )

}

export default UserMgmt;
