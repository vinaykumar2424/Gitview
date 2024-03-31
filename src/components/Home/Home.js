import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import './Home.css';
import './HomeResponsive.css';
import banner from '../images/banner.jpg';
import React, { useEffect, useRef, useState } from 'react';
import homeImg from '../images/homeImg4.png'
import Loading from '../images/serverDown.gif'
const Home = () => {

    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const historyRef = useRef(null)


    // storing the hisotry into the localhost
    useEffect(() => {
        const storedHistory = localStorage.getItem('searchHistory');
        if (storedHistory) {
            setSearchHistory(JSON.parse(storedHistory));
        }
    }, []);


    // getting the form data
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const userResponse = await fetch(`https://api.github.com/users/${username}`);

            if (!userResponse.ok) {
                throw new Error('User not found');
            }

            const userData = await userResponse.json();
            console.log("userData:", userData)
            setUserData({
                ...userData,
            });
            setError(null);

            const isDuplicate = searchHistory.some(item => item.prevUserData?.id === userData.id);
            if (!isDuplicate) {
                const updatedHistory = [{ prevUserData: userData }, ...searchHistory.slice(0, 4)];
                setSearchHistory(updatedHistory);
                localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            }
        } catch (error) {
            setError(error.message);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleHistory = () => {
        const history = document.querySelector('.history');
        history.classList.toggle('toggle-history');
    };
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (!historyRef?.current?.contains(event.target)) {
    //             historyRef.current.classList.remove('toggle-history');
    //             // historyRef.current.classList.remove('ActiveToggleArrowSelectionBox');
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    // }, [historyRef]);
    // console.log(userData)


    return (
        <>
            <div id="home">
                {/* <video className='video-bg' autoPlay loop muted>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video> */}
                <nav>
                    <img src={logo} alt="" />
                    <span onClick={toggleHistory}>History</span>
                    <ul className='history' ref={historyRef}>
                        {searchHistory.map((item, index) => (
                            <li key={index} >
                                <Link to={`/user-details`} state={{ userData: item.prevUserData }}>
                                    <img src={item.prevUserData.avatar_url} alt="User Avatar" />
                                    {item.prevUserData.login}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className='sections'>
                    <section id="main">
                        <span>Discover GitHub like never before with <span>GitView</span></span>
                        <span>GitView is a web application that automates the process of generating documentation for GitHub repositories. Built with React.js and integrated with the OpenAI API, GitView analyzes code files and READMEs to generate comprehensive documentation effortlessly.</span>
                        <section id="search-bar">
                            <form className='input-form' onSubmit={handleSubmit}>
                                <input type='text' placeholder='Github username...'
                                    value={username.trim()}
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                                <button type="submit">
                                    Search
                                </button>
                            </form>
                        </section>
                    </section>
                    {!loading && userData ? (
                        <section id="result-section">
                            <div className='banner-div'>
                                <img src={banner} alt="Avatar" />
                            </div>
                            <div className='user-name-repo'>
                                <img src={userData.avatar_url} alt="Avatar" />
                                <span>{userData.name}</span>
                                <div className='user-bio'>{userData.bio === null ? "Empty Bio" : userData.bio}</div>
                            </div>
                            <div className='other-details'>
                                <span>
                                    <span>{userData.followers}</span>
                                    <span>followers</span>
                                </span>
                                <span>
                                    <span>{userData.public_repos}</span>
                                    <span>Repos</span>
                                </span>
                                <span>
                                    <span>{userData.following}</span>
                                    <span>followings</span>
                                </span>
                            </div>
                            <Link className='go-to-btn' to="/user-details" state={{ userData: userData }}>
                                Go to Profile
                            </Link>
                        </section>
                    ) : (
                        <section className='home-img'>
                            {!loading && !error && <img src={homeImg} alt='loading...' className='loading-img' />}
                            {loading && <img src={Loading} alt='loading...' className='loading-img' />}
                            {!loading && error && <p>{error}</p>}
                        </section>
                    )}
                </div>

            </div>
        </>
    )
}
export default Home;