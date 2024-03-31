import React, { useEffect, useState } from 'react';
import './UserDetails.css'
import './UserDetailsResponsive.css'
import { Link, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import loadingImg from '../images/loading.gif'
import serverDown from '../images/serverDown.gif'
const UserDetails = () => {
    const location = useLocation();
    const userData = location?.state?.userData;
    const [repos, setRepos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)


    // Fetch all repositories
    useEffect(() => {
        const fetchRepos = async () => {
            try {
                let allRepos = [];
                let page = 1;
                let totalPages = 1;

                while (page <= totalPages) {
                    const response = await fetch(`${userData.repos_url}?per_page=100&page=${page}`);
                    if (!response.ok) {
                        setError(403);
                        throw new Error('Failed to fetch repositories');
                    }
                    const data = await response.json();
                    allRepos = [...allRepos, ...data];
                    // Check if the Link header contains pagination information
                    const linkHeader = response.headers.get('Link');
                    if (linkHeader) {
                        // Extract the total number of pages from the Link header
                        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                        if (match) {
                            totalPages = parseInt(match[1]);
                        }
                    } else {
                        // If Link header is not present, assume only one page
                        totalPages = 1;
                    }
                    page++;
                }

                setRepos(allRepos);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        console.log(error)

        if (userData) {
            fetchRepos();
        }
    }, [userData]);

    // Pagination configuration
    const reposPerPage = 12;
    const pageCount = Math.ceil(repos.length / reposPerPage);

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo(0, 0);
    };

    // Determine if there are more pages after the current page
    const hasNextPage = currentPage < (pageCount - 1);
    const hasPreviousPage = 0;

    // Pagination data
    const offset = currentPage * reposPerPage;
    const paginatedRepos = repos.slice(offset, offset + reposPerPage);

    return (
        <section className='user-repos-details'>
            <section className='top-section'>
                <span className='basic-detail-a'>
                    <img src={userData.avatar_url} alt='' />
                    <span>
                        <h1>{userData.name ? userData.name : "Unknown"}</h1>
                        <span>Repository count: {userData.public_repos}</span>
                    </span>
                </span>
                <span className='basic-detail-b'>{userData.bio === null ? "Empty Bio" : userData.bio}</span>
            </section>
            <section className='repos-section'>
                <h2>Repositories</h2>
                {!loading ? <div className='repo-cards'>
                    {paginatedRepos.map(repo => (
                        <div key={repo.id} className='repo-card'>
                            <span>
                                <span><b>Project:</b> {repo.name}</span>
                                <p><b>Description:</b> {repo.description == null ? "No description avialable" : repo.description}</p>
                            </span>
                            {/* Rendering topics */}
                            {repo.topics && repo.topics.length !== 0 ? (
                                <div className='topics'>
                                    <strong>Topics: </strong>
                                    <span>
                                        {repo.topics.map((topic, index) => (
                                            <span key={topic} className='topic'>{topic}{repo.topics.length !== index + 1 && ", "}</span>
                                        ))}
                                    </span>
                                </div>
                            ) : (
                                <div className='topics'>
                                    <strong>Topics: </strong>
                                    <span className='topic'>No topic mentioned</span>
                                </div>
                            )}
                            <Link to={`${repo.name}`} state={{ repoData: repo }} className='documentation-btn'>Create Documentation</Link>
                        </div>
                    ))}
                </div> :
                    (<div className='loading-box'>
                        <img src={loadingImg} alt='loading...' className='loading-img' />
                    </div>)}
                {error && <img className='server-down-img' src={serverDown} alt='server-down' />}
                {error && <p className='server-down-text'>Server facing problem, try after some time</p>}
                {/* Pagination component */}
                {!loading && <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageChange}
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    disabledClassName={'disabled'}
                    previousLinkClassName={!hasPreviousPage ? 'disabled' : ''}
                    nextLinkClassName={!hasNextPage ? 'disabled' : ''}
                />}
            </section>
        </section>
    );
};

export default UserDetails;
