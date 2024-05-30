import React, { useState, useEffect } from 'react';
import axios from 'axios';
// sponsors and admin to add existing drivers/sponsors to sponsor orgs
function AddToSponsor() {
    var user_id = window.sessionStorage.getItem("user_id");
    var user_type = sessionStorage.getItem("user_type");

    const [searchTerm, setSearchTerm] = useState(''); // search
    const [drivers, setDrivers] = useState([]);  // all drivers
    const [driver, setDriver] = useState(''); // id of single driver to add

    const [sponsorUsers, setSponsorUsers] = useState([]); // all sponsor users
    const [sponsor, setSponsor] = useState(''); // id of single sponsor to add

    const [sponsorInfo, setSponsorInfo] = useState([]); // list of sponsor orgs
    const [org_id, setOrg_id] = useState(''); // sponsor org id
    const [type, setType] = useState('');
    let ADDR = "http://54.234.98.88:8000";

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
        else {
            let url = ADDR + '/sponsors'
            const list = async() => {
                axios.get(url)
                .then(res => setSponsorInfo(res.data))
                .catch((err) => console.log(err));
            }
            list();
        }
    }, []);

    useEffect( () => {
        // admin can add any sponsors to a sponsor org
        if (type=='S' && user_type=='A') {
             let url = ADDR + '/sponsor/viewAll';
            const sponsorList = async() => {
                axios.post(url, {
                    searchTerm : searchTerm})
                .then(res => setSponsorUsers(res.data))
                .catch((err) => console.log(err));
            }
            sponsorList();
        }

        // sponsors can only add sponsor users not tied to another org 
        else if(type=='S' && user_type=='S') {
            let url = ADDR + '/sponsor/noOrg';
           const sponsorList = async() => {
               axios.post(url, {
                searchTerm : searchTerm})
               .then(res => setSponsorUsers(res.data))
               .catch((err) => console.log(err));
           }
           sponsorList(); 
        }
        // sponsors and admin can add any driver to a sponsor org
        else if(type=='D') {
            let url = ADDR + '/driver/viewAll';
            const driverList = async() => {
                axios.post(url, {
                    searchTerm : searchTerm})
                .then(res => setDrivers(res.data))
                .catch((err) => console.log(err));
            }
            driverList();
        }
        
    }, [searchTerm, ADDR, type])


    // for adding drivers, limit list to orgs. they are not a part of
    useEffect( () => {
        if (type=="D") {
            let url = ADDR + '/driver/notAccepted/' + driver;
            const sponsList = async() => {
                axios.get(url)
                .then(res => setSponsorInfo(res.data))
                .catch((err) => console.log(err));
            }
            sponsList();
        }

    }, [driver, ADDR])

    const addDriverToSponsor = () => {
        
        let url = ADDR + "/driver/addExisting";
        axios.post(url, {
            user_id: user_id,
            sponsor_id: org_id,
            driver_id: driver})
            .then(res => {console.log(res)})
            .catch((err) => console.log(err));

    }


    const addSponsorToSponsor = () => {
        let url = ADDR + "/sponsor/addExisting";
        axios.post(url, {
            user_id: user_id,
            org_id: org_id,
            sponsor_id: sponsor})
        .then(res => {console.log(res)})
        .catch((err) => console.log(err));
    }

    return (
        
        
        <div className="addToSponsor">
            <form>
            <h2> Add User To Sponsor </h2>
            <label htmlFor='type'> Type of User To Add: </label>
            <select name='type' placeholder='User Type' onChange={e => setType(e.target.value)}> 
            <option value=''> </option>
            <option value="D">Driver</option>
            <option value="S">Sponsor</option>
            </select>

            {(type==='D') && 
            <>
                <label htmlFor="driverName"> Name: </label>
                <input name="driverName" type="text" placeholder="Search Drivers" onChange={e => setSearchTerm(e.target.value)}></input>
                <br></br>
                <select name="driver" placeholder='Driver' required  onChange={e => setDriver(e.target.value)}>
                    <option value=""> Select Driver </option>
                    {drivers.map((info) => <option key= {info.user_id} value={info.user_id}>{info.f_name} {info.l_name} ({info.username})</option>)}
                    </select>

                <br></br>
                {(driver.length>0 && user_type==='A')&&
                <>
                <select name="sponsors" placeholder='Sponsor'  required onChange={e => setOrg_id(e.target.value)}>
                <option value=''> Select Sponsor</option>
                {sponsorInfo.map((info) => <option key= {info.SponsorID} value={info.SponsorID}>{info.Name} </option>)}
                </select>
                <br></br>
                </>
                }
                <button onClick={() => addDriverToSponsor()}> Add To Sponsor</button>
            </>
            }

            {(type==='S') && 
            <>
                <label> Name: </label>
                <input name='sponsorName' type='text' placeholder='Search Sponsors' onChange={e => setSearchTerm(e.target.value)}></input>
                <br></br>

                <select name='sponsor' placeholder='Sponsor' required onChange={e => setSponsor(e.target.value)}>
                    <option value=''>Select Sponsor</option>
                    {sponsorUsers.map((info) => <option key={info.user_id} value={info.user_id}>{info.f_name} {info.l_name} ({info.username} </option>)}
                </select>
                <br></br>

                {(sponsor.length>0 && user_type==='A')&&
                <>
                <select name="sponsors" placeholder='Sponsor'  required onChange={e => setOrg_id(e.target.value)}>
                    <option value=''>Select Sponsor Org</option>
                {sponsorInfo.map((info) => <option key= {info.SponsorID} value={info.SponsorID}>{info.Name} </option>)}
                </select>
                <br></br>
                </>
                }
                 <button onClick={() => addSponsorToSponsor()}> Add To Sponsor</button>
            </>
            }

            
            </form>

        </div>
    )
}

export default AddToSponsor;