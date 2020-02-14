import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import './createQuiz.css'
import {Modal,Skeleton,List,Avatar, Card,Collapse, Layout} from 'antd';
import Theme from "../homepage/theme";
import '../model';
import {Link} from "react-router-dom";
import openSocket from 'socket.io-client';

const { Header, Content, Footer, Sider} = Layout;
const { Panel } = Collapse;
const url = 'http://192.168.43.223:10001/';


class DetailQuiz extends React.Component {
    socket = openSocket;
    panelList = [];
    alldata = [];
    state = {
        collapsed: false,
        visible: false,
        checkedList: [],
        questionList: [],
        individuel: [],
        handsTouch: [],
        handsMove:[],
        deleteItem: null,
    };

    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.type = props.type;

        this.socket.emit('get all types quiz');
        this.socket.on('all types quiz',(data) => {
            data.personal.map((e)=>{
                this.state.individuel.push({
                    type:'personal',
                    e
                })
            });
            data.collaborative.handsTouch.map((e)=>{
                this.state.individuel.push({
                    type:'handsTouch',
                    e
                })
            });
            data.collaborative.handsMove.map((e)=>{
                this.state.individuel.push({
                    type:'handsMove',
                    e
                })
            });
            // this.state.individuel= data.personal;
            // this.state.handsTouch =data.collaborative.handsTouch;
            // this.state.handsMove =data.collaborative.handsMove;
            console.log(data);
            console.log(this.state.individuel);
            console.log(this.state.handsTouch);
            console.log(this.state.handsMove);
            this.setState({
                questionList: this.state.questionList.concat(this.state.individuel,this.state.handsTouch,this.state.handsMove),
            });
            console.log(this.state.questionList);
        });

    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    deleteQuiz = (e,item) => {
        console.log(item);
        this.setState({
            visible: true,
            deleteItem: item,
        })
    };

    handleOk = e => {
        let deleteQuiz = {
            id: this.state.deleteItem.e.id,
            type: this.state.deleteItem.type,
        };
        this.socket.emit('delete quiz',deleteQuiz);

        this.setState({
            visible: false,
        });
        console.log(deleteQuiz);

        // this.socket.emit('get all types quiz');
        // this.socket.on('all types quiz',(data) => {
        //     data.personal.map((e)=>{
        //         this.state.individuel = [];
        //         this.state.individuel.push({
        //             type:'personal',
        //             e
        //         })
        //     });
        //     data.collaborative.handsTouch.map((e)=>{
        //         this.state.handsTouch = [];
        //         this.state.handsTouch.push({
        //             type:'handsTouch',
        //             e
        //         })
        //     });
        //     data.collaborative.handsMove.map((e)=>{
        //         this.state.handsMove = [];
        //         this.state.handsMove.push({
        //             type:'handsMove',
        //             e
        //         })
        //     });
        //     this.setState({
        //         questionList: this.state.questionList.concat(this.state.individuel,this.state.handsTouch,this.state.handsMove),
        //     });
        //     console.log(this.state.questionList);
        // });
    };

    handleCancel = e => {

        this.setState({
            visible: false,
        });
    };



    render() {
        return (<div>
            <List
                itemLayout="horizontal"
                dataSource={this.state.questionList}
                renderItem={item => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit">modifier</a>, <a onClick={(e) => this.deleteQuiz(e,item)}>supprimer</a>]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={url+item.e.src} />}
                            title={item.e.name}
                            description={item.e.topic}
                        />
                    </List.Item>
                )}
            />
                <Modal
                    title=""
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Vous êtes sûr de supprimer cette quiz?</p>
                </Modal>
    </div>
        );
    }
}
export default DetailQuiz;
