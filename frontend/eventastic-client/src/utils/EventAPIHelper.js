import * as axios from "axios";

export default class EventAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = `http://127.0.0.1:8081/v1`;
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

  postEvent = (body) => {
    return this.init().post("/events", body);
  };
  
  getEventList = (params) => {
    return this.init().get("/events", { params: params });
  };

  getEventDetails = (eventID) => {
    return this.init().get("/events/" + eventID);
  };

  putEvent = (eventID, body) => {
    return this.init().put(`/events/${eventID}`, body);
  };

  patchEvent = (eventID, body) => {
    return this.init().patch(`/events/${eventID}`, body);
  };  

  addBooking = (body) => {
    return this.init().post("/bookings", body);
  };

  getBookings = (params) => {
    return this.init().get('/bookings', { params: params });
  };

  getBooking = (accountID, params) => {
    return this.init().get(`/bookings/${accountID}`, { params: params });
  };

  patchBookings = (bookingID, body) => {
    return this.init().patch(`/bookings/${bookingID}`, body);
  };

  getTickets = (params) => {
    return this.init().get('/tickets', { params: params });
  };

  getReviews = (params) => {
    return this.init().get('/reviews', { params: params });
  };

  putReviews = (reviewId, body) => {
    return this.init().put(`/reviews/${reviewId}`, body);
  };

  getRewardPoints = (param) => {
    return this.init().get("/reward_points", { params: param });
  };

  postRewardPoints = (body) => {
    return this.init().post("/reward_points", body);
  };

  patchRewardPoints = (reward_points_id, body) => {
    return this.init().patch(`/reward_points/${reward_points_id}`, body);
  };
  
  getRecommendations = (accountID, params) => {
    return this.init().get(`/recommendations/${accountID}`, { params: params });
  };  
  // Add additional API call here as needed ...
}