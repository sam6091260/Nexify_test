import React, { useState } from "react";
import axios from "axios";
import "./style/style.css";

const App = () => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [records, setRecords] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  // 取得API資料
  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Record/GetRecords`);
      if (response.data && response.data.Success) {
        setRecords(response.data.Data);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // 儲存輸入資訊
  const saveRecord = async () => {
    // 檢查必填項目是否已經填寫
    if (!name || !birthday || !address) {
      return; // 如果有必填項目未填寫，則不執行 POST 請求
    }

    try {
      const response = await axios.post(`${apiUrl}/Record/SaveRecords`, [
        {
          Name: name,
          DateOfBirth: birthday,
          Salary: parseInt(salary, 10),
          Address: address,
        },
      ]);

      if (response.data.Success) {
        fetchRecords();
        setName("");
        setBirthday("");
        setSalary(0);
        setAddress("");
      } else {
        console.error("Failed to save record");
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleSaveClick = () => {
    saveRecord();
    setShowInput(false);
  };

  //  日期以YYYY/MM/DD顯示
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // getMonth() 從 0 開始，所以要加 1
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <div className="container">
      <div className="btn-area">
        <button className="add-btn" onClick={() => setShowInput(!showInput)}>
          Add
        </button>
        <button className="save-btn" onClick={handleSaveClick}>
          Save
        </button>
        <button className="update-btn" onClick={fetchRecords}>
          Update
        </button>
      </div>

      <div className="title">
        <h3>Name</h3>
        <h3>Birthday</h3>
        <h3>Salary</h3>
        <h3>Address</h3>
      </div>
      {showInput && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <input
            type="range"
            min="0"
            max="100000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      )}

      {records.map((record, index) => (
        <ul className="detail" key={index}>
          <li>{record.Name}</li>
          <li>{formatDate(record.DateOfBirth)}</li>
          <li>{record.Salary}</li>
          <li>{record.Address}</li>
        </ul>
      ))}
    </div>
  );
};

export default App;
