import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './ProfileDetails.css';

const profileDetails = props => (
    <AuthContext.Consumer>
        {context => {
            return (

                <div className="profile">
                    <div className="profile__header">
                        <h1>User Profile</h1>
                    </div>
                    <div className="profile__details">
                        <h2>Email:{props.email}</h2>
                        <p>Created Events:</p>
                    </div>
                </div>

            );
        }}
    </AuthContext.Consumer>
);

export default profileDetails;