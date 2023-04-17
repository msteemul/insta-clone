import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const [userProfile, setProfile] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'UPDATE',
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem('user', JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        console.log(data);
      });
  };

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'UPDATE',
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem('user', JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: { ...prevState.user, followers: newFollower },
          };
        });
        console.log(data);
      });
  };
  return (
    <>
      {userProfile.user ? (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '18px 0px',
              borderBottom: '1px solid grey',
            }}
          >
            <div>
              <img
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                }}
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6> {userProfile.user.following.length} followings</h6>
              </div>
              <div
                style={{
                  padding: '10px',
                  alignSelf: 'center',
                  justifySelf: 'center',
                }}
              >
                {userProfile.user.followers.includes(state._id) ? (
                  <a
                    style={{ borderRadius: '80px', minWidth: '250px' }}
                    className="waves-effect waves-light btn-small"
                    onClick={() => unfollowUser()}
                  >
                    <i className="material-icons left">add</i>unfollow
                  </a>
                ) : (
                  <a
                    style={{ borderRadius: '80px', minWidth: '250px' }}
                    className="waves-effect waves-light btn-small"
                    onClick={() => followUser()}
                  >
                    <i className="material-icons left">add</i>follow
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt="item.title"
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
}

export default UserProfile;
