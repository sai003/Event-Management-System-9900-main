import * as axios from "axios";

export default class AccountAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = 'http://127.0.0.1:8080/v1';
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

  addAccount = (data) => {
    return this.init().post("/accounts", data);
  };

  getAccounts = (params) => {
    return this.init().get("/accounts", { params: params })
  };

  getAccount = (accountID) => {
    return this.init().get(`/accounts/${accountID}`)
  };

  patchAccount = (accountID, body) => {
    return this.init().patch(`/accounts/${accountID}`, body)
  };

  putAccount = (accountID, body) => {
    return this.init().put(`/accounts/${accountID}`, body)
  };

  getAccountCard = (accountID) => {
    return this.init().get(`/accounts/${accountID}/credit_card`)
  };

  putAccountCard = (accountID, body) => {
    return this.init().put(`/accounts/${accountID}/credit_card`, body)
  };

  getHost = (accountID) => {
    return this.init().get(`/accounts/${accountID}/host_details`)
  };

  putHost = (accountID, body) => {
    return this.init().put(`/accounts/${accountID}/host_details`, body)
  };

  getHostRequests = (params) => {
    return this.init().get("/host_details", { params: params });
  };

}