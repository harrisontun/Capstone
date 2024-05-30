import React, { useState, useEffect } from "react";
import axios from 'axios';

function AddUser() {
    const [username, setUsername] = useState('');
    const [type, setType] = useState('');
    const [sponsorInfo, setSponsorInfo] = useState([]);
    const [sponsor, setSponsor] = useState('');
    const [postURL, setPostURL] = useState('');
    const [serverRes, setServerRes] = useState('');
    let requester = sessionStorage.getItem("user_type");
    let user_id = sessionStorage.getItem("user_id");
    let baseURL = "http://54.234.98.88:8000";
    let userAdded=false;

    useEffect( () => {
        if (requester==='A') {
            let url = baseURL + '/sponsors';
            const sponsList = async() => {
                axios.get(url)
                .then(res => setSponsorInfo(res.data))
                .catch((err) => console.log(err));
            }
            sponsList();
        }

        if (requester==='S') {
            let url = baseURL + '/sponsor/' + user_id ;
            const getSponsID = async() => {
                axios.get(url)
                .then(res => setSponsor(res.data[0].SponsorID))
                .catch((err) => console.log(err));
            }
            getSponsID();
        }
        if(!type) {setType('D');}
    }, [type, requester]);


    useEffect(() => {
        switch(type) {
            case 'D':
                setPostURL(baseURL+"/driver/add");
                break;
            case 'S':
                setPostURL(baseURL+"/sponsor/add");
                break;
            case 'A':
                setPostURL(baseURL+"/admin/add");
                break;
            default:
                setPostURL(baseURL+"/driver/add");
                break;
        }
}, [type])


    const create = async (e) => {
        e.preventDefault();

        if (type === 'D' || type === 'S') {    
            try {
                const response = await axios.post(postURL, {
                    username: username,
                    user_id: user_id,
                    sponsor_id: sponsor
                });
                if (!JSON.stringify(response.data).includes('failed')) {
                    console.log(response.data)
                    let msg = "Password is " + response.data + "\n After logging in, user can finish setting up profile and change password. \n This password is needed to set account up."
                    setServerRes(msg)
                }
                else if (JSON.stringify(response.data).includes("Username")) {
                    setServerRes("Username taken.")
                }
                else if (JSON.stringify(response.data).includes('failed')) {
                    setServerRes("Failed to add user.")
                }
                
               
            } catch (error) {
                console.error('Error adding user: ', error);
            }
        } else {
            try {
                const response = await axios.post(postURL, {
                    username: username,
                    user_id: user_id,
                });
                if (!JSON.stringify(response.data).includes('failed')) {
                    console.log(response.data)
                    let msg = "Password is " + response.data + "\n After logging in, user can finish setting up profile and change password. \n This password is needed to set account up."
                    setServerRes(msg)
                }
                else if (JSON.stringify(response.data).includes("Username")) {
                    setServerRes("Username taken.")
                }
                else if (JSON.stringify(response.data).includes('failed')) {
                    setServerRes("Failed to add user.")
                }
            } catch (error) { console.error('Error adding user: ', error);}
        }
    };
    
    return (
        
        <div className="addUser">
            <h2> Add User </h2>
            <form className="addUserForm">
                <label htmlFor="type">User Role</label>
                <select name="type" onChange={e=>setType(e.target.value)}>
                <option value={-1}> </option>
                    <option value='D'>Driver</option>
                    <option value='S'>Sponsor</option>
                    {requester==='A' && <option value='A'>Admin</option>}
                </select>
                <br></br>
                <label htmlFor="username">Username</label>
                <input name="username" placeholder="Username" onChange={e=>setUsername(e.target.value)}></input>
                {(((type==='D' )|| (type==='S')) && (requester==='A')) && 
                    <>
                    <label htmlFor="sponsor">Sponsor</label>
                    <select name="sponsor" placeholder='Sponsor' required onChange={e => setSponsor(e.target.value)}>
                        <option value={-1}> </option>
                        {sponsorInfo.map((info) => <option key= {info.Name} value={info.SponsorID}>{info.Name}</option>)}
                    </select>
                    </>
                }
                <br></br>
                <button  onClick={(e) => create(e)}>Create User</button>
            </form>
            {serverRes.length>0 &&
            <>
            <h3> {serverRes} </h3>
            </>
            }
            
        </div>
    )
}

export default AddUser;