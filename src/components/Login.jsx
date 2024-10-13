import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Card, Modal } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Grid from '@mui/material/Grid2';
import * as Yup from 'yup';
import { loginUser } from '../services/APIservice.jsx';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../styles/Registration.css';


const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .matches(/@gmail\.com$/, 'Email must be from the domain gmail.com')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must not exceed 15 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

const LoginPage = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);  // State to manage modal visibility
  const navigate=useNavigate();
  const initialValues = {
    email: '',
    password: '',
  };
  // const userId = response.data.userId;
   // sessionStorage.setItem('userId', userId);
   // console.log("Fetching tests for userId:", userId);
  const handleSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      
     if (response && response?.status == 200 && response?.data?.status == "success") {
      
        setSuccessMessage('Success! You have logged in successfully');
        setErrorMessage(null);
        const token = response.data.token;
        sessionStorage.setItem('token',token),
        console.log("Token:", token);
        navigate('/Quest');
   

      }
    } catch (error) {
      if (error && error?.status == 404 && error?.response?.data?.message == "User not found") {
        setSuccessMessage(null);
        setErrorMessage('No account associated with this email address. Please check your email or create a new account.');
      } else if (error && error?.status == 400 && error?.response?.data?.message == "Incorrect password") {
        setSuccessMessage(null);
        setErrorMessage('Oops! The password you entered is incorrect. Please try again.');
      } else {
        setSuccessMessage(null);
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      {successMessage && (
        <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
          <Alert severity="success">{successMessage}</Alert>
        </Stack>
      )}
      {errorMessage && (
        <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
          <Alert severity="error">{errorMessage}</Alert>
        </Stack>
      )}

      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" align="left" sx={{ fontWeight: 'bold' }}>Login</Typography>
          <Typography variant="body2" align="left" sx={{ mt: 1, mb: 2 }}>
            Doesn't have an account yet?{' '}
            <Link to="/register" variant="body2" style={{ textDecoration: 'none', color: 'primary' }} className='Loginlink'>
              Register here
            </Link>
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form style={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      variant="outlined"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      id="pwd"
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                  <Typography variant="body2" align="right" >
                    <Button  variant="text" onClick={() => setOpenModal(true)} className='Loginlink'>
                      Forgot Password?
                    </Button>
                  </Typography>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Card>

      {/* Forgot Password Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="forgot-password-modal"
        aria-describedby="forgot-password-form"
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2,
        }}>
          <ResetPassword />  {/* Include ForgotPassword component inside the modal */}
        </Box>
      </Modal>
    </Container>
  );
};

export default LoginPage;
