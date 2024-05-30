import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

//For exporting log to CSV
import { saveAs } from 'file-saver';

function Dashboard() {
    var user_type = sessionStorage.getItem("user_type");
    var user_id = window.sessionStorage.getItem("user_id");
    var view = window.sessionStorage.getItem("view");
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [sponsorInfo, setSponsorInfo] = useState([]);
    const [sponsor_id, setSponsor_id] = useState('');
    const [PointsAmt, setPointsAmt] = useState('');
    //For exporting log to CSV
    const [auditLog, setAuditLog] = useState([]);
    const [currSponsor, setCurrSponsor] = useState('');
    //Purchase History
    const [purchaseHistory, setPurchaseHistory] = useState([]);

    //Sponsor Audit Log
    /*const getPurchaseHistory = () => {
        axios.get('http://54.234.98.88:8000/purchaseHistory/orderHistory/' + user_id)
        .then(res => {
            setPurchaseHistory(res.data);
            convertToCSVPH(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };*/

    /*const convertToCSVPH = (log) => {
        if (!log || log.length === 0) {
            console.error('Cannot create log');
            return;
        }

        const csvRows = [];
        const headers = Object.keys(log[0]);

        csvRows.push(headers.join(','));

        log.forEach(row => {
            const data = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(data.join(','));
        });

        const csvString = csvRows.join('\n');
        //blob = Binary Large Object
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

        saveAs(blob, 'PurchaseHistory.csv');
    }*/

    //Sponsor Audit Log
    const getAuditLogSponsor = () => {
        axios.get('http://54.234.98.88:8000/getAuditLogData')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    //Admin Audit Log
    const getAuditLogApps = () => {
        axios.get('http://54.234.98.88:8000/getAuditLogApps')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const getAuditLogPoints = () => {
        axios.get('http://54.234.98.88:8000/getAuditLogPoints')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const getAuditLogPass = () => {
        axios.get('http://54.234.98.88:8000/getAuditLogPass')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const getAuditLogLogin = () => {
        axios.get('http://54.234.98.88:8000/getAuditLogLogin')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const convertToCSV = (log) => {
        if (!log || log.length === 0) {
            console.error('Cannot create log');
            return;
        }

        const csvRows = [];
        const headers = Object.keys(log[0]);

        csvRows.push(headers.join(','));

        log.forEach(row => {
            const data = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(data.join(','));
        });

        const csvString = csvRows.join('\n');
        //blob = Binary Large Object
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

        saveAs(blob, 'auditLog.csv');
    }

    //Handle dropdown for admin audit logs
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelection = (event) => {
        setSelectedOption(event.target.value);
    }

    const handleDownload = () => {
        switch (selectedOption) {
            case '1':
                getAuditLogApps();
                break;
            case '2':
                getAuditLogPoints();
                break;
            case '3':
                getAuditLogPass();
                break;
            case '4':
                getAuditLogLogin();
                break;
            default:
                break;
        }
    }

    //DOESNT WORK YET
    
    const modPoints = (points_id) => {
        axios.post('http://54.234.98.88:8000/modPoints2', {
            user_id: points_id,
            PointsAmt: PointsAmt,
            sponsor_id: sponsor_id
        }).then(res => {
            console.log(res);
            //window.location.reload();
        //.catch(err => console.log(err));
    }
)};
    const editUser = (user_id) =>{
      window.sessionStorage.setItem("edit_id", user_id);
      window.location.href = '/editProfile';  
    };

    const getSponsorID = () => {
        axios.post('http://54.234.98.88:8000/getSponsorID', {
            user_id: user_id
        }).then(res => {
            console.log(res);
            setSponsor_id(res.data[0].sponsor_id);
            //window.location.reload();
        //.catch(err => console.log(err));
    }   
    );}
    
    const getSponsorDrivers = () => {
        getSponsorID();
        axios.post('http://54.234.98.88:8000/getSponsorDrivers', {
            sponsor_id: sponsor_id
        }).then(res => { setSponsorInfo(res.data)
            
    });}

const searchDrivers = () => {
    axios.post('http://54.234.98.88:8000/searchDrivers', {
        searchTerm: searchTerm
    }).then(res => {
        console.log(res);
        setResults(res.data)
    //.catch(err => console.log(err));
})};

    function deleteUser(userToDelete) {
        let url = 'http://54.234.98.88:8000/user/delete';
        const deleteUser = async() => {
            axios.put(url, {
                userID: user_id,
                userToDelete: userToDelete
            })
            .catch((err) => console.log(err)); }
            deleteUser();
    }

    function removeDriver(driverID) {
        let url = 'http://54.234.98.88:8000/driver/remove';
        const remove = async() => {
            axios.put(url, {
                user_id: user_id,
                sponsor_id: sponsor_id,  // need to adjust for admins who can see mult. sponsors
                driver_id: driverID
            })
            .catch((err) => console.log(err)); }
            remove();
    }

    const getDriverInfo = () => {
        axios.post('http://54.234.98.88:8000/getDriverInfo', {
            user_id: user_id
        }).then(res => {
            console.log(res);
            setResults(res.data)
        //.catch(err => console.log(err));
    })};

    const getSponsorName = (sponsor_id) => {
        axios.post('http://54.234.98.88:8000/getSponsorName', {
            sponsor_id: sponsor_id
        }).then(res => {
            console.log(res);
            setCurrSponsor(res.data[0].Name);
        //.catch(err => console.log(err));
    })};

    const driverView = () =>{
        window.sessionStorage.setItem("view", "D");
        window.location.reload();
    }
    const adminView = () =>{
        window.sessionStorage.setItem("view", "A");
        window.location.reload();
    }

    const sponsorView = () =>{
        window.sessionStorage.setItem("view", "S");
        window.location.reload();
    }

    if(user_type == "A" && view != "D" && view != "S"){
    return (
        <div className="dashboard-container">
            <div classname = "dashboard"> 
            <h1 class="centerHeader">ADMIN DASHBOARD</h1>
            <input type="text" placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></input>
            <button className="btn" onClick={searchDrivers}>Search</button>
            <button className="btn" onClick={driverView}>View as Driver</button>
            <button className="btn" onClick={sponsorView}>View as Sponsor</button>
            {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>User Type</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.user_type}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <button onClick={(() => editUser(i.user_id))}>Edit Profile</button>
                                </td>
                                <td> </td>
                                <td>
                                <button onClick={() => deleteUser(i.user_id)}>Delete User</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}            
            </div>
            <section>
                <h3>Audit Log:</h3>
                <select value={selectedOption} onChange={handleSelection}>
                    <option value="">Select an option</option>
                    <option value="1">Driver Applications</option>
                    <option value="2">Point Changes</option>
                    <option value="3">Password Changes</option>
                    <option value="4">Login Attempts</option>
                </select>
                <button className="btn" onClick={handleDownload}>Download as CSV</button>
            </section>
        </div>
    )}
    if(user_type == "D"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>DRIVER DASHBOARD</h1>
                <Link to="/existingUserApp">
                     <button> Apply to New Sponsor </button>
                </Link>
                <button className="btn" onClick={getDriverInfo}>View Sponsors</button>
                {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Sponsor Name</th>
                            <th>Sponsor ID</th>
                            <th>Status</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.Name}</td>
                                <td>{i.sponsor_id}</td>
                                <td>{i.status}</td>
                                <td>{i.points}</td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </section>
            
            </div>
    )}
    if(user_type == "A" && view =="D"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>DRIVER DASHBOARD</h1>
                <Link to="/existingUserApp">
                     <button> Apply to New Sponsor </button>
                </Link>
                <button className="btn" onClick={getDriverInfo}>View Sponsors</button>
                <button className="btn" onClick={adminView}>View as Admin</button>
                {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Sponsor Name</th>
                            <th>Sponsor ID</th>
                            <th>Status</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.Name}</td>
                                <td>{i.sponsor_id}</td>
                                <td>{i.status}</td>
                                <td>{i.points}</td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </section>
            
            </div>
    )}

    if(user_type == "S"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>SPONSOR DASHBOARD</h1>
                <Link to="/viewApps">
                    <button>View Applications</button>
                </Link>
                <button className="btn" onClick={getSponsorDrivers}>View Drivers</button>
                {sponsorInfo.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Points</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sponsorInfo.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.points}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <input type="text" placeholder="Amount" name="PointsAmt"
                                    onChange={e => setPointsAmt(e.target.value)}/>
                                    <button onClick = {(() => modPoints(i.user_id))} type="submit">Add/Subtract Points</button>
                                </td>
                                <td>
                                <button onClick={() => removeDriver(i.user_id)}>Remove Driver</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </section>
            <section>
                <h3>Audit Log:</h3>
                <button className="btn" onClick={getAuditLogSponsor}>Download as CSV</button>
            </section>
            </div>
    )}

    if(user_type == "A" && view =="S"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>SPONSOR DASHBOARD</h1>
                <Link to="/viewApps">
                    <button>View Applications</button>
                </Link>
                <button className="btn" onClick={getSponsorDrivers}>View Drivers</button>
                <button className="btn" onClick={adminView}>View as Admin</button>
                {sponsorInfo.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Points</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sponsorInfo.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.points}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <input type="text" placeholder="Amount" name="PointsAmt"
                                    onChange={e => setPointsAmt(e.target.value)}/>
                                    <button onClick = {(() => modPoints(i.user_id))} type="submit">Add/Subtract Points</button>
                                </td>
                                <td>
                                <button onClick={() => removeDriver(i.user_id)}>Remove Driver</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </section>
            <section>
                <h3>Audit Log:</h3>
                <button className="btn" onClick={getAuditLogSponsor}>Download as CSV</button>
            </section>
            </div>
    )}
}

