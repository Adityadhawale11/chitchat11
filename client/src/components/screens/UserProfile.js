import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'

const Profile=()=>{
    const[userProfile,setProfile]=useState(null)
    
    const{state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    const[showfollow,setShowfollow]=useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")

           }
        }).then(res=>res.json())
        .then(result=>{
          //console.log(result)
          
          setProfile(result)
        })

    },[])

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")

            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{...prevState.user,
                    followers:[...prevState.user.followers,data._id]}
                }
            })
            setShowfollow(false)
        })
    }
    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")

            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState)=>{
                const newfollower=prevState.user.followers.filter(item=>item !== data._id)
                return{
                    ...prevState,
                    user:{...prevState.user,
                    followers:newfollower}
                }
            })
            setShowfollow(true)
        })
    }
    return(
        <>
        {userProfile?
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{
            display:"flex",
            justifyContent:"space-around",
            margin:"18px 0px",
            borderBottom:"1px solid grey"
        }}>
            <div>
               <img style={{width:"80px",height:"80px",borderRadius:"40px"}}
               src={userProfile.user.pic}
               />

            </div>
            <div>
               <h5>{userProfile.user.name}</h5>
               <h6>{userProfile.user.email}</h6>
               <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                   <h6>{userProfile.posts.length} posts</h6>
                   <h6>{userProfile.user.followers.length} followers</h6>
                   <h6>{userProfile.user.following.length} following</h6>
               </div>
               {showfollow?
               <button style={{
                   margin:"10px"
               }}className="btn waves-effect  #64b5f6 blue darken-1"
               onClick={()=>followUser()}>
                   Follow
               
                  </button>
                  :
                  <button style={{
                    margin:"10px"
                }} className="btn waves-effect  #64b5f6 blue darken-1"
                  onClick={()=>unfollowUser()}>
                      UnFollow
                  
                     </button>
               }
               
                 
            </div>
        </div>
        <div>
        <div className="gallery">
           {
                userProfile.posts.map(item=>{
                    return(<img key={item._id} className="item" src={item.photo} alt={item.title}/>)
                })

            }
           
          
            
            
           
        </div>
        <ul>
            
        </ul>
        </div>
   
    </div>
        
        
        
        :<h2>loading...</h2>}
       
       </>
    )
}

export default Profile