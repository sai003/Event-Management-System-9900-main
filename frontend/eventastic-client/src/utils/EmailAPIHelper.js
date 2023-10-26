import * as axios from "axios";

export default class EmailAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = `http://127.0.0.1:8083/v1`;
  }

  init = () => {

    let headers = {
      Accept: "application/json",
    };

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
      headers: headers,
    });

    return this.client;
  };

  postEmails = (body) => {
    return this.init().post("/email", body);
  };

  format_event_updated_email = (event) => {
    let template = "<html>\
    <h1>Here are the latest details for your Event:</h1>\
    <h2>" + event.event_title + "</h2>\
    <p>" + event.event_short_desc + "</p>\
    <p>" + event.event_desc + "</p>\
    <p><b>Location:</b> " + event.event_location + "</p>\
    <p><b>When does it start?</b> " + formatDate(event.event_start_datetime) + "</p>\
    <p><b>When does it end?</b> " + formatDate(event.event_end_datetime) + "</p>\
    </html>"
    return template
  };

  broadcast_message_email = (eventDetails, title, message) => {
    let template = "<html>\
    <h1>Immportant message broadcast for your event:</h1>\
    <h2>" + eventDetails.event_title + "</h2>\
    <h2>" + title + "</h2>\
    <p>" + message + "</p>\
    </html>"
    return template
  };

  send_bookings_email = (booking_code, seating_details, event_title, event_short_desc, event_desc, event_location, event_start_datetime, event_end_datetime) => {
    let template = "<html>\
    <h1>Here are the details for your booking:</h1>\
    <h2>" + event_title + "</h2>\
    <p>" + event_short_desc + "</p>\
    <p>" + event_desc + "</p><br>\
    <p><b>Location:</b> " + event_location + "</p>\
    <p><b>When does it start?</b> " + formatDate(event_start_datetime) + "</p>\
    <p><b>When does it end?</b> " + formatDate(event_end_datetime) + "</p>\
    <p> <b>Booking Code: </b>" + booking_code + "</p>\
    <p> <b>Seat Numbers: </b>" + seating_details + "</p>\
    </html>"
    return template
  };

  send_cancellation_email = (booking_code, event_title, event_short_desc, event_desc, event_location, event_start_datetime, event_end_datetime) => {
    let template = "<html>\
    <h1>Your tickets have been cancelled for this booking:</h1>\
    <h2>" + event_title + "</h2>\
    <p>" + event_short_desc + "</p>\
    <p>" + event_desc + "</p><br>\
    <p><b>Location:</b> " + event_location + "</p>\
    <p><b>When does it start?</b> " + formatDate(event_start_datetime) + "</p>\
    <p><b>When does it end?</b> " + formatDate(event_end_datetime) + "</p>\
    <p> <b>Booking Code: </b>" + booking_code + "</p>\
    </html>"
    return template
  };

}

function formatDate(dateTime) {
  let d = new Date(dateTime);
  return d.toLocaleDateString("en-US", { 
    weekday: 'long', year: 'numeric', month: 'long', 
    day: 'numeric', hour: 'numeric', minute: 'numeric' })
}
