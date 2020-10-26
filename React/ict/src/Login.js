//This component is a bar which is displayed at the top of hompage
import Lawbot from './Lawbot.png';
import React,{Component} from 'react';
import './styles/Login.css';
class Login extends Component{
    state= {
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });
      }
    submit = () =>{
        var a={

        };
        a.userID=this.state.email;
        a.userPW=this.state.password;
 //       console.log("hi");
 fetch('http://localhost:8080/user/login', {
    method: "POST",
    headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(a),
})
.then(response => response.json())
.then(data => {
    //console.log(data);
if (data.success===true)
{
    document.cookie="user="+data.id;
alert("로그인 되었습니다.");
window.location='/';
//process.env.REACT_APP_USER="YES";
}
else
{
alert("아이디가 존재하지 않거나 패스워드가 일치하지 않습니다.");
}
})
    }
    render()
    {
        return(
            <div className="background">  
                <img className="loginimg" src={Lawbot} alt=""></img>
                <div className="loginBoard">
                <div className="password">
                <input className="registerinput" type="text" value={this.state.email} onChange={this.handleChange} name="email" placeholder="이메일 또는 전화번호" autoFocus="1" />
                </div>
                <div className="password">
                <input className="registerinput" type="password" value={this.state.password} onChange={this.handleChange} name="password" placeholder="비밀번호" autoFocus="2" />
                </div>
                <button className="submit" onClick={this.submit}>로그인</button>
                <a href="/register" className="register">회원가입</a>
                </div>
            </div>
        );
    }
}

export default Login;