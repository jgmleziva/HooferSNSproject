// Global Object

var variables = {};

// Initialize Page

// showTrips();

function r_e(id) {
  return document.querySelector(`#${id}`);
}

// Show Trip Sign Up Modals
function showmodal(tripid) {
  r_e("modal_" + tripid).classList.add("is-active");
  r_e("modalbg" + tripid).addEventListener("click", () => {
    r_e("modal_" + tripid).classList.remove("is-active");
  });
  r_e("close" + tripid).addEventListener("click", () => {
    r_e("modal_" + tripid).classList.remove("is-active");
  });
}

function showmytrips(userid) {
  db.collection("tripsignups")
    .where("user", "==", userid)
    .get()
    .then((snapshot) => {
      let mysignups = snapshot.docs;
      let html = ``;
      mysignups.forEach((signup) => {
        let mycar = signup.data().carnumber;
        let status = signup.data().status;
        let pickuptime = signup.data().pickuptime;
        let skis = signup.data().skis;
        let date = "";
        let location = "";
        let pickuplocation = "";
        let price = "";
        let driver = "";
        let tripid = signup.data().tripid;
        db.collection("cars")
          .where("tripID", "==", tripid)
          .where("carnumber", "==", parseInt(mycar))
          .get()
          .then((snapshot) => {
            let cars = snapshot.docs;
            pickuplocation = cars[0].data().pickuplocation;
            driver = cars[0].data().driver;
            pickuptime = cars[0].data().pickuptime;
          });
        db.collection("trips")
          .where("tripID", "==", tripid)
          .get()
          .then((snapshot) => {
            let trip = snapshot.docs;
            date = trip[0].data().date;
            location = trip[0].data().location;
            price = trip[0].data().price;
          });
        setTimeout(() => {
          html += `<tr class="row-highlight">
        <!-- Added row-highlight class here -->
        <td>${date}</td>
        <td>${location}</td>
        <td>${mycar}</td>
        <td>${driver}</td>
        <td>${pickuplocation}</td>
        <td>${pickuptime}</td>
        <td>${skis}</td>
        <td>$${price}</td>
        
        <td class="capacity-box capacity-green">${status}</td>
        <td><i style="cursor: pointer;" class="fa-solid fa-trash" id="trashsignup${tripid}" onclick="deletesignup(${tripid}, '${userid}')"></i></td>
      </tr>`;
        }, 400);
      });
      setTimeout(() => {
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
              <th class="has-text-centered">Driver</th>
              <th class="has-text-centered">Pickup Location</th>
              <th class="has-text-centered">Pickup Time</th>
              <th class="has-text-centered">Skis</th>
              <th class="has-text-centered">Price</th>
              <th class="has-text-centered">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            ${html}
          </tbody>
        </table>
      </div>
    </div>
  </section>
</div>`;
      }, 500);
    });
}

// Show Sign up Modal
r_e("signupbutton").addEventListener("click", () => {
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
      let leaderpassword = r_e("trip_leader_password").value;
      alert(leaderpassword);
      let accesslevel = 0;
      if (leaderpassword == "password") {
        accesslevel = 1;
      }

      // add the user to the user database
      db.collection("users").add({
        name: r_e("name").value,
        email: email,
        address: r_e("address").value,
        phone: r_e("phone").value,
        rechub_username: r_e("rechub_username").value,
        access_level: accesslevel,
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

// Possible Delete?

// r_e("moredetailsbtn").addEventListener("click", () => {
//   r_e("main").innerHTML = `<section class="section">
//   <div class="container is-fluid">
//     <div class="columns">
//       <div class="column">
//         <div class="box">
//           <div class="has-text-centered">
//             <div class="title is-3 is-underlined is-marginless">
//               Trip Location
//             </div>

//             <div class="is-size-3">Mountain Resort A</div>
//           </div>

//           <div>
//             <div class="mt-3">
//               <span class="title is-4">Date: </span>
//               <span class="is-size-4">03/12/2024</span>
//             </div>
//             <div>
//               <span class="title is-4">Availability: </span>
//               <span class="is-size-4">13/18</span>
//             </div>
//           </div>
//           <div class="has-text-centered mt-3">
//             <div class="title is-4 is-underlined is-marginless">
//               Trip Description
//             </div>
//           </div>

//           <div class="is-size-6">
//             Lorem ipsum dolor sit, amet consectetur adipisicing elit.
//             Aliquid voluptatem harum itaque adipisci suscipit quisquam ea
//             dolores temporibus incidunt consequatur, ducimus unde
//             exercitationem fuga? Tempora.
//           </div>
//           <div class="has-text-centered mt-3">
//             <span class="button is-success">Sign Up</span>
//           </div>
//         </div>
//       </div>
//       <div class="column">
//         <div class="box">
//           <div class="has-text-centered">
//             <div class="title is-4">Car 1</div>
//           </div>
//           <div class="is-size-5">
//             <span>Driver:</span>
//             <span>Name</span>
//           </div>
//           <div class="is-size-5">
//             <span>Pickup Location:</span>
//             <span>Union South</span>
//           </div>
//         </div>
//       </div>
//       <div class="column">
//         <div class="box">
//           <div class="has-text-centered">
//             <div class="title is-4">Car 2</div>
//           </div>
//           <div class="is-size-5">
//             <span>Driver:</span>
//             <span>Name</span>
//           </div>
//           <div class="is-size-5">
//             <span>Pickup Location:</span>
//             <span>Memorial Union</span>
//           </div>
//         </div>
//       </div>
//       <div class="column">
//         <div class="box">
//           <div class="has-text-centered">
//             <div class="title is-4">Car 3</div>
//           </div>
//           <div class="is-size-5">
//             <span>Driver:</span>
//             <span>Name</span>
//           </div>
//           <div class="is-size-5">
//             <span>Pickup Location:</span>
//             <span>Memorial Union South</span>
//           </div>
//           <div></div>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>`;
// });

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
        <div
        id="full_name"
        class="has-background-lightgray p-4 m-3 has-background-grey-lighter">
        </div>
        <div class= "field"> 
          <label class = "label"> Email Address: </label>
            <div id="email_address"
              class="has-background-lightgray p-4 m-3 has-background-grey-lighter">
            </div>
          </div>    
                <div class= "field"> 
                    <label class = "label"> Phone # </label>
                    <div id="phone_number"
                    class="has-background-lightgray p-4 m-3 has-background-grey-lighter">
                  </div>
                    </div>  
                        <div class= "field"> 
                            <label class = "label"> RecHub Username: </label>
                            <div id="rechub"
                            class="has-background-lightgray p-4 m-3 has-background-grey-lighter">
                          </div>
                            </div>     
            <div class= "field"> 
                <label class = "label"> Address: </label>
                <div id="user_address"
                class="has-background-lightgray p-4 m-3 has-background-grey-lighter">
              </div>
                </div>
        </form>
    </div>
    </div>
    </div>
  </section>
</div>`;
  function user_full_name() {
    db.collection("users")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((res) => {
        let data = res.docs;

        let html = ``;
        data.forEach((d) => {
          html += `<p id="${d.id}">${d.data().name}
            
            <input type="hidden" value = "${d.data().name}" />
    
            <button hidden="hidden" onclick= "save_name(this, '${
              d.id
            }' )">Save</button>
            
            <button onclick="update_doc(this, '${
              d.id
            }' )" class="is-pulled-right button is-info is-small">Update</button>
            </p>`;
        });

        // append the html variable to the document
        document.querySelector("#full_name").innerHTML += html;
      });
  }

  function user_email_address() {
    db.collection("users")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((res) => {
        let data = res.docs;

        let html = ``;
        data.forEach((d) => {
          html += `<p id="${d.id}">${d.data().email}
        </p>`;
        });

        // append the html variable to the document
        document.querySelector("#email_address").innerHTML += html;
      });
  }
  function user_phone_number() {
    db.collection("users")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((res) => {
        let data = res.docs;

        let html = ``;
        data.forEach((d) => {
          html += `<p id="${d.id}">${d.data().phone}
        
        <input type="hidden" value = "${d.data().phone}" />

        <button hidden="hidden" onclick= "save_phone(this, '${
          d.id
        }' )">Save</button>
        
        <button onclick="update_doc(this, '${
          d.id
        }' )" class="is-pulled-right button is-info is-small">Update</button>
        </p>`;
        });

        // append the html variable to the document
        document.querySelector("#phone_number").innerHTML += html;
      });
  }
  function user_rechub_username() {
    db.collection("users")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((res) => {
        let data = res.docs;

        let html = ``;
        data.forEach((d) => {
          html += `<p id="${d.id}">${d.data().rechub_username}
        
        <input type="hidden" value = "${d.data().rechub_username}" />

        <button hidden="hidden" onclick= "save_rechub(this, '${
          d.id
        }' )">Save</button>
        
        <button onclick="update_doc(this, '${
          d.id
        }' )" class="is-pulled-right button is-info is-small">Update</button>
        </p>`;
        });

        // append the html variable to the document
        document.querySelector("#rechub").innerHTML += html;
      });
  }

  function user_address() {
    db.collection("users")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((res) => {
        let data = res.docs;

        let html = ``;
        data.forEach((d) => {
          html += `<p id="${d.id}">${d.data().address}
        
        <input type="hidden" value = "${d.data().address}" />

        <button hidden="hidden" onclick= "save_address(this, '${
          d.id
        }' )">Save</button>
        
        <button onclick="update_doc(this, '${
          d.id
        }' )" class="is-pulled-right button is-info is-small">Update</button>
        </p>`;
        });

        // append the html variable to the document
        document.querySelector("#user_address").innerHTML += html;
      });
  }

  user_full_name();
  user_email_address();
  user_phone_number();
  user_rechub_username();
  user_address();
});

// Show My Trips
r_e("mytrips").addEventListener("click", () => {
  showmytrips(auth.currentUser.email);
});

// Show Trip Roster
r_e("triproster").addEventListener("click", () => {
  db.collection("users")
    .where("email", "==", auth.currentUser.email)
    .get()
    .then((snapshot) => {
      triproster(snapshot.docs[0].data().name);
    });
  //   r_e("main").innerHTML = `<div class="p-5">
  //   <section class="section">
  //     <div class="container">
  //       <h1 class="title has-text-centered">Trip Roster</h1>

  //       <!-- Ski Trip Table -->
  //       <div class="box">
  //         <table class="table is-fullwidth has-text-centered">
  //           <thead>
  //             <tr>
  //               <th class="has-text-centered">Name</th>
  //               <th class="has-text-centered">Phone #</th>
  //               <th class="has-text-centered">Email Address</th>
  //               <th class="has-text-centered">Trip Date</th>
  //               <th class="has-text-centered">Location</th>
  //               <th class="has-text-centered">Car #</th>
  //               <th class="has-text-centered">Payment Status</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <!-- Sample Person 1 -->
  //             <tr class="row-highlight">
  //               <!-- Added row-highlight class here -->
  //               <td>Bob</td>
  //               <td>###-###-####</td>
  //               <td>email@gmail.com</td>
  //               <td>March 15, 2024</td>
  //               <td>Moutain Resort A</td>
  //               <td>1</td>
  //               <td class="capacity-box capacity-green">Paid</td>
  //             </tr>
  //             <!-- Sample Person 2 -->
  //             <tr class="row-highlight">
  //                 <!-- Added row-highlight class here -->
  //                 <td>Sally</td>
  //                 <td>###-###-####</td>
  //                 <td>email@gmail.com</td>
  //                 <td>March 15, 2024</td>
  //                 <td>Moutain Resort A</td>
  //                 <td>1</td>
  //                 <td class="capacity-box capacity-red">Unpaid</td>
  //               </tr>
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </section>
  // </div>`;
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
    document.getElementById("capacity_status").innerHTML > 11 / 12 &&
    document.getElementById("capacity_status").innerHTML >= 7 / 12
  ) {
    document.getElementById("capacity_status").style.color = "Yellow";
  } else if (
    document.getElementById("capacity_status").innerHTML < 6 / 12 &&
    document.getElementById("capacity_status").innerHTML > 0
  ) {
    document.getElementById("capacity_status").style.color = "Green";
  } else if (document.getElementById("capacity_status").innerHTML == 12 / 12) {
    document.getElementById("capacity_status").style.color = "Red";
  }
}

