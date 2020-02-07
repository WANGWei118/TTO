import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import { Layout, Menu, Icon } from 'antd';
import Theme from "./theme";
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';
import Sidebar from '../sidebar';

const { Sider } = Layout;

class Homepage extends React.Component {
    socket = openSocket;

    state = {
        collapsed: false,
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "1"/>
                <Theme socket={this.socket}/>
            </Layout>
        );
    }
}

export default Homepage;
