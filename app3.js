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
          <td class="is-vcentered has-text-danger"><i style="cursor: pointer;" class="fa-solid fa-trash admin" id="trash${tripID}" onclick="adminTripConfirmDelete(${tripID})"></i></td>
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