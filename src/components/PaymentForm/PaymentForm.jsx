import React from 'react'

export default function PaymentForm() {

    const onFormSubmit = (params) => {
        
    }
    

    return (
        <div>
            <form action="/create-checkout-session" method="POST">
                <button type="submit">Checkout</button>
            </form>
        </div>
    )
}
