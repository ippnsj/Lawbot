//This component is a bar which is displayed at the top of hompage
import React,{Component} from 'react';

class New extends Component{
    postsubmit = () =>
    {
        var a={

        };
        var e = document.getElementById("boardCategory");
        a.boardCategory= parseInt(e.options[e.selectedIndex].value);
        a.title=document.getElementById("title").value;
        a.content=document.getElementById("content").value;
        a.userID=document.cookie.split("=")[1];
        var today=new Date();
        a.writtenDate=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        console.log(a);
    
        fetch('http://localhost:8080/boards/write', {
            method: "POST",
            headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(a),
        })
        .then(response => response.json())
        .then(data => {

        })
        alert("글 작성이 완료되었습니다.");
        window.location.href="/boards?category=0";
    }
    render()
    {
        return(
            <div>
            <div id="categoryselect" className="inline-block relative w-64">
            <select id="boardCategory" className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="1">로봇 후기 게시판</option>
            <option value="2">재판후기 게시판</option>
            <option value="3">자유게시판</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
            </div>
            <div className="w-full">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" form="title">
            제목
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="제목"/>
            </div>
            <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" form="content">
            내용
      </label>
      <textarea className="shadow appearance-none rounded h-64 w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="content" type="text" placeholder="글을 작성해주세요"/>
    </div>
    <button type="button" onClick={this.postsubmit} className="bg-red-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ">
                        글쓰기
                        </button>
            </form>
            </div>
            </div>
        );
    }
}

export default New;