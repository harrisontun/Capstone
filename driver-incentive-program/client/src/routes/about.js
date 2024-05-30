import React, { useState, useEffect } from 'react';
import axios from 'axios';

function About() {

    //Connect to EC2 Instance
    const url = "http://54.234.98.88:8000/about";
    const [aboutInfo, setAboutInfo] = useState([]);


    //Use axios to get information from the about table
    useEffect( () => {
        const regAboutInfo = async() => {
            axios.get(url)
            .then(res => setAboutInfo(res.data))
            .catch((err) => console.log(err));
        }
        regAboutInfo();
    }, []);

    return (
        <div className="about">
            <table id="about-page-table">
                <thead>
                    <tr>
                        <th colSpan={2}>About Information</th>
                    </tr>
                </thead>
                <tbody>
                    {aboutInfo.map (item => (
                        <tr>
                            <td>{ item.team_name }</td>
                            <td>{ item.version }</td>
                            <td>{ item.release_date }</td>
                            <td>{ item.product_name }</td>
                            <td>{ item.product_description }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default About;