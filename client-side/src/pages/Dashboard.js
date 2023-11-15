import React from "react";
import { useEffect, useState } from "react";

function Dashboard() {
  const [quote, setQuote] = useState("");

  // To populate quotes
  async function populateQuotes(event) {
    const response = await fetch("http://localhost:1337/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("accessToken"),
      },
    });
    // converting response data to json
    const data = await response.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    }
  }

  useEffect(() => {
    populateQuotes();
  }, []);

  return <div>{quote ? quote : "No Quotes Found"}</div>;
}

export default Dashboard;
