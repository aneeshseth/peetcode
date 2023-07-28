const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "new-password",
  database: "PEETCODE",
});
const createUser = async (request, response) => {
  const { username, first_name, last_name, email, password, profile_pic } =
    request.body;
  await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.length === 0) {
        pool.query(
          "INSERT INTO users (username,first_name, last_name, email, password, role, profile_pic) VALUES (?, ?,?, ?, ?, 'user', ?)",
          [
            username.toLowerCase(),
            first_name.toLowerCase(),
            last_name.toLowerCase(),
            email.toLowerCase(),
            bcrypt.hashSync(password),
            profile_pic,
          ],
          (err, res) => {
            if (err) {
              throw err;
            }
            const token = jwt.sign({ id: res.insertId }, "ANEESH", {
              expiresIn: "3hr",
            });

            response
              .cookie("token", token, {
                httpOnly: true,
                expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              })
              .status(201)
              .json({ id: res.insertId });
          }
        );
      } else {
        return response.status(400).send("User already exists!");
      }
    }
  );
};

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res);
  });
};
const loginUser = (request, response) => {
  const { email, password } = request.body;
  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email.toLowerCase()],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.length !== 0) {
        const comparePass = bcrypt.compare(password, res[0].password);
        if (comparePass) {
          const token = jwt.sign({ id: res[0].id }, "ANEESH", {
            expiresIn: "3hr",
          });
          response
            .cookie("token", token, {
              httpOnly: true,
              expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .json({
              id: res[0].id,
              token: token,
            });
        } else {
          return response.status(400).send("Invalid ID/Password!");
        }
      } else {
        response.status(400).send("User does not exist!");
      }
    }
  );
};

const getRole = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM users WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("An error occurred");
      throw err;
    }
    response.status(200).json(res[0].role);
  });
};

const logoutUser = (request, response) => {
  response.cookie("token", null, {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  return response.json("User logged out!");
};

const getLoggedInUser = async (req, res) => {
  pool.query(
    "SELECT * FROM USERS WHERE ID = ?",
    [req.user.id],
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send(result);
    }
  );
};

const updateRole = async (req, res) => {
  const id = req.params.id;
  pool.query(
    "UPDATE USERS SET ROLE = 'Premium' WHERE ID = ?",
    [id],
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send("Updated!");
    }
  );
};

module.exports = {
  updateRole,
  createUser,
  getUsers,
  loginUser,
  getRole,
  logoutUser,
  getLoggedInUser,
};
