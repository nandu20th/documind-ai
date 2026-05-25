import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {

  // =========================
  // STATES
  // =========================

  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState("");
  const [loading, setLoading] = useState(false);

  // History
  const [history, setHistory] = useState(() => {

  const savedHistory = localStorage.getItem("docHistory");

  return savedHistory
    ? JSON.parse(savedHistory)
    : [];

  });

  // Active Page
  const [activePage, setActivePage] = useState("dashboard");

  // Theme
  const [darkMode, setDarkMode] = useState(true);

  // Auth
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // User Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loader
  const [loaderText, setLoaderText] = useState("AI is generating");

  // =========================
  // THEME COLORS
  // =========================

  const bgColor = darkMode
    ? "linear-gradient(to bottom right, #020617, #111827)"
    : "#f5f0e6";

  const cardColor = darkMode
    ? "rgba(15,23,42,0.85)"
    : "#fffaf3";

  const textColor = darkMode
    ? "white"
    : "#3e2f1c";

  const subTextColor = darkMode
    ? "#94a3b8"
    : "#7c6a55";

  const boxColor = darkMode
    ? "rgba(2,6,23,0.7)"
    : "#efe4d3";


  // =========================
  // SAVE HISTORY TO STORAGE
  // =========================

  useEffect(() => {

   localStorage.setItem(
    "docHistory",
    JSON.stringify(history)
  );

 }, [history]);
  // =========================
  // LOADER ANIMATION
  // =========================

  useEffect(() => {

    if (loading) {

      const interval = setInterval(() => {

        setLoaderText((prev) => {

          if (prev === "AI is generating") {
            return "AI is generating.";
          }

          if (prev === "AI is generating.") {
            return "AI is generating..";
          }

          if (prev === "AI is generating..") {
            return "AI is generating...";
          }

          return "AI is generating";
        });

      }, 500);

      return () => clearInterval(interval);
    }

  }, [loading]);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoggedIn(true);
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = () => {

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    alert("Registration Successful 🚀");

    setLoggedIn(true);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    setLoggedIn(false);

    setEmail("");
    setPassword("");
    setName("");

    setDocs("");
    setFile(null);
  };

  // =========================
  // FILE UPLOAD
  // =========================

  const uploadFile = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

      setLoading(true);

      const response = await axios.post(
        "https://documind-backend-71bb.onrender.com/generate-docs/",
        formData
      );

      if (response.data.documentation) {

        setDocs(response.data.documentation);

        const newHistory = {
          filename: file.name,
          date: new Date().toLocaleString(),
          documentation: response.data.documentation,
        };

        setHistory((prev) => [newHistory, ...prev]);

      } else {

        setDocs("No documentation generated.");

      }

    } catch (error) {

      setDocs("Error generating documentation.");

    }

    setLoading(false);
  };

  // =========================
  // DOWNLOAD DOCS
  // =========================

  const downloadDocs = () => {

    if (!docs) {
      alert("No documentation available");
      return;
    }

    const element = document.createElement("a");

    const fileBlob = new Blob([docs], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(fileBlob);

    element.download = "README.md";

    document.body.appendChild(element);

    element.click();
  };

  // =========================
  // LOGIN / REGISTER
  // =========================

  if (!loggedIn) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: bgColor,
          fontFamily: "Arial",
          padding: "20px",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: cardColor,
            padding: "50px",
            borderRadius: "25px",
            color: textColor,
            boxShadow: "0px 0px 40px rgba(168,85,247,0.15)",
          }}
        >

          <h1
            style={{
              textAlign: "center",
              fontSize: "55px",
              marginBottom: "15px",
              background: "linear-gradient(to right, #c084fc, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DocuMind AI
          </h1>

          <p
            style={{
              textAlign: "center",
              color: subTextColor,
              marginBottom: "35px",
            }}
          >
            {
              isLogin
              ? "Login to continue"
              : "Create your account"
            }
          </p>

          {
            !isLogin && (

              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  marginBottom: "20px",
                }}
              />

            )
          }

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              marginBottom: "20px",
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              marginBottom: "25px",
            }}
          />

          <button
            onClick={
              isLogin
              ? handleLogin
              : handleRegister
            }
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(to right, #8b5cf6, #ec4899)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            {
              isLogin
              ? "Login"
              : "Register"
            }
          </button>

          <p
            style={{
              textAlign: "center",
              color: subTextColor,
              cursor: "pointer",
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {
              isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"
            }
          </p>

        </div>

      </div>

    );
  }

  // =========================
  // MAIN WEBSITE
  // =========================

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: bgColor,
        fontFamily: "Arial",
      }}
    >

      {/* SIDEBAR */}

      <div
        style={{
          width: "260px",
          background: cardColor,
          padding: "30px",
          color: textColor,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "40px",
              marginBottom: "50px",
              background: "linear-gradient(to right, #c084fc, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DocuMind AI
          </h1>

          <div
            onClick={() => setActivePage("dashboard")}
            style={{
              marginBottom: "30px",
              color: activePage === "dashboard" ? "#60a5fa" : textColor,
              cursor: "pointer",
            }}
          >
            📊 Dashboard
          </div>

          <div
            onClick={() => setActivePage("generate")}
            style={{
              marginBottom: "30px",
              color: activePage === "generate" ? "#60a5fa" : textColor,
              cursor: "pointer",
            }}
          >
            📄 Generate Docs
          </div>

          <div
            onClick={() => setActivePage("history")}
            style={{
              marginBottom: "30px",
              color: activePage === "history" ? "#60a5fa" : textColor,
              cursor: "pointer",
            }}
          >
            📚 History
          </div>

          <div
            onClick={() => setActivePage("settings")}
            style={{
              marginBottom: "30px",
              color: activePage === "settings" ? "#60a5fa" : textColor,
              cursor: "pointer",
            }}
          >
            ⚙️ Settings
          </div>

        </div>

        <div>

          <div
            style={{
              color: subTextColor,
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            👤 Welcome {name || "Developer"}
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(to right, #dc2626, #ef4444)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div
        style={{
          flex: 1,
          padding: "40px",
          overflowY: "auto",
        }}
      >

        {/* DASHBOARD */}

        {
          activePage === "dashboard" && (

            <>
              <h1
                style={{
                  fontSize: "60px",
                  color: textColor,
                  marginBottom: "10px",
                }}
              >
                AI Documentation Generator 🚀
              </h1>

              <p
                style={{
                  color: subTextColor,
                  fontSize: "18px",
                  marginBottom: "40px",
                }}
              >
                Generate professional technical documentation instantly using AI-powered static analysis.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >

                <div
                  style={{
                    background: cardColor,
                    padding: "25px",
                    borderRadius: "20px",
                    color: textColor,
                  }}
                >
                  <h2>📂 Files</h2>
                  <p>{history.length} Uploaded</p>
                </div>

                <div
                  style={{
                    background: cardColor,
                    padding: "25px",
                    borderRadius: "20px",
                    color: textColor,
                  }}
                >
                  <h2>⚡ AI Status</h2>
                  <p>{loading ? "Generating..." : "Active"}</p>
                </div>

                <div
                  style={{
                    background: cardColor,
                    padding: "25px",
                    borderRadius: "20px",
                    color: textColor,
                  }}
                >
                  <h2>📄 Docs</h2>
                  <p>{history.length} Generated</p>
                </div>

              </div>
            </>

          )
        }

        {/* GENERATE PAGE */}

        {
          activePage === "generate" && (

            <>
              <div
                style={{
                  background: cardColor,
                  padding: "40px",
                  borderRadius: "25px",
                  marginBottom: "35px",
                  border: "2px dashed rgba(96,165,250,0.4)",
                }}
              >

                <div
                  style={{
                    textAlign: "center",
                    color: textColor,
                  }}
                >

                  <div
                    style={{
                      fontSize: "70px",
                      marginBottom: "15px",
                    }}
                  >
                    📄
                  </div>

                  <h2>Upload Source Code</h2>

                  <p
                    style={{
                      color: subTextColor,
                      marginBottom: "25px",
                    }}
                  >
                    Python, JavaScript, Java, C++, React and more
                  </p>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {

                      e.preventDefault();

                      const droppedFile = e.dataTransfer.files[0];

                      if (droppedFile) {
                        setFile(droppedFile);
                      }

                    }}
                    style={{
                      border: "2px dashed #60a5fa",
                      padding: "40px",
                      borderRadius: "20px",
                      marginBottom: "25px",
                      cursor: "pointer",
                      background: boxColor,
                    }}
                  >

                    <input
                      type="file"
                      id="fileUpload"
                      hidden
                      onChange={(e) => setFile(e.target.files[0])}
                    />

                    <label
                      htmlFor="fileUpload"
                      style={{
                        cursor: "pointer",
                        display: "block",
                      }}
                    >

                      <div
                        style={{
                          fontSize: "55px",
                          marginBottom: "10px",
                        }}
                      >
                        ⬆️
                      </div>

                      <h3>Drag & Drop File Here</h3>

                      <p
                        style={{
                          color: subTextColor,
                        }}
                      >
                        or click to browse files
                      </p>

                    </label>

                  </div>

                  {
                    file && (
                      <p
                        style={{
                          color: "#60a5fa",
                          marginBottom: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        ✅ {file.name} selected successfully
                      </p>
                    )
                  }

                  <button
                    onClick={uploadFile}
                    style={{
                      padding: "16px 40px",
                      border: "none",
                      borderRadius: "14px",
                      background: "linear-gradient(to right, #2563eb, #9333ea)",
                      color: "white",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ⚡ Generate Documentation
                  </button>

                </div>

              </div>

              {/* OUTPUT */}

              <div
                style={{
                  background: cardColor,
                  padding: "30px",
                  borderRadius: "25px",
                  color: textColor,
                  lineHeight: "1.8",
                  minHeight: "300px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                  }}
                >

                  <h2>
                    📄 Generated Documentation
                  </h2>

                  <button
                    onClick={downloadDocs}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "12px",
                      background: "linear-gradient(to right, #2563eb, #9333ea)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ⬇ Download README
                  </button>

                </div>

                {
                  loading ? (

                    <div
                      style={{
                        color: "#60a5fa",
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      ⚡ {loaderText}
                    </div>

                  ) : (

                    docs ? (

                      <div
                        style={{
                          background: boxColor,
                          padding: "25px",
                          borderRadius: "18px",
                        }}
                      >

                        <ReactMarkdown>
                          {docs}
                        </ReactMarkdown>

                      </div>

                    ) : (

                      <div
                        style={{
                          color: subTextColor,
                        }}
                      >
                        Generated documentation will appear here...
                      </div>

                    )

                  )
                }

              </div>
            </>

          )
        }

        {/* HISTORY */}

        {
          activePage === "history" && (

            <div
              style={{
                background: cardColor,
                padding: "30px",
                borderRadius: "25px",
                color: textColor,
              }}
            >

              <h2
                style={{
                  marginBottom: "25px",
                }}
              >
                📚 Documentation History
              </h2>

              {
                history.length === 0 ? (

                  <p
                    style={{
                      color: subTextColor,
                    }}
                  >
                    No history available yet.
                  </p>

                ) : (

                  history.map((item, index) => (

                    <div
                      key={index}
                      style={{
                        background: boxColor,
                        padding: "20px",
                        borderRadius: "18px",
                        marginBottom: "20px",
                      }}
                    >

                      <h3>
                        📄 {item.filename}
                      </h3>

                      <p
                        style={{
                          color: subTextColor,
                          fontSize: "14px",
                        }}
                      >
                        {item.date}
                      </p>

                      <div
                        style={{
                          marginTop: "15px",
                        }}
                      >

                        <ReactMarkdown>
                          {item.documentation.substring(0, 300) + "..."}
                        </ReactMarkdown>

                      </div>

                    </div>

                  ))

                )
              }

            </div>

          )
        }

        {/* SETTINGS */}

        {
          activePage === "settings" && (

            <div
              style={{
                background: cardColor,
                padding: "30px",
                borderRadius: "25px",
                color: textColor,
              }}
            >

              <h2>⚙️ Settings</h2>

              <div
                style={{
                  marginTop: "30px",
                }}
              >

                <h3>Theme Mode</h3>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    marginTop: "20px",
                    padding: "14px 25px",
                    border: "none",
                    borderRadius: "12px",
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {
                    darkMode
                    ? "☀️ Switch to Beige Light Mode"
                    : "🌙 Switch to Dark Mode"
                  }
                </button>

              </div>

            </div>

          )
        }

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: subTextColor,
            fontSize: "14px",
          }}
        >
          Powered by DocuMind AI • 2026 🚀
        </div>

      </div>

    </div>

  );
}

export default App;