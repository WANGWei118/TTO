import React from 'react';
import 'antd/dist/antd.css';
import './app.css';
import openSocket from 'socket.io-client';
import { notification, List, Select,Layout, Menu, Icon, Tabs, Button, Breadcrumb,
    Modal, Checkbox, Input, Radio} from 'antd';

const { Header, Content, Footer, Sider} = Layout;
const Menu1 = 'Liste de quiz';
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
    cheminPic = [];
    state = {
        collapsed: false,
        visible: false,
        visible2: false,
        visiblePic: false,
        checkedList: [],
        data: null,
        name: null,
        theme: null,
        checkedQuestion: [],
        type: 'individuel',
        description: null,
        acceuilli: [],
        questionCol: [],
        nameCol: null,
        responseCol: [],
        res1: null,
        res2: null,
        res3: null,
        res4: null,
        showingRes2: false,
        showingRes3: false,
        showingRes4: false,
        resNb: 1,
        currentRes: null,
        checkedPic: null,
        bon1: false,
        bon2: false,
        bon3: false,
        bon4: false,
        pic1: null,
        pic2: null,
        pic3: null,
        pic4: null,
        rightAnsNb: 0,
    };
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeTheme = this.onChangeTheme.bind(this);
        this.socket = props.socket;
        // this.socket.on('all quizz', (result) => {
        //     this.quizList = result;
        //     this.setState({ data: result })
        // })
        this.socket.on('quiz added',(type) =>{
            if (type.type === true){
                notification['success']({
                    message: 'Quiz créé avec succès ',
                });
                this.setState({
                    name: '',
                    theme: null,
                    checkedList: [],
                    checkedQuestion: [],
                });
                this.onChangeTheme('');
            }
        });

        this.socket.emit('get images');
        this.socket.on('images',(data) => {
            this.cheminPic = data.map((e) => e.src);
            console.log(this.cheminPic);
        });
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

    onChangeQuestionIndi = checkedList => {
        this.setState({
            checkedList,
        });
        console.log(checkedList);

    };

    onChangeName = e => {
        this.setState({
            name:e.target.value,
        });
    };

    onChangeNameCol = e => {
        this.setState({
            nameCol:e.target.value,
        });
        console.log(this.state);
    };

    onChangeTheme = value => {
        this.setState({
            theme: value,
        });
    };

    onChangeType = e => {
        this.setState({
            type: e.target.value,
        });
    };

    onChangeDes = e => {
        this.setState({
            description: e.target.value,
        });
    };

    onChangeAcc = value => {
        this.setState({
            acceuilli: value,
        });
    };

    onChangeRes1 = e => {
        this.setState({
            res1: e.target.value,
        });
    };

    onChangeRes2 = e => {
        this.setState({
            res2: e.target.value,
        });
    };

    onChangeRes3 = e => {
        this.setState({
            res3: e.target.value,
        });
    };

    onChangeRes4 = e => {
        this.setState({
            res4: e.target.value,
        });
    };

    onChangePic = e => {
        this.setState({
            checkedPic: e.target.value,
        });
    };

    renderAcceuilli = () => {
        if(this.state.type === 'individuel') {
            return(
                //<Select defaultValue="" value = {this.state.acceuilli}
                        //style={{ width: 120, marginLeft: 50 }} onChange={this.onChangeAcc}>
                    //<Option value="acceuilli">Acceuilli</Option>
                //</Select>
                <div style={{marginLeft:30}}><b>Tout le monde</b></div>
            );
        } else {
            return (
                <div style={{marginLeft:30}}><b>Tout le monde</b></div>
            );
        }
    };

    addResponse = () => {
        // switch (this.state.resNb) {
        //     case 1 : this.setState({
        //         showingRes2: true,
        //         resNb: 2,
        //     });break;
        //     case 2 : this.setState({
        //         showingRes3: true,
        //         resNb: 3
        //     });break;
        //     case 3 : this.setState({
        //         showingRes4: true,
        //         resNb: 4
        //     });break;
        // }
        if(this.state.showingRes2 === false) {
            this.setState({
                showingRes2: true,
                resNb: this.state.resNb + 1,
            });
        }else if (this.state.showingRes3 === false) {
            this.setState({
                showingRes3: true,
                resNb: this.state.resNb + 1,
            });
        } else if (this.state.showingRes4 === false) {
            this.setState({
                showingRes4: true,
                resNb: this.state.resNb + 1,
            });
        }
        console.log(this.state.resNb);

    };

    deleteRes2 = () => {
        this.setState({
            showingRes2: false,
            res2: null,
            resNb: this.state.resNb-1,
            bon2: false,
            rightAnsNb : (this.state.bon1 ? 1 : 0)
                + (this.state.bon3 ? 1 : 0)
                + (this.state.bon4 ? 1 : 0),
        });
        console.log(this.state.resNb);
    };

    deleteRes3 = () => {
        this.setState({
            showingRes3: false,
            res3: null,
            resNb: this.state.resNb-1,
            bon3: false,
            rightAnsNb : (this.state.bon1 ? 1 : 0)
                + (this.state.bon2 ? 1 : 0)
                + (this.state.bon4 ? 1 : 0),
        });
        console.log(this.state.resNb);
    };

    deleteRes4 = () => {
        this.setState({
            showingRes4: false,
            res4: null,
            resNb: this.state.resNb-1,
            bon4: false,
            rightAnsNb : (this.state.bon1 ? 1 : 0)
                + (this.state.bon2 ? 1 : 0)
                + (this.state.bon3 ? 1 : 0)
        });
        console.log(this.state.resNb);
    };

    addPic1 = () => {
        this.setState({
            checkedPic: null,
            currentRes: 1,
            visiblePic: true,
        });
        console.log(this.state.currentRes)
    };
    addPic2 = () => {
        this.setState({
            checkedPic: null,
            currentRes: 2,
            visiblePic: true,
        });
    };
    addPic3 = () => {
        this.setState({
            checkedPic: null,
            currentRes: 3,
            visiblePic: true,
        });
    };
    addPic4= () => {
        this.setState({
            checkedPic: null,
            currentRes: 4,
            visiblePic: true,
        });
    };

    onSelect1 = e => {
        this.setState({
            bon1: e.target.checked,
            rightAnsNb : (!this.state.bon1 ? 1 : 0)
            + (this.state.bon2 ? 1 : 0)
            + (this.state.bon3 ? 1 : 0)
            + (this.state.bon4 ? 1 : 0),
        });
        console.log("bon1 " + this.state.bon1);
    };

    onSelect2 = () => {
        this.setState({
            bon2 : !this.state.bon2,
            rightAnsNb : (this.state.bon1 ? 1 : 0)
                + (!this.state.bon2 ? 1 : 0)
                + (this.state.bon3 ? 1 : 0)
                + (this.state.bon4 ? 1 : 0),
        });
        console.log("bon2 " + this.state.bon2);
    };

    onSelect3 = () => {
        this.setState({
            bon3 : !this.state.bon3,
            rightAnsNb : (!this.state.bon1 ? 1 : 0)
                + (this.state.bon2 ? 1 : 0)
                + (!this.state.bon3 ? 1 : 0)
                + (this.state.bon4 ? 1 : 0),
        });
        console.log("bon3 " + this.state.bon3);
    };

    onSelect4 = () => {
        this.setState({
            bon4 : !this.state.bon4,
            rightAnsNb : (this.state.bon1 ? 1 : 0)
                + (this.state.bon2 ? 1 : 0)
                + (this.state.bon3 ? 1 : 0)
                + (!this.state.bon4 ? 1 : 0),
        });
        console.log("bon4 " + this.state.bon4);
    };


    showModal = () => {
        if (this.state.type === 'individuel') {
            this.setState({
                visible: true,
            });
        } else {
            this.setState({
                visible2: true,
            });
        }
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

    handleOkCol = e => {
        const questionsCollaborative = [];
        const response = [];
        if (this.state.nameCol === null || this.state.nameCol === '') {
            notification['warning']({
                message: 'Entrez la question',
            });
        } else if (this.state.rightAnsNb === 0){
            notification['warning']({
                message: 'Il faut au moins une bonne réponse',
            });
        } else if (this.state.pic1 === null) {
            notification['warning']({
                message: 'Ajouter une image pour réponse 1',
            });
        } else if ((this.state.pic2 === null)&&(this.state.showingRes2===true)) {
            notification['warning']({
                message: 'Ajouter une image pour réponse 2',
            });
        } else if ((this.state.pic3 === null)&&(this.state.showingRes3===true)) {
            notification['warning']({
                message: 'Ajouter une image pour réponse 3',
            });
        } else if ((this.state.pic4 === null)&&(this.state.showingRes4===true)) {
            notification['warning']({
                message: 'Ajouter une image pour réponse 4',
            });
        }else {
            if (this.state.res1 !== (null || '')) {
                response.push({
                    description: this.state.res1,
                    src: this.state.pic1,
                    isAnswer: this.state.bon1,
                });
            }
            if ((this.state.res2 !== (null || ''))
                && (this.state.showingRes2 === true)) {
                response.push({
                    description: this.state.res2,
                    src: this.state.pic2,
                    isAnswer: this.state.bon2,
                });
            }
            if ((this.state.res3 !== (null || ''))
                && (this.state.showingRes3 === true)) {
                response.push({
                    description: this.state.res3,
                    src: this.state.pic3,
                    isAnswer: this.state.bon3,
                });
            }
            if ((this.state.res4 !== (null || ''))
                && (this.state.showingRes4 === true)) {
                response.push({
                    description: this.state.res4,
                    src: this.state.pic4,
                    isAnswer: this.state.bon4,
                });
            }
            questionsCollaborative.push({
                id:questionsCollaborative.length,
                description: this.state.nameCol,
                type: "notangile",
                rightAnswers: this.state.rightAnsNb,
                pictures: response,
            });

            this.setState({
                visible2: false,
                questionCol: questionsCollaborative,
            });

            console.log(questionsCollaborative);
        }

    };

    handleOkPic = e => {
        switch (this.state.currentRes){
            case 1: this.setState({
                pic1: this.state.checkedPic,
            }); break;
            case 2: this.setState({
                pic2: this.state.checkedPic,
            }); break;
            case 3: this.setState({
                pic3: this.state.checkedPic,
            }); break;
            case 4: this.setState({
                pic4: this.state.checkedPic,
            }); break;
        }
        this.setState({
            visiblePic: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancelCol = e => {
        console.log(e);
        this.setState({
            visible2: false,
        });
    };

    handleCancelPic = e => {
        console.log(e);
        this.setState({
            visiblePic: false,
        });
    };

    sendNewQuiz = () => {
        if (this.state.type === 'individuel') {
            const newQuiz = {
                id: this.getId(),
                name: this.state.name,
                topic: this.state.theme,
                questions: this.state.checkedQuestion,
            };
            console.log(newQuiz);
            if (newQuiz.name === null || newQuiz.name === ''){
                notification['warning']({
                    message: 'Entrer le nom ',
                });
                return null;
            }else if (newQuiz.topic === null || newQuiz.topic === '') {
                notification['warning']({
                    message: 'Choisir un theme ',
                });
            }else if (newQuiz.questions.length === 0) {
                notification['warning']({
                    message: 'Choisir les questions ',
                });
            }else {this.socket.emit('add quiz', newQuiz);}
        } else if (this.state.type === 'collaboratif') {
            const newColla = {
                id: this.getId(),
                name: this.state.name,
                topic:this.state.theme,
                type: 'notangile',
                questions: this.state.questionCol,
            };
            console.log(newColla);
            if (newColla.name === null || newColla.name === ''){
                notification['warning']({
                    message: 'Entrer le nom ',
                });
                return null;
            }else if (newColla.topic === null || newColla.topic === '') {
                notification['warning']({
                    message: 'Choisir un theme ',
                });
            }else if (newColla.questions.length === 0) {
                notification['warning']({
                    message: 'Ajouter les questions ',
                });
            }else{
                this.socket.emit('add quiz collaborative', newColla);
            }
        }

    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    renderQuestion = () => {
      return this.state.checkedQuestion.map((q) => q.description);
    };


    render() {
        const {resCol} =this.state;
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
                            <div style={{fontSize:16,display: 'flex', flexDirection: 'row'}}>Type<p style={{color:'red'}}>*</p>
                                <Radio.Group defaultValue={'individuel'}
                                             onChange={this.onChangeType}
                                             value={this.state.type}
                                         style = {{marginBottom:20,marginLeft:10}}>
                                <Radio value={'individuel'}>Quiz individuel</Radio>
                                <Radio value={'collaboratif'}>Quiz collaboratif</Radio>
                                </Radio.Group>
                            </div>
                            <Input style = {{width:400, marginBottom:20}}
                                   addonBefore= 'Nom '
                                   prefix={<p style={{color:'red'}}>*</p>}
                                   allowClear = 'true'
                                   value={this.state.name}
                                   onChange = {e=>this.onChangeName(e)}
                            />
                            <Input style = {{width:400, marginBottom:20}}
                                   addonBefore= 'Description '
                                   allowClear = 'true'
                                   value={this.state.description}
                                   onChange = {e=>this.onChangeDes(e)}
                            />
                            <div style = {{ marginBottom:20, fontSize:16,display: 'flex', flexDirection: 'row'}}>
                                Thème<p style={{color:'red'}}>*</p>
                                <Select defaultValue="" value = {this.state.theme}
                                        style={{ width: 120, marginLeft: 50 }} onChange={this.onChangeTheme}>
                                    <Option value="fruit">Fruit</Option>
                                </Select>
                            </div>
                            <div style = {{ marginBottom:20, fontSize:16, display: 'flex', flexDirection: 'row'}}> Acceuilli
                                {this.renderAcceuilli()}
                            </div>
                            <div style = {{ marginBottom:20,fontSize:16,display: 'flex', flexDirection: 'row'}}> Les questions<p style={{color:'red'}}>*</p>
                                <Button style={{marginLeft:130}} type='primary' onClick={this.showModal}><Icon type="plus"/> Ajouter des questions</Button>
                            </div>
                            <Modal
                                title="Choisir des questions individuels"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <CheckboxGroup
                                    options={plainOptions}
                                    value={this.state.checkedList}
                                    onChange={this.onChangeQuestionIndi}
                                />
                            </Modal>
                            <Modal
                                title="Ajouter des questions collaboratives"
                                visible={this.state.visible2}
                                onOk={this.handleOkCol}
                                onCancel={this.handleCancelCol}
                                width={800}
                            >
                                <Input style = {{marginBottom:20}}
                                       addonBefore= 'Question collaboraitve '
                                       prefix={<p style={{color:'red'}}>*</p>}
                                       allowClear = 'true'
                                       onChange = {e=>this.onChangeNameCol(e)}
                                />
                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                    <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                           addonBefore= 'Réponse 1'
                                           allowClear = 'true'
                                           onChange = {e=>this.onChangeRes1(e)}
                                    />
                                    <p style={{color:'red'}}>*</p>
                                    <Button icon="picture"
                                            style={{marginRight:30}}
                                            onClick={this.addPic1} />
                                    Bonne Résponse
                                    <Checkbox checked={this.state.bon1}
                                              style={{marginLeft:5}}
                                              onChange={this.onSelect1}/>
                                </div>
                                { this.state.showingRes2
                                    ? <div style={{ display: 'flex', flexDirection: 'row'}}>
                                        <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                               addonBefore= 'Réponse 2'
                                               allowClear = 'true'
                                               onChange = {e=>this.onChangeRes2(e)}
                                        />
                                        <p style={{color:'red'}}>*</p>
                                        <Bu  tton icon="picture"
                                                style={{marginRight:30}}
                                                onClick={this.addPic2} />
                                        Bonne Résponse
                                        <Checkbox checked={this.state.bon2}
                                                  style={{marginLeft:5}}
                                                  onChange={this.onSelect2}/>
                                        <Button type="danger"
                                                size='small'
                                                shape="circle"
                                                icon="minus"
                                                style={{marginLeft:20}}
                                                onClick={this.deleteRes2} />
                                    </div>
                                    : null
                                }
                                { this.state.showingRes3
                                    ? <div style={{ display: 'flex', flexDirection: 'row'}}>
                                        <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                               addonBefore= 'Réponse 3'
                                               allowClear = 'true'
                                               onChange = {e=>this.onChangeRes3(e)}
                                        />
                                        <p style={{color:'red'}}>*</p>
                                        <Button icon="picture"
                                                style={{marginRight:30}}
                                                onClick={this.addPic3} />
                                        Bonne Résponse
                                        <Checkbox checked={this.state.bon3}
                                                  style={{marginLeft:5}}
                                                  onChange={this.onSelect3}/>
                                        <Button type="danger" style={{marginLeft:20}} size='small' shape="circle" icon="minus" onClick={this.deleteRes3} />
                                    </div>
                                    : null
                                }
                                { this.state.showingRes4
                                    ? <div style={{ display: 'flex', flexDirection: 'row'}}>
                                        <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                               addonBefore= 'Réponse 4'
                                               allowClear = 'true'
                                               onChange = {e=>this.onChangeRes4(e)}
                                        />
                                        <p style={{color:'red'}}>*</p>
                                        <Button icon="picture"
                                                style={{marginRight:30}}
                                                onClick={this.addPic4} />
                                        Bonne Résponse
                                        <Checkbox checked={this.state.bon4}
                                                  style={{marginLeft:5}}
                                                  onChange={this.onSelect4}/>
                                        <Button type="danger" style={{marginLeft:20}} size='small' shape="circle" icon="minus" onClick={this.deleteRes4} />
                                    </div>
                                    : null
                                }
                                <div style={{height:30}}> </div>
                                {/*{resCol.map(res => {*/}
                                    {/*return <div key={res} style={{ display: 'flex', flexDirection: 'row'}}>*/}
                                        {/*<Input style = {{width:400, marginBottom:20, marginRight:20}}*/}
                                               {/*addonBefore= 'Résponse'*/}
                                               {/*allowClear = 'true'*/}
                                               {/*onChange = {e=>this.onChangeRes2(e)}*/}
                                        {/*/>*/}
                                        {/*<Button type="danger" shape="circle" icon="minus" onClick={this.deleteRes2} />*/}
                                    {/*</div>*/}
                                {/*})}*/}
                                {
                                    this.state.resNb < 4
                                    ? <Button style={{position:'absolute',right:20,bottom:70}} onClick={this.addResponse}
                                            // onClick = {() => this.setState({comps: comps.concat([Date.now()])})}
                                        >
                                            <Icon type="plus"/> Ajouter une response
                                        </Button>
                                        : null
                                }

                            </Modal>
                            <Modal
                                title="Choisir une image"
                                visible={this.state.visiblePic}
                                onOk={this.handleOkPic}
                                onCancel={this.handleCancelPic}
                            >
                                <p>Response {this.state.currentRes}</p>
                                <Radio.Group options={this.cheminPic}
                                             onChange={e => this.onChangePic(e)}
                                             value={this.state.checkedPic}
                                             style = {{marginBottom:20,marginLeft:10}}>
                                </Radio.Group>
                            </Modal>
                            {this.state.type === 'individuel'
                                ? <List
                                    bordered
                                    dataSource={this.state.checkedQuestion}
                                    renderItem={item => <List.Item><List.Item.Meta
                                        title={item.description}
                                        description={"Options: " + item.answers.map((a)=>a.text)+ "; Bonne reponse: " + item.rightAnwer.text}
                                    /></List.Item>}
                                />
                                : <List
                                    bordered
                                    dataSource={this.state.questionCol}
                                    renderItem={item => <List.Item><List.Item.Meta
                                        title={item.description}
                                        description={"Options: " + item.pictures.map((a)=>a.description)}
                                    /></List.Item>}
                                />
                            }

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
