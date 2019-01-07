import axios from "axios";

export const onSuccess = resp => {
  console.log("Success");
  console.log(resp);
  return resp;
};
export const onError = err => {
  console.log("Error");
  console.log(err);
  return err;
};

export default () =>
  axios({
    method: "get",
    url: `https://mock-endpoints.herokuapp.com/passcode`,
    responseType: "stream",
    headers: {
      "Content-Type": "application/json"
    }
  });
