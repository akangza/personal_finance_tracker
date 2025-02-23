import React from "react";
import Header from "../components/Header";
import SignupSignInComponent from "../components/SignupSignIn";

function Signup() {
  return (
    <div>
      <Header/>
      <div className="wrapper">
        <SignupSignInComponent/>
      </div>
    </div>
  )
}

export default Signup