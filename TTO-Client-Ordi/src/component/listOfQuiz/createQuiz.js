import React from 'react';
import 'antd/dist/antd.css';
import '../app.css';
import openSocket from 'socket.io-client';
import { Upload, message,notification, List, Select,Layout, Menu, Icon,
    Tabs, Button, Breadcrumb, Modal, Checkbox, Input, Radio} from 'antd';
import images from './images';
import Sidebar from '../sidebar';
import './createQuiz.css'
import {Link} from "react-router-dom";
import $ from 'jquery';

const { Header, Content, Footer, Sider} = Layout;
const Menu1 = 'Liste de quiz';
const Menu2 = 'Statistiques';
const Menu3 = 'Information par acceuil';
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Option } = Select;
const questions = require('../question');
const plainOptions = questions.map((question) => question.description);

const url = "http://192.168.1.7:";


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

function getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

function beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
    }
    // const isLt2M = file.size / 1024 / 1024 < 2
    // if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!')
    // }
    return isJpgOrPng
}

class CreateQuiz extends React.Component {
    socket = openSocket;
    quizList = null;
    cheminPic = [];
    prefix = null;
    state = {
        id : 0,
        loading: false,
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
        nameIndi: null,
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
        indi1: null,
        indi2: null,
        indi3: null,
        indi4: null,
        rightAnsNb: 0,
        images: [],
        tangible: 'tangible',
        bonneIndi: "",
        rightAnwer: null,
        showAcc: false,
        accList: [],
        nameList: [],
        idList: [],
        checkedAcc: [],
        checkedAccId: [],
        themePic: null,
        quizList: null,
        topicList: [],
        topicId:0,
    };
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeTheme = this.onChangeTheme.bind(this);
        this.socket = props.socket;

        this.socket.emit("get topics");
        this.socket.on("all topics",(data)=>{
            this.state.topicList=[];
            data.map((e)=>{
                this.setState({
                    topicList: this.state.topicList.concat(e),
                })
            });
            console.log(this.state.topicList);
        });

        this.socket.emit('get all types quiz');
        this.socket.on('all types quiz',(data) => {
            this.quizList = data;
            this.state.quizList = data;
            console.log(this.quizList);
            console.log(this.quizList.personal.length);
        });
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

        this.socket.emit('get profiles');
        this.socket.on('all profiles',(data) => {
            this.state.accList = data;
            console.log(this.state.accList);
            this.state.accList.map((e)=>{
                this.state.nameList.push(e.id + ". " +e.firstName+e.lastName);
            });
            console.log(this.state.nameList);
            console.log(this.state.idList);
        });

        this.socket.emit('get topics');
        this.socket.on('all topics',(data)=>{
            this.setState({
                topicList:data,
            });
            console.log(this.state.topicList);
        });

