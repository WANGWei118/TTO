import React from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route } from "react-router-dom";import './app.css';
import { Layout, Breadcrumb, Menu, Icon, Tabs, Button, Input} from 'antd';
import DetailTheme from './detailTheme'
const { Header, Content, Footer, } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;

function callback(key) {
    console.log(key);
}

class Theme extends React.Component {
    state = {
        current: 'theme',
        visible1: false,
        visible2 :false,
    };
    constructor(props) {
        super(props);
        this.renderInput1 = this.renderInput1.bind(this);
        this.addList1 = this.addList1.bind(this);
    }

    renderInput1() {
        if (this.state.visible1){
            console.log('render');
            return (
                <Search
                    className = "input"
                    placeholder="Enter name of list"
                    enterButton="Ok"
                    onSearch={value => {
                        console.log(value);
                        this.props.history.push('/detailTheme');
                    }}
                />
            );
        }
    }
    renderInput2() {
        if (this.state.visible2){
            console.log('render');
            return (
                <Search
                    className = "input"
                    placeholder="Enter name of list"
                    enterButton="Ok"
                    onSearch={value => {
                        console.log(value);
                        this.goto();
                    }}
                />
            );
        }
    }

    addList1() {
        this.setState({
            visible1: !this.state.visible1,
        });
    }

    addList2() {
        this.setState({
            visible2: !this.state.visible2,
        });
    }

    render() {
        return(
            <Layout>
                <Header style={{ background: '#fff' }}>
                    <h2>Liste de quiz</h2>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item> </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                tab={
                                    <span>
                                        <Icon type="database" />Thèmes
                                    </span>
                                }
                                key="1">
                                <Layout style={{ background: '#fff', minHeight: 360, flexDirection: 'row', }}>
                                    <div className = "buttonContainer">
                                        <Button className = "button">Fruit</Button>
                                    </div>
                                    <div className = "buttonContainer">
                                        <Button className = "button" onClick={this.addList1}>+</Button>
                                        {this.renderInput1()}
                                    </div>
                                </Layout>
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                            <Icon type="ordered-list" />Quiz
                                    </span>
                                }
                                key="2">
                                <Layout style={{ background: '#fff', minHeight: 360, flexDirection: 'row', }}>
                                    <div className = "buttonContainer">
                                        <Button className = "button">Quiz 1</Button>
                                    </div>
                                    <div className = "buttonContainer">
                                        <Button className = "button">Quiz 2</Button>
                                    </div>
                                    <div className = "buttonContainer">
                                        <Button className = "button" onClick={this.addList2}>+</Button>
                                        {this.renderInput2()}
                                    </div>
                                </Layout>
                            </TabPane>
                        </Tabs>,
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default Theme;

