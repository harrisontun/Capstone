import React, { useState, useEffect } from 'react';
//import { ReactSession } from 'react-client-session';
import axios from 'axios';
import {Link} from "react-router-dom";


function Signin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    //ReactSession.setStoreType("localStorage");

    const signin = ()  => {
        //event.preventDefault();
        axios.post('http://54.234.98.88:8000/signin', {
            username: username,
             password: password
        }).then(res => {
            console.log(res);
        if(res.data.message){
                setLoginStatus(res.data.message);
               }
        else{ setLoginStatus(res.data[0].username)
            sessionStorage.setItem("username", res.data[0].username);
            sessionStorage.setItem("user_id", res.data[0].user_id);
            sessionStorage.setItem("f_name", res.data[0].f_name);
            sessionStorage.setItem("l_name", res.data[0].l_name);
            sessionStorage.setItem("phone_number", res.data[0].phone_number);
            sessionStorage.setItem("address", res.data[0].address);
            sessionStorage.setItem("birthday", res.data[0].birthday);
            sessionStorage.setItem("user_type", res.data[0].user_type);
            sessionStorage.setItem("points", res.data[0].points);
            sessionStorage.setItem("city", res.data[0].city);
            sessionStorage.setItem("state", res.data[0].state);
            sessionStorage.setItem("zip_code", res.data[0].zip_code);

            window.location.href = '/dashboard'
        }

        //.catch(err => console.log(err));
    }
        )};
    return (
        <div className="signin">
            <div className='login-form'>
            <div className="title">Sign In</div>
            <div className='input-container'>
            <input type="text" placeholder="Username" name="username"  
            onChange={e => setUsername(e.target.value)}/></div>
            <div className='input-container'>
            <input type="password" placeholder="Password" name="password"
            onChange={e => setPassword(e.target.value)}/></div>
            <div className='button-container'>
            <button onClick = {signin} type="submit">Login</button></div>
            <h1>{loginStatus}</h1>
            <Link to="/passwordReset">
                    <div>Change Password?</div>
            </Link>
            </div>
            <div>
                <Link to="/application">
                    <div>No account? Click here for application</div>
                </Link>
            </div>     
        </div>
        
        
    );
}

export default Signin;