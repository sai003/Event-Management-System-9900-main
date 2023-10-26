import * as axios from "axios";

export default class VenueAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = 'http://localhost:8081/v1';
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

  getVenueList = () => {
    return this.init().get("/venues");
  };

  addVenue = (data) => {
    return this.init().post("/venues", data);
  };

  // Add additional API call here as needed ...
}