import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react'
import Post from '../../components/PostComponent/Post';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';

export default function SearchPosts() {

    const [course, setCourse] = useState('');
    const [text, setText] = useState('');
    const [postType, setPostType] = useState('');
    const [courseOptions, setCourseOptions] = useState([]);

    const [posts, setPosts] = useState([]);


    useEffect(() => {
        fetchCourses();
    }, []);

    const onFilterResults = () => {
        const filters = { courseId: course, text, postType }
        httpService.postRequest(URLS.SEARCH_POSTS, filters, false, true, false).subscribe(p => {
            setPosts(p);
        })
    }

    const fetchCourses = async () => {
        const cOptions = await miscService.getCourseOptions();
        setCourseOptions(cOptions);
    }

    return (
        <div className="search-posts-component">

            <div className="row filters-row">
                {/* text, course, type */}

                <div className="col-md-3">
                    <div className="form-group p-float-label">
                        <InputText
                            value={text}
                            type="text"
                            required
                            id="text"
                            className="form-control single-control"
                            onChange={(e) => {
                                setText(e.target.value);
                            }}
                        />
                        <label htmlFor="text">Search Text</label>
                    </div>
                </div>

                <div className="col-md-3">

                    <div className="form-group p-float-label">
                        <Dropdown
                            value={course}
                            required
                            showClear
                            options={courseOptions}
                            className="form-cotntrol single-control"
                            id="distance"
                            onChange={(e) => {
                                setCourse(e.target.value);
                            }}
                        />
                        <label htmlFor="distance">Distance</label>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group p-float-label">
                        <Dropdown
                            value={postType}
                            required
                            showClear
                            options={courseOptions}
                            className="form-cotntrol single-control"
                            id="distance"
                            onChange={(e) => {
                                setPostType(e.target.value);
                            }}
                        />
                        <label htmlFor="distance">Distance</label>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <button onClick={onFilterResults} className="btn btn-primary fw">
                            Search
                        </button>
                    </div>
                </div>


            </div>

            <div className="row results-row">
                {
                    posts.map(p => {
                        return <Post fetchPosts={onFilterResults} post={p} />
                    })
                }
            </div>


        </div>
    )
}
