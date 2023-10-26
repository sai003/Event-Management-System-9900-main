import * as axios from "axios";

export default class GroupAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = `http://127.0.0.1:8082/v1`;
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

  getGroupList = (params) => {
    return this.init().get("/groups", { params: params });
  };

  postGroup = (body) => {
    return this.init().post("/groups", body);
  };

  getGroup = (groupID) => {
    return this.init().get(`/groups/${groupID}`);
  };

  putGroup = (groupID, body) => {
    return this.init().put(`/groups/${groupID}`, body);
  };

  postGroupMember = (groupID, body) => {
    return this.init().post(`/groups/${groupID}/members`, body);
  };

  patchGroupMember = (groupID, memberID, body) => {
    return this.init().patch(`/groups/${groupID}/members/${memberID}`, body);
  };

}