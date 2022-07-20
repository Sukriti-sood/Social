import {
    Button,
    Container,
    Link,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { Box } from "@mui/system";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { login, sendOtp, verifyOtp, changePass } from "../../api/users";
  import ErrorAlert from "../ErrorAlert";
  import { loginUser } from "../../helpers/authHelper";
  import Copyright from "../Copyright";
  import { isLength, isEmail} from "validator";
  import Loading from "../Loading";

  
  const LoginPage = () => {
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    const [resOtpMsg, setresOtpMsg] = useState("")
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false)
    const [isOtpVerified, setOtpVerified] = useState(false);
    const [isOtpSent, setotpSent] = useState(false)
    const [errors, setErrors] = useState({});
    const [Otp, setOtp] = useState("")
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    };
  
    const sendOTP = async(e) =>{
        e.preventDefault();
        setLoading(true)
        let otpData ={"email":formData.email, "isLogin":"1"}
    
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
    
        }
      }

      const handleOtp = (e) => {
        setOtp(e.target.value)
      };
    
      const verifyotp = async (e) => {
        setLoading(true)
        e.preventDefault();
    
        let otpData = {"email":formData.email, "code":Otp};
    
        let response = await verifyOtp(otpData);
    
        if(response.error)
        {
          setServerError(response.error);
          setLoading(false)
        }
        else
        {
          setOtpVerified(true)
          setLoading(false)
        }
      }
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)
      const errors = validate();
      if (Object.keys(errors).length !== 0) 
      return;
    
    const resp = await changePass(formData);

    if(resp.error)
    {
      setLoading(false)
        setServerError(resp.error)
    }else
    {
        const data = await login(formData);
        if (data.error) {
          setLoading(false)
            setServerError(data.error);
        } else {
            loginUser(data);
            navigate("/");
        }
    }

    };

    const validate = () => {
        const errors = {};
    
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
      <Container maxWidth={"xs"} sx={{ mt: 6 }}>
        <Stack alignItems="center">
          <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
            <Link href="/" color="inherit" underline="none">
              Social
            </Link>
          </Typography>
          {isOtpVerified?(<Stack alignItems="center">
          <Typography variant="h5" gutterBottom>
                Update Password
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
              <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            placeholder="New Password"
            onChange={handleChange}
            error={errors.password !== undefined}
            helperText={errors.password}
          />
          <ErrorAlert error={serverError} />
          {loading?<Stack alignItems="center">
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Updating and Singning..
          </Button>
          <Loading/>
            </Stack>:<Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Update Password
          </Button>}          
                </Box>         
          </Stack>):(
              isOtpSent ?<Stack alignItems="center">
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
            {loading?<Stack alignItems="center">
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Verifying OTP
          </Button>
          <Loading/>
            </Stack>:<Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Verify OTP
          </Button>}  
            <Typography color="text.secondary">
            <Link to="/forget" onClick={sendOTP}>Resend OTP</Link>
            </Typography>
            </Box>
              </Stack>:(
                <Stack alignItems="center">
                <Typography variant="h5" gutterBottom>
                Reset Password
              </Typography>
              <Typography color="text.secondary">
                Remember Password <Link href="/login">Sign Up</Link>
              </Typography>
              <Box component="form" onSubmit={sendOTP}>
                <TextField
                  label="Email Address"
                  fullWidth
                  margin="normal"
                  autoComplete="email"
                  autoFocus
                  required
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
                <ErrorAlert error={serverError} />
              {loading?<Stack alignItems="center">
              <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
              Sending ...
              </Button>
              <Loading/>
              </Stack>:<Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
              Send OTP
              </Button>}  
              </Box>                
                </Stack>
          ))}
          
          <Box sx={{ mt: 3 }}>
            <Copyright />
          </Box>
        </Stack>
      </Container>
    );
  };
  
  export default LoginPage;
  