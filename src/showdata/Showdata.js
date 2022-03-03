import React, {Component} from "react";
import axios from "axios";
import Modal from 'react-awesome-modal';
import './Showdata.css';
//import '../../server/app';
import {ip,port} from "../setIP/setting";

export default class Showdata extends Component{
    constructor() {
        super();
        this.state ={
            list:[],
            idkey:"",
            firstname:"",
            lastname:"",
            time:"",
            email:"",
            id_province:"",
            id_district:"",
            id_subdistrict:"",
            id_village:"",
            keep_province:[],
            keep_district:[],
            keep_subdistrict:[],
            keep_village:[]
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        //console.log("hello show data");
    }
    componentDidMount() {
        //console.log("before get data");
        this.getData();
        //console.log("after get data");
    }
    getData = () => {
        console.log("before fetch data");
        fetch('/data')
            .then(res => res.json())
            .then(list => this.setState({ list }))
        console.log("after fetch data");
    }
    
    onDelete=(user)=>{
        let url = `https://localhost:3000/delete`;
        let data = {
            idkey:user.id
        }
        axios.put(url,data)
        setTimeout(()=>{this.componentDidMount()},1)
    }

    listprovince(){
        axios.get('/province').then(listprovince_op=>{
            this.setState(()=>({keep_province:listprovince_op.data}));
        })
    }
    listdistrict(value){
        axios.get(`/district?provinceId=${value}`)
        .then(listdistrict_op=>{
            this.setState(()=>({keep_district:listdistrict_op.data}));
        })
    }
    listsubdistrict(value){
        axios.get(`/subdistrict?districtId=${value}`)
        .then(listsubdistrict_op=>{
            this.setState(()=>({keep_subdistrict:listsubdistrict_op.data}));
        })
    }
    listvillage(value){
        axios.get(`/village?subdistrictId=${value}`)
        .then(listvillage_op=>{
            this.setState(()=>({keep_village:listvillage_op.data}));
        })
    }
    openModal(user) {
        this.listprovince();
        this.listdistrict(user.provinceId);
        this.listsubdistrict(user.districtId);
        this.listvillage(user.subdistrictId);

        this.setState({
            visible : true
        });

    }
    closeModal() {
        this.setState({
            visible : false
        });
    }
    call=(user)=>{
        this.openModal(user);
        this.setState({
            idkey:user.id,
            firstname:user.firstname,
            lastname:user.lastname,
            time:user.time,
            email:user.email,
            id_province:user.id_province,
            id_district:user.id_district,
            id_subdistrict:user.id_subdistrict,
            id_village:user.id_village
        })
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        switch(e.target.id) {
            case 'id_province':
                this.listdistrict(e.target.value);
                this.state.keep_subdistrict = [];
                this.state.keep_village = [];
                document.getElementById('id_district').disabled = e.target.value === "0" ? true : false;
                document.getElementById('id_subdistrict').disabled = true;
                document.getElementById('id_village').disabled = true;
                break;
            case 'id_district':
                this.listsubdistrict(e.target.value);
                this.state.keep_village = [];
                document.getElementById('id_subdistrict').disabled = e.target.value === "0" ? true : false;
                document.getElementById('id_village').disabled = true;
                break;
            case 'id_subdistrict':
                this.listvillage(e.target.value);
                document.getElementById('id_village').disabled = e.target.value === "0" ? true : false;
                break;
            }
        // let url = `https://localhost:3000/data`;
        // let data = {
        //     idkey:this.state.idkey,
        //     firstname:this.state.firstname,
        //     lastname:this.state.lastname,
        //     time:this.state.time,
        //     email:this.state.email,
        //     id_province:this.state.id_province,
        //     id_district:this.state.id_district,
        //     id_subdistrict:this.state.id_subdistrict,
        //     id_village:this.state.id_village
        // }
        // axios.put(url,data)
    }
    getDateTimeFormatted = (data) => {
        const date = new Date(data);
        const resultDate = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const resultTime = date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${resultDate} ${resultTime}`;
    }
    handleClicked(){
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.idkey,
            firstname:this.state.firstname,
            lastname:this.state.lastname,
            time:this.state.time,
            email:this.state.email,
            id_province:this.state.id_province,
            id_district:this.state.id_district,
            id_subdistrict:this.state.id_subdistrict,
            id_village:this.state.id_village
        }
        axios.put(url,data)
        this.setState({
            idkey:"",
            firstname:"",
            lastname:"",
            time:"",
            email:"",
            id_province:"",
            id_district:"",
            id_subdistrict:"",
            id_village:""
        });
	this.closeModal();
        setTimeout(()=>{this.componentDidMount()},1)
    }
    render() {
        let {list} = this.state;

        return (
            <div className="App">
                <h2 className="my-4">{this.state.list.length} Users<br/></h2>
                <hr/>
                <div className="container p-3 my-3 bg-dark text-white">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Time Stamp</th>
                            <th>Email</th>
                            <th>Province</th>
                            <th>District</th>
                            <th>Sub District</th>
                            <th>Village</th>
                            </tr>
                        </thead>
                        <tbody>
                                {list.map((user) =>{
                                    return(
                                        <tr>
                                            <td>{user.id}</td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>       
                                            <td>{this.getDateTimeFormatted(user.time)}</td>
                                            <td>{user.email}</td>
                                            <td>{user.provinceName}</td>
                                            <td>{user.districtName}</td>
                                            <td>{user.subdistrictName}</td>
                                            <td>{user.villageName}</td>
                                            <td><button type="button" class="btn btn-warning" onClick={()=>this.call(user)}>Edit</button></td>
                                            <td><button type="button" class="btn btn-danger"  onClick={()=>this.onDelete(user)}>Delete</button></td>
                                            <div className="box">
                                                <Modal visible={this.state.visible}
                                                       width="1200"
                                                       height="600"
                                                       effect="fadeInUp"
                                                       onClickAway={() => this.closeModal()}
                                                >
                                                    <form className="container" id='form'>
                                                        <div className="form-group">
                                                            <h3><label htmlFor="id">ID: {this.state.idkey}<br/></label></h3>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>firstname:</label>
                                                            <input type="text" className="form-control" id="firstname" onChange={this.handleChang} value={this.state.firstname}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>lasttname:</label>
                                                            <input type="text" className="form-control" id="lastname" onChange={this.handleChang} value={this.state.lastname}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-white" >Province</label>
                                                                <select className="form-control" id="id_province" onChange={this.handleChang}>
                                                                    <option value={0}></option>
                                                                    {
                                                                        this.state.keep_province.map((item)=>{
                                                                            return(
                                                                                <option value={item.provinceId} selected={item.provinceId == this.state.id_province}>{item.provinceName}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-white"  >District</label>
                                                                <select className="form-control" id="id_district" onChange={this.handleChang}>
                                                                    <option value={0}></option>
                                                                    {
                                                                        this.state.keep_district.map((item)=>{
                                                                            return(
                                                                                <option value={item.districtId} selected={item.districtId == this.state.id_district}>{item.districtName}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-white"  >Sub-District</label>
                                                                <select className="form-control" id="id_subdistrict" onChange={this.handleChang}>
                                                                    <option value={0}></option>
                                                                    {
                                                                        this.state.keep_subdistrict.map((item)=>{
                                                                            return(
                                                                                <option value={item.subdistrictId} selected={item.subdistrictId == this.state.id_subdistrict}>{item.subdistrictName}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="text-white"  >Village</label>
                                                                <select className="form-control" id="id_village" onChange={this.handleChang}>
                                                                <option value={0}></option>
                                                                    {
                                                                        this.state.keep_village.map((item)=>{
                                                                            return(
                                                                                <option value={item.villageId} selected={item.villageId == this.state.id_village}>{item.villageName}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                        </div>
                                                        <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                                                    </form>
                                                </Modal>
                                            </div>
                                        </tr>
                                    )})}
                        </tbody>
                    </table>
                </div><br/>
            </div>
        );
    }
}
