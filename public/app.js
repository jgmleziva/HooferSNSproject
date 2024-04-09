// Initialize Page

showTrips();

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

    showTrips();
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

// Show Account Info
r_e("accountinfo").addEventListener("click", () => {
  r_e("main").innerHTML = `<div class="p-5">
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">Account Information</h1>
      <form>
        <div class= "field"> 
            <label class="label"for="myfile">Profile Picture:</label>
            <div class = "control">
                <input type="file" id="myfile" name="myfile">
            </div>
            </div>
        <div class= "field"> 
        <label class = "label"> First Name: </label>
        <div class = "control">
            <input class = "input" type="text" name="name" id="stitle" required>
        </div>
        </div>
        <div class= "field"> 
            <label class = "label"> Last Name: </label>
            <div class = "control">
                <input class = "input" type="text" name="name" id="stitle" required>
            </div>
            </div>
            <div class= "field"> 
                <label class = "label"> Email Address: </label>
                <div class = "control">
                    <input class = "input" type="text" name="name" id="stitle" required>
                </div>
                </div>    
                <div class= "field"> 
                    <label class = "label"> Phone # </label>
                    <div class = "control">
                        <input class = "input" type="text" name="name" id="stitle" required>
                    </div>
                    </div>  
                        <div class= "field"> 
                            <label class = "label"> RecHub Username: </label>
                            <div class = "control">
                                <input class = "input" type="text" name="name" id="stitle" required>
                            </div>
                            </div>     
            <div class= "field"> 
                <label class = "label"> Address: </label>
                <div class = "control">
                    <input class = "input" type="text" name="name" id="stitle" required>
                </div>
                </div>
            <br>
            <div class = "field is-grouped">
                <div class= "control">
                    <button type = "button" id="pick_submit" class="button">Save</button>
                </div>
            </div>
            <br>
        </form>
    </div>
    </div>
    </div>
  </section>
</div>`;
});

// Show My Trips
r_e("mytrips").addEventListener("click", () => {
  r_e("main").innerHTML = `<div class="p-5">
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">My Trips</h1>
      <p>
      **Please make sure to pay the full trip amount within 48 hours after signing up and before trip date or your reservation will be removed.
      Venmo Link**
      </p>

      <!-- Ski Trip Table -->
      <div class="box">
        <table class="table is-fullwidth has-text-centered">
          <thead>
            <tr>
              <th class="has-text-centered">Trip Date</th>
              <th class="has-text-centered">Location</th>
              <th class="has-text-centered">Car #</th>
              <th class="has-text-centered">Pickup Location</th>
              <th class="has-text-centered">Pickup Time</th>
              <th class="has-text-centered">Equipment Rentals</th>
              <th class="has-text-centered">Price</th>
              <th class="has-text-centered">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- Sample Person 1 -->
            <tr class="row-highlight">
              <!-- Added row-highlight class here -->
              <td>March 15, 2024</td>
              <td>Moutain Resort A</td>
              <td>1</td>
              <td>Memorial Union</td>
              <td>4:00 pm</td>
              <td>Yes</td>
              <td>$100</td>
              <td class="capacity-box capacity-green">Paid</td>
            </tr>
            <!-- Sample Person 2 -->
            <tr class="row-highlight">
                <!-- Added row-highlight class here -->
                <td>March 17, 2024</td>
                <td>Moutain Resort A</td>
                <td>2</td>
                <td>Memorial Union</td>
                <td>4:30 pm</td>
                <td>No</td>
                <td>$100</td>
                <td class="capacity-box" id="payment_status">Unpaid</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</div>`;
});

