import React from 'react';
import 'antd/dist/antd.css';
import './app.css';
import {Layout, Menu, Icon, Tabs, Button, Breadcrumb, Modal, Checkbox} from 'antd';
import Theme from "./theme";

const { Header, Content, Footer, Sider} = Layout;const Menu1 = 'Liste de quiz';
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Quiz 1', 'Quiz2'];

class DetailTheme extends React.Component {
    state = {
        collapsed: false,
        visible: false,
        checkedList: [],
    };
    onChange = checkedList => {
        this.setState({
            checkedList,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
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
                <Layout>
                    <Header style={{ background: '#fff' }}>
                        <h2>Nouveau Theme</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <div className = "buttonContainer">
                                <Button type="primary" style={{width:150, height:80, fontSize:18}} onClick={this.showModal}>+ Add quiz</Button>
                            </div>
                            <Modal
                                title="Choisir le quiz"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <CheckboxGroup
                                    options={plainOptions}
                                    value={this.state.checkedList}
                                    onChange={this.onChange}
                                />
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default DetailTheme;
