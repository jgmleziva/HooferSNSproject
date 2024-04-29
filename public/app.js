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

async function showmytrips(userid) {
  try {
    const snapshot = await db
      .collection("tripsignups")
      .where("user", "==", userid)
      .get();
    const mysignups = snapshot.docs;
    let html = ``;

    for (const signup of mysignups) {
      const mycar = signup.data().carnumber;
      const status = signup.data().status;
      let boxColor = "capacity-yellow";
      if (status == "Approved") {
        boxColor = "capacity-green";
      }
      const skis = signup.data().skis;
      const tripid = signup.data().tripid;

      const carsSnapshot = await db
        .collection("cars")
        .where("tripID", "==", tripid)
        .where("carnumber", "==", parseInt(mycar))
        .get();
      const cars = carsSnapshot.docs;
      const pickuplocation = cars[0].data().pickuplocation;
      const driver = cars[0].data().driver;
      const pickuptime = cars[0].data().pickuptime;

      const tripSnapshot = await db
        .collection("trips")
        .where("tripID", "==", tripid)
        .get();
      const trip = tripSnapshot.docs;
      const date = trip[0].data().date;
      const eventName = trip[0].data().eventName;
      const location = trip[0].data().location;
      const price = trip[0].data().price;
      const startTime = trip[0].data().starttime;
      const endTime = trip[0].data().endtime;

      html += `<tr class="row-highlight">
        <!-- Added row-highlight class here -->
        <td>${date}</td>
        <td>${eventName}</td>
        <td>${location}</td>
        <td>${startTime} - ${endTime}</td>
        <td>${driver}</td>
        <td>${pickuplocation}</td>
        <td>${pickuptime}</td>
        <td>${skis}</td>
        <td>$${price}</td>
        <td class="capacity-box ${boxColor}">${status}</td>
        <td><i style="cursor: pointer;" class="fa-solid fa-trash" id="trashsignup${tripid}" onclick="deletesignup(${tripid}, '${userid}')"></i></td>
      </tr>`;
    }

    document.getElementById("main").innerHTML = `<div class="p-5">
      <section class="section">
        <div class="container">
          <p class="title pl-6 has-text-centered">My Trips</p>
          <p style= "text-align: center; color: red; ">
          **Please make sure to pay the full trip amount within 48 hours after signing up and before the trip date, or your reservation will be removed.
          <br>Click the Venmo icon at the bottom of the page to make your payment.**
          </p>
          <!-- Ski Trip Table -->
          <div class="box">
            <table class="table is-fullwidth has-text-centered">
              <thead>
                <tr>
                  <th class="has-text-centered">Trip Date</th>
                  <th class="has-text-centered">Event Name</th>
                  <th class="has-text-centered">Location</th>
                  <th class="has-text-centered">Event Time</th>
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
  } catch (error) {
    console.error("Error fetching trips:", error);
  }
}

function updateModal(tripid, user) {
  db.collection("tripsignups")
    .where("tripid", "==", tripid)
    .where("user", "==", user)
    .get()
    .then((snapshot) => {});
}
async function showalltrips() {
  try {
    const carSnapshot = await db.collection("cars").get();
    const driversinfo = [];
    const data = carSnapshot.docs;
    const carinfo = [];

    data.forEach((d) => {
      driversinfo.push({
        driver: d.data().driver,
        pickuptime: d.data().pickuptime,
        pickuplocation: d.data().pickuplocation,
        carnumber: d.data().carnumber,
      });
      carinfo.push({
        tripID: d.data().tripID,
        carnum: d.data().carnumber,
        driver: d.data().driver,
        pickuplocation: d.data().pickuplocation,
        pickuptime: d.data().pickuptime,
        passengers: [],
      });
    });

    const infoSnapshot = await db.collection("tripsignups").get();
    const data2 = infoSnapshot.docs;

    data2.forEach((t) => {
      let notstatus = "";
      if (t.data().status == "Pending") {
        notstatus = "Approved";
      } else {
        notstatus = "Pending";
      }
      const index = carinfo.findIndex(
        (item) =>
          item.carnum == t.data().carnumber && item.tripID == t.data().tripid
      );
      carinfo[index].passengers.push({
        name: t.data().user,
        status: t.data().status,
        notstatus: notstatus,
      });
    });

    console.log(carinfo);
    const tripinf = await db.collection("trips").get();
    const tripdata = tripinf.docs;
    const tripinfo = [];

    tripdata.forEach((d) => {
      tripinfo.push({
        tripID: d.data().tripID,
        date: d.data().date,
        eventName: d.data().eventName,
      });
    });

    const combinedInfo = [];
    carinfo.forEach((car) => {
      const trip = tripinfo.find((trip) => trip.tripID === car.tripID);
      if (trip) {
        combinedInfo.push({
          driver: car.driver,
          carNumber: car.carnum,
          passengers: car.passengers,
          tripID: car.tripID,
          tripName: trip.eventName,
          date: trip.date,
          pickuplocation: car.pickuplocation,
          pickuptime: car.pickuptime,
        });
      }
    });

    let html = ``;
    let index = 0;
    combinedInfo.forEach((info) => {
      let driver = info.driver;
      let carNumber = info.carNumber;
      let eventName = info.tripName;
      let date = info.date;
      let pickuplocation = info.pickuplocation;
      let pickuptime = info.pickuptime;
      html += `<tr class="row-highlight has-text-centered">
        <!-- Added row-highlight class here -->
        <td class="is-vcentered">${date}</td>
        <td class="is-vcentered">${eventName}</td>
        <td class="is-vcentered">${driver}</td>
        <td class="is-vcentered">${pickuplocation}</td>
        <td class="is-vcentered">${pickuptime}</td>
        <td class="is-vcentered">${carNumber}</td>
        <td class="is-vcentered">${info.passengers.length}</td>
        <td class="is-vcentered"><button
        id="info${index}"
        class="button view-btn" onclick="getPassengers(${info.tripID}, ${carNumber})"
      >
        View
      </button></td>
      </tr>`;
      index++;
    });

    document.getElementById("main").innerHTML = `<div class="p-5">
      <section class="section">
        <div class="container">
        <p class="title pl-6 has-text-centered">All Trips</p>
          <!-- Ski Trip Table -->
          <div class="box">
            <table class="table is-fullwidth has-text-centered">
              <thead>
                <tr>
                  <th class="has-text-centered">Trip Date</th>
                  <th class="has-text-centered">Event Name</th>
                  <th class="has-text-centered">Driver</th>
                  <th class="has-text-centered">Pickup Location</th>
                  <th class="has-text-centered">Pickup Time</th>
                  <th class="has-text-centered">Car #</th>
                  <th class="has-text-centered"> Passengers</th>
                  <th class="has-text-centered">View Passengers</th>
                  
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

    // document.querySelectorAll(".view-btn").forEach((button, index) => {
    //   button.addEventListener("click", () => {
    //     const passengers = combinedInfo[index].passengers;

    //     const passengerList = document.getElementById("passengerList");
    //     passengerList.innerHTML = "";
    //     if (passengers.length == 0) {
    //       passengerList.innerHTML = `<p class="header has-text-centered"> There are no passengers. </h1>`;
    //     }
    //     passengers.forEach((passenger) => {
    //       const listItem = document.createElement("tr");
    //       listItem.innerHTML = `<td> ${passenger.name}</td>
    //       <td> Status: <Select name="currentStatus" id="currentStatus" class="select" oninput="async function update() { await db.collection('tripsignups').where('tripid', '==', ${combinedInfo[index].tripID}).where('user', '==', '${passenger.name}').get().then((snapshot)=>{db.collection('tripsignups').doc(snapshot.docs[0].id).update({status: r_e('currentStatus').value})}); await alert('Status has been updated')} update(); updateModal(${combinedInfo[index].tripID},'${passenger.name}')"> <option id='status1' value='${passenger.status}'>${passenger.status}</option><option id='status2' value='${passenger.notstatus}'>${passenger.notstatus}</option></select> </td>
    //       <td class="is-vcentered has-text-danger"><i style="cursor: pointer;" class="fa-solid fa-trash admin" id="trash" onclick="deletetrip()"></i></td>`;
    //       passengerList.appendChild(listItem);
    //     });

    //     const modal = document.getElementById("passengerModal");
    //     modal.classList.add("is-active");
    //   });
    // });

    // document.getElementById("closeModal").addEventListener("click", () => {
    //   const modal = document.getElementById("passengerModal");
    //   modal.classList.remove("is-active");
    // });

    // document.getElementById("passmodal-bg").addEventListener("click", () => {
    //   const modal = document.getElementById("passengerModal");
    //   modal.classList.remove("is-active");
    // });

    // document.getElementById("xcloseModal").addEventListener("click", () => {
    //   const modal = document.getElementById("passengerModal");
    //   modal.classList.remove("is-active");
    // });
  } catch (error) {
    console.error("Error fetching trips:", error);
  }
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

function configure_message_bar(user) {
  // show a confirmation message for the user

  // show the message bar for only 2 seconds and then hide it back

  r_e("message_bar").classList.remove("is-hidden");

  r_e("message_bar").innerHTML = `Signed in as: ${user}`;

  // hide the message bar after 2 seconds
  if (user != "admin@hoofersns.org") {
    setTimeout(() => {
      r_e("message_bar").classList.add("is-hidden");

      // clear the message bar
      r_e("message_bar").innerHTML = "";
    }, 2000);
  }
}

// auth.onAuthStateChanged((user) => {

//   // check if a user exists
//   if (user) {

//     configure_message_bar("Signed in as: " + user.email);

//     // add user's email address to the nav bar

//     // r_e("currentuser").innerHTML = auth.currentUser.email;

//     // configure nav bar

//     // show all recipes

//   //   show_recipes(auth.currentUser.email);
//   } else {

//   }
// });

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
    configure_message_bar(user.email);
    showHomePage();
    showTrips();
    hideadminfunction();
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
// Define async functions to fetch user information
async function fetchUserFullName() {
  const res = await db
    .collection("users")
    .where("email", "==", auth.currentUser.email)
    .get();
  const data = res.docs;

  let html = ``;
  data.forEach((d) => {
    html += `<p id="${d.id}">${d.data().name}
          <input type="hidden" value="${d.data().name}" />
          <button hidden="hidden" onclick="save_name(this, '${
            d.id
          }')">Save</button>
          <button onclick="update_doc(this, '${
            d.id
          }')" class="is-pulled-right button is-info is-small">Update</button>
      </p>`;
  });

  document.querySelector("#full_name").innerHTML += html;
}

async function fetchUserEmailAddress() {
  const res = await db
    .collection("users")
    .where("email", "==", auth.currentUser.email)
    .get();
  const data = res.docs;

  let html = ``;
  data.forEach((d) => {
    html += `<p id="${d.id}">${d.data().email}</p>`;
  });

  document.querySelector("#email_address").innerHTML += html;
}

async function fetchUserPhoneNumber() {
  const res = await db
    .collection("users")
    .where("email", "==", auth.currentUser.email)
    .get();
  const data = res.docs;

  let html = ``;
  data.forEach((d) => {
    html += `<p id="${d.id}">${d.data().phone}
          <input type="hidden" value="${d.data().phone}" />
          <button hidden="hidden" onclick="save_phone(this, '${
            d.id
          }')">Save</button>
          <button onclick="update_doc(this, '${
            d.id
          }')" class="is-pulled-right button is-info is-small">Update</button>
      </p>`;
  });

  document.querySelector("#phone_number").innerHTML += html;
}

async function fetchUserRecHubUsername() {
  const res = await db
    .collection("users")
    .where("email", "==", auth.currentUser.email)
    .get();
  const data = res.docs;

  let html = ``;
  data.forEach((d) => {
    html += `<p id="${d.id}">${d.data().rechub_username}
          <input type="hidden" value="${d.data().rechub_username}" />
          <button hidden="hidden" onclick="save_rechub(this, '${
            d.id
          }')">Save</button>
          <button onclick="update_doc(this, '${
            d.id
          }')" class="is-pulled-right button is-info is-small">Update</button>
      </p>`;
  });

  document.querySelector("#rechub").innerHTML += html;
}

async function fetchUserAddress() {
  const res = await db
    .collection("users")
    .where("email", "==", auth.currentUser.email)
    .get();
  const data = res.docs;

  let html = ``;
  data.forEach((d) => {
    html += `<p id="${d.id}">${d.data().address}
          <input type="hidden" value="${d.data().address}" />
          <button hidden="hidden" onclick="save_address(this, '${
            d.id
          }')">Save</button>
          <button onclick="update_doc(this, '${
            d.id
          }')" class="is-pulled-right button is-info is-small">Update</button>
      </p>`;
  });

  document.querySelector("#user_address").innerHTML += html;
}

async function getallinfo() {
  fetchUserFullName();
  fetchUserEmailAddress();
  fetchUserPhoneNumber();
  fetchUserRecHubUsername();
  fetchUserAddress();
}
// Event listener
r_e("accountinfo").addEventListener("click", async () => {
  r_e("main").innerHTML = `<div class="p-5">
      <section class="section">
          <div class="container">
              <p class="title pl-6 has-text-centered">Account Information</p>
              <form>
                  <div class="field"> 
                      <label class="label"> Name: </label>
                      <div id="full_name" class="has-background-lightgray p-4 m-3 has-background-grey-lighter"></div>
                  </div>
                  <div class="field"> 
                      <label class="label"> Email Address: </label>
                      <div id="email_address" class="has-background-lightgray p-4 m-3 has-background-grey-lighter"></div>
                  </div>
                  <div class="field"> 
                      <label class="label"> Phone # </label>
                      <div id="phone_number" class="has-background-lightgray p-4 m-3 has-background-grey-lighter"></div>
                  </div>
                  <div class="field"> 
                      <label class="label"> RecHub Username: </label>
                      <div id="rechub" class="has-background-lightgray p-4 m-3 has-background-grey-lighter"></div>
                  </div>
                  <div class="field"> 
                      <label class="label"> Address: </label>
                      <div id="user_address" class="has-background-lightgray p-4 m-3 has-background-grey-lighter"></div>
                  </div>
              </form>
          </div>
      </section>
  </div>`;

  // Call the async functions to fetch user information
  await getallinfo();
});

// Show My Trips
r_e("mytrips").addEventListener("click", () => {
  showmytrips(auth.currentUser.email);
});

// Show All Trips
r_e("alltrips").addEventListener("click", () => {
  showalltrips(auth.currentUser.email);
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

// Get Upcoming Trips

async function moreDetails(tripid) {
  try {
    const tripSnapshot = await db
      .collection("trips")
      .where("tripID", "==", tripid)
      .get();
    const tripdata = tripSnapshot.docs;

    let signupoption = `<button
      class="button is-success mt-2"
      id="su${tripid}"
      onclick="showmodal(${tripid})"
    >
      Sign Up
    </button>`;
    let optionshtml = ``;

    const eventName = tripdata[0].data().eventName;
    const capacity = tripdata[0].data().numberofcars * 4;
    const location = tripdata[0].data().location;
    const date = tripdata[0].data().date;
    const starttime = tripdata[0].data().starttime;
    const endtime = tripdata[0].data().endtime;
    const description = tripdata[0].data().description;
    const numberofcars = tripdata[0].data().numberofcars;
    const price = tripdata[0].data().price;
    let carColumnsHTML = "";

    const carSnapshot = await db
      .collection("cars")
      .where("tripID", "==", tripid)
      .get();
    const driversinfo = [];
    const data = carSnapshot.docs;
    const carinfo = [];

    data.forEach((d) => {
      driversinfo.push({
        driver: d.data().driver,
        pickuptime: d.data().pickuptime,
        pickuplocation: d.data().pickuplocation,
        carnumber: d.data().carnumber,
      });
      carinfo.push({ carnum: d.data().carnumber, passengers: [] });
    });

    const infoSnapshot = await db
      .collection("tripsignups")
      .where("tripid", "==", tripid)
      .get();
    const data2 = infoSnapshot.docs;
    const occupied = data2.length;
    const availability = capacity - occupied;

    data2.forEach((t) => {
      const index = carinfo.findIndex(
        (item) => item.carnum == t.data().carnumber
      );
      carinfo[index].passengers.push(t.data().user);
    });

    for (let i = 1; i <= numberofcars; i++) {
      const index = carinfo.findIndex((item) => item.carnum == i);
      const passengernum = carinfo[index].passengers.length;

      if ((i - 1) % 3 === 0) {
        carColumnsHTML += `<div class="columns is-centered">`;
      }

      if (passengernum < 4) {
        optionshtml += `<option value="${carinfo[index].carnum}">${carinfo[index].carnum}</option>`;
      }

      if (occupied == capacity) {
        signupoption = `<button
          class="button is-success mt-2"
          id="su${tripid}"
          )"
        >
          The trip is full!
        </button>`;
      }

      const driver = driversinfo[index].driver;
      const plocation = driversinfo[index].pickuplocation;
      const ptime = driversinfo[index].pickuptime;

      let carHTML = `
        <div class="column is-one-third">
          <div class="box">
            <div class="has-text-centered">
              <div class="title is-3">Car ${carinfo[index].carnum}</div>
            </div>
            <div class="is-size-5">
              <span class="has-text-weight-bold">Driver:</span>
              <span>${driver}</span>
            </div>
            <div class="is-size-5">
              <span class="has-text-weight-bold">Pickup Location:</span>
              <span>${plocation}</span>
            </div>
            <div class="is-size-5">
              <span class="has-text-weight-bold">Pickup Time:</span>
              <span>${ptime}</span>
            </div>
            <div class="is-size-5">
              <span class="has-text-weight-bold">Seats Available:</span>
              <span>${4 - passengernum}/4</span>
            </div>
            <div>
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

    document.getElementById("main").innerHTML = `<section class="section">
      <div class="container is-fluid">
        <div class="box">
          <div class="columns">
            <div class="column has-text-centered is-flex is-flex-direction-column">
              <div class="has-text-left mx-auto">
                <div class="title is-3 is-underlined is-marginless">${eventName}</div>
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
                    <span class="is-size-4">${starttime} - ${endtime}</span>
                  </div>
                  <div class="has-text-left">
                    <span class="title is-4">Availability: </span>
                    <span class="is-size-4">${availability}/${capacity}</span>
                  </div>
                </div>
              </div>
              <div id="option${tripid}" class="mt-auto">${signupoption}</div>
            </div>
            <div class="column has-text-centered is-flex is-flex-direction-column is-two-thirds">
              <div class="has-text-centered">
                <div class="title is-3 is-underlined is-marginless">Location: ${location}</div>
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
      </div>
    </section>`;

    document.getElementById("modals").innerHTML += `<!-- Add Sign Up Modal -->
    <div class="modal" id="modal_${tripid}">
      <div class="modal-background" id="modalbg${tripid}"></div>
      <div class="modal-content p-6 is-bordered" style="backdrop-filter: blur(8px); border: 2px solid #31ada6; border-radius: 20px;">
        <p class="subtitle has-text-weight-bold has-text-white">Trip Sign Up</p>
        <form action="" id="form${tripid}" onsubmit="return false">
          <div class="field">
            <label class="label has-text-white">Car Number:
              <select oninput="cardetails(${tripid}, parseInt(r_e('carnumber${tripid}').value))" name="car#" id="carnumber${tripid}" class="ml-3 select">
                ${optionshtml}
              </select>
            </label>
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
            <label class="label has-text-white">Skis? </label>
            <p class="has-text-white">
              <input name="skis" type="radio" class="radio has-text-white mr-1" value="Rent">Rent
              <input name="skis" type="radio" class="radio has text-white mr-1" value="Own">Own
            </p>
          </div>
          <div class="field">
            <label class="label has-text-white">Payment Link: <a href="https://venmo.com/" > <img src="venmo_icon.png"  style="height: 20px" alt=""><a/></label>
          </div>
          <div class="pt-4">
            <button class="button is-primary" id="submit${tripid}" onclick="submittripsignup(${tripid}); closemodal('modal_${tripid}'); restrictsignup(${tripid});">Submit</button>
          </div>
        </form>
        <button class="modal-close is-large" id="close${tripid}" aria-label="close"></button>
      </div>
    </div>`;

    r_e("info_modal").classList.add("is-active");
    r_e("infomodalbg").addEventListener("click", () => {
      r_e("info_modal").classList.remove("is-active");
    });
    r_e("infoclose").addEventListener("click", () => {
      r_e("info_modal").classList.remove("is-active");
    });

    await cardetails(tripid, parseInt(r_e("carnumber" + tripid).value));
    restrictsignup(tripid);
  } catch (error) {
    console.error("Error fetching trip details:", error);
  }
}

function save_name(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");
  event.preventDefault();
  db.collection("users")
    .doc(id)
    .update({
      name: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}
function save_phone(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");
  event.preventDefault();
  db.collection("users")
    .doc(id)
    .update({
      phone: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}
function save_rechub(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");
  event.preventDefault();
  db.collection("users")
    .doc(id)
    .update({
      rechub_username: inputs[0].value,
    })
    .then(() => alert("Your account has been updated."));
}
function save_address(ele, id) {
  let inputs = ele.parentNode.querySelectorAll("input");
  event.preventDefault();
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
    event.preventDefault();
  });
  // show the save button
  ele.parentNode.querySelectorAll("button").forEach((e) => {
    e.hidden = "";
  });
}

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
  let eventName = r_e("eventName").value;
  let price = r_e("trip_price").value;
  let location = r_e("trip_location").value;
  let date = r_e("trip_date").value;
  var parts = date.split("-");
  var year = parts[0];
  var month = parts[1];
  var day = parts[2];

  // Rearrange the components into the desired format
  date = month + "/" + day + "/" + year;
  let starttime = convertTo12Hour(r_e("trip_starttime").value);
  let endtime = convertTo12Hour(r_e("trip_endtime").value);
  let description = r_e("trip_description").value;
  let tripID = Date.now();
  let numberofcars = r_e("carnumber").value;
  let pickuplocation1 = r_e("car1pickuplocation").value;
  let driver1 = r_e("car1driver").value;
  let pickuptime1 = convertTo12Hour(r_e("car1pickuptime").value);
  let pickuplocation2 = "";
  let driver2 = "";
  let pickuplocation3 = "";
  let driver3 = "";
  let trip = {
    eventName: eventName,
    tripID: tripID,
    price: price,
    location: location,
    date: date,
    starttime: starttime,
    endtime: endtime,
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
    pickuptime: pickuptime1,
  };

  addCar(car1);

  if (r_e("carnumber").value > 1) {
    driver2 = r_e("car2driver").value;
    pickuptime2 = convertTo12Hour(r_e("car2pickuptime").value);
    pickuplocation2 = r_e("car2pickuplocation").value;
    let car2 = {
      tripID: tripID,
      carnumber: 2,
      pickuplocation: pickuplocation2,
      driver: driver2,
      pickuptime: pickuptime2,
    };
    addCar(car2);
  }

  if (r_e("carnumber").value == 3) {
    driver3 = r_e("car3driver").value;
    pickuptime3 = convertTo12Hour(r_e("car3pickuptime").value);
    pickuplocation3 = r_e("car3pickuplocation").value;
    let car3 = {
      tripID: tripID,
      carnumber: 3,
      pickuplocation: pickuplocation3,
      driver: driver3,
      pickuptime: pickuptime3,
    };
    addCar(car3);
  }

  // Clear form
  r_e("trip_price").value = "";
  r_e("trip_location").value = "";
  r_e("trip_date").value = "";
  r_e("trip_starttime").value = "";
  r_e("trip_endtime").value = "";
  r_e("trip_description").value = "";
  r_e("carnumber").value = "1";
  r_e("car1driver").value = "";
  r_e("car1pickuptime").value = "";
  r_e("additionalcars").innerHTML = ``;
}

//Calculate Capacity Color
/*
function calculateColor(users, capacity) {
    if (Number(users) == Number(capacity)) {
      return "capacity-box capacity-red"
    }
    else if (Number(users) >= Number(capacity)/2) {
      return "capacity-box capacity-yellow"
    }
    else  {
      return "capacity-box capacity-green"
    }
}
*/

// Get Upcoming Trips

async function showTrips() {
  try {
    const snapshot = await db.collection("trips").orderBy("date").get();
    const trips = snapshot.docs;
    let html = ``;

    for (const trip of trips) {
      const tripID = trip.data().tripID;
      let users = "";

      const usersSnapshot = await db
        .collection("tripsignups")
        .where("tripid", "==", tripID)
        .get();
      users = parseInt(usersSnapshot.docs.length);

      const eventName = trip.data().eventName;
      const price = trip.data().price;
      const location = trip.data().location;
      const date = trip.data().date;
      const starttime = trip.data().starttime;
      const endtime = trip.data().endtime;
      const capacity = trip.data().numberofcars * 4;

      let color = "";

      if (users == capacity) {
        color = "has-text-danger";
      } else if (users >= capacity / 2) {
        color = "has-text-warning";
      } else {
        color = "has-text-success";
      }

      html += `<tr class="row-highlight">
        <!-- Added row-highlight class here -->
        <td class="is-vcentered is-size-5">${eventName}</td>
        <td class="is-vcentered is-size-5">$${price}</td>
        <td class="is-vcentered is-size-5">${location}</td>
        <td class="is-vcentered is-size-5">${date}</td>
        <td class="is-vcentered is-size-5" >${starttime} - ${endtime}</td>
        <td>
          <button
            onclick = "moreDetails(${tripID})"
            class="button is-success is-outlined is-vcentered has-text-weight-bold is-rounded"
            style = "border-width: 3px;"
            id="${tripID}" 
          >
            More Details
          </button>
        </td>
        <td class="has-text-weight-bold ${color} is-size-5 is-vcentered">${users}/${capacity}</td>
        <td class="is-vcentered has-text-danger"><i style="cursor: pointer;" class="fa-solid fa-trash admin" id="trash${tripID}" onclick="deletetrip(${tripID})"></i></td>
      </tr>`;
    }

    document.getElementById("upcomingtrips").innerHTML = html;
    hideadminfunction();
  } catch (error) {
    console.error("Error fetching trips:", error);
  }
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
</div>
<div class="field">
                  <label class="label has-text-white">Car #2 Pickup Time</label>
                  <p class="control has-icons-left">
                    <input
                      class="input"
                      type="time"
                      placeholder=""
                      id="car2pickuptime"
                    />
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
                  <label class="label has-text-white">Car #2 Pickup Time</label>
                  <p class="control has-icons-left">
                    <input
                      class="input"
                      type="time"
                      placeholder=""
                      id="car2pickuptime"
                    />
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
</div>
<div class="field">
                  <label class="label has-text-white">Car #3 Pickup Time</label>
                  <p class="control has-icons-left">
                    <input
                      class="input"
                      type="time"
                      placeholder=""
                      id="car3pickuptime"
                    />
                  </p>
                </div>`;
  }
});

async function cardetails(tripid, car) {
  if (isNaN(car) != true) {
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
}

// function addoptions(tripid, num) {
//   if (num == 2) {
//     r_e("carnumber" + tripid).innerHTML += `<option value="2">2</option>`;
//   }
//   if (num == 3) {
//     r_e(
//       "carnumber" + tripid
//     ).innerHTML += `<option value="2">2</option> <option value="3">3</option>
//     `;
//   }
// }

db.collection("cars")
  .get()
  .then((snapshot) => {});

function closemodal(id) {
  r_e(id).classList.remove("is-active");
  alert("Submitted");
}

async function deletetrip(tripid) {
  try {
    const tripSnapshot = await db
      .collection("trips")
      .where("tripID", "==", tripid)
      .get();
    const tripDocId = tripSnapshot.docs[0].id;
    await db.collection("trips").doc(tripDocId).delete();

    const carsSnapshot = await db
      .collection("cars")
      .where("tripID", "==", tripid)
      .get();
    carsSnapshot.docs.forEach(async (car) => {
      await db.collection("cars").doc(car.id).delete();
    });

    const signupsSnapshot = await db
      .collection("tripsignups")
      .where("tripid", "==", tripid)
      .get();
    signupsSnapshot.docs.forEach(async (signup) => {
      await db.collection("tripsignups").doc(signup.id).delete();
    });

    showTrips();
  } catch (error) {
    console.error("Error deleting trip:", error);
  }
}

async function calculatecapacity(tripid) {
  try {
    const snapshot = await db
      .collection("tripsignups")
      .where("tripid", "==", tripid)
      .get();
    return snapshot.docs.length;
  } catch (error) {
    console.error("Error calculating capacity:", error);
    return 0;
  }
}

async function restrictsignup(tripid) {
  try {
    const snapshot = await db
      .collection("tripsignups")
      .where("tripid", "==", tripid)
      .where("user", "==", auth.currentUser.email)
      .get();
    if (snapshot.size != 0) {
      r_e("su" + tripid).classList.add("is-hidden");
      r_e(
        "option" + tripid
      ).innerHTML = `<button class="button is-success mt-2"> You already signed up! </button>`;
    }
  } catch (error) {
    console.error("Error restricting signup:", error);
  }
}

async function triproster(user) {
  try {
    const snapshot = await db
      .collection("cars")
      .where("driver", "==", user)
      .get();

    let html = ``;
    if (snapshot.size === 0) {
      html = `<p class="column is-full is-size-4 has-text-centered"> You are not a driver of any trips.</p>`;
    }

    const cars = snapshot.docs;
    for (const car of cars) {
      const carnumber = car.data().carnumber;
      const pickuplocation = car.data().pickuplocation;
      const pickuptime = car.data().pickuptime;
      const tripID = car.data().tripID;

      const tripSnapshot = await db
        .collection("trips")
        .where("tripID", "==", tripID)
        .get();

      const trip = tripSnapshot.docs[0];
      const eventName = trip.data().eventName;
      const location = trip.data().location;
      const date = trip.data().date;
      const capacity = trip.data().numberofcars * 4;

      const userSnapshot = await db
        .collection("tripsignups")
        .where("tripid", "==", tripID)
        .where("carnumber", "==", carnumber.toString())
        .get();

      const users = userSnapshot.docs.length;

      html += `<div class="column is-one-third">
        <div class="card" onclick="getusers(${tripID},(${carnumber}).toString())" style="cursor: pointer;" >
          <div class="card-content">
            <p class="has-text-centered is-size-5">${eventName}</p>
            <p>Trip Location: ${location}</p>
            <p>Date: ${date}</p>
            <p>Car #: ${carnumber}</p>
            <p>Pickup Location: ${pickuplocation}</p>
            <p>Pickup Time: ${pickuptime}</p>
            <p>Capacity: ${users}/${capacity}</p>
          </div>
        </div>
      </div>`;
    }

    r_e("main").innerHTML = `<div class="p-5">
      <div class="p-5">
      <p class="title pl-6 has-text-centered">Trip Roster</p>

        <!-- Ski Trip Table -->
        <div class="container is-fluid">
          <div class="columns is-multiline">
            ${html}
          </div>
        </div>
      </div>
    </div>`;
  } catch (error) {
    console.error("Error fetching trip roster:", error);
  }
}

async function getusers(tripid, carnumber) {
  try {
    const snapshot = await db
      .collection("tripsignups")
      .where("tripid", "==", tripid)
      .where("carnumber", "==", carnumber)
      .get();

    let html = ``;
    const users = snapshot.docs;
    if (snapshot.size === 0) {
      html = `<tr class="row-highlight is-size-4 has-text-centered"> <td colspan= "6">There are no users signed up.</td></tr>`;
    }
    for (const user of users) {
      const email = user.data().user;
      const status = user.data().status;
      const skis = user.data().skis;

      const userSnapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      const userdata = userSnapshot.docs[0].data();
      const name = userdata.name;
      const phone = userdata.phone;
      const address = userdata.address;

      html += `<tr class="row-highlight">
                  <td>${name}</td>
                  <td>${email}</td>
                  <td>${phone}</td>
                  <td>${address}</td>
                  <td>${skis}</td>
                  <td class="capacity-box capacity-yellow">${status}</td>
               </tr>`;
    }

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
  } catch (error) {
    console.error("Error fetching users:", error);
  }
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

// Hide admin functionality
// Trash - id = trash (list of nums), fa-solid fa-trash
// Add event - id = addeventbtn

function hideadminfunction() {
  let adminfunctionality = document.querySelectorAll(".admin");
  if (auth.currentUser.email != "admin@hoofersns.org") {
    adminfunctionality.forEach((functionality) => {
      functionality.classList.add("is-hidden");
    });
  } else {
    adminfunctionality.forEach((functionality) => {
      functionality.classList.remove("is-hidden");
    });
  }
}

function showHomePage() {
  r_e("main").innerHTML = `<section class="section">
  <div class="container">
    <!-- Welcome Section -->
    <div class="box" style="background-color: #f5f5f5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <h2 class="title is-3 has-text-centered">Sign Up Info and Policies</h2>
      <ul style="list-style-type: disc; margin-left: 20px;">
        <li>Below you will find upcoming trips available for sign up. Please click the more details button to learn more about the trip, then you can sign up from there.</li>
        <li>Cars will wait at a maximum of 5 minutes before departing without you. Please arrive at the pickup location 10-15 minutes early to load the car. </li>
        <li>Trip time's are listed in the description. You will be picked up from the pickup location of the car you sign up for. Either Memorial Union or Union South.</li>
        <li>Once you have signed up for a trip you will have 48 hours to complete payment on Venmo @HoofersSNS (linked in icon in footer). Failure to complete payment within this time will result in removal from the trip.</li>
        <li>Please refer to your My Trips page to see which trips you have signed up for.</li>
        <li>Refer to the Account Info page to change any of your contact information or preferences.</li>
        <li>Please contact vplocaltrips@hoofersns.org with any questions or concerns about your sign ups or if you need to cancel.</li>
        <li>Please note all trips are <b>NONREFUNDABLE</b>.</li>
      </ul>
    </div>
    <!-- Upcoming Trips Section -->
    <div id="tabletitle" class="columns has-text-centered">
      <div class="column"></div>
      <div class="column">
        <p class="title">Upcoming Trips</p>
      </div>
      <div class="column has-text-right pr-5">
        <button id="addeventbtn" class="button is-success is-outlined is-vcentered has-text-weight-bold is-rounded admin" style="border-width: 3px;">
          Add Event
        </button>
      </div>
    </div>
    <!-- Ski Trip Table -->
    <div class="box" style="background-image: radial-gradient(at top left, #1fafa3e6, #00ffc8be); border-radius: 12px; margin-top: 20px;">
      <table class="table is-fullwidth has-text-centered" style="border-radius: 8px;">
        <thead>
          <tr>
            <th class="has-text-centered is-size-5">Event Name</th>
            <th class="has-text-centered is-size-5">Price</th>
            <th class="has-text-centered is-size-5">Location</th>
            <th class="has-text-centered is-size-5">Date</th>
            <th class="has-text-centered is-size-5">Time</th>
            <th class="has-text-centered is-size-5">Action</th>
            <th class="has-text-centered is-size-5">Capacity</th>
          </tr>
        </thead>
        <tbody id="upcomingtrips"></tbody>
      </table>
    </div>
  </div>
</section>
`;
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
}

async function getPassengers(tripid, carnumber) {
  try {
    let snapshot = await db
      .collection("tripsignups")
      .where("tripid", "==", tripid)
      .where("carnumber", "==", carnumber.toString())
      .get();
    let html = ``;
    let users = snapshot.docs;
    if (snapshot.size == 0) {
      html = `<tr class="row-highlight is-size-4 has-text-centered"> <td colspan= "6">There are no users signed up.</td></tr>`;
    }
    for (let user of users) {
      let email = user.data().user;
      let status = user.data().status;
      let notstatus = "";
      if (status == "Pending") {
        notstatus = "Approved";
      } else {
        notstatus = "Pending";
      }
      let skis = user.data().skis;

      let userSnapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      let userdata = userSnapshot.docs[0].data();
      let name = userdata.name;
      let phone = userdata.phone;
      let address = userdata.address;

      html += `<tr class="row-highlight">
                  <td>${name}</td>
                  <td>${email}</td>
                  <td>${phone}</td>
                  <td>${address}</td>
                  <td>${skis}</td>
                  <td> Status: <Select name="currentStatus" id="currentStatus" class="select" oninput="async function update() { await db.collection('tripsignups').where('tripid', '==', ${tripid}).where('user', '==', '${email}').get().then((snapshot)=>{db.collection('tripsignups').doc(snapshot.docs[0].id).update({status: r_e('currentStatus').value})}); await alert('Status has been updated')} update(); updateModal(${tripid},'${email}')"> <option id='status1' value='${status}'>${status}</option><option id='status2' value='${notstatus}'>${notstatus}</option></select> </td>
                  <td class="is-vcentered has-text-danger"><i style="cursor: pointer;" class="fa-solid fa-trash admin" id="trash" onclick="async function go() {await admindeletesignup(${tripid}, '${email}'); await getPassengers(${tripid}, ${carnumber});} go()"></i></td>
               </tr>`;
    }

    r_e(
      "passengerModal"
    ).innerHTML = `<div class="modal" id="passenger_${tripid}${carnumber}">
    <div class="modal-background" id="passengermodalbg${tripid}${carnumber}"></div>
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
        id="passengerclose${tripid}${carnumber}"
        aria-label="close"
      ></button>
    </div>
  </div>`;
    passengershowmodal(tripid.toString() + carnumber.toString());
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function passengershowmodal(tripid) {
  r_e("passenger_" + tripid).classList.add("is-active");
  r_e("passengermodalbg" + tripid).addEventListener("click", () => {
    r_e("passenger_" + tripid).classList.remove("is-active");
  });
  r_e("passengerclose" + tripid).addEventListener("click", () => {
    r_e("passenger_" + tripid).classList.remove("is-active");
  });
}

function admindeletesignup(tripid, user) {
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
          alert("User has been deleted");
        });
    });
}