// Show Trip Roster
r_e("triproster").addEventListener("click", () => {
  r_e("main").innerHTML = `<div class="p-5">
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">Trip Roster</h1>

      <!-- Ski Trip Table -->
      <div class="box">
        <table class="table is-fullwidth has-text-centered">
          <thead>
            <tr>
              <th class="has-text-centered">Name</th>
              <th class="has-text-centered">Phone #</th>
              <th class="has-text-centered">Email Address</th>
              <th class="has-text-centered">Trip Date</th>
              <th class="has-text-centered">Location</th>
              <th class="has-text-centered">Car #</th>
              <th class="has-text-centered">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- Sample Person 1 -->
            <tr class="row-highlight">
              <!-- Added row-highlight class here -->
              <td>Bob</td>
              <td>###-###-####</td>
              <td>email@gmail.com</td>
              <td>March 15, 2024</td>
              <td>Moutain Resort A</td>
              <td>1</td>
              <td class="capacity-box capacity-green">Paid</td>
            </tr>
            <!-- Sample Person 2 -->
            <tr class="row-highlight">
                <!-- Added row-highlight class here -->
                <td>Sally</td>
                <td>###-###-####</td>
                <td>email@gmail.com</td>
                <td>March 15, 2024</td>
                <td>Moutain Resort A</td>
                <td>1</td>
                <td class="capacity-box capacity-red">Unpaid</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</div>`;
});

// function that will return an element with a given ID

function r_e(id, str) {
  if (str) {
    alert(str);
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
  if (document.getElementById("payment_status").innerHTML == "Paid") {
    document.getElementById("payment_status").style.color = "Green";
  } else if (document.getElementById("payment_status").innerHTML == "Unpaid") {
    document.getElementById("payment_status").style.color = "Red";
  }
}

function trip_color() {
  if (document.getElementById("trip_status").innerHTML == "Pending") {
    document.getElementById("trip_status").style.color = "Yellow";
  } else if (document.getElementById("trip_status").innerHTML == "Accepted") {
    document.getElementById("trip_status").style.color = "Green";
  }
}

function capacity_color() {
  if (
    document.getElementById("capacity_status").innerHTML < 18 &&
    document.getElementById("capacity_status").innerHTML > 12
  ) {
    document.getElementById("capacity_status").style.color = "Yellow";
  } else if (document.getElementById("capacity_status").innerHTML < 18) {
    document.getElementById("capacity_status").style.color = "Green";
  } else if (document.getElementById("trip_status").innerHTML == 18) {
    document.getElementById("trip_status").style.color = "Red";
  }
}

// Get Upcoming Trips

function showTrips() {
  db.collection("trips")
    .orderBy("date")
    .get()
    .then((snapshot) => {
      let trips = snapshot.docs;
      let html = ``;
      trips.forEach((trip) => {
        let price = trip.data().price;
        let location = trip.data().location;
        let date = trip.data().date;
        let time = trip.data().time;
        let tripID = trip.data().tripID;
        console.log(typeof time);
        html += `<tr class="row-highlight">
      <!-- Added row-highlight class here -->
      <td>$${price}</td>
      <td>${location}</td>
      <td>${date}</td>
      <td>${time}</td>
      <td>
        <button
          onclick = "moreDetails(${tripID})"
          style="background-color: #4f8cc2"
          class="button is-info"
          id="${tripID}" 
        >
          More Details
        </button>
      </td>
      <td class="capacity-box capacity-green">1/8</td>
    </tr>`;
      });
      r_e("upcomingtrips").innerHTML = html;
    });
}

function moreDetails(tripid) {
  db.collection("trips")
    .where("tripID", "==", tripid)
    .get()
    .then((trip) => {
      let tripdata = trip.docs;
      let location = tripdata[0].data().location;
      let date = tripdata[0].data().date;
      let time = tripdata[0].data().time;
      r_e("main").innerHTML = `<section class="section">
  <div class="container is-fluid">
    <div class="columns">
      <div class="column">
        <div class="box">
          <div class="has-text-centered">
            <div class="title is-3 is-underlined is-marginless">
              Trip Location
            </div>

            <div class="is-size-3">${location}</div>
          </div>

          <div>
            <div class="mt-3">
              <span class="title is-4">Date: </span>
              <span class="is-size-4">${date}</span>
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
}
