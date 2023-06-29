
import React, {useEffect, useState} from 'react'
import {auth, googleProvider, db} from "../config/firebase";
import { getDocs, collection, addDoc, doc , deleteDoc, updateDoc} from "firebase/firestore";

import {createUserWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth"; //CHOSSING FROM EITHER GOOGLE OR EMAIL OR ANYTHINF

function Auth(){

    //TO CHANGE
 
 
  

    //FOR MOVIE

    const [movieList, setMovieList] = useState([])

    const moviesCollectionRef = collection(db, "movies")
    const getMovieList = async()=>{
        try {
       const data = await getDocs(moviesCollectionRef);
       const filteredData = data.docs.map((doc) => ({...doc.data(), id:doc.id}));
       setMovieList(filteredData);
        } catch(err){
            console.error(err);
        }
    };

    useEffect(() =>{
     
        getMovieList();
    }, []);

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    //FOR MOVIE STATES
    const [ updatedTitle , setUpdatedTitle] = useState("");
    const[movieTitle, setMovieTitle] = useState("");
    const[releaseDate, setReleaseDate] = useState(0);
    const[isMovieOscar, setIsMovieOscar] = useState(false);

    //DELETE MOVIE
    const deleteMovie = async(id) =>{
        const movieDoc = doc(db, "movies", id)
        await deleteDoc(movieDoc);

    };
    //UPDATE MOVIE
  

    //NOW WRITING IT IN THE INPUT AND SUBMITTING THEN THE MOVIE HEADING CHANGES
    
   const updatedMovieTitle = async(id) => {
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc, {title: updatedTitle})
   }


   
   
    function writeP(event){
        setPassword(event.target.value);
}



    //FUNCTION IS CALLED WHENEVER WE CLICKED A BUTTON
    const singIn= async () => {
        try {
       await createUserWithEmailAndPassword(auth, email, password);
        } catch(err){
            console.error(err);
        }
    };

  const singInWithGoogle = async() =>{
    try{
    await signInWithPopup(auth, googleProvider)
    } catch(err){
        console.error(err);
    }
  }
  const logout = async() =>{
    try{
    await signOut (auth)
    } catch(err){
        console.error(err);
    }
  }


  const onSubmitMovie = async() =>{
    try{
        await addDoc(moviesCollectionRef, {title: movieTitle, releaseDate: releaseDate, receivedAnOscar: isMovieOscar})
        getMovieList();
    } catch(err){
        console.error(err);
    }
  }


  return (
    <div>
      <h1>Authentication</h1>
      <input onChange = {(e) => setEmail(e.target.value)} type = "text" placeholder='email' />
      <input onChange = {writeP} value = {password} type = "password" placeholder='password'/>
      <button onClick={singIn}>SIGN IN</button>
      <button onClick={singInWithGoogle}>SIGN IN WITH GOOGLE</button>
      <button onClick = {logout}>LOG OUT</button>
     <div>
   
     {movieList.map((movie) => (
  <div key={movie.id}>
   
      <div>
      
        <h1 style={{ color: movie.receivedAnOscar ? "green" : "red"}} >
          {movie.title}
        </h1>
        <p>Date: {movie.releaseDate}</p>
        <button onClick={() => deleteMovie(movie.id)}>DELETE MOVIE</button>
        <input onChange={(e) => setUpdatedTitle(e.target.value)} type="name" />
        <button onClick = {() => updatedMovieTitle(movie.id)}>Update title</button>
      </div>
   
  </div>
))}
</div>

    
     <div>
        <input onChange = {(e) => setMovieTitle(e.target.value)}placeholder='Movie title..'/>
        <input onChange = {(e) => setReleaseDate(e.target.value)}placeholder='Release Date..' type = "number"/>
        <input onChange = {(e) => setIsMovieOscar(e.target.checked)} type = "checkbox" checked = {isMovieOscar}/>
        <label>Received an Oscar</label>
        <button onClick = {onSubmitMovie}>SUBMIT MOVIE</button>
     </div>
    </div>
  )};

export default Auth;

















import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBsi9_duk_z13jcujrBCbXA5cB77ZD4nvc",
  authDomain: "clone-31dad.firebaseapp.com",
  projectId: "clone-31dad",
  storageBucket: "clone-31dad.appspot.com",
  messagingSenderId: "83259407541",
  appId: "1:83259407541:web:f40d0f668661833dc452fc",
  measurementId: "G-80FLVKMK54"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
