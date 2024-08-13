import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./index.scss";
import { Dropdown, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const AdminNavbar = () => {
  const items = [
    {
      label: "Admin",
      key: "1",
    },
    {
      label: "Settings",
      key: "2",
    },
    {
      label: "Logout",
      key: "3",
    },
  ];
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  const navigateToAdminPage = () => {
    window.location.href = "/admin";
  };

  const onClick = ({ key }) => {
    if (key === "1") {
      navigate("/admin");
    } else if (key === "2") {
      navigate("/admin/settings");
    } else if (key === "3") {
      signOutUser();
    }
  };

  return (
    <div className="top">
      <div className="top-content">
        <span
          className="admin-title"
          onClick={navigateToAdminPage}
        >
          Admin Dashboard
        </span>
        <Dropdown
          menu={{
            items,
            onClick,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <MenuOutlined className="menu-icon" />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};