// Get Upcoming Trips

function moreDetails(tripid) {
  db.collection("trips")
    .where("tripID", "==", tripid)
    .get()
    .then((trip) => {
      let tripdata = trip.docs;
      let location = tripdata[0].data().location;
      let date = tripdata[0].data().date;
      let time = tripdata[0].data().time;
      let description = tripdata[0].data().description;
      let numberofcars = tripdata[0].data().numberofcars;
      let price = tripdata[0].data().price;
      let carColumnsHTML = "";
      db.collection("cars")
        .where("tripID", "==", tripid)
        .get()
        .then((car) => {
          let driversinfo = [];
          let data = car.docs;
          let carinfo = [];
          data.forEach((d) => {
            driversinfo.push({
              driver: d.data().driver,
              pickuptime: d.data().pickuptime,
              pickuplocation: d.data().pickuplocation,
            });
            carinfo.push({ carnum: d.data().carnumber, passengers: [] });
          });

          db.collection("tripsignups")
            .where("tripid", "==", tripid)
            .get()
            .then((info) => {
              let data2 = info.docs;
              data2.forEach((t) => {
                const index = carinfo.findIndex(
                  (item) => item.carnum == t.data().carnumber
                );
                carinfo[index].passengers.push(t.data().user);
              });
              for (let i = 1; i <= numberofcars; i++) {
                let driver = driversinfo[i - 1].driver;
                let ptime = driversinfo[i - 1].pickuptime;
                let plocation = driversinfo[i - 1].pickuplocation;

                const index = carinfo.findIndex((item) => item.carnum == i);

                let passengernum = carinfo[index].passengers.length;

                if ((i - 1) % 3 === 0) {
                  carColumnsHTML += `<div class="columns is-centered">`;
                }
                let carHTML = `
        <div class="column is-one-third">
        <div class="box">
          <div class="has-text-centered">
            <div class="title is-3">Car ${i}</div>
          </div>
          <div class="is-size-5">
            <span class="has-text-weight-bold	">Driver:</span>
            <span>${driver}</span>
          </div>
          <div class="is-size-5">
            <span class="has-text-weight-bold	">Pickup Location:</span>
            <span>${plocation}</span>
          </div>
          <div class="is-size-5">
            <span class="has-text-weight-bold	">Seats Available:</span>
            <span>${4 - passengernum}/4</span>
          </div>
          <div class="">
          <figure class="image px-6 pt-3">
            <img src="${passengernum}.png" alt="" />
          </figure>
        </div>
        </div>
      </div>`;

                carColumnsHTML += carHTML;
                if (i % 3 === 0 || i === numberofcars) {
                  carColumnsHTML += `</div>`;
                }
              }

              r_e("main").innerHTML = `    <section class="section">
      <div class="container is-fluid">
        <div class="box">
          <div class="columns">
            <div
              class="column has-text-centered is-flex is-flex-direction-column"
            >
              <div class="has-text-left mx-auto">
                <div class="title is-3 is-underlined is-marginless">
                  Trip Details
                </div>
                <div>
                  <div class="mt-3 has-text-left">
                    <span class="title is-4">Price: </span>
                    <span class="is-size-4">$${price}</span>
                  </div>

                  <div class="has-text-left">
                    <span class="title is-4">Date: </span>
                    <span class="is-size-4">${date}</span>
                  </div>

                  <div class="has-text-left">
                    <span class="title is-4">Time: </span>
                    <span class="is-size-4">${time}</span>
                  </div>

                  <div class="has-text-left">
                    <span class="title is-4">Availability: </span>
                    <span class="is-size-4">${numberofcars * 4}</span>
                  </div>
                </div>
              </div>
              <div id="option${tripid}" class="mt-auto">
                <button
                  class="button is-success mt-2"
                  id="su${tripid}"
                  onclick="showmodal(${tripid})"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div
              class="column has-text-centered is-flex is-flex-direction-column is-two-thirds"
            >
              <div class="has-text-centered">
                <div class="title is-3 is-underlined is-marginless">
                  Trip Location: ${location}
                </div>
              </div>

              <div class="is-size-6 has-text-centered mt-2">
                <div class="px-6 mb-2 is-size-4">
                  <p class="is-size-5">${description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        ${carColumnsHTML}
       
    </section>`;

              r_e("modals").innerHTML += `<!-- Sign-In Modal -->
<div class="modal" id="modal_${tripid}">
  <div class="modal-background" id="modalbg${tripid}"></div>
  <div
    class="modal-content p-6 is-bordered"
    style="
      backdrop-filter: blur(8px);
      border: 2px solid #31ada6;
      border-radius: 20px;
    "
  >
    <p class="subtitle has-text-weight-bold has-text-white">Trip Sign Up</p>
    <form action="" id="form${tripid}" onsubmit="return false">
      <div class="field">
        <label class="label has-text-white">Car Number:<select oninput= "cardetails(${tripid}, parseInt(r_e('carnumber${tripid}').value) )"  name="car#" id="carnumber${tripid}" class="ml-3 select">
        <option value="1">1</option>
        
      </select></label>
        <div class="control"></div>
      </div>
      <div class="field">
        <label id="driver" class="label has-text-white">Driver: </label>
      </div>
      <div class="field">
        <label id="pickuplocation" class="label has-text-white">Pickup Location: </label>
      </div>
      <div class="field">
        <label id="pickuptime" class="label has-text-white">Pickup Time: </label>
      </div>
      <div class="field">
        <label id="" class="label has-text-white">Skis? </label>
        <p class="has-text-white">
        <input name="skis" type="radio" class="radio has-text-white mr-1" value="Rent">Rent
        <input name="skis" type="radio" class="radio has text-white mr-1" value="Own">Own
        </p>
      </div>
      <div class="field">
        <label class="label has-text-white">Payment Link: <a href="https://venmo.com/" > <img src="venmo_icon.png"  style="height: 20px" alt=""><a/></label>
      </div>
      <div class="pt-4">
        <!-- Submit Button -->
        <button class="button is-primary" id="submit${tripid}" onclick = "submittripsignup(${tripid}); closemodal('modal_${tripid}'); restrictsignup(${tripid}); ">Submit</button>
        
      </div>
    </form>
    <button
      class="modal-close is-large"
      id="close${tripid}"
      aria-label="close"
    ></button>
  </div>
</div>`;
              cardetails(tripid, 1);
              addoptions(tripid, numberofcars);
              restrictsignup(tripid);
            });
        });
    });
}

