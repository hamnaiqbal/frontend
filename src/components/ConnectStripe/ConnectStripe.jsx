import React from 'react'
import userService from '../../services/userservice'

export default function ConnectStripe() {
    const user = userService.getLoggedInUser();

    const connect = () => {
        const stateToMaintain = JSON.stringify({
            email: user.email
        })

        window.location.href = `https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_KxTHIWCpZZo1kqVzBLRY58ahVW5o48IV&state=${stateToMaintain}`;
    }

    return (
        <div className='connect-stripe'>
            <h4 className="stripe-heading">
                Connect Your Stripe Account
            </h4>

            <p className="stripe-description">
                You need to connect your stripe account in order to place a bid. Please use the following link to create your account through our platform.
                Please use the same email ({user.email}) that you used while creating the account with us. You will need to login again after connecting the account.
            </p>

            <button className='btn btn-connect-stripe' onClick={connect}>
                <i className="fas fa-link" /> Connect Stripe
            </button>

        </div>
    )
}
