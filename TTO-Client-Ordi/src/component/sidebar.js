import React from 'react';
import 'antd/dist/antd.css';
import './app.css';
import { Layout, Menu, Icon } from 'antd';
import openSocket from "socket.io-client";
import {Link} from "react-router-dom";
import Theme from "./homepage/theme";

const { Sider } = Layout;

class Sidebar extends React.Component {
    default = "1";
    state = {
        collapsed: false,
    };

    constructor(props) {
        super(props);
        this.default = props.default;
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={this.default} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="desktop" />
                            <span>Liste de quiz</span>
                            <Link to="/homepage" />
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="pie-chart" />
                            <span>Statistiques</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="file" />
                            <span>Profile</span>
                            <Link to="/profile" />
                        </Menu.Item>
                    </Menu>
                </Sider>
        );
    }
}

export default Sidebar;
