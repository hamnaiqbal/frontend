import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import JobItem from '../../components/JobItem/JobItem';
import PostJob from '../../components/PostJob/PostJob';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

function JobsListing() {

    const [jobs, setJobs] = useState([]);

    const [nameFilter, setNameFilter] = useState('');
    const [budgetFilter, setBudgetFilter] = useState(0);
    const [typeFilter, setTypeFilter] = useState();

    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const JOB_TYPES = [
        { label: 'Assignment Help', value: 'A' },
        { label: 'Project Help', value: 'P' },
        { label: 'Others', value: 'O' },
    ];

    const fetchJobs = () => {
        const data = {
            userId: userService.getCurrentUserId()
        }
        if (typeFilter) {
            data.type = typeFilter;
        }
        if (nameFilter && nameFilter !== '') {
            data.name = nameFilter;
        }
        if (budgetFilter && budgetFilter > 0) {
            data.minBudget = budgetFilter;
        }
        httpService.getRequest(URLS.GET_JOB_LISTING, data).subscribe(jobs => {
            jobs.forEach(j => {
                j.wrappedDesc = j.description?.length < 180 ? j.description : j.description?.substring(0, 180) + '...';
                j.createdOnFormatted = miscService.getFormattedDate(j.createdOn, true);
                j.deadlineFormatted = miscService.getFormattedDate(j.deadline, true);
                j.typeName = miscService.getJobTypeName(j.type);
            });
            setJobs(jobs);
        });
    };

    const AddJobFloatingButton = () => {
        return (
            <div className="add-floating-button" onClick={() => { setShowAddDialog(true); }}>
                <p className="floating-btn-text"> <i className="fas fa-plus-circle"></i> Add Job</p>
            </div>
        );
    };


    return (
        <div className="job-listing-component">
            <div className="row">

                <div className="col-md-8">
                    {jobs.length > 0 &&
                        jobs.map((job, i) => {
                            return <JobItem key={i} Job={job} />;
                        })
                    }
                    {
                        jobs.length === 0 &&
                        <div className="no-jobs found app-card">
                            <h5 className='bold'>
                                No Jobs were Found
                            </h5>

                            <p className="description text-center">
                                No Jobs were found for this search. Either change the search filters or
                                clear more skills courses to unlock more jobs.
                            </p>
                        </div>
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
                                <button onClick={fetchJobs} className="btn btn-primary fw">Filter</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="post-job-dialog-wrapper">
                <Dialog
                    header='Post a New Job'
                    visible={showAddDialog}
                    onHide={() => setShowAddDialog(false)}
                    modal={true}
                    className="post-job-dialog custom-scrollbar"
                >
                    <div className="add-post-dialog-wrapper">
                        <PostJob onClose={() => setShowAddDialog(false)} />
                    </div>
                </Dialog>
            </div>

            <AddJobFloatingButton />

        </div>
    );
}

export default JobsListing;
