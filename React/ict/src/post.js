//This component is a bar which is displayed at the top of hompage
import React,{Component} from 'react';
import './styles/tailwind.css';
class post extends Component{
    state={
        posts:[]
    }
    locate = ()=>{
      //  console.log(window.location.search.split('?category='));
        window.location.href="/boards/"+this.props.post.postID;
    }
    render()
    {
        if ((window.location.search.split('?category=')[1]==="0") || (parseInt(window.location.search.split('?category=')[1])===this.props.post.boardCategory) || (window.location.search===""))
        {
            return(
                <div onClick={this.locate}className="border-2 h-24 bg-white rounded-none">
                    <div className="ml-5 mt-3 font-bold">
                    {this.props.post.title}
                    </div>
                    <div className="w-10/12 ml-5 mt-1 pr-5 overflow-hidden">
                    {this.props.post.content}
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div></div>
            );
        }

    }
}

export default post;