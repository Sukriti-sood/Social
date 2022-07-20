import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { signup, sendOtp, verifyOtp} from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useNavigate } from "react-router-dom";
import Copyright from "../Copyright";
import ErrorAlert from "../ErrorAlert";
import { isLength, isEmail, contains } from "validator";
import Loading from "../Loading"

const SignupPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isotpSent, setotpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [resOtpMsg, setresOtpMsg] = useState("")
  const [Otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtp = (e) => {
    setOtp(e.target.value)
  };

  const verifyotp = async (e) => {
    e.preventDefault();

    let otpData = {"email":formData.email, "code":Otp};

    let response = await verifyOtp(otpData);

    if(response.error)
    {
      setServerError(response.error);
    }
    else
    {
      setLoading(true)
      const data = await signup(formData);

      if (data.error) {
        setLoading(false)
        setServerError(data.error);
      } else {
        
        loginUser(data);
        navigate("/");
      }
    }
  }

  const sendOTP = async() =>{
    setLoading(true)
    let otpData ={"username":formData.username, "email":formData.email, "isLogin":"0"}

    const otpres = await sendOtp(otpData);

    if(otpres.error)
    {
      setLoading(false)
      setServerError(otpres.error);
    }
    else
    {
      setLoading(false)
      setotpSent(true);
      setresOtpMsg(otpres.message);

      // const data = await signup(formData);

      // if (data.error) {
      //   setServerError(data.error);
      // } else {
      //   loginUser(data);
      //   navigate("/");
      // }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0) 
    return;
    
    await sendOTP();

  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Must contain only valid characters";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Must be at least 8 characters long";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }

    // if(!isLength(Otp, {min:4,max: 4}))
    // {
    //   errors.otp = "Otp is not valid"
    // }

    setErrors(errors);

    return errors;
  };

  return (
    <Container maxWidth={"xs"} sx={{ mt: { xs: 2, md: 6 } }}>
      <Stack alignItems="center">
        <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
          <Link href="/" color="inherit" underline="none">
            Social
          </Link>
        </Typography>
        {!isotpSent? (<Stack alignItems="center">
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Typography color="text.secondary">
          Already have an account? <Link href="/login">Login</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            autoFocus
            required
            id="username"
            name="username"
            onChange={handleChange}
            error={errors.username !== undefined}
            helperText={errors.username}
          />
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            required
            id="email"
            name="email"
            onChange={handleChange}
            error={errors.email !== undefined}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            error={errors.password !== undefined}
            helperText={errors.password}
          />
          <ErrorAlert error={serverError} />
          {loading? <Stack alignItems="center">
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Sending Otp.....
          </Button>
          <Loading/>
          </Stack> : <Stack alignItems="center">
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Send Otp
          </Button>
          </Stack>}
        </Box>
        </Stack>):(
          <Stack alignItems="center">
            <Typography color="text.secondary">
              {resOtpMsg}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Verify Email
            </Typography>
            <Box component="form" onSubmit={verifyotp}>
            <TextField
            label="OTP"
            fullWidth
            margin="normal"
            required
            id="otp"
            type="number"
            name="otp"
            onChange={handleOtp}
            error={errors.otp !== undefined}
            helperText={errors.otp}
          />
            <ErrorAlert error={serverError} />
            {loading?<Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
              Verifying OTP.....
            </Button>: <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
              Verify OTP
            </Button>}
            <Typography color="text.secondary">
            <Link to="/signup" onClick={sendOTP}>Resend OTP</Link>
            </Typography>
            </Box>
          </Stack>
        )}
        <Box sx={{ mt: 3 }}>
          <Copyright />
        </Box>
      </Stack>
    </Container>
  );
};

export default SignupPage;
