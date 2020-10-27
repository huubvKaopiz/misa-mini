import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  Input,
  Button,
  notification,
  Spin,
  Modal,
  PageHeader,
  Statistic,
  Pagination,
  DatePicker,
} from "antd";
import axios from "axios";
import moment from "moment";
import { get } from "lodash";
import Header from "./components/Header";

function App() {
  const [receiptPayload, setReceiptPayload] = useState({
    price: "",
    reason: "",
  });
  const [receipts, setReceipts] = useState(null);
  const [statistical, setStatistical] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  const getReceipts = useCallback(async () => {
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_API_URL}/receipts`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        params,
      });
      setReceipts(res.data);
    } catch (error) {
      notification.error({ message: "Error" });
    }
  }, [params]);

  const getStatistical = useCallback(
    async function () {
      try {
        const res = await axios({
          url: `${process.env.REACT_APP_API_URL}/receipts-statistical`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          params,
        });
        setStatistical(res.data);
      } catch (error) {
        notification.error({ message: "Error" });
      }
    },
    [params]
  );

  const getData = useCallback(async () => {
    try {
      await getStatistical();
      await getReceipts();
    } catch (error) {
      notification.error({ message: "Error" });
    } finally {
      setLoading(false);
    }
  }, [getReceipts, getStatistical]);

  useEffect(() => {
    setLoading(true)
    getData();
  }, [getData]);

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
      await getData();
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
          await getData();
        } catch (error) {
          notification.error({ message: error.response.data.message });
        } finally {
          setLoading(false);
        }
      },
    });
  }

  function handlePageChange(page: number) {
    setLoading(true);
    setParams({ ...params, page });
  }

  function handleChangeDate(date: any) {
    setLoading(true);
    setParams({
      ...params,
      date: moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : null,
    });
  }

  return (
    <Spin spinning={loading}>
      <div className="container">
        <PageHeader
          title="Misa"
          className="site-page-header"
          subTitle="This is a misa mini app"
          extra={[<Header key="more" />]}
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
          <Statistic
            title="08/2020"
            value={get(statistical, "amountLastOfLastMonth", 0)}
          />
          <Statistic
            title="09/2020"
            value={get(statistical, "amountLastMonth", 0)}
          />
          <Statistic
            title="10/2020"
            value={get(statistical, "amountCurrentMonth", 0)}
          />
        </div>

        <DatePicker format="YYYY-MM-DD" onChange={handleChangeDate} inputReadOnly />

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
        <Pagination
          current={get(receipts, "current_page", 1)}
          total={get(receipts, "total", 1)}
          pageSize={get(receipts, "per_page", 1)}
          className="mt-1"
          onChange={handlePageChange}
          size="small"
        />
      </div>
    </Spin>
  );
}

export default App;
