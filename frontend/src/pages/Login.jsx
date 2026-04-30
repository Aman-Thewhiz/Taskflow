import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "../chakra";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../store/authSlice";

const MotionBox = motion(Box);

const getFriendlyError = (message) => {
  if (!message) {
    return "";
  }

  const lower = message.toLowerCase();
  if (lower.includes("invalid") || lower.includes("password")) {
    return "That email or password is incorrect. Please try again.";
  }

  if (lower.includes("missing")) {
    return "Please enter both email and password.";
  }

  return "Unable to sign you in right now. Please try again.";
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const friendlyError = useMemo(() => getFriendlyError(error), [error]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
    );
  };

  return (
    <Box minH="100vh" px={{ base: 4, md: 10 }} py={{ base: 10, md: 16 }}>
      <Box maxW="440px" mx="auto" position="relative">
        <MotionBox
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          position="relative"
          bg="whiteAlpha.50"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          borderRadius="24px"
          px={{ base: 6, md: 8 }}
          py={{ base: 8, md: 10 }}
          backdropFilter="blur(16px)"
          _before={{
            content: '""',
            position: "absolute",
            inset: "-2px",
            borderRadius: "28px",
            background:
              "radial-gradient(160px circle at top left, rgba(56, 217, 161, 0.35), transparent 60%), radial-gradient(200px circle at 80% 120%, rgba(246, 196, 83, 0.2), transparent 65%)",
            zIndex: -1,
          }}
        >
          <Stack spacing="6">
            <Stack spacing="2">
              <Text color="whiteAlpha.700" fontSize="sm" letterSpacing="0.08em">
                WELCOME BACK
              </Text>
              <Heading size="lg">Sign in to TaskFlow</Heading>
              <Text color="whiteAlpha.700">
                Stay on top of everything. Lets get you back in.
              </Text>
            </Stack>

            {friendlyError ? (
              <Alert status="error" borderRadius="12px">
                <AlertIcon />
                {friendlyError}
              </Alert>
            ) : null}

            <Box as="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing="4">
                <FormControl isInvalid={Boolean(formErrors.email)}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={Boolean(formErrors.password)}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                </FormControl>

                <Button type="submit" size="lg" isLoading={loading}>
                  Sign in
                </Button>
              </Stack>
            </Box>

            <Text color="whiteAlpha.700" fontSize="sm">
              New here?{" "}
              <Link as={RouterLink} to="/register" color="brand.300">
                Create an account
              </Link>
            </Text>
          </Stack>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default Login;
