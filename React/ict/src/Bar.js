//This component is a bar which is displayed at the top of hompage
import React,{Component} from 'react';
import './styles/Bar.css';
class Bar extends Component{
    
    render()
    {
        return(
            <div className="top">
                <div className="logo"> LAWBOT</div>
                <ul>
                    <li className="list">
                        <a href="/analyze" className="link">유사판례분석</a></li>
                    <li className="list">
                    <a href="/qna" className="link">법률 QnA</a>
                    </li>
                    <li className="list">
                    <a href="/interpret" className="link">법률문서해석</a>
                    </li>
                    <li className="list">
                    <a href="/boards" className="link">게시판</a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Bar;