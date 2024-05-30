import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

function RemoveUser() {
    var user_id = window.sessionStorage.getItem("user_id");
    var user_type = sessionStorage.getItem("user_type");

    const [drivers, setDrivers] = useState([]); // list of driver users to potentially remove
    const [sponsors, setSponsors] = useState([]); // list of sponsor users to potentially remove
    const [searchTerm, setSearchTerm] = useState(''); // search term for user
    const [user, setUser] = useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [type, setType] = useState('');
    const [org_id, setOrg_id] = useState(''); // sponsor org id
    const [driversSponsors, setDriversSponsors] = useState([]); // for admin to see all the sponsors an admin has


    let ADDR = "http://54.234.98.88:8000";

        // if sponsor user, only get drivers and sponsors from their org
    useEffect(() => {
        if(user_type=='S') {
            let url = ADDR + '/sponsor/' + user_id;
            const sponsID = async() => {
                axios.get(url)
                .then(res => setOrg_id(res.data[0].SponsorID))
                .catch((err) => console.log(err));
            }
            sponsID();
        }
    }, []);

    // if sponsor user, only get drivers and sponsors from their org
    useEffect(() => {
        if(user_type=='S') {
            if(type=="D") {
                let url = ADDR + '/sponsor/drivers/' + org_id;
                let params = { searchTerm: searchTerm }
                let qParams = new URLSearchParams(params)
                const driversFromOrg = async () => {
                    axios.get(url, { params: qParams })
                        .then(res => setDrivers(res.data))
                        .catch((err) => console.log(err));
                }
                driversFromOrg();

            }
            if (type=="S") {
                let url = ADDR + '/sponsor/org/' + org_id;
                let params2 = { org_id: org_id, searchTerm: searchTerm }
                let qParams2 = new URLSearchParams(params2)
                const sponsorsFromOrg = async () => {
                    axios.post(url, { params: qParams2 })
                        .then(res => setSponsors(res.data))
                        .catch((err) => console.log(err));
                }
                sponsorsFromOrg();
            }
                       
        }
        else if (user_type=='A') {
            if (type=="D") {
                let url = ADDR + '/driver/viewAllCurrent';
                let params= {searchTerm:searchTerm}
                let qParams = new URLSearchParams(params)
                const getDrivers = async() => {
                    axios.post(url, {searchTerm:searchTerm})
                    .then(res => setDrivers(res.data))
                    .catch((err) => console.log(err));
                }
                getDrivers();
            }

            if (type=="S") {
                let url = ADDR + '/sponsor/searchTerm';
                let params2= {searchTerm:searchTerm}
                let qParams2 = new URLSearchParams(params2)
                const getSponsors = async() => {
                    // axios.get(url, {params:qParams2})
                    // .then(res => setSponsors(res.data))
                    // .catch((err) => console.log(err));
                    axios.post(url, {searchTerm:searchTerm})
                    .then(res => setSponsors(res.data))
                    .catch((err) => console.log(err));
                }
                getSponsors();       

            }
        }
    }, [org_id, searchTerm, type]);
    
    useEffect(() => {
        if (user_type=='A') {
            let url = ADDR + '/driver/currentSponsors/' + user;
            const getSponsors = async() => {
                axios.get(url)
                .then(res => setDriversSponsors(res.data))
                .catch((err) => console.log(err));
            }
            getSponsors();   
        }
    }, [user])


    function openModal() {
        setIsOpen(true);
      }

      function closeModal() {
        setIsOpen(false);
      }
      function removeUser() {
        if (type=='D') {
            let url = ADDR + "/driver/remove";
            axios.put(url, {user_id:user_id, sponsor_id: org_id ,driver_id: user}).then(res=>console.log(res))
            .catch((err) => console.log(err));
            setUser('');
            setType('')
            console.log(user)
            console.log(type)
            setDriversSponsors([])
        }
        else {
                let url = ADDR + "/sponsor/remove";
                axios.put(url, {user_id:user_id, user_to_remove: user}).then(res=>console.log(res))
                .catch((err) => console.log(err));
                setUser('');
              }
        }



    return (
        <div className='deleteUsers'> 

            {(user_type==='A' || user_type==='S') && 
                    <>
                    <h1> Remove Users From Sponsor Organization </h1>
                    <div className="removeButtonOptionContainer"> 
                    <button className='removeButtonOption' onClick={() => setType("D")}> Remove Driver </button>
                    <button className='removeButtonOption' onClick={() => setType("S")}> Remove Sponsor </button>
                    </div>
                    {(type==="D") && 
                    <>
                    <input name="name" type="text" placeholder="Name" onChange={e => {setSearchTerm(e.target.value)}}></input>
                    <select name="name" placeholder='Driver' required  onChange={e => setUser(e.target.value)}>
                    <option value=""> Select User to Remove </option>
                    {drivers.map((info) => <option key= {info.user_id} value={info.user_id}>{info.f_name} {info.l_name} ({info.username})</option>)}
                    </select>
                    </>
                    }

                    {(type==="S") &&
                    <>
                    <input name="name" type="text" placeholder="Name" onChange={e => {setSearchTerm(e.target.value)}}></input>
                    <select name="name" placeholder='Driver' required  onChange={e => setUser(e.target.value)}>
                    <option value=""> Select User to Remove </option>
                    {sponsors.map((info) => <option key= {info.user_id} value={info.user_id}>{info.f_name} {info.l_name} ({info.username})</option>)}                    </select>
                    </>
                    }
                   
                   <br></br>
                    {(user_type==='A' && type==='D') &&
                    
                    <>
                    <select placeholder='Sponsor Org' required onChange={e => setOrg_id(e.target.value) }> 
                    <option value=""> Select Organization to Remove From </option>
                    {driversSponsors.map((info) => <option key= {info.SponsorID} value={info.SponsorID}> {info.Name}</option>)}
                    </select>
                    </>
                    }
                   {(user.length > 0) &&
                     <button className='delete-my-acct' onClick={openModal}> Remove User From Sponsor</button> 
                   }
                   
                    <div className='delete-my-acct-container'>

                    <Modal className='delete-my-acct-popup' isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Are you sure you want to delete user?">
    
                        <h3> Are you sure you want to remove this user from sponsor? </h3>
                        <p> This action cannot be undone. </p>
                        <button className='delete-my-acct' onClick={()=> {removeUser(); closeModal();}} > Yes, remove. </button>
                        <button className='gray-button' onClick={closeModal}> No, cancel. </button>
                    </Modal>  
                    </div>

                    </>
                }
        </div>
        
    )

}

export default RemoveUser;