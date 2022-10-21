import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

  const ids = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
  const alternativeOpc = [
    {  alternative: 0,  tile: 'for loop'  },
    {  alternative: 1,  tile: 'for of loop'  },
    {  alternative: 2,  tile: 'for forEach'  },
    {  alternative: 3,  tile: 'for await'  },
    {  alternative: 4,  tile: 'for await Promise.all'}, 
    {  alternative: 5,  tile: 'for then Promise.all'},
    {  alternative: 6,  tile: 'for getPostSerialized'}
  ];

  const url = `https://jsonplaceholder.typicode.com/posts/`;

  const [ posts, setPosts ] = useState([]);

  const [ alternative, setAlternative ] = useState(0);
  const [loading , setLoading] = useState(true);

  const getPosts = async (id) => {
    const response = await fetch(`${url}${id}`);
    const post = await response.json();
    return post;
  }

  const getPostSerialized = async (ids) => {
    await ids.reduce(async (promise, id) => {
      await promise;
      const post = await getPosts(id);
      setPosts(posts => [...posts, post]);
    }, Promise.resolve());
    console.log("I'll wait on you");
    setLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      setPosts([])
      if(alternative === 0) {
        for(let i = 0; i < ids.length; i++) {
          getPosts(ids[i]).then(post => {
            console.log(i);
            setPosts(posts => [...posts, post]);
            setLoading(false);
          });        
        }
        console.log('done for loop');
      } else if(alternative === 1) {
        for( const id of ids) {
          const data = await getPosts(id);
          setPosts(posts => [...posts, data]);
          setLoading(false);
        }
        console.log('done for of loop');
      }      
       else if (alternative === 2) {
        ids.forEach(id => {
          getPosts(id).then(post => {
            setPosts(posts => [...posts, post]);
            setLoading(false);
          });         
        })   
        console.log('done forEach');   
      } else if(alternative === 3) {
        ids.forEach(async id => {
          const post = await getPosts(id);
          setPosts(posts => [...posts, post]);
          setLoading(false); 
          console.log('done for await getPosts');
        
        })
        console.log('done forEach async');   
      } else if(alternative === 4) {
        // await form
        (async () => {
          const promises = ids.map(id => getPosts(id));
          const posts = await Promise.all(promises);
          setPosts(posts);
          setLoading(false);
          console.log('done for await Promise.all');
        })()
      } else if(alternative === 5) {
        const promises = ids.map(id => getPosts(id));
        Promise.all(promises).then(posts => { 
          setPosts(posts);
          setLoading(false);
        });
        console.log('done for then Promise.all');  
      } else if(alternative === 6) {
        getPostSerialized(ids);
        console.log('done for getPostSerialized');  
      }
    }
    console.log('before fetchData');
    fetchData();   
  }, [alternative]);


  const displayPosts = (posts) => {
    const items = posts.map((post) => {
      return <li style={{ margin: 0, padding: 0}} key={post.id}>ID {post.id} - TITLE : {post.title}</li>;
    });
    return (
      <div key={React.key}  >
        <ul style={{ margin: 0, padding: 0}}>{items}</ul>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header"> 
      {
        alternativeOpc.map((opc) =>{
          return <button key={React.key} onClick={()=> setAlternative(opc.alternative)}>{opc.tile}</button>
        })
      }
      {
        loading ? <h1>Loading...</h1> : displayPosts(posts)
      }            
      </header>
    </div>
  );
}

export default App;
