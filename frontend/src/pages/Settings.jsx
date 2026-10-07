import { useState } from "react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

const Settings = () => {
  const { logout } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [newsDigest, setNewsDigest] = useState(false);

  return (
    <div className="settings-page">
      <Card>
        <h3>Notifications</h3>
        <div className="settings-row">
          <div>
            <strong>Email alerts</strong>
            <p>Get notified about upcoming high-impact economic events.</p>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts((v) => !v)} />
            <span className="toggle__slider" />
          </label>
        </div>
        <div className="settings-row">
          <div>
            <strong>Weekly news digest</strong>
            <p>A weekly summary of forex and central bank news.</p>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={newsDigest} onChange={() => setNewsDigest((v) => !v)} />
            <span className="toggle__slider" />
          </label>
        </div>
      </Card>

      <Card>
        <h3>Account</h3>
        <div className="settings-row">
          <div>
            <strong>Log out</strong>
            <p>End your current session on this device.</p>
          </div>
          <Button variant="secondary" onClick={logout}>Log out</Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
