import { useEffect, useState } from "react";

interface ApiResponse {
  message: string;
}

const Test = () => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000/api/v1/hello");
      const data = await response.json();
      setData(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      {" "}
      {data ? (
        <div>
          {" "}
          <h1>{data.message}</h1>{" "}
        </div>
      ) : (
        <div>Loading…</div>
      )}{" "}
    </div>
  );
};

export default Test;
