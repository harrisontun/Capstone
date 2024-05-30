import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ExistingUserApp() {
    var user_id = window.sessionStorage.getItem("user_id");
    const [sponsor, setSponsor] = useState('');
    const [sponsorInfo, setSponsorInfo] = useState([]);
    let ADDR = "http://54.234.98.88:8000"


    useEffect( () => {
        let url = ADDR + '/driver/notAcceptedOrPending/' + user_id;
            const sponsList = async() => {
                axios.get(url)
                .then(res => setSponsorInfo(res.data))
                .catch((err) => console.log(err));
            }
            sponsList();
    }, [user_id])

    const submitApp = () => {
        let url = ADDR + '/application/existingUserApp';
        axios.post(url, {
            user_id: user_id, 
            sponsor_id: sponsor
        }).then(res => {console.log(res)
        }).catch(err => {
            console.log(err)
        });
    }

    function submit() {
        console.log('called')
        let url = ADDR + '/application/existingUserApp';
        axios.post(url, {
            user_id: user_id, 
            sponsor_id: sponsor
        }).then(res => {console.log(res)
        }).catch(err => {
            console.log(err)
        });  
    }

    return (
        <div className='existingApp'>
             
             <br></br>
            {sponsorInfo.length>0 && 
            <form>
               <h1> Application </h1>
                <h3 className="appWarn"> **This application will use your existing profile information** </h3>
                <select name="sponsor" placeholder='Sponsor' required onChange={e => setSponsor(e.target.value)}>
                        <option value={-1}> </option>
                        {sponsorInfo.map((info) => <option key= {info.Name} value={info.SponsorID}>{info.Name}</option>)}
                    </select>
                    <br></br>
                    <button onClick={ submit }> Submit </button>
            </form>
            }
            {sponsorInfo.length===0 && 
            <>
            <div className='noMoreApps'>
                
            <h2> You have already applied and/or currently apart of all sponsors. </h2>
            <h3> Please check back in the future for additional sponsors. </h3>
            <Link to= "/dashboard">
            <button> Return To Dashboard</button>
            </Link>
            </div>
            </>
            }
        </div>

    )
}

export default ExistingUserApp;