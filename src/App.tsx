import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  Input,
  Button,
  notification,
  Spin,
  Modal,
  PageHeader,
  Menu,
  Dropdown,
  Tag,
  Typography,
  Row,
  Statistic,
} from "antd";
import axios from "axios";
import moment from "moment";
import { get } from "lodash";
import { EllipsisOutlined } from "@ant-design/icons";

const menu = (
  <Menu>
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
    <Menu.Item>3rd menu item</Menu.Item>
  </Menu>
);

const DropdownMenu = () => {
  return (
    <Dropdown key="more" overlay={menu}>
      <Button
        style={{
          border: "none",
          padding: 0,
        }}
      >
        <EllipsisOutlined
          style={{
            fontSize: 20,
            verticalAlign: "top",
          }}
        />
      </Button>
    </Dropdown>
  );
};

function App() {
  const [receiptPayload, setReceiptPayload] = useState({
    price: "",
    reason: "",
  });
  const [receipts, setReceipts] = useState(null);
  const [loading, setLoading] = useState(false);

  const getReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_API_URL}/receipts`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      setReceipts(res.data);
    } catch (error) {
      notification.error({ message: "Error" });
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/receipts`,
        method: "POST",
        data: receiptPayload,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      notification.success({ message: "Success" });
      getReceipts();
      setReceiptPayload({ reason: "", price: "" });
    } catch (error) {
      notification.error({ message: error.response.data.message });
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteReceipt(receipt: any) {
    Modal.confirm({
      title: "are you sure?",
      async onOk() {
        setLoading(true);
        try {
          await axios({
            url: `${process.env.REACT_APP_API_URL}/receipts/${receipt.id}`,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          notification.success({ message: "Success" });
          getReceipts();
        } catch (error) {
          notification.error({ message: error.response.data.message });
        } finally {
          setLoading(false);
        }
      },
    });
  }

  return (
    <Spin spinning={loading}>
      <div className="container">
        <PageHeader
          title="Misa"
          className="site-page-header"
          subTitle="This is a misa mini app"
          extra={[<DropdownMenu key="more" />]}
          onBack={() => null}
        />

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

        <div className="statistical">
          <Statistic title="08/2020" value={1231} />
          <Statistic title="09/2020" value={9123} />
          <Statistic title="10/2020" value={9223} />
          <Statistic title="11/2020" value={1000} />
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
            {get(receipts, "data.length", 0)
              ? get(receipts, "data", []).map((receipt: any) => {
                  return (
                    <tr key={receipt.id}>
                      <td onClick={() => handleDeleteReceipt(receipt)}>
                        {moment(receipt.created_at).format("DD-MM")}
                      </td>
                      <td>{receipt.reason}</td>
                      <td>{receipt.price}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </Spin>
  );
}

export default App;
