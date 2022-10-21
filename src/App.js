import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

  const ids = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
  const url = `https://jsonplaceholder.typicode.com/posts/`;

  const [ posts, setPosts ] = useState([]);

  const [ alternative, setAlternative ] = useState(3);
  const [loading , setLoading] = useState(true);

  const getPosts = async (id) => {
    const response = await fetch(`${url}${id}`);
    const post = await response.json();
    return post;
  }

  useEffect(() => {
    const fetchData = async () => {
      if(alternative === 0) {
        for(let i = 0; i < ids.length; i++) {
          getPosts(ids[i]).then(post => {
            console.log(i);
            setPosts(posts => [...posts, post]);
            setLoading(false);
          });        
        }
        console.log('done for loop');
      } else if (alternative === 1) {
        ids.forEach(id => {
          getPosts(id).then(post => {
            setPosts(posts => [...posts, post]);
            setLoading(false);
          });         
        })   
        console.log('done forEach');   
      } else if(alternative === 2) {
        console.log(ids);
        ids.forEach(async id => {
          const post = await getPosts(id);
          setPosts(posts => [...posts, post]);
          setLoading(false); 
          console.log('done for await getPosts');
        
        })
        console.log('done forEach async');   
      } else if(alternative === 3) {
        // await form
        (async () => {
          const promises = ids.map(id => getPosts(id));
          const posts = await Promise.all(promises);
          setPosts(posts);
          setLoading(false);
          console.log('done for await Promise.all');
        })()
      } else if(alternative === 4) {
        const promises = ids.map(id => getPosts(id));
        Promise.all(promises).then(posts => { 
          setPosts(posts);
          setLoading(false);
        });
        console.log('done for then Promise.all');  
      }
    }
    console.log('before fetchData');
    fetchData();   
  }, [alternative]);


  const displayPosts = (posts) => {
    const items = posts.map((post) => {
      return <li key={React.key}>{post.id} - {post.title}</li>;
    });
    return (
      <div key={React.key} >
        {items}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header"> 
      {
        loading ? <h1>Loading...</h1> : displayPosts(posts)
      }            
      </header>
    </div>
  );
}

export default App;
