import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react'
import Post from '../../components/PostComponent/Post';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
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
        const filters = {}
        if (text && text !== '') {
            filters.textFilter = text;
        }
        if (course && course !== '') {
            filters.courseFilter = course;
        }
        if (postType && postType !== '') {
            filters.typeFilter = postType;
        }
        httpService.getRequest(URLS.POST, filters, false, true, false).subscribe(p => {
            setPosts(p);
        })
    }

    const fetchCourses = async () => {
        const cOptions = await miscService.getCourseOptions();
        setCourseOptions(cOptions);
    }

    return (
        <div className="search-posts-component">

            <div className="row filters-row text-left">
                {/* text, course, type */}

                <div className="col-md-3">
                    <div className="form-group p-float-label">
                        <InputText
                            value={text}
                            type="text"
                            required
                            style={{ padding: '9px' }}
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
                        <label htmlFor="distance">Course</label>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group p-float-label">
                        <Dropdown
                            value={postType}
                            required
                            showClear
                            options={CONSTANTS.POST_TYPES}
                            className="form-cotntrol single-control"
                            id="distance"
                            onChange={(e) => {
                                setPostType(e.target.value);
                            }}
                        />
                        <label htmlFor="distance">Type</label>
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