        this.socket.emit('get images');
        this.socket.on('images',(data) => {
            this.cheminPic = data[0].src.map((e) => e);
            console.log(data);
            console.log(this.cheminPic);
            this.cheminPic.map((i)=>{
                this.state.images.push(
                    <Button className="buttonImage"
                            onClick={e => this.onChangePic(e, i)}>
                        <img src = {url+'10000/'+i} className='image'/>
                    </Button>
                );
            });
        });
    }

    getTopicId = name =>{
        this.state.topicList.map((e)=>{
            if (e.topic.toString() === name.toString()) {
                console.log(e.id);
                this.state.topicId = e.id;
                return e.id;
            }
        });

    };

    getTopicPersonalQuiz = name => {
        let personal = [];
        this.quizList.personal.map((e)=>{
            if(e.topic === name) {
                personal.push(e.id);
            }
        });
        return personal;
    };

    getTopicHandsMoveQuiz = name => {
        let handsmove = [];
        this.quizList.collaborative.handsMove.map((e)=>{
            if(e.topic === name) {
                handsmove.push(e.id);
            }
        });
        return handsmove;
    };

    getTopicHandsTouchQuiz = name => {
        let handstouch = [];
        this.quizList.collaborative.handsTouch.map((e)=>{
            if(e.topic === name) {
                handstouch.push(e.id);
            }
        });
        return handstouch;
    };

    getId = () => {
        let id = 0;
        for(let i = 0; i < this.quizList.personal.length; i++) {
            if (this.quizList[i].id > id) {
                id = this.quizList[i].id;
            }
        }
        console.log(id);
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

    onChangeBonne = value => {
        this.setState(({
            bonneIndi: value,
        }));
    };

    onChangeType = e => {
        this.setState({
            type: e.target.value,
        });
    };

    onChangeTangible = e => {
        this.setState({
            tangible: e.target.value,
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

    onChangePic = (e,i) => {
        this.setState({
            checkedPic: i,
        });
    };

    showPic1 = () => {
        this.cheminPic.map((i)=> {
            if(this.state.pic1 === i) {
                return <img src={url+i} className='littleImage'/>;
            }
        });
    };

    renderAcceuilli = () => {
        if(this.state.type === 'individuel') {
            return(
                <div style={{display:"flex", flexDirection: "row"}}>
                    <p style={{color:'red'}}>*</p>
                    {/*<Select defaultValue="" value = {this.state.acceuilli}*/}
                            {/*style={{ width: 120, marginLeft: 50 }} onChange={this.onChangeAcc}>*/}
                        {/*<Option value="acceuilli">Acceuilli</Option>*/}
                    {/*</Select>*/}
                    <Button style={{marginLeft:30}} onClick={this.modalAcceuilli}>Ajouter les acceuillis</Button>
                </div>

            );
        } else {
            return (
                <div style={{marginLeft:30}}><b>Tout le monde</b></div>
            );
        }
    };

    modalAcceuilli = () => {
        this.setState({
            showAcc: true,
        })
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

    onChangeNameIndi = e =>{
        this.setState({
            nameIndi: e.target.value,
        });
    };

    onSelectAcc = checkedList => {
        this.setState({
            checkedAcc: checkedList,
        });
        console.log(this.state.checkedAcc);
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

        const questionsIndividuel = [];
        let right;
        const response = [];
        if (this.state.nameIndi === null || this.state.nameIndi === '') {
            notification['warning']({
                message: 'Entrez la question',
            });
        } else if (this.state.bonneIndi === ""){
            notification['warning']({
                message: 'Il manque la bonne réponse',
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
                    id:"A",
                    text: this.state.res1,
                    src: this.state.pic1,
                });
            }
            if ((this.state.res2 !== (null || ''))
                && (this.state.showingRes2 === true)) {
                response.push({
                    id:"B",
                    text: this.state.res2,
                    src: this.state.pic2,
                });
            }
            if ((this.state.res3 !== (null || ''))
                && (this.state.showingRes3 === true)) {
                response.push({
                    id:"C",
                    text: this.state.res3,
                    src: this.state.pic3,
                });
            }
            if ((this.state.res4 !== (null || ''))
                && (this.state.showingRes4 === true)) {
                response.push({
                    id:"D",
                    text: this.state.res4,
                    src: this.state.pic4,
                });
            }

            switch (this.state.bonneIndi) {
                case "A": {
                    right = {
                        id: this.state.bonneIndi,
                        text: this.state.res1,
                        src: this.state.pic1,
                    };
                    break;
                }
                case "B": {
                    right = {
                        id: this.state.bonneIndi,
                        text: this.state.res2,
                        src: this.state.pic2,
                    };
                    break;
                }
                case "C": {
                    right = {
                        id: this.state.bonneIndi,
                        text: this.state.res3,
                        src: this.state.pic3,
                    };
                    break;
                }
                case "D": {
                    right = {
                        id: this.state.bonneIndi,
                        text: this.state.res4,
                        src: this.state.pic4,
                    };
                    break;
                }
            }

            questionsIndividuel.push({
                id:questionsIndividuel .length,
                description: this.state.nameIndi,
                answers: response,
                rightAnwer:right,
            });

            this.setState({
                visible: false,
                checkedQuestion: this.state.checkedQuestion.concat(questionsIndividuel),
            });

            console.log(questionsIndividuel);
            console.log(this.state.checkedQuestion);
        }
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
                questionCol: this.state.questionCol.concat(questionsCollaborative),
            });

            console.log(questionsCollaborative);
            console.log(this.state.questionCol);
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
        console.log(this.state.pic1);
    };

    handleOkAcc = e =>{
        let checkedAccId = [];
        let test = this.state.checkedAcc;
        test.map((e)=>{
            checkedAccId.push(e.split(".")[0]);
        });
        console.log(checkedAccId);
        this.setState({
            showAcc: false,
            checkedAccId: checkedAccId,
        });
        console.log(this.state.checkedAccId);
    };
    handleCancelAcc = e =>{
        this.setState({
            showAcc: false,
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
        let themePic = '';
        this.state.topicList.map((e)=>{
            if(this.state.theme === e.topic){
                themePic = e.icon;
            }
        });

        this.getTopicId(this.state.theme);

        if (this.state.type === 'individuel') {
            let sendAcc = [];
            console.log(this.state.accList)
            this.state.checkedAccId.map((e)=>{
                this.state.accList.map((acc)=>{
                    console.log(acc)
                    if (e.toString() === acc.id.toString()) {
                        sendAcc.push({
                            id: acc.id,
                            quizAccessible: {
                                quizIndividuel: acc.quizAccessible.quizIndividuel.concat(this.state.quizList.personal.length+1),
                            }
                        })
                    }
                });
                // this.state.accList.filter(function(acc) {
                //     // checkedList.map((check) => check === question.description)
                //     for(var i = 0; i < this.state.checkedAccId.length; i++) {
                //         if(acc.id === this.state.checkedAccId [i]){
                //             sendAcc.push({
                //                 id: e,
                //                 questionAccessible: {
                //                     questionIndividuel: e.questionAccessible.questionIndividuel.concat(this.getId),
                //                     questionTangible:e.questionAccessible.questionTangible,
                //                     questionNonTangible:e.questionAccessible.questionNonTangible,
                //                 }
                //             })
                //         }
                //     }
                // });

            });
            const newQuiz = {
                id: this.state.quizList.personal.length+1,
                name: this.state.name,
                topic: this.state.theme,
                src: themePic,
                questions: this.state.checkedQuestion,
            };
            console.log(newQuiz);


            const updateTopic = {
                id: this.state.topicId,
                quiz: {
                    personalQuiz: this.getTopicPersonalQuiz(this.state.theme).concat(newQuiz.id),
                    tableQuiz: {
                        handsMove: this.getTopicHandsMoveQuiz(this.state.theme),
                        handsTouch: this.getTopicHandsTouchQuiz(this.state.theme),
                    }
                }
            };
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
            }else {
                this.socket.emit('add quiz', newQuiz);
                console.log(newQuiz);
                this.socket.emit('update profile',sendAcc);
                console.log(sendAcc);
                this.socket.emit('update topic',updateTopic);
                console.log(updateTopic);
            }
        } else if (this.state.type === 'collaboratif') {
            let id = 0;
            let updateTopicCol = null;
            if (this.state.tangible === 'handsTouch') {

                    id = this.state.quizList.collaborative.handsTouch.length + 1;
                updateTopicCol = {
                    id: this.state.topicId,
                    quiz: {
                        personalQuiz: this.getTopicPersonalQuiz(this.state.theme),
                        tableQuiz: {
                            handsMove: this.getTopicHandsMoveQuiz(this.state.theme),
                            handsTouch: this.getTopicHandsTouchQuiz(this.state.theme).concat(id),
                        }
                    }
                };
            } else if (this.state.tangible === 'handsMove') {
                id = this.state.quizList.collaborative.handsMove.length + 1;
                updateTopicCol = {
                    id: this.state.topicId,
                    quiz: {
                        personalQuiz: this.getTopicPersonalQuiz(this.state.theme),
                        tableQuiz: {
                            handsMove: this.getTopicHandsMoveQuiz(this.state.theme).concat(id),
                            handsTouch: this.getTopicHandsTouchQuiz(this.state.theme),
                        }
                    }
                };
            }
            console.log(this.state.quizList.collaborative);
            console.log(id);
            const newColla = {
                id: id,
                name: this.state.name,
                topic:this.state.theme,
                src:themePic,
                type: this.state.tangible,
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
                this.socket.emit('add quiz collaborative', {type:this.state.tangible,quiz:newColla});
                this.socket.emit('update topic',updateTopicCol);
                console.log(updateTopicCol);
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

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{
                let image;
                image = this.prefix.concat(info.file.originFileObj.name);
                this.setState({
                    imageUrl,
                    loading: false,
                    images: this.state.images.concat(
                        <Button className="buttonImage"
                                onClick={e => this.onChangePic(e, image)}>
                            <img src = {url+imageUrl} className='image'/>
                        </Button>
                    ),
                });
                console.log(this.prefix);
                console.log(image);
                console.log(this.state.images);
            });
            this.sendImage(info);
        }
    };

    sendImage = info => {
        const image = info.file.originFileObj;

        console.log(image);
        let myForm = new FormData();
        myForm.append('name', 'testUpload');
        myForm.append('userfile', image);

        // var myPhoto = $('#img-upload')[0].files[0];
        // var oMyForm = new FormData();
        // oMyForm.append("name", 'crazyJiaLin');
        // oMyForm.append("userfile", myPhoto);
        $.ajax({
            type: 'POST',
            url: url+'10001/imgUpload',
            cache: false,  //不需要缓存
            processData: false,    //不需要进行数据转换
            contentType: false, //默认数据传输方式是application,改为false，编程multipart
            data: myForm,
            dataType: 'json'
        }).done(function (data) {
            console.log(data);
            alert(data.errMsg)
        }).fail(function (err) {
            console.error(err)
        })
    };


    render() {
        let i = 0;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const {imageUrl} = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar default = "1"/>
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
                            {this.state.type === 'collaboratif'
                            ?<div style={{fontSize:16,display: 'flex', flexDirection: 'row'}}>Type<p style={{color:'red'}}>*</p>
                                    <Radio.Group defaultValue={'individuel'}
                                                 onChange={this.onChangeTangible}
                                                 value={this.state.tangible}
                                                 style = {{marginBottom:20,marginLeft:10}}>
                                        <Radio value={'handsTouch'}>Cliquer avec un objet</Radio>
                                        <Radio value={'handsMove'}>Drag and Drop</Radio>
                                    </Radio.Group>
                                </div>
                            : null}

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
                                    {this.state.topicList.map((e)=>(
                                        <Option key={e.topic}>{e.topic}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div style = {{ marginBottom:20, fontSize:16, display: 'flex', flexDirection: 'row'}}> Acceuilli
                                {this.renderAcceuilli()}
                            </div>
                            <Modal
                                title="Choisir des acceuillis"
                                visible={this.state.showAcc}
                                onOk={this.handleOkAcc}
                                onCancel={this.handleCancelAcc}
                                width={800}
                            >
                                <CheckboxGroup
                                options={this.state.nameList}
                                value={this.state.checkedAcc}
                                onChange={this.onSelectAcc}
                                />
                            </Modal>
                            <div style = {{ marginBottom:20,fontSize:16,display: 'flex', flexDirection: 'row'}}> Les questions<p style={{color:'red'}}>*</p>
                                <Button style={{marginLeft:130}} type='primary' onClick={this.showModal}><Icon type="plus"/> Ajouter des questions</Button>
                            </div>
                            <Modal
                                title="Ajouter des questions individuels"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                width={800}
                                style={{zIndex:10}}
                            >
                                {/*<CheckboxGroup*/}
                                    {/*options={plainOptions}*/}
                                    {/*value={this.state.checkedList}*/}
                                    {/*onChange={this.onChangeQuestionIndi}*/}
                                {/*/>*/}
                                <Input style = {{marginBottom:20}}
                                       addonBefore= 'Question individuel '
                                       prefix={<p style={{color:'red'}}>*</p>}
                                       allowClear = 'true'
                                       onChange = {e=>this.onChangeNameIndi(e)}
                                />
                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                    <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                           addonBefore= 'Réponse A'
                                           allowClear = 'true'
                                           onChange = {e=>this.onChangeRes1(e)}
                                    />
                                    <p style={{color:'red'}}>*</p>
                                    <Button icon="picture"
                                            style={{marginRight:30}}
                                            onClick={this.addPic1} />
                                    {/*{this.showPic1}*/}
                                </div>
                                { this.state.showingRes2
                                    ? <div style={{ display: 'flex', flexDirection: 'row'}}>
                                        <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                               addonBefore= 'Réponse B'
                                               allowClear = 'true'
                                               onChange = {e=>this.onChangeRes2(e)}
                                        />
                                        <p style={{color:'red'}}>*</p>
                                        <Button icon="picture"
                                                style={{marginRight:30}}
                                                onClick={this.addPic2} />

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
                                               addonBefore= 'Réponse C'
                                               allowClear = 'true'
                                               onChange = {e=>this.onChangeRes3(e)}
                                        />
                                        <p style={{color:'red'}}>*</p>
                                        <Button icon="picture"
                                                style={{marginRight:30}}
                                                onClick={this.addPic3} />

                                        <Button type="danger" style={{marginLeft:20}} size='small' shape="circle" icon="minus" onClick={this.deleteRes3} />
                                    </div>
                                    : null
                                }
                                { this.state.showingRes4
                                    ? <div style={{ display: 'flex', flexDirection: 'row'}}>
                                        <Input style = {{width:450, marginBottom:20, marginRight:20}}
                                               addonBefore= 'Réponse D'
                                               allowClear = 'true'
                                               onChange = {e=>this.onChangeRes4(e)}
                                        />
                                        <p style={{color:'red'}}>*</p>
                                        <Button icon="picture"
                                                style={{marginRight:30}}
                                                onClick={this.addPic4} />

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
                                Bonne reponse<Select defaultValue="" value = {this.state.bonneIndi}
                                        style={{ width: 120, marginLeft: 50 }} onChange={this.onChangeBonne}>
                                    <Option value="A">A</Option>
                                    <Option value="B">B</Option>
                                    <Option value="C">C</Option>
                                    <Option value="D">D</Option>
                                </Select>

                            </Modal>
                            <Modal
                                title="Ajouter des questions collaboratives"
                                visible={this.state.visible2}
                                onOk={this.handleOkCol}
                                onCancel={this.handleCancelCol}
                                width={800}
                                style={{zIndex:10}}
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
                                    {/*{this.showPic1}*/}
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
                                        <Button icon="picture"
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
                                style={{zIndex:20}}
                            >
                                <p>Response {this.state.currentRes}</p>
                                <div style={{maxHeight:450,overflowY:"auto",}}>{this.state.images}</div>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChange}>
                                    {uploadButton}
                            </Upload>
                            </Modal>
                            {this.state.type === 'individuel'
                                ? <List
                                    bordered
                                    dataSource={this.state.checkedQuestion}
                                    renderItem={item => <List.Item><List.Item.Meta
                                        title={item.description}
                                        description={"Options: " + item.answers.map((a)=>a.text)}
                                    /></List.Item>}
                                />
                                : <List
                                    bordered
                                    dataSource={this.state.questionCol}
                                    renderItem={item =>
                                        <List.Item><List.Item.Meta
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
