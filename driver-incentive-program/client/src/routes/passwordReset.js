import React, { useState, useEffect } from 'react';
//import { ReactSession } from 'react-client-session';
import axios from 'axios';


function PasswordReset() {
    var question = sessionStorage.getItem("question");
    const [username, setUsername] = useState('');
    const [OldPassword, setOldPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    //ReactSession.setStoreType("localStorage");

const getQuestion = () => {
    let url= 'http://54.234.98.88:8000/password/reset/' + username
    axios.get(url).then(res => {
        console.log(res);
        sessionStorage.setItem("question", res.data[0].security_question);
        console.log(sessionStorage.getItem("question"));
        window.location.reload();
    //.catch(err => console.log(err));
})};

    const reset = ()  => {
        //event.preventDefault();
        axios.post('http://54.234.98.88:8000/PasswordReset', {
            username: username,
            answer: answer,
            NewPassword: NewPassword
        }).then(res => {
            console.log(res);
        if(res.data.message){
                setLoginStatus(res.data.message);
               }
        else{ 
            alert("Password reset success");
            question = '';
            sessionStorage.clear();
            //window.location.href = '/'
        }

        //.catch(err => console.log(err));
    })};
    
    if(question == null)
        {
        return(
            <div className="signin">
                <div className='login-form'>
                <div className="title">Password Reset</div>
                <div className='input-container'>
                <input type="text" placeholder="Username" name="username"  
                onChange={e => setUsername(e.target.value)}/></div>
                <div className='button-container'>
                <button onClick = {getQuestion} type="submit">Reset</button></div>
                <h1>{loginStatus}</h1>
            </div>  
        </div>
        )}
    else{
    return (
        <div className="signin">
            <div className='login-form'>
            <div className="title">Password Reset</div>
            <div className='input-container'>
            <input type="text" placeholder="Username" name="username"  
            onChange={e => setUsername(e.target.value)}/></div>
            <div className='input-container'>
            <div>{question}</div>
            <input type="text" placeholder="Answer" name="SecurityAnswer"
            onChange={e => setAnswer(e.target.value)}/></div>
            <div className='input-container'>
            <input type="password" placeholder="New Password" name="NewPassword"
            onChange={e => setNewPassword(e.target.value)}/></div>
            <div className='button-container'>
            <button onClick = {reset} type="submit">Reset</button></div>
            <h1>{loginStatus}</h1>
            </div>  
        </div>
        
        
    )}
}

export default PasswordReset;