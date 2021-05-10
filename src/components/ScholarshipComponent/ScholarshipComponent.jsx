function ScholarshipComponent(props) {
    const sch = props.scholarship;

    return (
        <div className="single-scholarship-wrapper">
            <div className="scholarship-card">
                <div className="row">
                    <div className="image-div col-md-3">
                        <div className="provider-logo-wrapper">
                            <img src={sch.logoURL} alt="" className="provider-logo" />
                        </div>
                    </div>
                    <div className="content-div col-md-9">
                        <div className="title-wrapper">
                            <p className="scholarship-title">{sch.title}</p>
                        </div>
                        <div className="subtitle-wrapper">
                            <p className="scholarship-subtitle">{sch.provider}</p>
                        </div>
                        <div className="description-wrapper">
                            <p className="scholarship-description">{sch.description}</p>
                        </div>
                        <div className="features-wrapper">
                            <div className="date-wrapper">
                                <p className="scholarship-date">
                                    <span className="pi pi-calendar"></span> {sch.date}
                                </p>
                            </div>
                            <div className="level-wrapper">
                                <p className="scholarship-level">
                                    <span className="pi pi-calendar"></span> {sch.level}
                                </p>
                            </div>
                            <div className="amount-wrapper">
                                <p className="scholarship-amount">
                                    <span className="pi pi-calendar"></span> {sch.amount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScholarshipComponent;
