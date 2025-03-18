import React, { useEffect, useState } from "react";

const Test = () => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const eventSource = new EventSource(
        `${process.env.REACT_APP_INVOICE_API_URL}/invoices/duplicate-stream`
    );

    eventSource.onmessage = (event) => {
      const message = event.data;

      if (message === "[DONE]") {
        eventSource.close();
        setLoading(false);
        console.log("SSE stream finished.");
      } else if (message.startsWith('{"duplicates":')) {
        try {
          const data = JSON.parse(message);
          if (data && data.duplicates) {
            setDuplicates(data.duplicates);
          }
        } catch (parseError) {
          setError("Error parsing SSE data.");
          console.error("Error parsing SSE event data:", parseError);
          setLoading(false);
          eventSource.close();
        }
      } else if (message.startsWith('data: {"duplicates":')) {
        try {
          const data = JSON.parse(message.substring(6));
          if (data && data.duplicates) {
            console.log(data.duplicates, "duplicates 444");
            setDuplicates(data.duplicates);
          }
        } catch (parseError) {
          setError("Error parsing SSE data.");
          console.error("Error parsing SSE event data:", parseError);
          setLoading(false);
          eventSource.close();
        }
      }
    };

    eventSource.onerror = (err) => {
      setTimeout(() => {
        if (loading) {
          setError("Error connecting to SSE stream.");
          console.error("SSE error:", err);
          setLoading(false);
          eventSource.close();
        }
      }, 1000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Duplicate Invoices</h2>
      {duplicates.length > 0 ? (
        <ul>
          {duplicates.map((duplicate: any) => (
            <li key={duplicate.file_has}>
              <strong>File Hash:</strong> {duplicate.file_hash}
              <ul>
                {duplicate.invoices.map((invoice: any) => (
                  <li key={invoice.id}>
                    <strong>ID:</strong> {invoice.id},{" "}
                    <strong>File Name:</strong> {invoice.file_name},{" "}
                    <strong>Created At:</strong> {invoice.created_at}
                    <strong>Status:</strong> {invoice.status},{" "}
                    <strong>Receiver:</strong> {invoice.metadata?.receiver},
                    <strong>Sender Email:</strong>{" "}
                    {invoice.metadata?.sender_email}, <strong>Sender:</strong>{" "}
                    {invoice.metadata?.sender}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No duplicate invoices found.</p>
      )}
    </div>
  );
};

export default Test;
