import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApplicationForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [birthday, setBirthday] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [user_type, setUserType] = useState('D');
    const [sponsor, setSponsor] = useState('');
    const [sponsorInfo, setSponsorInfo] = useState([]);

    const securityQuestions = [
        'What was your childhood nickname?',
        'In what city did you meet your spouse/significant other?',
        'What is the name of your favorite childhood friend?',
        'What street did you live on in third grade?',
        'What is your oldest siblings birthday month and year?',
        'What is the middle name of your youngest child?',
        'What is your oldest cousins first and last name?',
        'What was the name of your first stuffed animal?'
    ];

    const validatePassword = (password) => {
        return password.length > 5 && /[!@#$%^&*(),.?":{}|<>]/g.test(password);
    }

    const validateZipCode = (zipCode) => {
        return /^\d{5}$/.test(zipCode);
    }


    const resetForm = () => {
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setAddress('');
        setCity('');
        setState('');
        setZipCode('');
        setBirthday('');
        setSecurityQuestion('');
        setSecurityAnswer('');
    };


    const handleSubmit = () => {

        if (!validatePassword(password)) {
            alert('Password must be longer than 5 characters and include at least one special character.');
            return;
        }
        if (!validateZipCode(zipCode)) {
            alert('Zip Code must be a 5-digit number.');
            return;
        }
        axios.post('http://54.234.98.88:8000/application/apply', {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            address: address,
            birthday: birthday,
            user_type: user_type,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer,
            city: city,
            state: state,
            zipCode: zipCode,
            sponsor: sponsor
        }).then(res => {
            console.log(res);
            resetForm();
        }).catch(err => {
            console.error('Error submitting application/:', err);
        });
    };

    useEffect( () => {
        const sponsInfo = async() => {
            axios.get('http://54.234.98.88:8000/sponsors')
            .then(res => setSponsorInfo(res.data))
            .catch((err) => console.log(err));
        }
        sponsInfo();
    }, []);

    return (
        
        <div class='apps-table'> 
            
            <div className="form-container">
                <h2>Driver Application Form</h2>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <div className='form-row'>
                    <label htmlFor="username">Username</label>
                    <input className='appinput' type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="password">Password</label>
                    <input className='appinput' type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="firstName">First Name</label>
                    <input className='appinput' type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="lastName">Last Name</label>
                    <input className='appinput' type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input className='appinput' type="text" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="address">Address</label>
                    <input className='appinput' type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="city">City</label>
                    <input className='appinput' type="text" id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="City" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="state">State</label>
                    <input className='appinput' type="text" id="state" value={state} onChange={e => setState(e.target.value)} placeholder="State" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="zipCode">Zip Code</label>
                    <input className='appinput' type="text" id="zipCode" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="Zip Code" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="birthday">Birthday</label>
                    <input className='appinput' type="date" id="birthday" value={birthday} onChange={e => setBirthday(e.target.value)} required />
                </div>

                <div className='form-row'>
                    <label htmlFor="securityQuestion">Security Question</label>
                    <select className='appinput' id="securityQuestion" value={securityQuestion} onChange={e => setSecurityQuestion(e.target.value)} required>
                        <option value="">Select a Security Question</option>
                        {securityQuestions.map((question, index) => (
                            <option key={index} value={question}>{question}</option>
                        ))}
                    </select>
                </div>

                <div className='form-row'>
                    <label htmlFor="securityAnswer">Security Answer</label>
                    <input className='appinput' type="text" id="securityAnswer" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} placeholder="Security Answer" required />
                </div>

                <div className='form-row'>
                    <label htmlFor="sponsor">Sponsor</label>
                    <select name="sponsor" id="sponsor" className='appinput' required onChange={e => setSponsor(e.target.value)}>
                        {sponsorInfo.map((info) => <option key={info.Name} value={info.SponsorID}>{info.Name}</option>)}
                    </select>
                </div>

                <div className='form-row'>
                    <button type="submit" className="submit-button">Submit</button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default ApplicationForm;
