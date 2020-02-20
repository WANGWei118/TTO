import React from 'react';
import 'antd/dist/antd.css';
import './app.css';
import { Layout, Menu, Icon } from 'antd';
import Theme from "./theme";

const { Sider } = Layout;
const Menu1 = 'Liste de quiz';
const Menu2 = 'Statistiques';

class Homepage extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="desktop" />
                            <span>{Menu1}</span>
                        </Menu.Item>
                        {/*<Menu.Item key="2">*/}
                            {/*<Icon type="pie-chart" />*/}
                            {/*<span>{Menu2}</span>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="3">*/}
                            {/*<Icon type="file" />*/}
                            {/*<span>Information par acceuil</span>*/}
                        {/*</Menu.Item>*/}
                    </Menu>
                </Sider>
                <Theme/>
            </Layout>
        );
    }
}

export default Homepage;
