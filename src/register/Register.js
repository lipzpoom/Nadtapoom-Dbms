import React, {Component} from "react";
import axios from "axios";
import {ip,port} from "../setIP/setting";
import { useHistory } from 'react-router-dom';

 class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            idkey:"",
            firstname:"",
            lastname:"",
            email:"",
            keep_province:[],
            keep_district:[],
            keep_subdistrict:[],
            keep_village:[],
            id_province:"",
            id_district:"",
            id_subdistrict:"",
            id_village:""
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
    }
    componentDidMount(){
        document.getElementById('id_district').disabled = true;
        document.getElementById('id_subdistrict').disabled = true;
        document.getElementById('id_village').disabled = true;

        this.listprovince();
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
    }
    handleClicked(){
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.idkey,
            firstname:this.state.firstname,
            lastname:this.state.lastname,
            email: localStorage.getItem('email'),
            id_province:this.state.id_province,
            id_district:this.state.id_district,
            id_subdistrict:this.state.id_subdistrict,
            id_village:this.state.id_village
        }
        axios.post(url,data)
        this.setState({
            idkey:"",
            firstname:"",
            lastname:"",
            email:"",
            id_province:"",
            id_district:"",
            id_subdistrict:"",
            id_village:""
        });
        this.props.history.push('/Showdata');
    
    }
    render() {
        return(
            <div>
                <div className="App">
                <h2 className="my-4">Register<br/></h2>
                    <hr/>
                </div>
                <form className="container">
                <div className="form-group">
                        <label className="text-white" >ID</label>
                        <input type="text" className="form-control" id="idkey" onChange={this.handleChang} value={this.state.idkey}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white" >First Name</label>
                        <input type="text" className="form-control" id="firstname" onChange={this.handleChang} value={this.state.firstname}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >Last Name</label>
                        <input type="text" className="form-control" id="lastname" onChange={this.handleChang} value={this.state.lastname}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white" >Province</label>
                            <select className="form-control" id="id_province" onChange={this.handleChang}>
                                <option value={0}></option>
                                {
                                    this.state.keep_province.map((item)=>{
                                        return(
                                            <option value={item.provinceId}>{item.provinceName}</option>
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
                                            <option value={item.districtId}>{item.districtName}</option>
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
                                            <option value={item.subdistrictId}>{item.subdistrictName}</option>
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
                                            <option value={item.villageId}>{item.villageName}</option>
                                        )
                                    })
                                }
                            </select>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                </form>
            </div>
        );
    }
}
export default function WithRouter(props) {
    const history = useHistory();
    return (<Register {...props} history={history}/>);
  }