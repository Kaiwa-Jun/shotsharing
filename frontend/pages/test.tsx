import React, { useState, useEffect } from "react";
import axios from "axios";

const TestPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/hello");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching data from Rails API", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Frontend</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestPage;
