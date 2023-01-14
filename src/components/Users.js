import React, { useState,useRef } from "react";
import { saveAs } from 'file-saver';
// import { useNavigate } from 'react-router-dom'

import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState([]);
  const [jsonFile, setJsonFile] = useState(null);
  // const navigate = useNavigate();

  // const fileExists = (filePath) => {
  //   return fs.existsSync(filePath);
  // }
  

  const getUsers = async (namee) => {
    // console.log(fileExists('D:/New folderG/etData/src/components/input.json'));
    const comapanyName= namee
    const response = await fetch(`https://api.newscatcherapi.com/v2/search?q=${comapanyName} AND shares&lang=en&countries=US,CA`,{
      
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'tXtTA8YWS9NuEuZtAbm6gyQnvcUM_Y_EqOszxNNPM98'
        }
    });
    const data = await response.json();
    console.log(data);
    const jsonData = JSON.stringify(data);
    setJsonFile(jsonData);

      var blob = new Blob(["[",jsonData,"]"], { type: "application/json" });
      saveAs(blob, "news.json");
      
    setUsers(data.articles);
    
    console.log(data);
    setLoading(false);
  };
  const sendData =  async(e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:5000/myfun'
    // history.push('http://localhost:5000/myfun')
    
    // navigate('/http://localhost:5000/myfun');
    // navigate('/about');

    // const data = new FormData();  
    // data.append("json_file", jsonFile);
    // console.log(data)


    // const response = await fetch("http://localhost:5000/myfun", {
    //   method: "POST",
    //   body: data,
    //   // console.log
    // });
    // const jsonData = await response.json();
    // console.log("from flask")
    // console.log(jsonData);
  };
  // fetch("https://api.example.com/data")
  // .then(response => response.json())
  // .then(data => {
  //   const jsonData = JSON.stringify(data);
  //   var blob = new Blob([jsonData], { type: "application/json" });
  //   saveAs(blob, "data.json");
  // });
  const timeOut = () => {
    setTimeout(() => {
      getUsers();
    }, 1000);
  };
  const inputRef = useRef(null);
  function handleClick() {
    console.log(inputRef.current.value);
    getUsers(inputRef.current.value)
  }
  // const myfun=()=>{
  //   const jsonData = JSON.stringify(title);

  //     var blob = new Blob(["[",jsonData,"]"], { type: "application/json" });
  //     saveAs(blob, "data.json");
  // }

  const hideButton = () => {
    document.getElementById("btn").style.display = "none";
  };

  return (
    <>
      <div className="navbar">
        <div className="left">
          <p>AllUsers</p>
          <input
        ref={inputRef}
        type="text"
        id="message"
        name="message"
      />

      <button onClick={handleClick}>Log message</button>
      <button onClick={sendData}>send data</button>

        </div>
        <div className="right" id="btn" onClick={() => {timeOut();setLoading(true);hideButton();}}>
          <button className="getUsers">Get Users</button>
        </div>
      </div>
      {loading ? (
        <div className="preloader">
          <div className="container">
            <div className="dot dot1"></div>
            <div className="dot dot2"></div>
            <div className="dot dot3"></div>
          </div>
        </div>
      ) : (
        <div className="cards">
          {users.map((item,index) => {
            return (
              <div className="card" key={index}>
                {/* <div className="image">
                  <img className="image" src={item.avatar} alt="" />
                </div> */}

                {/* <div className="id">
                  <p className="card_text">{item.id}</p>
                </div> */}

                <div className="email">
                  <p className="card_text">{item.title}</p>
                  {console.log(item.title)}
                  {/* {setTitle(item.title)}
                  {myfun()} */}
                </div>

                {/* <div className="name">
                  <p className="card_text">
                    {item.first_name} {item.last_name}
                  </p>
                </div> */}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};


// console.log(title);

export default Users;
