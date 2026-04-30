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
import { clearAuthError, registerUser } from "../store/authSlice";

const MotionBox = motion(Box);

const getFriendlyError = (message) => {
  if (!message) {
    return "";
  }

  const lower = message.toLowerCase();
  if (lower.includes("email already")) {
    return "That email is already registered. Try logging in instead.";
  }

  if (lower.includes("required")) {
    return "Please fill in all required fields.";
  }

  return "Unable to create your account right now. Please try again.";
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
      registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
    );
  };

  return (
    <Box minH="100vh" px={{ base: 4, md: 10 }} py={{ base: 10, md: 16 }}>
      <Box maxW="520px" mx="auto" position="relative">
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
              "radial-gradient(180px circle at top right, rgba(56, 217, 161, 0.3), transparent 60%), radial-gradient(200px circle at 10% 120%, rgba(15, 116, 82, 0.25), transparent 70%)",
            zIndex: -1,
          }}
        >
          <Stack spacing="6">
            <Stack spacing="2">
              <Text color="whiteAlpha.700" fontSize="sm" letterSpacing="0.08em">
                GET STARTED
              </Text>
              <Heading size="lg">Create your TaskFlow account</Heading>
              <Text color="whiteAlpha.700">
                Build momentum, focus deeper, and track your wins.
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
                <FormControl isInvalid={Boolean(formErrors.name)}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                </FormControl>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={Boolean(formErrors.confirmPassword)}>
                  <FormLabel>Confirm password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <FormErrorMessage>
                    {formErrors.confirmPassword}
                  </FormErrorMessage>
                </FormControl>

                <Button type="submit" size="lg" isLoading={loading}>
                  Create account
                </Button>
              </Stack>
            </Box>

            <Text color="whiteAlpha.700" fontSize="sm">
              Already have an account?{" "}
              <Link as={RouterLink} to="/login" color="brand.300">
                Sign in
              </Link>
            </Text>
          </Stack>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default Register;
