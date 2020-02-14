import React from 'react';
import 'antd/dist/antd.css';
import openSocket from 'socket.io-client';
import { BrowserRouter as Router,
    Switch,
    Route,
    Link } from "react-router-dom";
import '../app.css';
import {List, Layout, Breadcrumb, Menu, Icon, Tabs, Button, Input, Card} from 'antd';
import NewTheme from '../listOfQuiz/newTheme'
import DetailQuiz from '../listOfQuiz/detailQuiz'
const { Header, Content, Footer, } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;
const url = "http://192.168.43.223:10000/";
const { Meta } = Card;

function callback(key) {
    console.log(key);
}

class Theme extends React.Component {
    socket = openSocket;

    state = {
        current: 'theme',
        visible1: false,
        visible2 :false,
        topicList: [],
        test: null,
    };
    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.socket.emit("get topics");
        this.socket.on("all topics",(data)=>{
            // let topic = data;
            // topic.map((e)=>{
            //     this.setState({
            //         topicList: this.state.topicList.concat(e.topic),
            //     });
            // });
            this.state.topicList=this.state.topicList.concat(data);


            console.log(this.state.topicList);
        });
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
                        // this.props.history.push('/detailTheme');
                    }}/>
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
                    }}
                />
            );
        }
    }

    addList1 =() => {
        this.setState({
            visible1: !this.state.visible1,
        });
    };


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
                                <Layout style={{ background: '#fff', minHeight: 450, flexDirection: 'row', }}>
                                    <p>{this.state.topicList.length}</p>
                                    <List grid={{ gutter: 16, column: 4 }}
                                          style = {{background: '#aaafff'}}
                                          dataSource = {this.state.topicList}
                                          renderItem = {item => (

                                              <List.item>
                                                  <Card cover={<img alt="photo" src={url+item.icon} />}
                                                  >
                                                      <Meta title={item.topic} />

                                                  </Card>

                                              </List.item>
                                          )}/>
                                </Layout>
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                            <Icon type="ordered-list" />Tous les quiz
                                    </span>
                                }
                                key="2">
                                <Layout style={{ background: '#fff', minHeight: 360, }}>
                                        <Button type='primary' style = {{fontSize:20,marginBottom:10}} size='large'><Link to="/createQuiz">+ Créer nouveau quiz</Link></Button>
                                        {this.renderInput2()}
                                    <DetailQuiz socket={this.socket}/>
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

