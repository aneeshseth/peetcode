const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "new-password",
  database: "PEETCODE",
});

const addProblemSolved = async (req, res) => {
  const id = req.params.id;
  await pool.query(
    "INSERT INTO PROBLEMS_SOLVED (PROBLEMS_ID, USER_ID) VALUES (?, ?)",
    [id, req.user.id],
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send("Solved added!");
    }
  );
};

const getNumberOfProblemsSolved = async (req, res) => {
  try {
    const solved = [];
    const { user_id } = req.body;

    const solvedProblems = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM PROBLEMS_SOLVED WHERE USER_ID = ?",
        [user_id],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(result);
        }
      );
    });
    const fetchPromises = solvedProblems.map((problem) => {
      return new Promise((resolve, reject) => {
        pool.query(
          "SELECT * FROM PROBLEMS WHERE ID = ?",
          [problem.problems_id],
          (error, problemSolved) => {
            if (error) {
              reject(error);
            }
            resolve(problemSolved[0]);
          }
        );
      });
    });
    solved.push(...(await Promise.all(fetchPromises)));
    return res.status(200).send(solved);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
};

const getProblemsByCategory = async (req, res) => {
  const { category } = req.body;
  pool.query(
    "SELECT * FROM PROBLEMS WHERE CATEGORY = ?",
    [category],
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send(result);
    }
  );
};

const filterByDifficulty = async (req, res) => {
  const { difficulty } = req.body;
  pool.query(
    "SELECT * FROM PROBLEMS WHERE DIFFICULTY = ?",
    [difficulty],
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send(result);
    }
  );
};

const filterByCompany = async (req, response) => {
  const { company } = req.body;
  console.log(company);
  const arr = [];
  const one = await new Promise((resolve, reject) => {
    pool.query(
      "SELECT ID FROM COMPANIES WHERE COMPANY_NAME = ?",
      [company],
      (err, res) => {
        if (err) {
          reject(err);
        }
        pool.query(
          "SELECT PROBLEM_ID FROM PROBLEMS_COMPANIES_RELATION WHERE COMPANY_ID = ?",
          [res[0].ID],
          (error, result) => {
            console.log(result);
            resolve(result);
          }
        );
      }
    );
  });
  const fetchFinal = one.map((final) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM PROBLEMS WHERE ID = ?",
        [final.PROBLEM_ID],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result[0]);
        }
      );
    });
  });
  arr.push(...(await Promise.all(fetchFinal)));
  return response.status(200).send(arr);
};

const getTotalProblems = async (req, res) => {
  pool.query("SELECT * FROM PROBLEMS", (err, result) => {
    if (err) {
      throw err;
    }
    return res.status(200).send(result.length.toString());
  });
};

const filterByTop150 = (req, res) => {
  pool.query("SELECT * FROM PROBLEMS WHERE top150 = 1 ", (err, result) => {
    if (err) {
      throw err;
    }
    return res.status(200).send(result);
  });
};
const filterByTop75 = async (req, res) => {
  pool.query("SELECT * FROM PROBLEMS WHERE top75 = 1", (err, result) => {
    if (err) {
      throw err;
    }
    return res.status(200).send(result);
  });
};

const addAttempt = async (req, res) => {
  const id = req.params.id;
  pool.query(
    "UPDATE PROBLEMS SET times_attempted = times_attempted + 1 WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send(result);
    }
  );
};

const getProblems = async (req, res) => {
  const { search } = req.body;
  if (search === "") {
    pool.query("SELECT * FROM PROBLEMS", (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(200).send(result);
    });
  } else {
    pool.query(
      "SELECT * FROM problems WHERE MATCH(title) AGAINST (?)",
      [search],
      (err, result) => {
        if (err) {
          throw err;
        }
        return res.status(200).send(result);
      }
    );
  }
};

const getCompanies = async (req, res) => {
  pool.query("SELECT * FROM COMPANIES", (err, result) => {
    if (err) {
      throw err;
    }
    return res.status(200).send(result);
  });
};
module.exports = {
  getCompanies,
  getProblems,
  addAttempt,
  filterByCompany,
  filterByDifficulty,
  filterByTop150,
  filterByTop75,
  addProblemSolved,
  getNumberOfProblemsSolved,
  getProblemsByCategory,
  getTotalProblems,
};
