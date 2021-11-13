const JobItem = ({ Job: j }) => {
    return (
        <div className="single-job-item">
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
                                        <i className="fas fa-user-circle"></i> <small>{j.postedBy?.name}</small>
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
                            <p className="job-description">
                                {j.wrappedDesc}
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