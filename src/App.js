import React, { Component } from 'react';
import Loader from 'react-loader-spinner'

import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.searchInput = React.createRef();
    this.repoInput = React.createRef();
    this.followersInput = React.createRef();
    this.dBottom  = React.createRef();
    this.state={
      results: [],
      limet:10,
      currentUser:{},
      repo:0,
      followers:0,
      isLoading:false,
      msg:'Type user name and select repo and followers numbers'
    }
  }

  getRrsult=()=>{
    this.setState({isLoading: true,limet:10})
    const searchWord=this.searchInput.current.value.trim();
    const app=this;
    if(searchWord.length===0){
      app.setState({results:{},isLoading: false,msg:'Type user name and select repo and followers numbers'});
      return;
    };
    axios.get(`https://api.github.com/search/users?q=${searchWord}repos:%3E${this.state.repo}+followers:%3E${this.state.followers}&per_page=100`)
    .then(function (response) {
     
      response.data.items.length>0?
      app.setState({results:response.data.items,isLoading: false}):
      app.setState({results:{},isLoading: false,msg:'No result try again!!'});
    })
    .catch(function (error) {
      alert('Api error show Console !!');
      console.log(error);
    });

  }
  getMoreResult=()=>{
    this.setState({limet:this.state.limet+8});
    this.dBottom.current.scrollIntoView({ behavior: 'smooth' });

  }
  getUserData=(u)=>{
    const app=this;
    axios.get(u.url)
    .then(function (response) {
      const currentUser=response.data;
      app.setState({currentUser});
    })
    .catch(function (error) {
      alert('Api error show Console !!');
      console.log(error);
    });
  }
  handelRepoInput=()=>{
    const repo=this.repoInput.current.valueAsNumber;
    this.setState({repo});
  }
  handelFollowersInput=()=>{
    const followers=this.followersInput.current.valueAsNumber;
    this.setState({followers});
  }
  handelSearchEnterPress=(event)=>{
    if(event.key === 'Enter'){
      this.getRrsult();
    }
    
  }
  showUserProfile=()=>{
    const u=this.state.currentUser;
    if(Object.keys(u).length === 0) return '';

    return(
      <div className='user-card'>
        <img src={u.avatar_url} alt="" />
        <div className='user-card-data'>
          <h2 className='closeBtn'><a href='' onClick={(e)=>{e.preventDefault();this.setState({currentUser:{}})}}>X</a> </h2>
          <h2>Name : {u.name} ({u.login})</h2>
          <p>
            <span className='data-item'><span className='title'>Created at: </span>{(new Date(u.created_at)).toDateString()}</span>
            <span className='data-item'><span className='title'>User type: </span>{u.type || '<unknown>'}</span>
            <span className='data-item'><span className='title'>Public repositories: </span>{u.public_repos || '<unknown>'}</span>
            <span className='data-item'><span className='title'>Followers: </span>{u.followers || '<unknown>'}</span>
            <span className='data-item'><span className='title'>Following: </span>{u.following || '<unknown>'}</span>
            <span className='data-item'><span className='title'>Location: </span>{u.location || '<unknown>'}</span>
            <span className='data-item'><span className='title'>Company: </span>{u.company || '<unknown>'}</span>
            

          </p>
          <a href={u.html_url} target="_blank">open github Account</a>
        </div>
      </div>
    );
  }

  componentDidUpdate=(prevProp,prevState)=>{
    if(this.state.limet>prevState.limet)
     this.dBottom.current.scrollIntoView({ behavior: 'smooth', block: "end" });
  }
  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Github Users-search App </h1>
          User name :<input type="text" ref={this.searchInput} onKeyPress={this.handelSearchEnterPress}/>
          Repo: <input type="number" defaultValue={0} min={0} ref={this.repoInput} onChange={this.handelRepoInput}/>
          Followers: <input type="number" defaultValue={0} min={0}  ref={this.followersInput} onChange={this.handelFollowersInput}/>
          <button type="button" defaultValue="Submit" onClick={this.getRrsult}>search</button>
        </header>
        <div className="App-results">
          {this.state.isLoading?
            <Loader type="Oval" color="#333" height={80} width={80}/>
            :
            (()=>{
              if(this.state.results && this.state.results.length>0){
                let limet=this.state.limet;
                return [
                  this.state.results.slice(0,limet).map((r,i)=>
                    <div className='App-results-Item' key={i} >
                      <img src={r.avatar_url} alt="" />
                      <h3>{r.login}</h3>
                      <button type='button' onClick={()=>{this.getUserData(r)}}>show Profile</button>
                    </div>
                  ),
                  (
                      <div className='buttonRow' key='btn'>
                        <button type='button' style={{display:this.state.limet>=this.state.results.length?'none':'block'}} onClick={this.getMoreResult}>show more result</button>
                        
                      </div>
                  )
                ]
              }
              else{
                return this.state.msg
              }
            })()
          }
        </div>
        <div className='userProfile'>
          {this.showUserProfile()}
        </div>
        
          <div className='dBottom' ref={this.dBottom}/>
      </div>
    );
  }
}

export default App;
