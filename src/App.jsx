import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/designTokens.css";

// Page placeholders
const Home = React.lazy(() => import("./pages/Home/Home"));
const Store = React.lazy(() => import("./pages/Store/Store"));
const Category = React.lazy(() => import("./pages/Category/Category"));
const SubmitDeal = React.lazy(() => import("./pages/SubmitDeal/SubmitDeal"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const About = React.lazy(() => import("./pages/About/About"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks/HowItWorks"));
const Admin = React.lazy(() => import("./pages/Admin/Admin"));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store/:storeId" element={<Store />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/submit" element={<SubmitDeal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
