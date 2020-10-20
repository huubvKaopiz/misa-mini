import React from "react";
import "./App.css";
import { Input, Button } from "antd";

function App() {
  return (
    <div className="container">
      <div className="form-group mb-1">
        <label htmlFor="">Reason</label>
        <Input />
      </div>
      <div className="form-group mb-1">
        <label htmlFor="">Price</label>
        <Input />
      </div>
      <div className="form-group">
        <Button type="primary">Save changes</Button>
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
