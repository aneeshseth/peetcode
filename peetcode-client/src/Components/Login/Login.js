import React, { useState } from "react";
import { PongSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const loginUser = async () => {
    if (email === "" || password === "") {
      alert("please enter all fields.");
      throw new Error("Bad Request: Some fields are empty.");
    } else {
      const res = await axios.post("http://localhost:4700/login", {
        email: email,
        password: password,
      });
      const data = await res.data;
      return data;
    }
  };
  if (loading) {
    return (
      <div className="App">
        <div className="spinner">
          <PongSpinner size={110} color="pink" />
        </div>
      </div>
    );
  } else {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bg="black"
      >
        <Box width="400px" p={8} borderRadius="md" boxShadow="lg">
          <Heading as="h1" size="lg" mb={6} color="white">
            Login
          </Heading>
          <FormControl id="email" mb={4} color="white">
            <FormLabel>Email</FormLabel>
            <Input
              color="white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" mb={6} color="white">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              color="white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="pink"
            width="100%"
            marginBottom={5}
            onClick={() => {
              loginUser()
                .then(() => {
                  navigate("/problems");
                })
                .catch(() => {
                  navigate("/");
                });
            }}
          >
            Log In
          </Button>
          <Button colorScheme="gray" onClick={() => navigate("/")} width="100%">
            Sign Up Instead
          </Button>
        </Box>
      </Flex>
    );
  }
}

export default Login;
