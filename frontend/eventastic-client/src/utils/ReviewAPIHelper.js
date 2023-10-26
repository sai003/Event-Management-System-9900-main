import * as axios from "axios";

export default class ReviewAPI {
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

  postReviewInteraction = (body) => {
    return this.init().post("/review_interaction", body);
  };

  putReviewInteraction = (interactionID, body) => {
    return this.init().put(`/review_interaction/${interactionID}`, body);
  };

  getReviewList = (params) => {
    return this.init().get("/reviews", {params:params});
  };

  postReview = (body) => {
    return this.init().post("/reviews", body);
  };

  putReview = (reviewID, body) => {
    return this.init().put(`/reviews/${reviewID}`, body);
  };
  
  // Add additional API call here as needed ...
}