import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './createQuiz.css'
import {List,Card,Collapse, Layout, Menu, Icon, Tabs, Button, Breadcrumb, Modal, Checkbox} from 'antd';
import Sidebar from '../sidebar';import '../model';
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';

const { Header, Content, Footer, Sider} = Layout;
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


class DetailTheme extends React.Component {
    socket = openSocket;
    type = null;
    panelList = [];
    state = {
        collapsed: false,
        visible: false,
        checkedList: [],
        quizList: [],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.type = props.type;
        if(this.type === 'individuel') {
            this.socket.emit('get quizz','pad');
            this.socket.on('all quizz',(data) => {
                this.setState({
                    quizList: data,
                });
                console.log(this.state.quizList);
            });
        } else if (this.type === 'collaboratif') {
            this.socket.emit('get quizz',{type:'table'});
            this.socket.on('all tableQuiz',(data) => {
                this.setState({
                    quizList: data,
                });
                console.log(this.state.quizList);
            });
        }else if (this.type === 'tangible') {
            this.socket.emit('get quiz tangible');
            this.socket.on('quiz tangible',(data) => {
                this.setState({
                    quizList: data,
                });
                console.log(this.state.quizList);
            });
        } else if (this.type === 'non-tangible') {
            this.socket.emit('get quiz non tangible');
            this.socket.on('quiz non tangible',(data) => {
                this.setState({
                    quizList: data,
                });
                console.log(this.state.quizList);
            });
        }

    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };


    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "1"/>
                <Layout>
                    <Header style={{ background: '#fff' }}>
                            <h2>Quiz {this.type}</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={this.state.quizList}
                                renderItem={item => (
                                    <List.Item>
                                        <Card title={item.name}>{item.topic}</Card>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default DetailTheme;
