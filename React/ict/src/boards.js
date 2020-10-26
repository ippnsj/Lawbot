//This component is a bar which is displayed at the top of hompage
import React,{Component} from 'react';
import './styles/boards.css';
import './styles/tailwind.css';
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import New from "./new.js";
import Posts from "./posts.js";
import Postdetail from './postdetail.js';
class Boards extends Component{
    write = () =>{
        window.location.href="/boards/write";
    }
    render()
    {
        return(
            <div>
                <div className="boardsBar">
                    <ul className="boardul">
                        <li className="boardlist">
                            <a className="boardscategory" href="/boards?category=0">전체</a></li>
                        <li className="boardlist">
                            <a className="boardscategory" href="/boards?category=1">어플후기 게시판</a></li>
                        <li className="boardlist">
                            <a className="boardscategory" href="/boards?category=2">재판후기 게시판</a></li>
                        <li className="boardlist">
                            <a className="boardscategory" href="/boards?category=3">자유게시판</a></li>
                    </ul>
                </div>
                <div className="background h-auto pb-3">
                    <div className="boardscenter">
                    <Router>
                        <Switch>
                        <Route exact path="/boards">
                        <button onClick={this.write} className="bg-red-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
                        글쓰기
                        </button>
                        <Posts/>
                        </Route>
                        <Route path="/boards/write">
                            <New/>
                        </Route>
                        <Route path="/boards/:id" component={Postdetail}/>
                        </Switch>
                    </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export default Boards;