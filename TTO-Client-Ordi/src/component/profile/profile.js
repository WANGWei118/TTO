import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './profile.css'
import {Card, Layout, Menu, Icon, Tabs, Button, Breadcrumb, Checkbox, List, Upload, Modal} from 'antd';
import '../model';
import {Link} from "react-router-dom";
import Sidebar from '../sidebar';
import openSocket from 'socket.io-client';
import '../config/config'

const { Header, Content} = Layout;
const { Meta } = Card;
const url = "http://192.168.1.7:10000/";

class Profile extends React.Component {
    socket = openSocket;

    state = {
        infoList: [],
        cardList: [],
        visible: false,
        deleteId: 0,
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.socket.emit('get profiles');
        this.socket.on('all profiles',(data) => {
            this.state.cardList = [];
            this.state.infoList = data;
            console.log(this.state.infoList);
            this.state.infoList.map((e) => {
                this.setState({
                    cardList: this.state.cardList.concat(
                        <Card className="card"
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="ph" src={url+e.src} />}
                            actions={[
                                <Button><Icon type="ellipsis" key="ellipsis" /></Button>,
                            ]}
                        >
                            <Meta title={e.firstName+' '+e.lastName} />
                        </Card>,
                    ),
                });
                console.log(url+e.src);

            }
            );

        });
    };
    showModal = () => {
        this.setState({
            visible: true,
        })
    };

    handleOk = () => {
        let deleteProfile = {
            id: this.state.deleteId,
        };
        this.socket.emit('delete profile',deleteProfile);

        console.log(deleteProfile);
        this.socket.emit('get profiles');
        this.socket.on('all profiles',(data) => {
            this.state.cardList = [];
            this.state.infoList = data;
            console.log(this.state.infoList);
            this.state.infoList.map((e) => {
                    this.setState({
                        visible: false,
                        cardList: this.state.cardList.concat(
                            <Card className="card"
                                  hoverable
                                  style={{ width: 240 }}
                                  cover={<img alt="ph" src={url+e.src} />}
                                  actions={[
                                      <Button><Icon type="ellipsis" key="ellipsis" /></Button>,
                                  ]}
                            >
                                <Meta title={e.firstName+' '+e.lastName} />
                            </Card>,
                        ),
                    });
                    console.log(url+e.src);

                }
            );

        });
    };

    handleCancel = () => {
        this.setState({
            visible:false,
        })
    };

    showDetail = (i,e) =>{
        console.log(e);
        global.constants.profileId = e.id;
        console.log(global.constants.profileId);
    };

    delete = (i,e) => {
        this.setState({
            visible: true,
            deleteId: e.id,
        })
    };


    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "3"/>
                <Layout>
                    <Header style={{ background: '#fff' , display:'flex', flexDirection: 'row'}}>
                        <h2>Profile</h2>
                        <Button type="primary" style={{marginTop:15,marginLeft:20}}>
                            <Link to="/createProfile">+ Créer nouveau profile</Link>
                        </Button>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={this.state.infoList}
                                renderItem={e => (
                                    <List.Item>
                                        <div>
                                            {/*<Link to={`/profile/${e.id}`}>*/}
                                            <Card className="card"
                                                  hoverable
                                                  actions={[
                                                      <Button onClick={(i)=>this.showDetail(i,e)}>
                                                          <Link to="/detailProfile"><Icon type="ellipsis" key="ellipsis" /></Link>
                                                      </Button>,
                                                      <Button onClick={(i)=>this.showDetail(i,e)}>
                                                          <Link to="/editProfile"><Icon type="edit" key="edit" /></Link>
                                                      </Button>
                                                  ,
                                                      <Button onClick={(i)=>this.delete(i,e)}><Icon type="delete" key="ellipsis" /></Button>,
                                                  ]}
                                                  cover={<img alt="photo" src={url+e.src} height={200}/>}
                                            >
                                                <Meta title={e.firstName+' '+e.lastName}
                                                      description={"Quiz Individuel: "+e.quizAccessible.quizIndividuel}>
                                                </Meta>
                                            </Card>
                                            {/*</Link>*/}
                                        </div>

                                    </List.Item>
                                )}
                            />
                            <Modal title=""
                                   visible={this.state.visible}
                                   onOk={this.handleOk}
                                   onCancel={this.handleCancel}>
                                <p>Vous êtes sûr de supprimer ce profile?</p>
                            </Modal>

                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default Profile;
