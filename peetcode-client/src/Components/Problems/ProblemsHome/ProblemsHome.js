import React, { useEffect, useState } from "react";
import "./ProblemsHome.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

function ProblemsHome() {
  const [numberSolved, setNumberSolved] = useState("");
  const [searchT, setSearchT] = useState("");
  const [numberOfProblems, setNumberOfProblems] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const progressPercentage = (numberSolved / numberOfProblems) * 100;
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (progressPercentage / 100) * circumference;
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState({});
  const [solved, setSolved] = useState([]);
  const [companies, setCompanies] = useState([]);
  const difficultProblems = async (id) => {
    const res = await axios.post("http://localhost:4700/problem/difficulty", {
      difficulty: id,
    });
    const data = await res.data;
    return data;
  };
  const fetchProblems = async () => {
    const res = await axios.post("http://localhost:4700/problems", {
      search: searchT.length === 1 ? "" : searchT,
    });
    const data = await res.data;
    return data;
  };
  const getUser = async () => {
    const res = await axios.get("http://localhost:4700/verify", {
      withCredentials: true,
    });
    const data = await res.data;
    return data;
  };
  const totalProblems = async () => {
    const res = await axios.get("http://localhost:4700/totalProblems");
    const data = await res.data;
    return data;
  };
  const problemsSolved = async (id) => {
    const res = await axios.post("http://localhost:4700/solved", {
      user_id: id,
    });
    const data = await res.data;
    return data;
  };

  const getRoleUser = async (dataid) => {
    const res = await axios.get(`http://localhost:4700/role/${dataid.id}`);
    const data = await res.data;
    return data;
  };

  const getCompanies = async () => {
    const res = await axios.get("http://localhost:4700/companies");
    const data = await res.data;
    return data;
  };

  const getByCompany = async (company) => {
    const res = await axios.post("http://localhost:4700/problem/company", {
      company: company,
    });
    const data = await res.data;
    console.log(data);
    return data;
  };

  const purchasePremium = async () => {
    const res = await axios.get(
      "http://localhost:4700/create-checkout-session"
    );
    const data = await res.data;
    window.location.href = data.id;
    return data;
  };

  const postPurchase = async (user) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const success = urlParams.get("success");
    if (success === "true") {
      window.location.href = "http://localhost:3002/problems";
      await axios.get(`http://localhost:4700/updateRole/${user.id}`);
      alert("Payment succeeded");
    } else if (success == "false") {
      window.location.href = "http://localhost:3002/problems";
      alert("Payment failed.");
    } else {
      return;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        const solvedData = await problemsSolved(userData.id);
        setSolved(solvedData);
        setNumberSolved(solvedData.length);

        const problemsData = await fetchProblems();
        setProblems(problemsData);

        const numberData = await totalProblems();
        setNumberOfProblems(numberData);

        const role = await getRoleUser(userData);
        setRole(role);

        const fetchCompanies = await getCompanies();
        setCompanies(fetchCompanies);

        await postPurchase(userData);
      } catch (error) {
        navigate("/");
      }
    };
    fetchData();
  }, []);
  return (
    <div className="full">
      <textarea
        value={searchT}
        onChange={(e) => {
          setSearchT(e.target.value);
          fetchProblems().then((data) => {
            setProblems(data);
          });
        }}
      ></textarea>
      <div className="circular-progress-bar-container">
        <svg className="circular-progress-bar">
          <circle
            className="circular-progress-bar-background"
            r={circleRadius}
            cx="50%"
            cy="50%"
          />
          <circle
            className="circular-progress-bar-fill"
            r={circleRadius}
            cx="50%"
            cy="50%"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="progress-text">{`${progressPercentage.toFixed(
          2
        )}%`}</div>
      </div>
      <div>
        <table className="custom-table borderClass">
          <thead>
            <tr>
              <th>Title</th>
              <th>Acceptance</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          {problems.map((problem, index) => (
            <tbody className="borderClass">
              <tr onClick={() => navigate(`/problem/${problem.id}`)}>
                <td>{problem.title}</td>
                <td>{problem.acceptance}</td>
                <div>
                  <td
                    style={{
                      color:
                        problem.difficulty === "Hard"
                          ? "red"
                          : problem.difficulty === "Medium"
                          ? "yellow"
                          : "green",
                    }}
                  >
                    {problem.difficulty}
                  </td>
                </div>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <button
        onClick={() => {
          difficultProblems("Easy").then((data) => {
            setProblems(data);
          });
        }}
      >
        Easy
      </button>
      <button
        onClick={() => {
          difficultProblems("Medium").then((data) => {
            setProblems(data);
          });
        }}
      >
        Medium
      </button>
      <button
        onClick={() => {
          difficultProblems("Hard").then((data) => {
            setProblems(data);
          });
        }}
      >
        Hard
      </button>
      <button
        onClick={() => {
          fetchProblems().then((data) => {
            setProblems(data);
          });
        }}
      >
        Default
      </button>
      {companies.map((company) => (
        <button
          onClick={() => {
            if (role === "user") {
              alert("Subscribe to Premium to access this feature");
            } else {
              getByCompany(company.company_name).then((data) => {
                setProblems(data);
              });
            }
          }}
        >
          {company.company_name}
        </button>
      ))}
      <button
        disabled={role === "Premium" ? true : false}
        onClick={() => {
          purchasePremium();
        }}
      >
        Subscribe to Premium
      </button>
    </div>
  );
}

export default ProblemsHome;
