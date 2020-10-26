//This component is a bar which is displayed at the top of hompage
import React,{Component} from 'react';
import Posting from './post.js';
class posts extends Component{
    state={
        posts:[]
    }
    componentDidMount(){
        fetch('http://localhost:8080/boards/posts',{
            method: "GET",
            headers: {
        'Content-Type': 'application/json',
        }})
        .then(response => response.json())
        .then((data)=>
        {
            console.log(data);

            this.setState({posts : data});
            console.log(this.state.posts[0]);
        })
    }
    render()
    {
        return(
            <div>
                <ul>
                {this.state.posts.map((post) => (
                    <Posting key={post.postID} post={post}/>
                ))}
                </ul>

            </div>
        );
    }
}

export default posts;