//This component is a bar which is displayed at the top of hompage
import React,{Component} from 'react';
import './styles/tailwind.css';
class postdetail extends Component{
    state={
        post:[],
        user:[]
    }
    postdelete= () =>{
        fetch('http://localhost:8080/boards/'+this.props.location.pathname.split("/")[2],{
            method: "DELETE"
        })
        .then(response => response.json())
        .then((data)=>
        {    
            console.log("글 삭제가 완료되었습니다!");
        });
        window.location.href="/boards";
    }
    componentDidMount(){
      //  console.log(this.props.location.pathname.split("/")[2]);
        fetch('http://localhost:8080/boards/'+this.props.location.pathname.split("/")[2])
        .then(response => response.json())
        .then((data)=>
        {
            console.log(data);

            this.setState({post : data});
            fetch('http://localhost:8080/boards/'+this.props.location.pathname.split("/")[2])
            .then(response => response.json())
            .then((data)=>
            {    
                this.setState({post : data});
                fetch('http://localhost:8080/user/'+data.userID)
                .then(response => response.json())
                .then((data)=>
                {    
                    console.log(data);
                    this.setState({user : data});
        
                });
            });
        });
    }
    render()
    {
        return(
            <div>
            <div id="categoryselect" className="inline-block relative w-64">
            </div>
            <div className="w-full">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
            <div className="font-bold appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="제목">{this.state.post.title}</div>
            <div className="appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="제목">{this.state.post.content}</div>
            </div>
            
    <button type="button" onClick={this.postdelete} className="ml-3 bg-red-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ">
                        삭제하기
                        </button>
            </div>
            </div>
            </div>
        );
    }
}

export default postdetail;