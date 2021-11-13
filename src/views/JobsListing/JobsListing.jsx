import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import JobItem from '../../components/JobItem/JobItem';
import CONSTANTS from '../../constants/constants';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

function JobsListing() {

    const [jobs, setJobs] = useState([]);

    const [nameFilter, setNameFilter] = useState('');
    const [budgetFilter, setBudgetFilter] = useState(0);
    const [typeFilter, setTypeFilter] = useState();

    const description = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

    useEffect(() => {
        fetchJobs();
    }, []);

    const JOB_TYPES = [
        { label: 'Assignment Help', value: 'A' },
        { label: 'Project Help', value: 'P' },
        { label: 'Others', value: 'O' },
    ];

    const fetchJobs = () => {

        const jobs = [
            { title: 'React Assignment', budget: 50, type: 'O', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'A', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'O', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'O', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'P', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'O', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'O', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
            { title: 'React Assignment', budget: 50, type: 'A', description, postedBy: userService.getLoggedInUser(), createdOn: new Date(), deadline: new Date() },
        ];

        jobs.forEach(j => {
            j.wrappedDesc = j.description?.length < 180 ? j.description : j.description?.substring(0, 180) + '...';
            j.createdOnFormatted = miscService.getFormattedDate(j.createdOn, true);
            j.deadlineFormatted = miscService.getFormattedDate(j.deadline, true);
            j.typeName = CONSTANTS.JOB_TYPES[j.type] ?? CONSTANTS.JOB_TYPES['O'];
        });

        setJobs(jobs);
    };

    const AddJobFloatingButton = () => {
        return (
            <div className="add-floating-button">
                <p className="floating-btn-text"> <i className="fas fa-plus-circle"></i> Add Job</p>
            </div>
        );
    };


    return (
        <div className="job-listing-component">
            <div className="row">

                <div className="col-md-8">
                    {jobs.map((job, i) => {
                        return <JobItem key={i} Job={job} />;
                    })
                    }
                </div>

                <div className="col-md-4">

                    <div className="app-card job-filters right-sidebar">

                        <div className="sidebar-header">
                            <p className="sidebar-heading">Filter Results</p>
                        </div>

                        <div className="sidebar-filters">

                            <div className="sidebar-filter">
                                <div className="p-0 m-0">
                                    <div className="form-group p-float-label col-sm-12 p-0">
                                        <InputText
                                            value={nameFilter}
                                            type="text"
                                            required
                                            id="word"
                                            className="form-control single-control"
                                            onChange={(e) => {
                                                setNameFilter(e.target.value);
                                            }}
                                        />
                                        <label htmlFor="word">Job Name</label>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-filter">
                                <div className="p-0 m-0">
                                    <div className="form-group p-float-label col-sm-12 p-0">
                                        <InputNumber
                                            value={budgetFilter}
                                            type="text"
                                            required
                                            id="budget"
                                            className="form-control single-control"
                                            onChange={(e) => {
                                                setBudgetFilter(e.value);
                                            }}
                                        />
                                        <label htmlFor="budget">Minimum Budget</label>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-filter">
                                <div className="p-0 m-0">
                                    <div className="form-group p-float-label col-sm-12 p-0 text-left">
                                        <Dropdown
                                            value={typeFilter}
                                            required
                                            options={JOB_TYPES}
                                            className="form-cotntrol single-control"
                                            id="type"
                                            onChange={(e) => {
                                                setTypeFilter(e.target.value);
                                            }}
                                        />
                                        <label htmlFor="type">Job Type</label>
                                    </div>
                                </div>
                            </div>

                            <div className="submit-button-wrapper">
                                <button className="btn btn-primary fw">Filter</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <AddJobFloatingButton />

        </div>
    );
}

export default JobsListing;
