import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './createQuiz.css'
import {Layout, Menu, Icon, Tabs, List,Breadcrumb, Button, Input, Card} from 'antd';
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';
import Sidebar from '../sidebar';
import DetailQuiz from "../listOfQuiz/detailQuiz";
import '../config/config'

const url = global.constants.url;
const { Header, Content, Footer,Sider } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;
const { Meta } = Card;


class QuizByTopic extends React.Component {
    socket = openSocket;

    state = {
        collapsed: false,
        topicList:[],
        id: null,
        currentTopic: null,
        individuel: [],
        handsTouch: [],
        handsMove:[],
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.state.id = global.constants.topicId;
        console.log(this.state.id);
        this.socket.emit("get topics");
        this.socket.on("all topics",(data)=>{
            this.setState({
                topicList:data,
            })
            this.state.topicList.map((e)=>{
                if(e.id === this.state.id){
                    this.setState({
                        currentTopic: e,
                    });
                }
            })
            console.log(this.state.currentTopic);
            console.log(this.state.topicList);

            this.socket.emit('get all types quiz');
            this.socket.on('all types quiz',(data) => {
                this.state.individuel = [];
                this.state.handsTouch = [];
                this.state.handsMove = [];
                data.personal.map((e)=>{
                    if (this.state.currentTopic.topic===e.topic) {
                        this.setState({
                            individuel: this.state.individuel.concat(e),
                        })
                    }
                });
                data.collaborative.handsTouch.map((e)=>{
                    if (this.state.currentTopic.topic===e.topic) {
                        this.setState({
                            handsTouch: this.state.handsTouch.concat(e),
                        })
                    }
                });
                data.collaborative.handsMove.map((e)=>{
                    if (this.state.currentTopic.topic===e.topic) {
                        this.setState({
                            handsMove: this.state.handsMove.concat(e),
                        })
                    }
                });
                console.log(data);
                console.log(this.state.individuel);
                console.log(this.state.handsTouch);
                console.log(this.state.handsMove);

            });
        });
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    showDetail = (i,e) =>{
        global.constants.topicId = e.id;
        console.log(global.constants.topicId);
    };


    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "1"/>
                {/*<Theme socket={this.socket}/>*/}
                <Layout>
                    <Header style={{ background: '#fff' }}>
                        <h2>Liste de quiz</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff' }}>
                            <Tabs defaultActiveKey="1">
                                <TabPane
                                    tab={
                                        <span>
                                        <Icon type="database" />Individuel
                                    </span>
                                    }
                                    key="1">
                                    <Layout style={{ background: '#fff', minHeight: 450, flexDirection: 'column', }}>
                                        {this.state.individuel.map((e)=>{
                                            return<div style = {{marginBottom:20}}>
                                                <h2>{e.name}</h2>
                                                <List itemLayout="horizontal"
                                                      bordered = "true"
                                                      dataSource={e.questions}
                                                      renderItem={item=>(
                                                          <List.Item>
                                                              <p>{item.description}</p>
                                                              {item.answers.map((i)=>{
                                                                  return <img src={url+i.src} className='imageWithMargin'/>
                                                              })}
                                                          </List.Item>
                                                      )}
                                                />
                                            </div>
                                        })}
                                    </Layout>
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="ordered-list" />Cliquer avec doigt
                                    </span>
                                    }
                                    key="2">
                                    <Layout style={{ background: '#fff', minHeight: 360, }}>
                                        {this.state.handsTouch.map((e)=>{
                                            return<div style = {{marginBottom:20}}>
                                                <h2>{e.name}</h2>
                                                <List itemLayout="horizontal"
                                                      bordered = "true"
                                                      dataSource={e.questions}
                                                      renderItem={item=>(
                                                          <List.Item>
                                                              <p>{item.description}</p>
                                                              {item.pictures.map((i)=>{
                                                                  return <img src={url+i.src} className='imageWithMargin'/>
                                                              })}
                                                          </List.Item>
                                                      )}
                                                />
                                            </div>
                                        })}
                                    </Layout>
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="ordered-list" />Drag and Drop
                                    </span>
                                    }
                                    key="3">
                                    <Layout style={{ background: '#fff', minHeight: 360, }}>
                                        {this.state.handsMove.map((e)=>{
                                            return<div style = {{marginBottom:20}}>
                                                <h2>{e.name}</h2>
                                                <List itemLayout="horizontal"
                                                      bordered = "true"
                                                      dataSource={e.questions}
                                                      renderItem={item=>(
                                                          <List.Item>
                                                              <p>{item.description}</p>
                                                              {item.pictures.map((i)=>{
                                                                  return <img src={url+i.src} className='imageWithMargin'/>
                                                              })}
                                                          </List.Item>
                                                      )}
                                                />
                                            </div>
                                        })}
                                    </Layout>
                                </TabPane>
                            </Tabs>,
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default QuizByTopic;
