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

function Signup() {
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile_pic, setProfilePic] = useState("");

  const signUpUser = async () => {
    if (
      username === "" ||
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === ""
    ) {
      alert("please enter all fields.");
      throw new Error("Bad Request: Some fields are empty.");
    } else {
      const res = await axios.post("http://localhost:4700/signup", {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        profile_pic:
          profile_pic === ""
            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwvGWjwjiCh8UCmLjeDGBj9iIZt7cyiynfwnYz_63_hg&s"
            : profile_pic,
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
      <>
        <Flex
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bg="black"
        >
          <Box width="400px" p={8} borderRadius="md" boxShadow="lg">
            <Heading as="h1" size="lg" mb={6} color="white">
              Sign Up
            </Heading>
            <FormControl id="username" mb={4}>
              <FormLabel color="white">Username</FormLabel>
              <Input
                type="text"
                color="white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="firstName" mb={4} color="white">
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                color="white"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl id="lastName" mb={4} color="white">
              <FormLabel color="white">Last Name</FormLabel>
              <Input
                type="text"
                color="white"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" mb={4} color="white">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                color="white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" mb={6}>
              <FormLabel color="white">Password</FormLabel>
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
                signUpUser()
                  .then(() => {
                    navigate("/problems");
                  })
                  .catch(() => {
                    navigate("/");
                  });
              }}
            >
              Sign Up
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => navigate("/login")}
              width="100%"
            >
              Login Instead
            </Button>
          </Box>
        </Flex>
      </>
    );
  }
}

export default Signup;
