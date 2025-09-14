// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Confirm from "./Confirm";
// import App from "./App";
// import "./index.css";
// import "./fonts.css";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Confirm />} />
//         <Route path="/app" element={<App />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import App from "./App";
import { AgeScreen } from "./AgeScreen";
import Confirm from "./Confirm";
import { RegisterScreen } from "./RegisterScreen";
import { SuccessScreen } from "./SuccessScreen";
import "./index.css";
import "./fonts.css";

// Wrapper nhỏ để điều hướng theo flow
function AgeRoute() {
  const navigate = useNavigate();
  return <AgeScreen onOk={() => navigate("/confirm")} />;
}

function RegisterRoute() {
  const navigate = useNavigate();
  return (
    <RegisterScreen
      onSuccess={() => navigate("/success")}
      onError={(msg) => {
        alert(msg);
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout chung cho Age / Register / Success */}
        <Route path="/" element={<App />}>
          <Route index element={<AgeRoute />} />
          <Route path="register" element={<RegisterRoute />} />
          <Route path="success" element={<SuccessScreen />} />
        </Route>

        {/* Confirm là trang độc lập, tự có layout riêng */}
        <Route path="/confirm" element={<Confirm />} />

        {/* Giữ tương thích /app/* → chuyển về / */}
        <Route path="/app/*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

