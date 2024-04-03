var originalhtml = r_e("Content").innerHTML;

function r_e(id) {
  return document.querySelector(`#${id}`);
}

// Show Sign up Modal
r_e("signupbutton").addEventListener("click", () => {
  console.log("HI");
  r_e("signup_modal").classList.add("is-active");
  r_e("sumodalbg").addEventListener("click", () => {
    r_e("signup_modal").classList.remove("is-active");
  });
  r_e("suclose").addEventListener("click", () => {
    r_e("signup_modal").classList.remove("is-active");
  });
});

// show sign in modal
r_e("signinbutton").addEventListener("click", () => {
  r_e("signin_modal").classList.add("is-active");
  r_e("simodalbg").addEventListener("click", () => {
    r_e("signin_modal").classList.remove("is-active");
  });
  r_e("siclose").addEventListener("click", () => {
    r_e("signin_modal").classList.remove("is-active");
  });
});

// sign up users
r_e("signup_form").addEventListener("submit", (e) => {
  // prevent the page from auto refresh
  e.preventDefault();

  // get the email and password

  let email = r_e("email").value;
  let password = r_e("password").value;

  // send email and password to firebase to create the user

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // reset the form
      r_e("signup_form").reset();

      // hide the modal
      r_e("signup_modal").classList.remove("is-active");
    })
    .catch((error) => {
      alert(error.message);
    });
});

// sign in users
r_e("signin_form").addEventListener("submit", (e) => {
  // prevent the page from auth refresh
  e.preventDefault();

  // get the email and password from the form

  let email = r_e("email2").value;
  let password = r_e("password2").value;

  // send email/password to firebase for authentication

  auth.signInWithEmailAndPassword(email, password).then((user) => {
    // reset the form
    r_e("signin_form").reset();

    // hide the modal
    r_e("signin_modal").classList.remove("is-active");
  });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    r_e("signedin").classList.remove("is-hidden");

    r_e("signedout").classList.add("is-hidden");
    // Sign out users
  } else {
    r_e("signedin").classList.add("is-hidden");

    r_e("signedout").classList.remove("is-hidden");
  }
});

console.log(originalhtml);

r_e("signoutbutton").addEventListener("click", () => {
  auth.signOut().then(() => {});
});
