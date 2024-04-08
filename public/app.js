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
      // add the user to the user database
      db.collection("users").add({
        name: r_e("name").value,
        email: email,
        address: r_e("address").value,
        phone: r_e("phone").value,
        rechub_username: r_e("rechub_username").value,
        ski_ownership: r_e("ski_ownership").value,
      });

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
    document.getElementById("html").style.overflow = "";
  } else {
    r_e("signedin").classList.add("is-hidden");

    r_e("signedout").classList.remove("is-hidden");
    document.getElementById("html").style.overflow = "hidden";
  }
});

// Sign out Users
r_e("signoutbutton").addEventListener("click", () => {
  auth.signOut().then(() => {});
});

r_e("moredetailsbtn").addEventListener("click", () => {
  r_e("main").innerHTML = `<section class="section">
  <div class="container is-fluid">
    <div class="columns">
      <div class="column">
        <div class="box">
          <div class="has-text-centered">
            <div class="title is-3 is-underlined is-marginless">
              Trip Location
            </div>

            <div class="is-size-3">Mountain Resort A</div>
          </div>

          <div>
            <div class="mt-3">
              <span class="title is-4">Date: </span>
              <span class="is-size-4">03/12/2024</span>
            </div>
            <div>
              <span class="title is-4">Availability: </span>
              <span class="is-size-4">13/18</span>
            </div>
          </div>
          <div class="has-text-centered mt-3">
            <div class="title is-4 is-underlined is-marginless">
              Trip Description
            </div>
          </div>

          <div class="is-size-6">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Aliquid voluptatem harum itaque adipisci suscipit quisquam ea
            dolores temporibus incidunt consequatur, ducimus unde
            exercitationem fuga? Tempora.
          </div>
          <div class="has-text-centered mt-3">
            <span class="button is-success">Sign Up</span>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <div class="has-text-centered">
            <div class="title is-4">Car 1</div>
          </div>
          <div class="is-size-5">
            <span>Driver:</span>
            <span>Name</span>
          </div>
          <div class="is-size-5">
            <span>Pickup Location:</span>
            <span>Union South</span>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <div class="has-text-centered">
            <div class="title is-4">Car 2</div>
          </div>
          <div class="is-size-5">
            <span>Driver:</span>
            <span>Name</span>
          </div>
          <div class="is-size-5">
            <span>Pickup Location:</span>
            <span>Memorial Union</span>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <div class="has-text-centered">
            <div class="title is-4">Car 3</div>
          </div>
          <div class="is-size-5">
            <span>Driver:</span>
            <span>Name</span>
          </div>
          <div class="is-size-5">
            <span>Pickup Location:</span>
            <span>Memorial Union South</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
});

// function that will return an element with a given ID

function r_e(id, str) {
  if (str) {
      alert(str)
  }
  return document.querySelector(`#${id}`);
}

function appendContent(html) {
  r_e(`#${id}`).innerHTML += html;
}

function removeContent() {
  r_e(`#${id}`).innerHTML = "";
}

function payment_color() {

  if (document.getElementById('payment_status').innerHTML  == 'Paid') { 
     document.getElementById('payment_status').style.color = "Green";
  }
  else if (document.getElementById('payment_status').innerHTML == 'Unpaid') {
     document.getElementById('payment_status').style.color = "Red";
  }
  }

function trip_color() {
  if (document.getElementById('trip_status').innerHTML == 'Pending'){
    document.getElementById('trip_status').style.color = "Yellow";
  }
  else if (document.getElementById('trip_status').innerHTML == 'Accepted') {
    document.getElementById('trip_status').style.color = "Green";
  }
}

function capacity_color() {
  if (document.getElementById('capacity_status').innerHTML < 18 && document.getElementById('capacity_status').innerHTML > 12){
    document.getElementById('capacity_status').style.color = "Yellow";
  }
  else if (document.getElementById('capacity_status').innerHTML < 18){
    document.getElementById('capacity_status').style.color = "Green";
  }
  else if (document.getElementById('trip_status').innerHTML == 18) {
    document.getElementById('trip_status').style.color = "Red";
  }
}