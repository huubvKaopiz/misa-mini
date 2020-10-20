import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Input, Button } from "antd";
import axios from "axios";

function App() {
  const [receiptPayload, setReceiptPayload] = useState({
    price: "",
    reason: "",
  });

  const getReceipts = useCallback(async () => {
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_API_URL}/receipts`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getReceipts();
  }, [getReceipts]);

  function handleChangeReason(e: any) {
    setReceiptPayload({ ...receiptPayload, reason: e.target.value });
  }

  function handleChangePrice(e: any) {
    setReceiptPayload({ ...receiptPayload, price: e.target.value });
  }

  async function handleSaveReceipt() {
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_API_URL}/receipts`,
        method: "POST",
        data: receiptPayload,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      console.log(res);
      getReceipts()
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <div className="container">
      <div className="form-group mb-1">
        <label htmlFor="">Reason</label>
        <Input value={receiptPayload.reason} onChange={handleChangeReason} />
      </div>
      <div className="form-group mb-1">
        <label htmlFor="">Price</label>
        <Input value={receiptPayload.price} onChange={handleChangePrice} />
      </div>
      <div className="form-group">
        <Button onClick={handleSaveReceipt} type="primary">
          Save changes
        </Button>
      </div>

      <table className="table mt-1">
        <thead>
          <tr>
            <th className="text-left">date</th>
            <th className="text-left">reason</th>
            <th className="text-left">price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
