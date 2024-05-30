import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import Modal from 'react-modal';

// for a sponsor to see applications to their org
function ViewApps() {
   
    const user_id = window.sessionStorage.getItem("user_id");
    const user_type = sessionStorage.getItem("user_type");
    const [appInfo, setAppInfo] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [name, setName] = useState('');
    const [sponsorOrg, setSponsorOrg] = useState('');
    const [sponsorInfo, setSponsorInfo] = useState([])
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [params, setParams] = useState({});
    const [acceptModalOpen, setAcceptModalOpen] = React.useState(false);
    const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
    const [driverID, setDriverID] = useState('')
    const [orgID, setOrgID] = useState('')

    let qParams;


    let ADDR = "http://54.234.98.88:8000"
    
    useEffect(() => {
        if (user_type=="A" || user_type=="D") {
            let url = ADDR + "/sponsors";
            const sponsInfo = async() => {
                axios.get(url)
                .then(res => setSponsorInfo(res.data))
                .catch((err) => console.log(err));
            }
            sponsInfo();
        }
    }, [])

    useEffect( () => {
        let url =  ADDR + "/application/view/" + user_id;
        qParams = new URLSearchParams(params);
        const regAppInfo = async() => {
            axios.get(url, {params: qParams})
            .then(res => setAppInfo(res.data))
            .catch((err) => console.log(err));
        }
        regAppInfo();
    } ,[params]);

    useEffect(() => {
        setParams({
            ...params,
            from: startDate
        })    
    }, [startDate])

    useEffect(() => {
            setParams({
                ...params,
                to: endDate
            })
    }, [endDate])

    useEffect(() => {
            setParams({
                ...params,
                status: status
            })
    }, [status])

    useEffect(() => {   
            setParams({
                ...params,
                name: name
            })
    }, [name])

    useEffect(() => {   
        setParams({
            ...params,
            sponsor: sponsorOrg
        })
}, [sponsorOrg])

function openAcceptModal() {
    setAcceptModalOpen(true);
  }

  function closeAcceptModal() {
    setAcceptModalOpen(false);
  }
  

  function openRejectModal() {
    setRejectModalOpen(true);
  }

  function closeRejectModal() {
    setRejectModalOpen(false);
  }
  
  function acceptApp(applicantID) {
    let url = ADDR+ "/application/accept" 
    console.log(orgID)
    if(user_type=="A") {
        axios.put(url, {            
            user_id: user_id,
            driverID: applicantID,
            description: description,
            orgID: orgID
        }).then(res => window.location.reload())
        .catch((err) => console.log(err));
    }

    if(user_type=="S") {
        axios.put(url, {            
            user_id: user_id,
            driverID: applicantID,
            description: description}).then(res => window.location.reload())
        .catch((err) => console.log(err));
    }

        setDriverID('');
        setOrgID('');
    }

    function rejectApp(applicantID) {
        let url = ADDR + "/application/reject" 
        if(user_type=="A") {
            axios.put(url, {            
                user_id: user_id,
                driverID: applicantID,
                description: description,
                orgID: orgID
            }).then(res => window.location.reload())
            .catch((err) => console.log(err));
        }
    
        if(user_type=="S") {
            axios.put(url, {            
                user_id: user_id,
                driverID: applicantID,
                description: description}).then(res => window.location.reload())
            .catch((err) => console.log(err));
        }
            setDriverID('');
            setOrgID('');

    }

    return (
        <div className="apps-table">
            <h1 className='centerHeader'>Your Applications</h1>
            <form className="filters-container">
                <div className="filter-option">
                <label htmlFor="start">Start Date: </label>
                <input type="date" id="start" min="2023-08-24" max={endDate}
                onChange={e => setStartDate(e.target.value)}/>
                </div>

                <div className="filter-option">
                <label htmlFor="end">End Date: </label>
                <input type="date" id="end" min={startDate} max="2023-12-31" 
                onChange={e => setEndDate(e.target.value)}/>
                </div>

                <div className="filter-option">
                <label htmlFor="status">Status: </label>
                <select name="status" id="status" onChange={e => setStatus(e.target.value)}>
                    <option value="">All    </option>
                    <option value="accepted">Accepted</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
                </div>

            {((user_type==='S') || (user_type==='A')) && 
                <>
                <div className="filter-option">
                <label for="name">Applicant: </label>
                 <input type="search" id="name" placeholder='Driver Name'
                onChange={e => setName(e.target.value)}/>
                </div>
                </> 
            }

            {((user_type==='D') || (user_type==='A')) && 
               <>
               <div className="filter-option">
               <label htmlFor="sponsor">Sponsor Organization: </label>
                <select name="sponsor" placeholder='Sponsor' required onChange={e => setSponsorOrg(e.target.value)}>
                <option value="">All</option>
                {sponsorInfo.map((info) => <option key= {info.Name} value={info.Name}>{info.Name}</option>)}
            </select>
            </div>
               </>
            }
            </form>
            <br></br>

            <table className="apps-table" id="sponsor-apps-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        {(((user_type==='D')||(user_type==='A')) && <> <th>Sponsor</th> </>  )}
                        {(((user_type==='S')||(user_type==='A')) && <> <th>Name</th> </>  )}
                        <th>Status</th>
                        <th>Comments</th>
                        {(((user_type==='S')||(user_type==='A')) && <> <th>Actions</th> </> )}
                    </tr>
                </thead>
                <tbody>
                    {(user_type.length>0) &&
                    <>
                        {appInfo?.map ((item, index) => (
                        <tr key={index} className="appRow">
                            <td>{ new Date(item.Date).toDateString() }</td>
                            {(((user_type==='D')||(user_type==='A')) && <> <td>{ item.Sponsor }</td> </>  )}
                            {(((user_type==='S')||(user_type==='A')) && <> 
                             <td>{ item.FName.charAt(0).toUpperCase() + item.FName.slice(1) + " " + item.LName.charAt(0).toUpperCase() + item.LName.slice(1) }</td> 
                             </>)}
                            <td>{ item.Status.charAt(0).toUpperCase() + item.Status.slice(1) }</td>
                            <td>{ item.Comments && item.Comments.charAt(0).toUpperCase() + item.Comments.slice(1) }</td>
                            {((user_type==='S')|| (user_type==='A')) &&
                            (item.Status==='pending') 
                            ?<td className='cell2Buttons'>
                                 <div className='delete-my-acct-container '>
                                <Modal className='appCommentPopup' isOpen={acceptModalOpen} onRequestClose={closeAcceptModal} contentLabel="Add Comment To Application?">
                                                <h3> Add Comment To Application Acceptance </h3>
                                                <p> Comments are optional. </p>
                                                <label htmlFor='comment'> Comment: </label>
                                                <input type='text' name='comment' maxLength={255} onChange={e => setDescription(e.target.value)}></input>
                                                <button className='acceptButtonPopup' onClick={() => { acceptApp(driverID); closeAcceptModal(); }}> Accept Driver </button>
                                            </Modal>
                                        </div>
                                        <div className='delete-my-acct-container'>
                                            <Modal className='appCommentPopup' isOpen={rejectModalOpen} onRequestClose={closeRejectModal} contentLabel="Add Comment To Application?">
                                                <h3> Add Comment To Application Rejection </h3>
                                                <p> Comments are optional. </p>
                                                <label htmlFor='comment'> Comment: </label>
                                                <input type='text' name='comment' maxLength={255} onChange={e => setDescription(e.target.value)}></input>
                                                <button className='rejectButtonPopup' onClick={() => { rejectApp(driverID); closeRejectModal(); }}> Reject Driver </button>
                                            </Modal>
                                        </div>
                                <button className='acceptButton' onClick={()=>{setDriverID(item.id); if(user_type==='A') {setOrgID(item.OrgID);}  openAcceptModal();}}>Accept</button>  
                                <button className='rejectButton' onClick={()=>{setDriverID(item.id); if(user_type==='A') {setOrgID(item.OrgID);}  openRejectModal()}}>Reject</button> </td> 
                            :<td className='cellButton'>  <Link to='/editProfile'> <button className='viewApp' onClick={() =>  window.sessionStorage.setItem("edit_id", item.user_id)}>View Applicant Profile</button></Link></td> 
                            }
                        </tr>
                    ))}
                    </>
                    }    
                </tbody>
            </table>

        </div>
        
    );
                }
export default ViewApps 
