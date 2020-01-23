import React from 'react';
import 'antd/dist/antd.css';
import './app.css';
import openSocket from 'socket.io-client';
import { Select,Layout, Menu, Icon, Tabs, Button, Breadcrumb, Modal, Checkbox, Input, Dropdown} from 'antd';

const { Header, Content, Footer, Sider} = Layout;const Menu1 = 'Liste de quiz';
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Option } = Select;
const questions = require('./question');
const plainOptions = questions.map((question) => question.description);

const menu = (
    <Menu>
        <Menu.Item key="1">
            <Icon type="user" />
            Fruit
        </Menu.Item>
        {/*<Menu.Item key="2">*/}
            {/*<Icon type="user" />*/}
            {/*2*/}
        {/*</Menu.Item>*/}
    </Menu>
);

class CreateQuiz extends React.Component {
    socket = openSocket;
    quizList = [];
    state = {
        collapsed: false,
        visible: false,
        checkedList: [],
        data: null,
        name: null,
        theme: null,
        checkedQuestion: [],
    };
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.socket.on('all quizz', (result) => {
            this.quizList = result;
            this.setState({ data: result })
        })
    }

    getId = () => {
        let id = 0;
        for(let i = 0; i < this.quizList.length; i++) {
            if (this.quizList[i].id > id) {
                id = this.quizList[i].id;
            }
        }
        return id;
    };

    onChange = checkedList => {
        this.setState({
            checkedList,
        });
        console.log(checkedList);

    };

    onChangeName = e => {
        this.setState({
            name:e.target.value,
        });
        console.log(this.state.name);
    };

    onChangeTheme = value => {
        this.setState({
            theme: value,
        });
        console.log(this.state.theme);
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        const checkedQuestions = [];
        let test = this.state.checkedList;
        questions.filter(function(question) {
            // checkedList.map((check) => check === question.description)
            for(var i = 0; i < test.length; i++) {
                if(question.description === test[i]){
                    checkedQuestions.push(question);
                }
            }
        });
        console.log(checkedQuestions);
        this.setState({
            checkedQuestion: checkedQuestions,
        });
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

    sendNewQuiz = () => {
        const newQuiz = {
            id: this.getId(),
            name: this.state.name,
            topic: this.state.theme,
            questions: this.state.checkedQuestion,
        };
        console.log(newQuiz);
        this.socket.emit('add quiz', newQuiz);
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
                        <h2>Créer un quiz</h2>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item> </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 480, display: 'flex', flexDirection: 'column' }}>

                            <Input style = {{width:400, marginBottom:20}}
                                   addonBefore= 'Nom '
                                   onChange = {e=>this.onChangeName(e)}
                            />
                            <div style = {{ marginBottom:20}}> Thème
                                <Select defaultValue="" style={{ width: 120, marginLeft: 50 }} onChange={this.onChangeTheme}>
                                    <Option value="fruit">Fruit</Option>
                                </Select>
                            </div>
                            <div style = {{ marginBottom:20}}> Les questions
                                <Button style={{marginLeft:130}} type='primary' onClick={this.showModal}><Icon type="plus"/> Ajouter des questions</Button>
                            </div>
                            <Modal
                                title="Choisir des questions"
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
                    <Footer style={{display:'flex', justifyContent:'center'}}>
                        <Button style={{marginBottom:100}} type='primary' onClick={this.sendNewQuiz}>Terminer</Button>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
export default CreateQuiz;