export default Dashboard;

/*
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

//For exporting log to CSV
import { saveAs } from 'file-saver';

function Dashboard() {
    var user_type = sessionStorage.getItem("user_type");
    var user_id = window.sessionStorage.getItem("user_id");
    //var currSponsorName = "";
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [sponsorInfo, setSponsorInfo] = useState([]);
    const [sponsor_id, setSponsor_id] = useState('');
    const [currSponsor, setCurrSponsor] = useState('');
    //const [points_id, setPoints_id] = useState('');
    const [PointsAmt, setPointsAmt] = useState('');
    const [searchTermSponsor, setSearchTermSponsor] = useState('');
    const [searchTermAdmin, setSearchTermAdmin] = useState('');
    const [sponsorUsers, setSponsorUsers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);

    //For exporting log to CSV
    const [auditLog, setAuditLog] = useState([]);

    //Change to getAuditLog query
    //Sponsor Audit Log
    const getAuditLogSponsor = () => {
        axios.get('http://54.234.98.88:8000/sponsors')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    //Admin Audit Log
    const getAuditLogApps = () => {
        axios.get('http://54.234.98.88:8000/sponsors')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const getAuditLogPoints = () => {
        axios.get('http://54.234.98.88:8000/sponsors')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const getAuditLogPass = () => {
        axios.get('http://54.234.98.88:8000/sponsors')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const getAuditLogLogin = () => {
        axios.get('http://54.234.98.88:8000/sponsors')
        .then(res => {
            setAuditLog(res.data);
            convertToCSV(res.data);
        })
        .catch(error => {
            console.log('Error Getting Data: ', error);
        });
    };

    const convertToCSV = (log) => {
        if (!log || log.length === 0) {
            console.error('Cannot create log');
            return;
        }

        const csvRows = [];
        const headers = Object.keys(log[0]);

        csvRows.push(headers.join(','));

        log.forEach(row => {
            const data = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(data.join(','));
        });

        const csvString = csvRows.join('\n');
        //blob = Binary Large Object
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

        saveAs(blob, 'auditLog.csv');
    }

    //Handle dropdown for admin audit logs
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelection = (event) => {
        setSelectedOption(event.target.value);
    }

    const handleDownload = () => {
        switch (selectedOption) {
            case '1':
                getAuditLogApps();
                break;
            case '2':
                getAuditLogPoints();
                break;
            case '3':
                getAuditLogPass();
                break;
            case '4':
                getAuditLogLogin();
                break;
            default:
                break;
        }
    }

    const modPoints = (points_id) => {
        axios.post('http://54.234.98.88:8000/modPoints2', {
            user_id: points_id,
            PointsAmt: PointsAmt,
            sponsor_id: sponsor_id
        }).then(res => {
            console.log(res);
            //window.location.reload();
        //.catch(err => console.log(err));
    }
)};
    //DOESNT WORK YET
    
    const getSponsorID = () => {
        axios.post('http://54.234.98.88:8000/getSponsorID', {
            user_id: user_id
        }).then(res => {
            console.log(res);
            setSponsor_id(res.data[0].sponsor_id);
            //window.location.reload();
        //.catch(err => console.log(err));
    }   
    );}
    
    const getSponsorDrivers = () => {
        getSponsorID();
        axios.post('http://54.234.98.88:8000/getSponsorDrivers', {
            sponsor_id: sponsor_id
        }).then(res => { setSponsorInfo(res.data)
            
    });}

const searchDrivers = () => {
    axios.get('http://54.234.98.88:8000/searchDrivers', {
        searchTerm: searchTerm
    }).then(res => {
        console.log(res);
        setResults(res.data)
    //.catch(err => console.log(err));
})};

const getDriverInfo = () => {
    axios.post('http://54.234.98.88:8000/getDriverInfo', {
        user_id: user_id
    }).then(res => {
        console.log(res);
        setResults(res.data)
    //.catch(err => console.log(err));
})};

const getSponsorName = (sponsor_id) => {
    axios.post('http://54.234.98.88:8000/getSponsorName', {
        sponsor_id: sponsor_id
    }).then(res => {
        console.log(res);
        setCurrSponsor(res.data[0].Name);
    //.catch(err => console.log(err));
})};
    function deleteUser(userToDelete) {
        let url = 'http://54.234.98.88:8000/user/delete' + userToDelete;
        const deleteUser = async() => {
            axios.put(url, {params: {
                user_id: user_id,

            }})
            .catch((err) => console.log(err)); }
            deleteUser();
    }

    const searchSponsors = () => {
        axios.get('http://54.234.98.88:8000/sponsor/viewAll', {params: {
            searchTerm: searchTermSponsor
        }
        }).then(res => {
            console.log(res);
            setSponsorUsers(res.data)
    })
    .catch(err => console.log(err));
};

    const searchAdmin = () => {
        axios.get('http://54.234.98.88:8000/admin/viewAll', {params: {
            searchTerm: searchTermAdmin
        }
        }).then(res => {
            console.log(res);
            setAdminUsers(res.data)
    }).catch(err => console.log(err));};

    function removeDriver(driverID) {
        let url = 'http://54.234.98.88:8000/user/delete' + driverID;
        const remove = async() => {
            axios.put(url, {params: {
                sponsorOrgID: sponsorInfo,
            }})
            .catch((err) => console.log(err)); }
            remove();
    }

    if(user_type == "A"){
    return (
        <div className="dashboard-container">
            <div classname = "dashboard"> 
            <h1 class="centerHeader">ADMIN DASHBOARD</h1>
            <input type="text" placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></input>
            <button className="btn" onClick={searchDrivers}>Search</button>
            {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Points</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.points}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <button>Edit Profile</button>
                                </td>
                                <td>
                                    <button onClick={deleteUser(i.user_id)}>Delete User</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            <br></br>

            <h2>Sponsor Users</h2>
            <input type="text" placeholder="Search Sponsors" onChange={e => setSearchTermSponsor(e.target.value)}></input>
            <button className="btn" onClick={searchSponsors}>Search</button>
            {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Sponsor</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sponsorUsers.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.Name}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <button>Edit Profile</button>
                                </td>
                                <td>
                                    <button onClick={deleteUser(i.user_id)}>Delete User</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}

            <h2>Admin Users</h2>
            <input type="text" placeholder="Search Admin" onChange={e => setSearchTermAdmin(e.target.value)}></input>
            <button className="btn" onClick={searchAdmin}>Search</button>
            {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Sponsor</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {adminUsers.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.Name}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <button>Edit Profile</button>
                                </td>
                                <td>
                                    <button onClick={deleteUser(i.user_id)}>Delete User</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </div>
            <section>
                <h3>Audit Log:</h3>
                <select value={selectedOption} onChange={handleSelection}>
                    <option value="">Select an option</option>
                    <option value="1">Driver Applications</option>
                    <option value="2">Point Changes</option>
                    <option value="3">Password Changes</option>
                    <option value="4">Login Attempts</option>
                </select>
                <button className="btn" onClick={handleDownload}>Download as CSV</button>
            </section>
        </div>
    )}
    if(user_type == "D"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>DRIVER DASHBOARD</h1>
                <button className="btn" onClick={getDriverInfo}>View Sponsors</button>
                {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Sponsor Name</th>
                            <th>Sponsor ID</th>
                            <th>Status</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{(() => getSponsorName(i.sponsor_id))}{currSponsor}</td>
                                <td>{i.sponsor_id}</td>
                                <td>{i.status}</td>
                                <td>{i.points}</td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </section>
            <section>
                <h3>Purchase History</h3>
            </section>
            </div>
    )}
    if(user_type == "S"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>SPONSOR DASHBOARD</h1>
                <Link to="/viewApps">
                    <button>View Applications</button>
                </Link>
                <button className="btn" onClick={getSponsorDrivers}>View Drivers</button>
                {sponsorInfo.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Points</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sponsorInfo.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.points}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <input type="text" placeholder="Amount" name="PointsAmt"
                                    onChange={e => setPointsAmt(e.target.value)}/>
                                    <button onClick = {(() => modPoints(i.user_id))} type="submit">Add/Subtract Points</button>
                                </td>
                                <td>
                                    <button onClick={removeDriver(i.user_id)}>Remove Driver</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            <input type="number" placeholder="Dollar Amount"/>
            <button type="submit">Set Dollar Amount for Driver Points</button>
            </section>
            <section>
                <h3>Audit Log:</h3>
                <button className="btn" onClick={getAuditLogSponsor}>Download as CSV</button>
            </section>
            </div>
    )}
}

export default Dashboard;


import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";


function Dashboard() {
    var user_type = sessionStorage.getItem("user_type");
    var user_id = window.sessionStorage.getItem("user_id");
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [sponsorInfo, setSponsorInfo] = useState([]);
    const [sponsor_id, setSponsor_id] = useState('');

    //DOESNT WORK YET
    
    const getSponsorID = () => {
        axios.get('http://54.234.98.88:8000/getSponsorID', {
            user_id: user_id
        }).then(res => {
            console.log(res);
            setSponsor_id(res.data[0].sponsor_id);
            //window.location.reload();
        //.catch(err => console.log(err));
    }   
    );}
    
    const getSponsorDrivers = () => {
        getSponsorID();
        axios.get('http://54.234.98.88:8000/getSponsorDrivers', {
            sponsor_id: sponsor_id
        }).then(res => { setSponsorInfo(res.data)
            
    });}

const searchDrivers = () => {
    axios.get('http://54.234.98.88:8000/searchDrivers', {
        searchTerm: searchTerm
    }).then(res => {
        console.log(res);
        setResults(res.data)
    //.catch(err => console.log(err));
})};

    function deleteUser(userToDelete) {
        let url = 'http://54.234.98.88:8000/user/delete';
        const deleteUser = async() => {
            axios.put(url, {
                userID: user_id,
                userToDelete: userToDelete
            })
            .catch((err) => console.log(err)); }
            deleteUser();
    }

    function removeDriver(driverID) {
        let url = 'http://54.234.98.88:8000/user/remove';
        const remove = async() => {
            axios.put(url, {
                user_id: user_id,
                sponsor_id: sponsor_id,  // need to adjust for admins who can see mult. sponsors
                driver_id: driverID
            })
            .catch((err) => console.log(err)); }
            remove();
    }

    if(user_type == "A"){
    return (
        <div className="dashboard-container">
            <div classname = "dashboard"> 
            <h1 class="centerHeader">ADMIN DASHBOARD</h1>
            <input type="text" placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></input>
            <button className="btn" onClick={searchDrivers}>Search</button>
            {results.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Points</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.points}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <button>Edit Profile</button>
                                </td>
                                <td> </td>
                                <td>
                                <button onClick={() => deleteUser(i.user_id)}>Delete User</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}            
            </div>
        </div>
    )}
    if(user_type == "D"){
        return (
            <div className="dashboard">
                <h1>DRIVER DASHBOARD</h1>
                <Link to="/existingUserApp">
                     <button> Apply to New Sponsor </button>
                </Link>
            </div>
    )}
    if(user_type == "S"){
        return (
            <div className="dashboard-container">
            <section classname = "dashboard"> 
                <h1>SPONSOR DASHBOARD</h1>
                <Link to="/viewApps">
                    <button>View Applications</button>
                </Link>
                <button className="btn" onClick={getSponsorDrivers}>View Drivers</button>
                {sponsorInfo.length && (
                <table class='styled-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Points</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sponsorInfo.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td>{i.username}</td>
                                <td>{i.f_name} {i.l_name}</td>
                                <td>{i.points}</td>
                                <td>{i.user_id}</td>
                                <td>
                                    <button>Add/Substract Points</button>
                                </td>
                                <td>
                                <button onClick={() => removeDriver(i.user_id)}>Remove Driver</button>
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                    </tbody>
                </table>
            )}
            </section>
            </div>
    )}
}

export default Dashboard;
*/