function save_name(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");

  db.collection("users")
    .doc(id)
    .update({
      name: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}
function save_phone(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");

  db.collection("users")
    .doc(id)
    .update({
      phone: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}
function save_rechub(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");

  db.collection("users")
    .doc(id)
    .update({
      rechub_username: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}
function save_address(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");

  db.collection("users")
    .doc(id)
    .update({
      address: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}

// update documents in the collection

function update_doc(ele, id) {
  ele.parentNode.querySelectorAll("input").forEach((e) => {
    e.type = "text";
  });

  // show the save button
  ele.parentNode.querySelectorAll("button").forEach((e) => {
    e.hidden = "";
  });
}

// Show Add Event Modal
r_e("addeventbtn").addEventListener("click", () => {
  r_e("addevent_modal").classList.add("is-active");
  r_e("aemodalbg").addEventListener("click", () => {
    r_e("addevent_modal").classList.remove("is-active");
  });
  r_e("aeclose").addEventListener("click", () => {
    r_e("addevent_modal").classList.remove("is-active");
  });
});

// Add trip to database
function addTrip(trip) {
  db.collection("trips").add(trip);
}

function addCar(car) {
  db.collection("cars").add(car);
}

function addsignup(signup) {
  db.collection("tripsignups").add(signup);
}

// Get trip sign up info and submit it
function submittripsignup(tripid) {
  let doc = "";
  let user = auth.currentUser.email;
  let carnumber = r_e("carnumber" + tripid).value;
  let date = Date();
  let skis = document.querySelector('input[name="skis"]:checked').value;
  let signup = {
    tripid: tripid,
    user: user,
    carnumber: carnumber,
    date: date,
    skis: skis,
    status: "Pending",
  };
  addsignup(signup);

  // db.collection("cars")
  //   .where("tripID", "==", tripid)
  //   .where("carnumber", "==", parseInt(carnumber))
  //   .get()
  //   .then((snapshot) => {
  //     doc = snapshot.docs[0].id;
  //     db.collection("cars")
  //       .doc(doc)
  //       .update({ users: firebase.firestore.FieldValue.arrayUnion(user) });
  //   });
}

// Get trip information from submit button
function submitTrip() {
  // gather trip information & call trip function
  let price = r_e("trip_price").value;
  let location = r_e("trip_location").value;
  let date = new Date(r_e("trip_date").value);
  date = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  let time = convertTo12Hour(r_e("trip_time").value);
  let description = r_e("trip_description").value;
  let tripID = Date.now();
  let numberofcars = r_e("carnumber").value;
  let pickuplocation1 = r_e("car1pickuplocation").value;
  let driver1 = r_e("car1driver").value;
  let pickuplocation2 = "";
  let driver2 = "";
  let pickuplocation3 = "";
  let driver3 = "";

  let trip = {
    tripID: tripID,
    price: price,
    location: location,
    date: date,
    time: time,
    added_by: auth.currentUser.email,
    description: description,
    numberofcars: numberofcars,
  };

  addTrip(trip);
  showTrips();

  let car1 = {
    tripID: tripID,
    carnumber: 1,
    pickuplocation: pickuplocation1,
    driver: driver1,
    pickuptime: time,
  };

  addCar(car1);

  if (r_e("carnumber").value > 1) {
    driver2 = r_e("car2driver").value;
    pickuplocation2 = r_e("car2pickuplocation").value;
    let car2 = {
      tripID: tripID,
      carnumber: 2,
      pickuplocation: pickuplocation2,
      driver: driver2,
      pickuptime: time,
    };
    console.log(pickuplocation2);
    addCar(car2);
  }

  if (r_e("carnumber").value == 3) {
    driver3 = r_e("car3driver").value;
    pickuplocation3 = r_e("car3pickuplocation").value;
    let car3 = {
      tripID: tripID,
      carnumber: 3,
      pickuplocation: pickuplocation3,
      driver: driver3,
      pickuptime: time,
    };

    addCar(car3);
  }

  // Clear form
  r_e("trip_price").value = "";
  r_e("trip_location").value = "";
  r_e("trip_date").value = "";
  r_e("trip_time").value = "";
  r_e("trip_description").value = "";
  r_e("carnumber").value = "1";
  r_e("car1driver").value = "";
  r_e("additionalcars").innerHTML = ``;
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
        let tripID = trip.data().tripID;
        let users = "";
        db.collection("tripsignups")
          .where("tripid", "==", tripID)
          .get()
          .then((snapshot) => {
            users = snapshot.docs.length;
          });
        let price = trip.data().price;
        let location = trip.data().location;
        let date = trip.data().date;
        let time = trip.data().time;
        let capacity = trip.data().numberofcars * 4;
        setTimeout(() => {
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
      <td class="capacity-box capacity-green">${users}/${capacity}</td>
      <td><i style="cursor: pointer;" class="fa-solid fa-trash" id="trash${tripID}" onclick="deletetrip(${tripID})"></i></td>
    </tr>`;
        }, 400);
      });
      setTimeout(() => {
        r_e("upcomingtrips").innerHTML = html;
      }, 500);
    });
}

// Add Reviews To Firebase
r_e("addTrip_Submit").addEventListener("click", (e) => {
  // prevent the page from auth refresh
  e.preventDefault();

  submitTrip();
});

// Show Car Drivers on add events modal

r_e("carnumber").addEventListener("input", (e) => {
  let numberofcars = r_e("carnumber").value;
  if (numberofcars == 1) {
    r_e("additionalcars").innerHTML = ``;
  }
  if (numberofcars == 2) {
    r_e("additionalcars").innerHTML = `<div class="field">
    <label class="label has-text-white">Car #2 Driver Name</label>
    <p class="control has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="John Smith"
        id="car2driver"
      />
      <span class="icon is-small is-left">
        <i class="fa-solid fa-user"></i>
      </span>
    </p>
  </div>
  <div class="field">
  <label class="label has-text-white">Car #2 Pickup Location</label>
  <p class="control has-icons-left">
    <select
      class="input"
      name="pickuplocation"
      id="car2pickuplocation"
    >
      <option value="Memorial Union">Memorial Union</option>
      <option value="Union South">Union South</option>
    </select>
  </p>
</div>`;
  }
  if (numberofcars == 3) {
    r_e("additionalcars").innerHTML = `<div class="field">
    <label class="label has-text-white">Car #2 Driver Name</label>
    <p class="control has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="John Smith"
        id="car2driver"
      />
      <span class="icon is-small is-left">
        <i class="fa-solid fa-user"></i>
      </span>
    </p>
  </div>
  <div class="field">
  <label class="label has-text-white">Car #2 Pickup Location</label>
  <p class="control has-icons-left">
    <select
      class="input"
      name="pickuplocation"
      id="car2pickuplocation"
    >
      <option value="Memorial Union">Memorial Union</option>
      <option value="Union South">Union South</option>
    </select>
  </p>
</div>
  <div class="field">
    <label class="label has-text-white">Car #3 Driver Name</label>
    <p class="control has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="John Smith"
        id="car3driver"
      />
      <span class="icon is-small is-left">
        <i class="fa-solid fa-user"></i>
      </span>
    </p>
  </div>
  <div class="field">
  <label class="label has-text-white">Car #3 Pickup Location</label>
  <p class="control has-icons-left">
    <select
      class="input"
      name="pickuplocation"
      id="car3pickuplocation"
    >
      <option value="Memorial Union">Memorial Union</option>
      <option value="Union South">Union South</option>
    </select>
  </p>
</div>`;
  }
});

function cardetails(tripid, car) {
  db.collection("cars")
    .where("tripID", "==", tripid)
    .where("carnumber", "==", car)
    .get()
    .then((car) => {
      let cars = car.docs;
      variables.driver = cars[0].data().driver;
      variables.pickuplocation = cars[0].data().pickuplocation;
      variables.pickuptime = cars[0].data().pickuptime;
      r_e("driver").innerHTML = `Driver: ${variables.driver}`;
      r_e(
        "pickuplocation"
      ).innerHTML = `Pickup Location: ${variables.pickuplocation}`;
      r_e("pickuptime").innerHTML = `Pickup Time: ${variables.pickuptime}`;
    });
}

function addoptions(tripid, num) {
  if (num == 2) {
    r_e("carnumber" + tripid).innerHTML += `<option value="2">2</option>`;
  }
  if (num == 3) {
    r_e(
      "carnumber" + tripid
    ).innerHTML += `<option value="2">2</option> <option value="3">3</option>
    `;
  }
}

db.collection("cars")
  .get()
  .then((snapshot) => {});

function closemodal(id) {
  r_e(id).classList.remove("is-active");
  alert("Submitted");
}

function deletetrip(tripid) {
  db.collection("trips")
    .where("tripID", "==", tripid)
    .get()
    .then((snapshot) => {
      trip = snapshot.docs[0].id;
      db.collection("trips")
        .doc(trip)
        .delete()
        .then(() => {
          showTrips();
        });
      console.log(trip);
    });
  db.collection("cars")
    .where("tripID", "==", tripid)
    .get()
    .then((snapshot) => {
      cars = snapshot.docs;
      cars.forEach((car) => {
        db.collection("cars").doc(car.id).delete();
      });
    });
  db.collection("tripsignups")
    .where("tripid", "==", tripid)
    .get()
    .then((snapshot) => {
      signups = snapshot.docs;
      signups.forEach((signup) => {
        db.collection("tripsignups").doc(signup.id).delete();
      });
    });
}

function calculatecapacity(tripid) {
  db.collection("tripsignups")
    .where("tripid", "==", tripid)
    .get()
    .then((snapshot) => {
      return snapshot.docs.length;
    });
}

function restrictsignup(tripid) {
  db.collection("tripsignups")
    .where("tripid", "==", tripid)
    .where("user", "==", auth.currentUser.email)
    .get()
    .then((snapshot) => {
      if (snapshot.size != 0) {
        r_e("su" + tripid).classList.add("is-hidden");
        r_e("option" + tripid).innerHTML = `<p> You already signed up! </p>`;
      }
    });
}

function triproster(user) {
  db.collection("cars")
    .where("driver", "==", user)
    .get()
    .then((snapshot) => {
      let cars = snapshot.docs;
      let html = ``;
      if (snapshot.size == 0) {
        html = `<p class="column is-full  is-size-4 has-text-centered"> You are not a driver of any trips.</p>`;
      }
      cars.forEach((car) => {
        let carnumber = car.data().carnumber;
        let pickuplocation = car.data().pickuplocation;
        let pickuptime = car.data().pickuptime;
        let tripID = car.data().tripID;
        db.collection("trips")
          .where("tripID", "==", tripID)
          .get()
          .then((snapshot) => {
            let trip = snapshot.docs[0];
            let location = trip.data().location;
            let date = trip.data().date;
            html += `<div class="column is-one-third">
            <div class="card" onclick="getusers(${tripID},(${carnumber}).toString())" style="cursor: pointer;" >
              <div class="card-content">
                <p class="has-text-centered is-size-5">${location}</p>
                <p>Date: ${date}</p>
                <p>Car #: ${carnumber}</p>
                <p>Pickup Location: ${pickuplocation}</p>
                <p>Picup Time: ${pickuptime}</p>
                <p>Capacity: ${date}</p>
              </div>
            </div>
          </div>`;
          });
      });
      setTimeout(() => {
        r_e("main").innerHTML = `<div class="p-5">
      <div class="p-5">
        <h1 class="title has-text-centered">Trip Roster</h1>

        <!-- Ski Trip Table -->
        <div class="container is-fluid">
          <div class="columns is-multiline">
            ${html}
          </div>
        </div>
      </div>
    </div>`;
      }, 300);
    });
}

function getusers(tripid, carnumber) {
  db.collection("tripsignups")
    .where("tripid", "==", tripid)
    .where("carnumber", "==", carnumber)
    .get()
    .then((snapshot) => {
      let users = snapshot.docs;
      let html = ``;
      if (snapshot.size == 0) {
        html = `<p class="column is-full  is-size-4 has-text-centered"> There are no users signed up.</p>`;
      }
      users.forEach((user) => {
        let email = user.data().user;
        let status = user.data().status;
        let skis = user.data().skis;
        db.collection("users")
          .where("email", "==", email)
          .get()
          .then((snapshot) => {
            let userdata = snapshot.docs[0].data();
            let name = userdata.name;
            let phone = userdata.phone;
            let address = userdata.address;
            html += `<tr class="row-highlight">
                        <td>${name}</td>
                        <td>${email}</td>
                        <td>${phone}</td>
                        <td>${address}</td>
                        <td>${skis}</td>
                        <td class="capacity-box capacity-yellow">${status}</td>
                     </tr>`;
          });
      });
      setTimeout(() => {
        r_e(
          "modals"
        ).innerHTML += `<div class="modal" id="modal_${tripid}${carnumber}">
        <div class="modal-background" id="modalbg${tripid}${carnumber}"></div>
        <div
          class="modal-content p-6 is-bordered"
          style="
            backdrop-filter: blur(8px);
            border: 2px solid #31ada6;
            border-radius: 20px;
            width: 80%;
          "
        >
          <p
            class="subtitle has-text-weight-bold has-text-white has-text-centered"
          >
            Users
          </p>
          <div class="box">
            <table class="table is-fullwidth has-text-centered">
              <thead>
                <tr>
                  <th class="has-text-centered">Name</th>
                  <th class="has-text-centered">Email</th>
                  <th class="has-text-centered">Phone #</th>
                  <th class="has-text-centered">Address</th>
                  <th class="has-text-centered">Skis</th>
                  <th class="has-text-centered">Status</th>
                </tr>
              </thead>
              <tbody> ${html}</tbody>
            </table>
          </div>
  
          <button
            class="modal-close is-large"
            id="close${tripid}${carnumber}"
            aria-label="close"
          ></button>
        </div>
      </div>`;
        showmodal(tripid + carnumber);
      }, 300);
    });
}

function convertTo12Hour(time24) {
  // Split the time into hours and minutes
  var timeParts = time24.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);

  // Determine AM or PM
  var period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Add leading zero to minutes if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the 12-hour time string
  var time12 = hours + ":" + minutes + " " + period;

  return time12;
}

convertTo12Hour("08:32");

function deletesignup(tripid, user) {
  db.collection("tripsignups")
    .where("tripid", "==", tripid)
    .where("user", "==", user)
    .get()
    .then((snapshot) => {
      signup = snapshot.docs[0].id;
      db.collection("tripsignups")
        .doc(signup)
        .delete()
        .then(() => {
          showmytrips(user);
        });
    });
}
