import { useHistory } from "react-router";

const JobItem = ({ Job: j }) => {

    const history = useHistory();

    const onJobClick = () => {
        history.push(`/home/job/${j._id}`);
    };

    return (
        <div className="single-job-item" onClick={onJobClick}>
            <div className="app-card job-card">
                <div className="job-header">
                    <div className="row">
                        <div className="col-md-10">

                            <div className="header-wrapper">

                                <div className="job-icon-wrapper">
                                    <div className="job-icon">
                                        <i className="fas fa-briefcase"></i>
                                    </div>
                                </div>

                                <div className="title-and-poster">
                                    <p className="job-title">
                                        {j.title}
                                    </p>

                                    <p className="job-poster">
                                        <small>  <i className="fas fa-user-circle first"></i> {j.postedBy?.name} <i className="fas fa-book"></i> {j.subject?.name}</small>
                                    </p>
                                </div>
                            </div>


                        </div>

                        <div className="col-md-2">
                            <p className="job-budget">
                                <span>PKR</span>  {j.budget}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="job-details">

                    <div className="row">
                        <div className="col-md-8">
                            <p className="job-description" dangerouslySetInnerHTML={{ __html: j.wrappedDesc }}>
                            </p>
                        </div>

                        <div className="col-md-4">
                            <div className="job-features">

                                <p className="job-feature">
                                    <i className="fas fa-calendar" /> <b>Posted On: </b> {j.createdOnFormatted}
                                </p>
                                <p className="job-feature">
                                    <i className="fas fa-tag" /> <b>Type: </b> {j.typeName}
                                </p>
                                <p className="job-feature">
                                    <i className="fas fa-hourglass-half" /> <b>Deadline: </b> {j.deadlineFormatted}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobItem;