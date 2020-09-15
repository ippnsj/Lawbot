import React,{Component} from 'react';
import './styles/Login.css';
import Lawbot from './Lawbot.png';
class register extends Component
{
    state= {
        userID: '',
        userPW: '',
        name : '',
        birthdate : '',
        email : '',
        sex : '',
        isLawyer : '',
    }
    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });
      }
    submit = () =>
    {
        var a={

        };
        a.userID=this.state.userID;
        a.userPW=this.state.userPW;
        a.name=this.state.name;
        a.birth=this.state.birthdate;
        a.email=this.state.email;
        if (this.state.sex==="남")
        {
            a.sex=0;
        }
        else if (this.state.sex==="여")
        {
            a.sex=1;
        }
        else
        {
            alert("성별을 다시 입력해주세요!");
            return;
        }
        a.isLawyer=this.state.isLawyer;
        fetch('http://localhost:8080/user/register', {
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
        alert("회원가입을 성공하셨습니다");
        window.location('/');
        }
        else
        {
        alert("이미 존재하는 아이디입니다");
        }
        })
        window.location.href="/";
    }
    render()
    {
    //    var data=this.state;
    //    var list=data.products.map(info => (<div>info</div>));
        return(
            <div className="background">
                <img className="loginimg" src={Lawbot} alt=""></img>
                <div className="registerBoard">
                <div className="password">
                <input className="registerinput" type="text" value={this.state.userID} onChange={this.handleChange} name="userID" placeholder="아이디" autoFocus="1" />
                </div>
                <div className="password">
                <input className="registerinput" type="password" value={this.state.userPW} onChange={this.handleChange} name="userPW" placeholder="비밀번호"/>
                </div>
                <div className="password">
                <input className="registerinput" type="text" value={this.state.name} onChange={this.handleChange} name="name" placeholder="이름"/>
                </div>
                <div className="password">
                <input className="registerinput" type="Date" value={this.state.birthdate} onChange={this.handleChange} name="birthdate" placeholder="생일"/>
                </div>
                <div className="password">
                <input className="registerinput" type="text" value={this.state.email} onChange={this.handleChange} name="email" placeholder="이메일 주소"/>
                </div>
                <div className="password">
                <input className="registerinput" type="text" value={this.state.sex} onChange={this.handleChange} name="sex" placeholder="남 or 여"/>
                </div>
                <div className="password">
                <input className="registerinput" type="text" value={this.state.isLawyer} onChange={this.handleChange} name="isLawyer" placeholder="변호사 여부" />
                </div>
                <button onClick={this.submit} className="register">회원가입</button>
                </div>
            </div>
        )
    }
}
export default register;