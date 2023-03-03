import React, { useEffect, useState } from "react";
import Script from 'next/script'

export default function CheckoutForm(props) {
  const [message, setMessage] = useState("");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [exactJSReady, setExactJSReady] = React.useState(false);
  const [exactJS, setExactJS ] = useState(null)

  useEffect(() =>{
    if (props.token !== ""){
      onOrderCreated()
    }
  }, [props.token])
  
  const onOrderCreated = () => {
    if (!exactJSReady) {
      setTimeout(initExactJS, 500);
      return
    };
    if (isLoaded){
      return
    }
    initExactJS()
  }

  const initExactJS = () => {
    const exact = ExactJS(props.token)
    console.log(props.token)
    const components = exact.components({orderId: props.orderId});
    components.addCard('payment-element');

    exact.on("payment-complete", (payload) => {
        setMessage("Payment complete");
        document.getElementById('payment_id').value  = payload.paymentId;
        document.getElementById("payment_form").submit();
    });
    
    exact.on("payment-failed", (payload) => {
        setMessage("Payment failed");
        console.debug(payload);
    });
    setExactJS(exact)

    setIsLoaded(true)
    
  }

  const onExactJSReady = () => {
    setExactJSReady(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    exactJS.payOrder();
  }


  return (
    <>
      <Script src="https://api.exactpaysandbox.com/js/v1/exact.js" strategy="afterInteractive" onReady={onExactJSReady}/>
       <form id="payment_form" action="api/not-webhooks" method="post" onSubmit={handleSubmit}>
        <div id="payment-element"/>
        <button id="submit_button">
          <span id="button-text">
            {!isLoaded ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        <input id="payment_id" name="payment_id" type="hidden" />
        {/* Show any error or success messages*/}
        {message && <div id="payment-message">{message}</div>}
      </form> 
    </>
  );
}