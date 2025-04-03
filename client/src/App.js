import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from "./components/homepage/Homepage";
import About from "./components/homepage/About";
import Services from "./components/homepage/Services";
import Contact from "./components/homepage/Contact";
import Login from "./components/authentication/Login";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import Register from "./components/authentication/Register";
import ForgotPassword from "./components/authentication/ForgotPassword";
import AdminReport from "./components/admincontrols/AdminReport";
import AdminSetting from "./components/admincontrols/AdminSetting";
import AuditLogs from "./components/admincontrols/AuditLogs";
import Bursaryfundmanagement from "./components/admincontrols/Bursaryfundmanagement";
import MonitoringApplication from "./components/admincontrols/MonitoringApplication";
import Usermanagement from "./components/admincontrols/Usermanagement";
import Amountdetails from "./components/applicationform/Amountdetails";
import Disclosuredetails from "./components/applicationform/Disclosuredetails";
import Documentupload from "./components/applicationform/Documentupload";
import Familydetails from "./components/applicationform/Familydetails";
import Personaldetails from "./components/applicationform/Personaldetails";
import Reports from "./components/applicationform/Reports";
import Setting from "./components/applicationform/Setting";
import Comreport from "./components/committeeview/Comreport";
import PersonalInformation from "./components/committeeview/PersonalInformation";
import Profile from "./components/committeeview/Profile";
import Settings from "./components/committeeview/Settings";
import UserDetails from "./components/committeeview/Userdetails";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import CommitteeDashboard from "./components/dashboard/CommitteeDashboard";

function App() {
return (
<Router>
<div className="App">
<Routes>
<Route exact path="/"  element={<Homepage/>}/>
<Route path="/about"  element={<About/>}/>
<Route path="/services"  element={<Services/>}/>
<Route path="/contact"  element={<Contact/>}/>
<Route path="/login"  element={<Login/>}/>
<Route path="/register"  element={<Register/>}/>
<Route path="/forgotpassword"  element={<ForgotPassword/>}/>
<Route path="/adminreport"  element={<AdminReport/>}/>
<Route path="/adminsetting"  element={<AdminSetting/>}/>
<Route path="/auditlogs"  element={<AuditLogs/>}/>
<Route path="/bursaryfundmanagement"  element={<Bursaryfundmanagement/>}/>
<Route path="/monitoringapplication"  element={<MonitoringApplication/>}/>
<Route path="/usermanagement"  element={<Usermanagement/>}/>
<Route path="/studentdashboard"  element={<StudentDashboard/>}/>
<Route path="/admindashboard"  element={<AdminDashboard/>}/>
<Route path="/committeedashboard"  element={<CommitteeDashboard/>}/>
<Route path="/amountdetails"  element={<Amountdetails/>}/>
<Route path="/disclosuredetails"  element={<Disclosuredetails/>}/>
<Route path="/documentupload"  element={<Documentupload/>}/>
<Route path="/familydetails"  element={<Familydetails/>}/>
<Route path="/personaldetails"  element={<Personaldetails/>}/>
<Route path="/reports"  element={<Reports/>}/>
<Route path="/setting"  element={<Setting/>}/>
<Route path="/comreport"  element={<Comreport/>}/>
<Route path="/personalinformation"  element={<PersonalInformation/>}/>
<Route path="/profile"  element={<Profile/>}/>
<Route path="/settings"  element={<Settings/>}/>
<Route path="/userdetails"  element={<UserDetails/>}/>
</Routes>
</div>
</Router>
);
}

export default App;
