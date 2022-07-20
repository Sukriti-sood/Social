import { BASE_URL } from "../config";

const signup = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const sendOtp = async (data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/email-send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }  
}

const verifyOtp = async (data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/verifyOTP", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }    
}

const changePass = async(data) => {
  try{
    const res = await fetch(BASE_URL + "api/users/changePass", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  }catch (err) {
    console.log(err);
  }   
}

const login = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + params.id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getRandomUsers = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/random?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getFollowing = async (data) =>{
  try{
    const res = await fetch(
      BASE_URL + "api/users/following/" + data.userId
    );

    return res.json();

  }catch (err) {
    console.log(err);
  }
}

const getFollowers = async (data) =>{
  try{
    const res = await fetch(
      BASE_URL + "api/users/followers/" + data.followingId
    );

    return res.json();

  }catch (err) {
    console.log(err);
  }  
}

const updateUser = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + user._id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const followUser = async (user, data) =>{
  try{
    const res = await fetch(BASE_URL + "api/users/follow/" + data.followingId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }catch (err) {
    console.log(err);
  }
}

const unfollowUser = async (user, data) =>{
  try{
    const res = await fetch(BASE_URL + "api/users/unfollow/" + data.followingId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }catch (err) {
    console.log(err);
  }
}

export { signup,getFollowing, getFollowers, followUser,unfollowUser, sendOtp, verifyOtp, changePass, login, getUser, getRandomUsers, updateUser };
