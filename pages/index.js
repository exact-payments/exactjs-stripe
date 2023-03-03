import React from "react";

import CheckoutForm from "../components/CheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

export default function App() {
  const [token, setToken] = React.useState("");
  const [orderId, setOrderId] = React.useState("");

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrderId(data.orderId)
        setToken(data.token);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };

  return (
    <div className="App">
      {(
          <CheckoutForm token={token} orderId = {orderId}/>
      )}
    </div>
  );
}